import { Injectable, InternalServerErrorException, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel, Content } from '@google/generative-ai';
import { AiHintResponse, AiRiddleResponse, RiddleIntentAnalysis } from './ai-responses.dto';
import { RiddleType } from '@prisma/client';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private readonly logger = new Logger(AiService.name);

  private readonly modelCandidates = [
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash-001',
    'gemini-flash-lite-latest',
    'gemini-2.5-pro',
    'gemini-pro-latest',
    'gemini-3-flash-preview',
    'gemini-2.0-flash-exp',
  ];

  private currentModelIndex = 0;
  private fallbackOccurred = false;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.initModel();
  }

  private initModel(): void {
    const modelName = this.modelCandidates[this.currentModelIndex];
    this.logger.log(`[AI] Active model: ${modelName}`);

    this.model = this.genAI.getGenerativeModel(
      {
        model: modelName,
        generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
      },
      { apiVersion: 'v1beta' },
    );
  }

  private switchToNextModel(): boolean {
    if (this.currentModelIndex < this.modelCandidates.length - 1) {
      this.currentModelIndex++;
      this.initModel();
      this.fallbackOccurred = true;
      return true;
    }
    return false;
  }

  consumeFallbackFlag(): boolean {
    const flag = this.fallbackOccurred;
    this.fallbackOccurred = false;
    return flag;
  }

  private getModelForRequest(modelName?: string): GenerativeModel {
    if (!modelName) return this.model;
    return this.genAI.getGenerativeModel(
      {
        model: modelName,
        generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
      },
      { apiVersion: 'v1beta' },
    );
  }

  getModelName(preferredModel?: string): string {
    return preferredModel || this.modelCandidates[this.currentModelIndex];
  }

  private isSwitchableError(status: number | undefined): boolean {
    return status === 429 || status === 404 || status === 403 || status === 500 || status === 503;
  }

  async askGemini<T>(history: Content[] | string, retries: number = 3, modelName?: string): Promise<T> {
    const activeModelName = modelName || this.modelCandidates[this.currentModelIndex];
    const modelInstance = this.getModelForRequest(modelName);

    this.logger.log(`[AI] askGemini → ${activeModelName}`);

    try {
      const messageContent =
        typeof history === 'string' ? history : history[history.length - 1]?.parts[0]?.text || '';

      const chat = modelInstance.startChat({
        history: typeof history === 'string' ? [] : history.slice(0, -1),
        generationConfig: { responseMimeType: 'application/json' },
      });

      const result = await chat.sendMessage(messageContent);
      const text = result.response.text();
      const cleanText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: unknown) {
      const status = (error as { status?: number }).status;

      this.logger.warn(`[AI] askGemini error — model: ${activeModelName}, status: ${status}`);

      if (!modelName && this.isSwitchableError(status)) {
        if (this.switchToNextModel()) {
          this.logger.log(`[AI] Switched to ${this.modelCandidates[this.currentModelIndex]}, retrying...`);
          return this.askGemini(history, retries, undefined);
        }
        this.logger.error('[AI] All models exhausted.');
        throw new HttpException(
          'All models reached their quota. Please try again in a few minutes.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      if (status === 429) {
        throw new HttpException(
          'All models reached their quota. Please try again in a few minutes.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      this.logger.error(`[AI] Unhandled error: ${error instanceof Error ? error.message : 'Unknown'}`);
      throw new InternalServerErrorException(
        'AI service is currently overloaded. Please try again.',
      );
    }
  }

  async classifyIntent(message: string): Promise<RiddleIntentAnalysis> {
    const classificationPrompt = `
    Analyze the user message for a riddle-solving application.

    Tasks:
    1. Detect "INAPPROPRIATE" content: Sexual acts, pornography, graphic gore, detailed physical torture, or extreme violence.
    2. Determine intent:
       - "NEW": User explicitly asks for a new riddle (e.g., "give me another one", "new topic", "start again").
       - "GIVE_UP": User explicitly wants to stop trying and see the answer (e.g., "i give up", "tell me the answer", "я здаюся", "я здаюсь", "відповідь" or any other request that indicates that the user wants to see the answer).
       - "REFINE": User is making a guess (usually 1-3 words in some cases may be more), asking for a hint, or discussing the current riddle.
       - "OFF_TOPIC": user is asking for something unrelated (recipes, code, general facts).
    3. Extract Type (only for NEW): "classic", "math", "logic", or "danetki".
    4. Extract Style: (e.g., "cyberpunk", "sherlock holmes", "medieval fantasy").
    5. Extract Topic: What is the riddle about?

    CRITICAL RULE: If the user provides a single word or a short phrase that could be an answer, it MUST be classified as "REFINE".

    User Message: "${message}"

    Return JSON only:
    {
      "intent": "NEW" | "REFINE" | "OFF_TOPIC" | "INAPPROPRIATE" | "GIVE_UP",
      "reason": "short explanation if inappropriate",
      "type": "string | null",
      "style": "string | null",
      "topic": "string | null"
    }
  `;

    try {
      const rawResult = await this.askGemini<{
        intent: 'NEW' | 'REFINE' | 'OFF_TOPIC' | 'INAPPROPRIATE';
        type?: string;
        style?: string;
        topic?: string;
      }>(classificationPrompt);

      const analysis: RiddleIntentAnalysis = {
        intent: rawResult.intent,
        style: rawResult.style,
        topic: rawResult.topic,
      };

      if (rawResult.type && Object.values(RiddleType).includes(rawResult.type as RiddleType)) {
        analysis.type = rawResult.type as RiddleType;
      } else if (rawResult.intent === 'NEW') {
        analysis.type = RiddleType.DANETKI;
      }

      return analysis;
    } catch (error: unknown) {
      this.logger.error('Intent classification failed, defaulting to REFINE');
      return { intent: 'REFINE' };
    }
  }

  async askGeminiChat(
    history: Content[],
    newMessage: string,
    modelName?: string,
  ): Promise<AiHintResponse | AiRiddleResponse> {
    const chatPrompt = `
      You are a game assistant in a riddle application.
      Analyze the language of the user's message and respond strictly in that same language.
      If the language cannot be determined, default to English.
      Respond to the following message: "${newMessage}"

      RETURN JSON ONLY.
    `;

    const updatedHistory: Content[] = [
      ...history,
      { role: 'user', parts: [{ text: chatPrompt }] }
    ];

    // Let exceptions propagate — do NOT swallow HttpException from askGemini
    return this.askGemini<AiHintResponse | AiRiddleResponse>(updatedHistory, 3, modelName);
  }

  async getContextualHint(
    history: Content[],
    userMessage: string,
    correctAnswer: string,
    retries: number = 3,
    modelName?: string,
  ): Promise<Partial<AiHintResponse>> {
    const hintPrompt = `
    You are a game assistant in a riddle web application.
    Analyze the language of the user's message and respond strictly in that same language.
    If the language cannot be determined, default to English.
    SECRET CORRECT ANSWER: "${correctAnswer}"
    USER WRITES: "${userMessage}"

      TASKS:
      1. In the "reasoning" field, analyze the user's message: is it a synonym, part of the word, or a completely wrong guess?
      2. Based on the analysis, decide: confirm the solution (is_solved: true) or give a hint.
      3. If the user guessed correctly (answer is close in meaning, matches the riddle answer, or has similar sense),
         congratulate them in the detected language and confirm the solution -> is_solved: true.
      4. If they did not guess, analyze their mistake and give a subtle hint in the detected language that moves toward the goal.
      5. STRICT RULE: Do not reveal the word "${correctAnswer}" directly if the user has not guessed it yet.
      6. Use the conversation history to avoid repeating the same hints.

      RETURN JSON ONLY:
      {
        "reasoning": "your step-by-step analysis of the user's guess" ("string"),
        "content": "response or hint text" ("string"),
        "is_solved": boolean
      }
    `;

    const activeModelName = modelName || this.modelCandidates[this.currentModelIndex];
    const modelInstance = this.getModelForRequest(modelName);

    this.logger.log(`[AI] getContextualHint → ${activeModelName}`);

    try {
      const chat = modelInstance.startChat({ history });
      const result = await chat.sendMessage(hintPrompt);
      const text = result.response.text();
      const cleanText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: any) {
      const status = error?.status;

      this.logger.warn(`[AI] getContextualHint error — model: ${activeModelName}, status: ${status}`);

      if (!modelName && this.isSwitchableError(status)) {
        if (this.switchToNextModel()) {
          this.logger.log(`[AI] Switched to ${this.modelCandidates[this.currentModelIndex]}, retrying hint...`);
          return this.getContextualHint(history, userMessage, correctAnswer, retries, undefined);
        }
        this.logger.error('[AI] All models exhausted for hint.');
      } else {
        this.logger.error(`[AI] Hint error (specific model): ${error instanceof Error ? error.message : 'Unknown'}`);
      }

      return {
        content: 'AI service is temporarily unavailable. Please try again in a moment.',
        is_solved: false,
      };
    }
  }
}

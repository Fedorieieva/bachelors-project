import { Injectable, InternalServerErrorException, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel, Content } from '@google/generative-ai';
import { AiHintResponse, AiImageRiddleResult, AiRiddleResponse, CrosswordLayout, RiddleIntentAnalysis } from './ai-responses.dto';
import { RiddleType } from '@prisma/client';

@Injectable()
export class AiService {
  private genAI!: GoogleGenerativeAI;
  private model!: GenerativeModel;
  private readonly logger = new Logger(AiService.name);

  private readonly modelCandidates = [
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-2.5-pro',
  ];

  private apiKeys: string[];
  private currentKeyIndex = 0;
  private currentModelIndex = 0;
  private fallbackOccurred = false;

  constructor(private readonly configService: ConfigService) {
    const primaryKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!primaryKey) throw new Error('GEMINI_API_KEY is not defined');

    this.apiKeys = [
      primaryKey,
      this.configService.get<string>('GEMINI_API_KEY2'),
      this.configService.get<string>('GEMINI_API_KEY3'),
      this.configService.get<string>('GEMINI_API_KEY4'),
    ].filter((k): k is string => !!k);

    this.initModel();
  }

  private initModel(): void {
    const activeKey = this.apiKeys[this.currentKeyIndex];
    this.genAI = new GoogleGenerativeAI(activeKey);

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

  private switchToNextApiKey(): boolean {
    if (this.currentKeyIndex < this.apiKeys.length - 1) {
      this.currentKeyIndex++;
      this.currentModelIndex = 0;
      this.initModel();
      return true;
    }
    return false;
  }

  private async handleFallback(status: number | undefined): Promise<boolean> {
    if (this.switchToNextModel()) {
      this.logger.log(`[AI] Switched to model ${this.modelCandidates[this.currentModelIndex]}, applying 1s cooldown...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }

    if (this.switchToNextApiKey()) {
      this.logger.warn(`[AI] All models exhausted. Switched to API key index ${this.currentKeyIndex}, applying 1.5s cooldown...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
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
    return status === 429 || status === 404 || status === 403 || status === 500 || status === 502 || status === 503;
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
      try {
        return JSON.parse(cleanText);
      } catch {
        this.logger.warn('[AI JSON] Malformed JSON structure caught');
        throw { status: 502, message: 'Truncated JSON payload from model' };
      }
    } catch (error: unknown) {
      const status = (error as { status?: number }).status;

      this.logger.warn(`[AI] askGemini error — model: ${activeModelName}, status: ${status}`);

      if (!modelName && this.isSwitchableError(status)) {
        if (await this.handleFallback(status)) {
          return this.askGemini(history, retries);
        }
        this.logger.error('[AI] All models and keys exhausted.');
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
       - "NEW": User explicitly asks for a new riddle (e.g., "give me another one", "new topic", "start again", "give me a visual riddle about X", "make a riddle with an image").
       - "GIVE_UP": User explicitly wants to stop trying and see the answer (e.g., "i give up", "tell me the answer", "я здаюся", "я здаюсь", "відповідь" or any other request that indicates that the user wants to see the answer).
       - "REFINE": User is making a guess (usually 1-3 words in some cases may be more), asking for a hint, or discussing the current riddle.
       - "OFF_TOPIC": user is asking for something unrelated (recipes, code, general facts).
    3. Extract Type (only for NEW): "classic", "math", "logic", or "danetki".
    4. Extract Style: (e.g., "cyberpunk", "sherlock holmes", "medieval fantasy").
    5. Extract Topic: What is the riddle about?

    CRITICAL RULES:
    - If the user provides a single word or a short phrase that could be an answer, it MUST be classified as "REFINE".
    - IMAGE GENERATION ABUSE PREVENTION: If the user asks to draw, paint, photograph, or generate a standalone image with NO riddle context (e.g., "draw a cat", "make a photo of a house", "create an image of a sunset", "generate a picture"), this MUST be classified as "OFF_TOPIC". This application only generates riddles, not arbitrary images.
    - VISUAL RIDDLE EXCEPTION: If the user explicitly asks for a riddle presented visually or as an image (e.g., "give me a visual riddle", "make a riddle with an image about space", "show me a picture riddle"), classify it as "NEW" — it is a legitimate riddle request.

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
      this.logger.error('Intent classification failed, defaulting to REFINE', error);
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
    } catch (error: unknown) {
      const status = (error as { status?: number }).status;

      this.logger.warn(`[AI] getContextualHint error — model: ${activeModelName}, status: ${status}`);

      if (!modelName && this.isSwitchableError(status)) {
        if (await this.handleFallback(status)) {
          return this.getContextualHint(history, userMessage, correctAnswer, retries);
        }
        this.logger.error('[AI] All models and keys exhausted for hint.');
      } else {
        this.logger.error(`[AI] Hint error (specific model): ${error instanceof Error ? error.message : 'Unknown'}`);
      }

      return {
        content: 'AI service is temporarily unavailable. Please try again in a moment.',
        is_solved: false,
      };
    }
  }

  async generateVisualRebusPrompt(answer: string, style: string): Promise<string> {
    const rebusInstruction = `You are a Visual Rebus and Puzzle Architect. Your task is to convert a secret answer word/phrase into a detailed, literal visual rebus description for a text-to-image diffusion model.

      Secret Answer to encrypt: "${answer}"
      Visual Aesthetic Style: "${style}"

      Instructions:
      1. Design a clever visual riddle composition where the viewer can deduce the secret answer word by combining or analyzing the visible objects, optical symbols, logical sequences, or visual puns in the scene.
      2. Break down the secret answer conceptually or phonetically into literal physical items, symbolic clues, geometric arrangements, or intentional anomalies (e.g., if the answer is "Compass", describe a scene with a cat pointing towards a structural pass layout, or broken mechanical components forming a hidden directional grid).
      3. Describe distinct, sharp, high-contrast tangible objects arranged clearly across the composition layout.
      4. Explicitly forbid any text overlays or letters from appearing. The rebus must be solved purely through object association and composition.
      5. Output ONLY the raw English descriptive prompt paragraph suitable for a text-to-image generator. Do not include any JSON wrapping, labels, introductory text, or conversational filler.`;

    this.logger.log(`[AI Image] Generating visual rebus prompt for answer: "${answer}"`);

    const modelInstance = this.genAI.getGenerativeModel(
      { model: this.modelCandidates[this.currentModelIndex], generationConfig: { temperature: 0.9 } },
      { apiVersion: 'v1beta' },
    );

    const result = await modelInstance.generateContent(rebusInstruction);
    return result.response.text().trim();
  }

  async generateCrossword(
    theme: string,
    customWords: string[] = [],
    language = 'english',
  ): Promise<CrosswordLayout> {
    const requiredBlock =
      customWords.length > 0
        ? `\nREQUIRED WORDS — you MUST include every one of these in the puzzle: ${customWords.map((w) => w.toUpperCase()).join(', ')}.`
        : '';

    const prompt = `You are a master crossword puzzle compiler. Produce a geometrically valid, fully interlocked crossword puzzle.

THEME: "${theme}"${requiredBlock}
OUTPUT LANGUAGE: Every "word" value and every "clue" value MUST be written strictly in ${language}. Capitalize all words (UPPERCASE).

CONSTRUCTION RULES — follow precisely:
1. Choose 8–12 thematic words, each 4–10 letters long.${customWords.length > 0 ? ' Include ALL required words listed above.' : ''}
2. Arrange words on a 2D grid using ACROSS (left-to-right) and DOWN (top-to-bottom) directions.
3. Coordinate system: x = column index (0-based, left→right), y = row index (0-based, top→bottom).
4. A word at (x, y, direction="across") occupies cells (x+0,y),(x+1,y),…,(x+len-1,y).
5. A word at (x, y, direction="down") occupies cells (x,y+0),(x,y+1),…,(x,y+len-1).
6. INTERSECTION RULE: every crossing pair of words must share exactly one letter at their crossing cell — that letter must match identically in both words.
7. No two non-crossing words may share a cell.
8. The entire puzzle must form one connected component (no isolated words).
9. Place words near the origin — minimize empty border padding.
10. gridSize must be the tight bounding box of all placed cells (rows = max occupied row + 1, cols = max occupied col + 1).
11. Number starting cells sequentially: 1, 2, 3… ordered top-to-bottom then left-to-right.
12. Write a concise, accurate clue for each word in ${language}.

RETURN ONLY this JSON, no markdown fences or extra keys:
{
  "gridSize": { "rows": <int>, "cols": <int> },
  "words": [
    { "word": "UPPERCASE_WORD", "clue": "clue text", "x": <int>, "y": <int>, "direction": "across"|"down", "number": <int> }
  ]
}`;

    this.logger.log(`[AI Crossword] Generating crossword — theme: "${theme}", requiredWords: ${customWords.length}, lang: ${language}`);
    return this.askGemini<CrosswordLayout>(prompt, 3);
  }

  async generateImageRiddle(riddleContent: string): Promise<AiImageRiddleResult> {
    this.logger.log(`[AI Image] Initiating image generation for riddle content length: ${riddleContent.length}`);

    const prompt = `${riddleContent}. Masterpiece digital art, hyper-distinct shapes, clear symbolic puzzle game presentation, sharp focus, volumetric lighting, zero text, no letters, no written words.`;

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    this.logger.debug(`[AI Image] Fetching from Pollinations URL: ${url}`);

    const response = await fetch(url);

    this.logger.log(`[AI Image] Pollinations response received. Status: ${response.status} (${response.statusText})`);

    if (!response.ok) {
      throw new InternalServerErrorException(
        `Pollinations.ai returned status ${response.status}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    this.logger.log(`[AI Image] Image successfully converted to Base64 buffer. Size: ${arrayBuffer.byteLength} bytes`);

    return {
      imageBase64: Buffer.from(arrayBuffer).toString('base64'),
      imageMimeType: 'image/jpeg',
    };
  }
}

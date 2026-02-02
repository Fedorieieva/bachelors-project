import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel, Content } from '@google/generative-ai';
import { RiddleIntentAnalysis, RiddleType } from '../dto/riddle.dto';

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

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.initModel();
  }

  private initModel() {
    const modelName = this.modelCandidates[this.currentModelIndex];
    this.logger.log(`Ініціалізація моделі: ${modelName}`);

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
      return true;
    }
    return false;
  }

  async askGemini<T>(history: Content[] | string, retries: number = 3): Promise<T> {
    try {
      const chatHistory = typeof history === 'string' ? [] : history;

      const messageContent =
        typeof history === 'string' ? history : history[history.length - 1]?.parts[0]?.text || '';

      const chat = this.model.startChat({
        history: typeof history === 'string' ? [] : history.slice(0, -1),
        generationConfig: { responseMimeType: 'application/json' },
      });

      const result = await chat.sendMessage(messageContent);
      const text = result.response.text();
      const cleanText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: unknown) {
      const status = (error as { status?: number }).status;

      if (status === 404 || status === 403) {
        this.logger.warn(
          `Модель ${this.modelCandidates[this.currentModelIndex]} недоступна (${status}). Перемикання...`,
        );
        if (this.switchToNextModel()) {
          return this.askGemini(history, retries);
        }
      }

      if (status === 429) {
        if (retries > 0) {
          this.logger.warn(`Квоту вичерпано. Спроб залишилось: ${retries}. Очікування 5с...`);
          await new Promise(resolve => setTimeout(resolve, 5000));

          this.switchToNextModel();
          return this.askGemini(history, retries - 1);
        }
        throw new InternalServerErrorException(
          'ШІ сервіс перевантажений. Спробуйте через хвилину.',
        );
      }

      this.logger.error(
        `Gemini API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Помилка генерації контенту ШІ');
    }
  }

  async classifyIntent(message: string): Promise<RiddleIntentAnalysis> {
    const classificationPrompt = `
    Analyze the user message for a riddle-solving application.

    Tasks:
    1. Determine intent:
       - "NEW": user wants a new riddle.
       - "REFINE": user is asking a question, making a guess, or discussing the current riddle.
       - "OFF_TOPIC": user is asking for something unrelated (recipes, code, general facts).
    2. Extract Type (only for NEW): "classic", "math", "logic", or "danetki".
    3. Extract Style: (e.g., "cyberpunk", "sherlock holmes", "medieval fantasy").
    4. Extract Topic: What is the riddle about?

    User Message: "${message}"

    Return JSON only:
    {
      "intent": "NEW" | "REFINE" | "OFF_TOPIC",
      "type": "string | null",
      "style": "string | null",
      "topic": "string | null"
    }
  `;

    try {
      const rawResult = await this.askGemini<{
        intent: 'NEW' | 'REFINE' | 'OFF_TOPIC';
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
      this.logger.error('Помилка класифікації наміру');
      return { intent: 'REFINE' };
    }
  }

  async askGeminiChat(history: any[], newMessage: string): Promise<any> {
    try {
      const chat = this.model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(newMessage);
      const text = result.response.text();
      const cleanText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      this.logger.error(`Chat Error: ${error.message}`);
      throw new InternalServerErrorException('ШІ не зміг відповісти у чаті');
    }
  }
}

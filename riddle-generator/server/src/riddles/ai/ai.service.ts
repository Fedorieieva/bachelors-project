import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel, Content } from '@google/generative-ai';

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

  async askGemini(history: Content[] | string, retries: number = 3): Promise<any> {
    try {
      const chatHistory = typeof history === 'string' ? [] : history;

      const messageContent =
        typeof history === 'string' ? history : history[history.length - 1]?.parts[0]?.text || '';

      const chat = this.model.startChat({
        history: typeof history === 'string' ? [] : history.slice(0, -1),
        generationConfig: { responseMimeType: 'application/json' },
      });

      const result = await chat.sendMessage(typeof history === 'string' ? history : messageContent);
      const text = result.response.text();
      const cleanText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: any) {
      const status = error.status;

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

      this.logger.error(`Gemini API Error: ${error.message}`);
      throw new InternalServerErrorException('Помилка генерації контенту ШІ');
    }
  }

  async classifyIntent(message: string): Promise<'NEW' | 'REFINE'> {
    const classificationPrompt = `
    Analyze the following user message for a riddle-solving chat.
    Determine if the user wants to start a completely NEW riddle with a new topic, or REFINE/discuss the current one.

    Message: "${message}"

    Return JSON only: {"intent": "NEW" | "REFINE"}
  `;

    try {
      const result = await this.askGemini(classificationPrompt);
      return result.intent === 'NEW' ? 'NEW' : 'REFINE';
    } catch (error) {
      this.logger.error('Failed to classify intent, defaulting to REFINE');
      return 'REFINE';
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

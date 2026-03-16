import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel, Content } from '@google/generative-ai';
import { AiHintResponse, AiRiddleResponse, RiddleIntentAnalysis } from './ai-responses.dto';
import { RiddleType } from '../dto/riddle-settings.dto';

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

  private initModel(): void {
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

      if (status === 404 || status === 403 || status === 503 || status === 500) {
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
      throw new InternalServerErrorException(
        'ШІ сервіс наразі перевантажений. Спробуйте змінити тему або зачекайте кілька секунд.',
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
       - "REFINE": User is making a guess (usually 1-3 words in some cases may be more), asking for a hint, or discussing the current riddle.
       - "OFF_TOPIC": user is asking for something unrelated (recipes, code, general facts).
    3. Extract Type (only for NEW): "classic", "math", "logic", or "danetki".
    4. Extract Style: (e.g., "cyberpunk", "sherlock holmes", "medieval fantasy").
    5. Extract Topic: What is the riddle about?

    CRITICAL RULE: If the user provides a single word or a short phrase that could be an answer, it MUST be classified as "REFINE".

    User Message: "${message}"

    Return JSON only:
    {
      "intent": "NEW" | "REFINE" | "OFF_TOPIC" | "INAPPROPRIATE",
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
      this.logger.error('Помилка класифікації наміру');
      return { intent: 'REFINE' };
    }
  }

  async askGeminiChat(
    history: any[],
    newMessage: string,
  ): Promise<AiHintResponse | AiRiddleResponse> {
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

  async getContextualHint(
    history: Content[],
    userMessage: string,
    correctAnswer: string,
  ): Promise<Partial<AiHintResponse>> {
    const hintPrompt = `
      Ти — ігровий помічник у вебзастосунку із загадками.
      ПРАВИЛЬНА ВІДПОВІДЬ (секретно): "${correctAnswer}"
      КОРИСТУВАЧ ПИШЕ: "${userMessage}"

      ЗАВДАННЯ:
      1. Спочатку в полі "reasoning" проаналізуй повідомлення користувача: чи це синонім, чи це частина слова, чи це абсолютно хибна здогадка.
      2. На основі аналізу виріши: підтвердити розв'язок (is_solved: true) або дати підказку.
      3. Якщо користувач вгадав (відповідь близька за змістом, точно відповідє правильній відповіді загадки чи загалом має схожий сенс до правильної відпоаіді),
         привітай його і підтверди розв'язок.
      4. Якщо не вгадав, проаналізуй його помилку та дай тонку підказку, що наближає до цілі.
      5. ЖОРСТКЕ ПРАВИЛО: Не називай слово "${correctAnswer}" прямо, якщо користувач його ще не вгадав.
      6. Використовуй історію діалогу, щоб не повторювати однакові підказки.

      ПОВЕРНИ ТІЛЬКИ JSON:
      {
      "reasoning": "твій покроковий аналіз здогадки користувача",
        "content": "текст відповіді або підказки",
        "is_solved": boolean
      }
    `;

    try {
      const chat = this.model.startChat({ history });
      const result = await chat.sendMessage(hintPrompt);
      const text = result.response
        .text()
        .replace(/```json|```/g, '')
        .trim();
      return JSON.parse(text);
    } catch (error) {
      this.logger.error(`Hint Error: ${(error as Error).message}`);
      return {
        content: 'Спробуй подумати ще раз, ти на правильному шляху!',
        is_solved: false,
      };
    }
  }
}

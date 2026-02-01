import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AiService } from './ai/ai.service';
import { PromptsService } from './prompts/prompts.service';
import { AiRiddleResponse, RiddleDto, RiddleType } from './dto/riddle.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Content } from '@google/generative-ai';

@Injectable()
export class RiddlesService {
  private readonly logger = new Logger(RiddlesService.name);
  private readonly MAX_REGENERATION_ATTEMPTS = 3;

  constructor(
    private readonly aiService: AiService,
    private readonly promptsService: PromptsService,
    private readonly prisma: PrismaService,
  ) {}

  async generateRiddle(dto: RiddleDto) {
    let attempts = 0;
    let lastResult: AiRiddleResponse | null = null;

    const riddleType = dto.type ?? RiddleType.DANETKI;
    const promptName = `${riddleType}_generator`;

    const mainPrompt = await this.promptsService.getRenderedPrompt(promptName, {
      language: dto.language,
      topic: dto.topic,
      complexity: dto.complexity,
    });

    while (attempts < this.MAX_REGENERATION_ATTEMPTS) {
      attempts++;
      const aiResult = (await this.aiService.askGemini(mainPrompt)) as AiRiddleResponse;
      lastResult = aiResult;

      const evaluation = await this.evaluateRiddle(aiResult, dto.language, riddleType);

      if (evaluation.is_good) {
        return this.formatResponse(aiResult, dto, promptName, attempts, riddleType);
      }

      this.logger.warn(`Спроба #${attempts} не пройшла критик: ${evaluation.reason}`);
    }

    this.logger.error(`Всі спроби вичерпано. Повертаємо найкращий наявний варіант.`);
    return this.formatResponse(lastResult!, dto, promptName, attempts, riddleType);
  }

  private formatResponse(
    result: AiRiddleResponse,
    dto: RiddleDto,
    promptName: string,
    attempts: number,
    type: RiddleType,
  ) {
    return {
      content: result.content,
      answer: result.answer,
      prompt_context: {
        topic: dto.topic,
        complexity: dto.complexity,
        language: dto.language,
        prompt_name: promptName,
        generation_attempts: attempts,
        type: type,
      },
    };
  }

  private async evaluateRiddle(riddle: AiRiddleResponse, language: string, type: RiddleType) {
    const criteria =
      type === RiddleType.DANETKI
        ? "Чи є ситуація загадковою, а розв'язок логічним і неочевидним?"
        : 'Чи є загадка цікавою та чи відповідає відповідь питанню?';

    const evalPrompt = `
      Ти — контролер якості контенту. Оціни загадку типу "${type}".
      Текст: "${riddle.content}"
      Відповідь: "${riddle.answer}"
      Мова: ${language}

      Критерій: ${criteria}
      Також перевір, чи немає граматичних помилок.

      Поверни JSON: {"is_good": boolean, "reason": "чому не пройшло (якщо false)"}
    `;

    try {
      return await this.aiService.askGemini(evalPrompt);
    } catch (e) {
      return { is_good: true };
    }
  }

  async createChat(authorId: string) {
    const newChat = await this.prisma.chat.create({
      data: {
        user_id: authorId,
      },
    });
    return { chatId: newChat.id };
  }

  async processChatMessage(
    chatId: string,
    userMessage: string,
    settings: RiddleDto,
    authorId: string,
  ) {
    const intent = await this.aiService.classifyIntent(userMessage);

    if (intent === 'NEW') {
      this.logger.log(`Нова генерація. Тема: ${userMessage}`);

      const newRiddle = await this.generateRiddle({
        ...settings,
        topic: userMessage,
      });

      await this.saveMessage(chatId, 'user', userMessage, true);
      await this.saveMessage(chatId, 'model', JSON.stringify(newRiddle));

      return { type: 'NEW_RIDDLE', data: newRiddle };
    }

    const rawHistory = await this.getHistory(chatId);

    const aiUpdate = await this.aiService.askGeminiChat(rawHistory, userMessage);

    await this.saveMessage(chatId, 'user', userMessage);
    await this.saveMessage(chatId, 'model', JSON.stringify(aiUpdate));

    return { type: 'REFINE_RIDDLE', data: aiUpdate };
  }

  private async getHistory(chatId: string): Promise<Content[]> {
    try {
      const messages = await this.prisma.message.findMany({
        where: { chat_id: chatId },
        orderBy: { createdAt: 'asc' },
        take: 10,
      });

      return messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));
    } catch (error) {
      this.logger.error(`Помилка отримання історії: ${error.message}`);
      return [];
    }
  }

  private async saveMessage(chatId: string, role: string, content: string, isInitial = false) {
    try {
      return await this.prisma.message.create({
        data: {
          chat_id: chatId,
          role: role,
          content: content,
          is_initial: isInitial,
        },
      });
    } catch (error) {
      this.logger.error(`Помилка при збереженні повідомлення: ${error.message}`);
    }
  }

  async saveToUserCollection(
    userId: string,
    riddleData: { content: string; answer: string; prompt_context: any },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.is_guest) {
      throw new ForbiddenException('Тільки зареєстровані користувачі можуть зберігати загадки');
    }

    return this.prisma.riddles.create({
      data: {
        content: riddleData.content,
        answer: riddleData.answer,
        prompt_context: riddleData.prompt_context,
        author_id: userId,
        is_public: false,
      },
    });
  }

  async makeRiddlePublic(userId: string, riddleId: string) {
    const riddle = await this.prisma.riddles.findFirst({
      where: { id: riddleId, author_id: userId },
    });

    if (!riddle) {
      throw new NotFoundException('Загадку не знайдено або ви не є її автором');
    }

    return this.prisma.riddles.update({
      where: { id: riddleId },
      data: { is_public: true },
    });
  }

  async remove(id: string, userId: string) {
    const riddle = await this.prisma.riddles.findUnique({
      where: { id },
    });

    if (!riddle) {
      throw new NotFoundException(`Загадку з ID ${id} не знайдено`);
    }

    if (riddle.author_id !== userId) {
      throw new ForbiddenException('Ви можете видаляти лише власні загадки');
    }

    return this.prisma.riddles.delete({
      where: { id },
    });
  }
}

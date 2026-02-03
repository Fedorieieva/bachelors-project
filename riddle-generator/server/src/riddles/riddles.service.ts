import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AiService } from './ai/ai.service';
import { PromptsService } from './prompts/prompts.service';
import {
  AiRiddleResponse,
  ChatResponseDto,
  ChatResponseType,
  EvaluationResult,
  RiddleDto,
  RiddleIntentAnalysis,
  RiddleSettingsDto,
  RiddleType,
} from './dto/riddle.dto';
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

  async generateRiddle(
    dto: RiddleDto,
    aiAnalysis?: RiddleIntentAnalysis,
  ): Promise<{
    content: string;
    answer: string;
    prompt_context: Record<string, unknown>;
  }> {
    let attempts = 0;
    let lastResult: AiRiddleResponse | null = null;

    const riddleType = aiAnalysis?.type || dto.settings.type || RiddleType.DANETKI;
    const style = aiAnalysis?.style || 'neutral';
    const topic = aiAnalysis?.topic || dto.topic;
    const { language, complexity } = dto.settings;

    const promptName = `${riddleType}_generator`;

    let mainPrompt = await this.promptsService.getRenderedPrompt(promptName, {
      language,
      topic,
      complexity,
    });

    if (style !== 'neutral') {
      mainPrompt += `\n\nSTYLE INSTRUCTION:
    Generate this riddle strictly in the style of "${style}".
    Use specific vocabulary, tone, and atmosphere characteristic of this style.`;
    }

    mainPrompt += `\n\nSAFETY AND CONTENT RULES:
  1. You are a specialized Riddle Generator.
  2. If the user's topic is a request for a recipe, code, general advice, or anything that is NOT a riddle,
     you MUST return exactly this JSON: {"content": "ERROR_OFF_TOPIC", "answer": "NONE"}.
  3. Do not break character. Do not provide information outside the riddle context.`;

    while (attempts < this.MAX_REGENERATION_ATTEMPTS) {
      attempts++;

      const aiResult = await this.aiService.askGemini<AiRiddleResponse>(mainPrompt);
      lastResult = aiResult;

      if (aiResult.content === 'ERROR_OFF_TOPIC') {
        throw new BadRequestException(
          'Вибачте, я можу створювати лише загадки. Будь ласка, введіть тему для нової задачі.',
        );
      }

      const evaluation = await this.evaluateRiddle(aiResult, riddleType, language);

      if (evaluation.is_good) {
        return this.formatResponse(aiResult, dto, promptName, attempts, riddleType, style);
      }

      this.logger.warn(`Спроба #${attempts} відхилена критиком: ${evaluation.reason}`);
    }

    if (!lastResult) {
      throw new InternalServerErrorException('Не вдалося згенерувати контент. Спробуйте пізніше.');
    }

    return this.formatResponse(lastResult, dto, promptName, attempts, riddleType, style);
  }

  private formatResponse(
    result: AiRiddleResponse,
    dto: RiddleDto,
    promptName: string,
    attempts: number,
    type: RiddleType,
    style: string,
  ) {
    return {
      content: result.content,
      answer: result.answer,
      prompt_context: {
        message: dto.topic,
        complexity: dto.settings.complexity,
        language: dto.settings.language,
        prompt_name: promptName,
        generation_attempts: attempts,
        type: type,
        style: style,
      },
    };
  }

  private async evaluateRiddle(
    riddle: AiRiddleResponse,
    type: RiddleType,
    language?: string,
  ): Promise<EvaluationResult> {
    const evalPrompt = `
    Evaluate this riddle of type "${type}".
    Text: "${riddle.content}"
    Answer: "${riddle.answer}"
    Language: ${language}

    Check:
    1. Is it a valid riddle?
    2. Does the answer match the logic?
    3. Are there grammar errors?

    Return JSON: {"is_good": boolean, "reason": "string"}
  `;

    try {
      return await this.aiService.askGemini<EvaluationResult>(evalPrompt);
    } catch (e) {
      return { is_good: true };
    }
  }

  async createRiddle(
    userId: string,
    data: { content: string; answer: string; prompt_context: any },
  ) {
    return this.prisma.riddles.create({
      data: {
        content: data.content,
        answer: data.answer,
        prompt_context: data.prompt_context
          ? JSON.parse(JSON.stringify(data.prompt_context))
          : null,
        author_id: userId,
        is_public: false,
      },
    });
  }

  async regenerateLastRiddle(
    chatId: string,
    settings: RiddleSettingsDto,
    authorId: string,
  ) {
    const lastUserMessage = await this.prisma.message.findFirst({
      where: {
        chat_id: chatId,
        role: 'user',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastUserMessage) {
      throw new NotFoundException('Історія повідомлень не знайдена для регенерації');
    }

    this.logger.log(`Регенерація загадки для чату ${chatId}. Тема: ${lastUserMessage.content}`);

    const newRiddle = await this.generateRiddle({
      topic: lastUserMessage.content,
      settings,
    });

    await this.saveMessage(chatId, 'model', JSON.stringify(newRiddle));

    const isInteractive = settings.is_interactive ?? false;

    await this.prisma.chat.update({
      where: { id: chatId },
      data: {
        is_interactive: isInteractive,
        current_riddle_answer: isInteractive ? newRiddle.answer : null,
      },
    });

    return {
      type: 'NEW_RIDDLE',
      data: newRiddle,
    };
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
    settings: RiddleSettingsDto,
    authorId: string,
  ): Promise<ChatResponseDto> {
    const analysis: RiddleIntentAnalysis = await this.aiService.classifyIntent(userMessage);

    if (analysis.intent === 'OFF_TOPIC') {
      return {
        type: ChatResponseType.SYSTEM_MESSAGE,
        data: {
          content: 'Вибачте, я спеціалізуюся лише на загадках. Чим я можу допомогти у межах цієї теми?',
        },
      };
    }

    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          where: { is_initial: true },
          take: 1,
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Чат не знайдено');
    }

    if (analysis.intent === 'NEW') {
      const newRiddle = await this.generateRiddle(
        { topic: analysis.topic || userMessage, settings },
        analysis,
      );

      await this.saveMessage(chatId, 'user', userMessage, true);
      await this.saveMessage(chatId, 'model', JSON.stringify(newRiddle), true);

      const isInteractive = settings.is_interactive ?? false;

      await this.prisma.chat.update({
        where: { id: chatId },
        data: {
          is_interactive: isInteractive,
          current_riddle_answer: isInteractive ? newRiddle.answer : null,
        },
      });

      return {
        type: ChatResponseType.NEW_RIDDLE,
        data: {
          content: newRiddle.content,
          answer: isInteractive ? undefined : newRiddle.answer,
          prompt_context: newRiddle.prompt_context,
        },
      };
    }

    if (chat.is_interactive) {
      if (!chat.current_riddle_answer) {
        throw new BadRequestException(
          'У цьому чаті немає активної інтерактивної загадки. Згенеруйте нову з is_interactive: true',
        );
      }

      const history = await this.getHistory(chatId);

      const hintObj = await this.aiService.getContextualHint(
        history,
        userMessage,
        chat.current_riddle_answer,
      );

      await this.saveMessage(chatId, 'user', userMessage);
      await this.saveMessage(chatId, 'model', JSON.stringify(hintObj));

      return {
        type: ChatResponseType.REFINE_RIDDLE,
        data: { content: hintObj.content },
      };
    }

    const rawHistory = await this.getHistory(chatId);
    const aiUpdate = await this.aiService.askGeminiChat(rawHistory, userMessage);

    await this.saveMessage(chatId, 'user', userMessage);
    await this.saveMessage(
      chatId,
      'model',
      typeof aiUpdate === 'string' ? aiUpdate : JSON.stringify(aiUpdate),
    );

    return {
      type: ChatResponseType.REFINE_RIDDLE,
      data: {
        content: aiUpdate.content || aiUpdate.text || JSON.stringify(aiUpdate),
      },
    };
  }

  async revealAnswer(chatId: string, userId: string): Promise<ChatResponseDto> {
    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, user_id: userId },
    });

    if (!chat) {
      throw new NotFoundException('Чат не знайдено');
    }

    if (!chat.current_riddle_answer) {
      throw new BadRequestException('У цьому чаті немає активної загадки з відповіддю');
    }

    const responseText = `Добре, ось відповідь: ${chat.current_riddle_answer}`;

    await this.saveMessage(chatId, 'model', responseText);

    await this.prisma.chat.update({
      where: { id: chatId },
      data: { is_interactive: false, current_riddle_answer: null },
    });

    return {
      type: ChatResponseType.SYSTEM_MESSAGE,
      data: {
        content: responseText,
        answer: chat.current_riddle_answer,
      },
    };
  }

  private async getHistory(chatId: string): Promise<Content[]> {
    try {
      const messages = await this.prisma.message.findMany({
        where: { chat_id: chatId },
        orderBy: { createdAt: 'asc' },
        take: 10,
      });

      return messages.map(msg => {
        let textContent = msg.content;

        if (msg.is_initial && msg.role === 'model') {
          try {
            const parsed = JSON.parse(msg.content);
            textContent = parsed.content;
          } catch (e) {
          }
        }

        return {
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: textContent }],
        };
      });
    } catch (error) {
      this.logger.error(`Помилка отримання історії: ${error.message}`);
      return [];
    }
  }

  async getChatHistory(chatId: string, userId: string) {
    return this.prisma.message.findMany({
      where: {
        chat_id: chatId,
        chat: { user_id: userId },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  private async saveMessage(chatId: string, role: string, content: string, isInitial = false) {
    try {
      this.logger.debug(`Збереження повідомлення: role=${role}, is_initial=${isInitial}, довжина=${content.length}`);
      return await this.prisma.message.create({
        data: {
          chat_id: chatId,
          role,
          content,
          is_initial: isInitial,
        },
      });
    } catch (error) {
      this.logger.error(`Помилка збереження повідомлення: ${(error as Error).message}`);
    }
  }

  async getMyRiddles(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: { author_id: userId },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.riddles.count({ where: { author_id: userId } }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPublicRiddles(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: { is_public: true },
        include: {
          author: {
            select: { id: true, name: true, is_guest: true },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.riddles.count({ where: { is_public: true } }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

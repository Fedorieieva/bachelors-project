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
import { PrismaService } from '../prisma/prisma.service';
import { Content } from '@google/generative-ai';
import { RiddleType } from '@prisma/client';
import { AiRiddleResponse, EvaluationResult, RiddleIntentAnalysis } from './ai/ai-responses.dto';
import { RiddleMetadata, ToggleSaveResponse } from './dto/riddle-persistence.dto';
import { ChatResponseDto, ChatResponseType } from './dto/chat-response.dto';
import { ExperienceService } from '../experience/experience.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RiddleDto, RiddleSettingsDto } from './dto/riddle-settings.dto';

@Injectable()
export class RiddlesService {
  private readonly logger = new Logger(RiddlesService.name);
  private readonly MAX_REGENERATION_ATTEMPTS = 3;
  private readonly BAN_DURATION_MINUTES = 320;
  private readonly MAX_VIOLATIONS = 3;
  private readonly BASE_XP_PER_COMPLEXITY = 20;

  constructor(
    private readonly aiService: AiService,
    private readonly promptsService: PromptsService,
    private readonly prisma: PrismaService,
    private readonly experienceService: ExperienceService,
    private readonly notificationsService: NotificationsService,
  ) {
  }

  async generateRiddle(
    dto: RiddleDto,
    aiAnalysis?: RiddleIntentAnalysis,
  ): Promise<{ content: string; answer: string; prompt_context: RiddleMetadata; model_used: string }> {
    let attempts = 0;
    let lastResult: AiRiddleResponse | null = null;

    const riddleType = aiAnalysis?.type || dto.settings.type || RiddleType.DANETKI;
    const style = aiAnalysis?.style || 'neutral';
    const topic = aiAnalysis?.topic || dto.topic;
    const { complexity, model: preferredModel } = dto.settings;
    const modelUsed = this.aiService.getModelName(preferredModel);

    const promptName = `${riddleType.toLowerCase()}_generator`;

    const languageInstruction =
      'the language of the user\'s input topic. ' +
      'CRITICAL LANGUAGE RULE: Analyze the topic and generate the riddle and all responses ' +
      'strictly in the same language as the user\'s input. ' +
      'If the input is ambiguous or the language cannot be determined, you MUST default to English.';

    let mainPrompt = await this.promptsService.getRenderedPrompt(promptName, {
      language: languageInstruction,
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

    mainPrompt += `\n\nCHAIN-OF-THOUGHT INSTRUCTION:
    Before generating the final riddle, you must:
    1. Analyze the chosen topic and identify its unique characteristics.
    2. Think about how to describe these characteristics metaphorically or indirectly.
    3. Ensure the answer is logical and directly follows from the clues provided.

    You MUST provide your thought process in the "reasoning" field of the JSON.`;

    while (attempts < this.MAX_REGENERATION_ATTEMPTS) {
      attempts++;

      const aiResult = await this.aiService.askGemini<AiRiddleResponse>(mainPrompt, 3, preferredModel);
      lastResult = aiResult;

      if (aiResult.content === 'ERROR_OFF_TOPIC') {
        throw new BadRequestException(
          'Згенерований контент не відповідає правилам безпеки. Спробуйте змінити тему.',
        );
      }

      const evaluation = await this.evaluateRiddle(aiResult, riddleType);

      if (!evaluation.is_safe) {
        this.logger.error(`🚨 Спроба #${attempts} заблокована через SAFETY: ${evaluation.reason}`);
        throw new BadRequestException(
          'Тема містить неприпустимий рівень жорстокості. Будь ласка, оберіть іншу тему.',
        );
      }

      if (evaluation.is_good) {
        return this.formatResponse(aiResult, dto, promptName, attempts, riddleType, style, modelUsed);
      }

      this.logger.warn(`Спроба #${attempts} відхилена критиком: ${evaluation.reason}`);
    }

    if (!lastResult) {
      throw new InternalServerErrorException('Не вдалося згенерувати контент. Спробуйте пізніше.');
    }

    return this.formatResponse(lastResult, dto, promptName, attempts, riddleType, style, modelUsed);
  }

  private formatResponse(
    result: AiRiddleResponse,
    dto: RiddleDto,
    promptName: string,
    attempts: number,
    type: RiddleType,
    style: string,
    modelUsed: string,
  ): { content: string; answer: string; prompt_context: RiddleMetadata; model_used: string } {
    return {
      content: result.content,
      answer: result.answer,
      model_used: modelUsed,
      prompt_context: {
        message: dto.topic,
        complexity: dto.settings.complexity,
        language: 'auto',
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
  ): Promise<EvaluationResult> {
    const evalPrompt = `
      Analyze this riddle for quality and safety.
      Type: "${type}"
      Content: "${riddle.content}"
      Answer: "${riddle.answer}"

      BLOCK (is_safe: false) if:
        - Any sexual content or innuendos.
        - Graphic gore/blood (descriptions of wounds, organs, etc.).
        - Physical cruelty.

      ALLOW (is_safe: true) if:
        - Mystery death/suicide (classic detective/danetki style) without graphic details.

      CRITICAL SAFETY CHECK:
      - Allowed: Dark themes, mentions of mystery deaths, or "danetki" style suicides.
      - Prohibited: Graphic gore, detailed descriptions of physical violence, torture, or cruelty.
      - No detailed descriptions of bodies, blood, or suffering.

      TECHNICAL CHECK:
      1. Is the logic sound?
      2. Does the answer make sense?

      Return JSON ONLY:
      {
        "is_good": boolean,
        "is_safe": boolean,
        "reason": "string"
      }
    `;

    try {
      const evaluation = await this.aiService.askGemini<EvaluationResult>(evalPrompt);
      return evaluation;
    } catch (e) {
      this.logger.error('Критична помилка оцінки ШІ, пропускаємо перевірку', e);
      return { is_good: true, is_safe: true };
    }
  }

  async regenerateLastRiddle(chatId: string, settings: RiddleSettingsDto) {
    const lastUserMessage = await this.prisma.message.findFirst({
      where: { chat_id: chatId, role: 'user' },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastUserMessage) {
      throw new NotFoundException('Історія повідомлень не знайдена');
    }

    const lastModelMessage = await this.prisma.message.findFirst({
      where: {
        chat_id: chatId,
        role: 'model',
        createdAt: { gt: lastUserMessage.createdAt }
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastModelMessage) {
      throw new NotFoundException('Відповідь для регенерації не знайдена');
    }

    const wasInitial = lastModelMessage.is_initial;

    await this.prisma.message.delete({
      where: { id: lastModelMessage.id }
    });

    let responseData;
    let responseType: ChatResponseType;

    if (wasInitial) {
      const newRiddle = await this.generateRiddle({
        topic: lastUserMessage.content,
        settings,
      });

      responseData = newRiddle;
      responseType = ChatResponseType.NEW_RIDDLE;

      await this.prisma.chat.update({
        where: { id: chatId },
        data: {
          is_interactive: settings.is_interactive ?? false,
          current_riddle_answer: settings.is_interactive ? newRiddle.answer : null,
        },
      });
    } else {
      const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
      const history = await this.getHistory(chatId);

      if (chat?.is_interactive && chat.current_riddle_answer) {
        responseData = await this.aiService.getContextualHint(
          history,
          lastUserMessage.content,
          chat.current_riddle_answer,
        );
      } else {
        responseData = await this.aiService.askGeminiChat(
          history,
          lastUserMessage.content,
        );
      }

      responseType = ChatResponseType.REFINE_RIDDLE;
    }

    await this.saveMessage(chatId, 'model', JSON.stringify(responseData), wasInitial);

    return {
      type: responseType,
      data: responseData,
    };
  }

  async createChat(authorId: string, settings: RiddleSettingsDto) {
    const newChat = await this.prisma.chat.create({
      data: {
        user_id: authorId,
        complexity: settings.complexity || 1,
        type: settings.type || RiddleType.LOGIC,
        language: 'auto',
        is_interactive: settings.is_interactive ?? false,
      },
    });
    return { chatId: newChat.id };
  }

  async processChatMessage(
    chatId: string,
    userMessage: string,
    authorId: string,
    model?: string,
  ): Promise<ChatResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id: authorId } });
    this.validateUserAccess(user);

    const analysis: RiddleIntentAnalysis = await this.aiService.classifyIntent(userMessage);

    if (analysis.intent === 'GIVE_UP') {
      await this.saveMessage(chatId, 'user', userMessage);
      return this.revealAnswer(chatId, authorId);
    }

    if (analysis.intent === 'INAPPROPRIATE') {
      await this.handleUserViolation(authorId);
      return {
        type: ChatResponseType.SYSTEM_MESSAGE,
        data: {
          content:
            'Ваш запит містить неприпустимий контент. Будь ласка, дотримуйтесь правил спільноти.',
        },
      };
    }

    if (analysis.intent === 'OFF_TOPIC') {
      return {
        type: ChatResponseType.SYSTEM_MESSAGE,
        data: {
          content:
            'Вибачте, я спеціалізуюся лише на загадках. Чим я можу допомогти у межах цієї теми?',
        },
      };
    }

    if (analysis.intent === 'NEW' || analysis.intent === 'REFINE') {
      await this.resetViolationIfNeeded(user, authorId);
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
      return this.handleNewRiddleIntent(chatId, userMessage, chat, analysis, model);
    }

    return this.handleContextualResponse(chatId, userMessage, authorId, chat, model);
  }

  private validateUserAccess(user: { banned_until: Date | null } | null): void {
    if (user?.banned_until && user.banned_until > new Date()) {
      const remainingTime = Math.ceil((user.banned_until.getTime() - Date.now()) / 60000);
      throw new ForbiddenException(
        `Ви тимчасово заблоковані. Спробуйте через ${remainingTime} хв.`,
      );
    }
  }

  private async resetViolationIfNeeded(
    user: { violation_count: number } | null,
    authorId: string,
  ): Promise<void> {
    if (user && user.violation_count > 0) {
      await this.prisma.user.update({
        where: { id: authorId },
        data: { violation_count: 0 },
      });
    }
  }

  private async handleNewRiddleIntent(
    chatId: string,
    userMessage: string,
    chat: { complexity: number; type: RiddleType; language: string; is_interactive: boolean },
    analysis: RiddleIntentAnalysis,
    model?: string,
  ): Promise<ChatResponseDto> {
    const effectiveSettings: RiddleSettingsDto = {
      complexity: chat.complexity,
      type: chat.type,
      language: chat.language,
      is_interactive: chat.is_interactive,
      model,
    };

    const newRiddle = await this.generateRiddle(
      { topic: analysis.topic || userMessage, settings: effectiveSettings },
      analysis,
    );

    await this.saveMessage(chatId, 'user', userMessage, true);
    await this.saveMessage(chatId, 'model', JSON.stringify(newRiddle), true);

    await this.prisma.chat.update({
      where: { id: chatId },
      data: { current_riddle_answer: chat.is_interactive ? newRiddle.answer : null },
    });

    const fallback_occurred = (!model && this.aiService.consumeFallbackFlag()) || undefined;
    return {
      type: ChatResponseType.NEW_RIDDLE,
      data: {
        content: newRiddle.content,
        answer: effectiveSettings.is_interactive ? undefined : newRiddle.answer,
        prompt_context: newRiddle.prompt_context,
        model_used: newRiddle.model_used,
        fallback_occurred,
      },
    };
  }

  private async handleContextualResponse(
    chatId: string,
    userMessage: string,
    authorId: string,
    chat: { is_interactive: boolean; current_riddle_answer: string | null; complexity: number | null },
    model?: string,
  ): Promise<ChatResponseDto> {
    const modelUsed = this.aiService.getModelName(model);
    this.aiService.consumeFallbackFlag();

    if (chat.is_interactive) {
      return this.handleInteractiveMessage(chatId, userMessage, authorId, chat, model, modelUsed);
    }

    return this.handleNonInteractiveMessage(chatId, userMessage, model, modelUsed);
  }

  private async handleInteractiveMessage(
    chatId: string,
    userMessage: string,
    authorId: string,
    chat: { current_riddle_answer: string | null; complexity: number | null },
    model: string | undefined,
    modelUsed: string,
  ): Promise<ChatResponseDto> {
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
      3,
      model,
    );

    await this.saveMessage(chatId, 'user', userMessage);
    await this.saveMessage(chatId, 'model', JSON.stringify({ ...hintObj, model_used: modelUsed }));

    let xpEarned = 0;
    if (hintObj.is_solved) {
      xpEarned = this.BASE_XP_PER_COMPLEXITY * (chat.complexity || 1);
      const previewText = history[0]?.parts[0]?.text || 'Загадка з чату';
      await this.experienceService.awardXpForSolving(authorId, previewText, xpEarned);
      await this.prisma.chat.update({
        where: { id: chatId },
        data: { current_riddle_answer: null },
      });
    }

    const fallback_occurred = (!model && this.aiService.consumeFallbackFlag()) || undefined;
    return {
      type: ChatResponseType.REFINE_RIDDLE,
      data: {
        content: hintObj.content ?? '',
        xp_earned: xpEarned > 0 ? xpEarned : undefined,
        model_used: modelUsed,
        fallback_occurred,
      },
    };
  }

  private async handleNonInteractiveMessage(
    chatId: string,
    userMessage: string,
    model: string | undefined,
    modelUsed: string,
  ): Promise<ChatResponseDto> {
    const rawHistory = await this.getHistory(chatId);
    const aiUpdate = await this.aiService.askGeminiChat(rawHistory, userMessage, model);

    const fallback_occurred = (!model && this.aiService.consumeFallbackFlag()) || undefined;
    await this.saveMessage(chatId, 'user', userMessage);
    await this.saveMessage(chatId, 'model', JSON.stringify({ ...aiUpdate, model_used: modelUsed }));

    return {
      type: ChatResponseType.REFINE_RIDDLE,
      data: {
        content: (aiUpdate as any).content,
        model_used: modelUsed,
        fallback_occurred,
      },
    };
  }

  async solveChallenge(userId: string, riddleId: string, guess: string) {
    const riddle = await this.prisma.riddles.findUnique({ where: { id: riddleId } });
    if (!riddle) throw new NotFoundException('Загадка не знайдена');

    let attempt = await this.prisma.riddleAttempt.findUnique({
      where: { user_id_riddle_id: { user_id: userId, riddle_id: riddleId } },
    });

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    if (attempt?.is_blocked && attempt.last_try < oneHourAgo) {
      attempt = await this.prisma.riddleAttempt.update({
        where: { id: attempt.id },
        data: { is_blocked: false, attempts: 0 },
      });
    }

    if (attempt?.is_blocked) {
      throw new ForbiddenException('Спроби вичерпано. Зачекайте годину або скористайтеся розблокуванням за XP.');
    }

    const result = await this.aiService.getContextualHint(
      [],
      guess,
      riddle.answer,
    );

    if (result.is_solved) {
      await this.experienceService.awardXpForSolving(userId, riddle.content, 20);
      if (userId !== riddle.author_id) {
        const solver = await this.prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
        if (solver) {
          await this.notificationsService.notifyRiddleSolved(riddle.author_id, userId, solver.name ?? 'Someone', riddle.content);
        }
      }
      await this.prisma.riddleAttempt.upsert({
        where: { user_id_riddle_id: { user_id: userId, riddle_id: riddleId } },
        update: { attempts: -1, is_blocked: false, last_try: now },
        create: { user_id: userId, riddle_id: riddleId, attempts: -1, last_try: now },
      });
      return { success: true, message: 'Геніально! +20 XP', answer: riddle.answer, xp_earned: 20 };
    } else {
      const newAttempts = (attempt?.attempts || 0) + 1;
      const isBlocked = newAttempts >= 3;

      await this.prisma.riddleAttempt.upsert({
        where: { user_id_riddle_id: { user_id: userId, riddle_id: riddleId } },
        update: { attempts: newAttempts, is_blocked: isBlocked, last_try: now },
        create: { user_id: userId, riddle_id: riddleId, attempts: newAttempts, is_blocked: isBlocked, last_try: now },
      });

      return {
        success: false,
        message: isBlocked ? 'Спроби вичерпано!' : 'Не вгадали.',
        remaining_attempts: 3 - newAttempts,
        is_blocked: isBlocked
      };
    }
  }

  async buyExtraAttempt(userId: string, riddleId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.xp < 10) throw new BadRequestException('Недостатньо XP');

    const attempt = await this.prisma.riddleAttempt.findUnique({
      where: { user_id_riddle_id: { user_id: userId, riddle_id: riddleId } }
    });

    if (!attempt?.is_blocked) throw new BadRequestException('Загадка не заблокована');

    return await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { xp: { decrement: 10 } }
      });

      return tx.riddleAttempt.update({
        where: { id: attempt.id },
        data: { is_blocked: false, attempts: 2 }
      });
    });
  }

  async getHintForXp(userId: string, riddleId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.is_guest) {
      throw new ForbiddenException('Тільки зареєстровані користувачі можуть отримуваи підказки');
    } else if (user.xp < 10) {
      throw new BadRequestException('Недостатньо XP для підказки');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { xp: { decrement: 10 } },
    });

    const riddle = await this.prisma.riddles.findUnique({ where: { id: riddleId } });
    if (!riddle) {
      throw new NotFoundException('Загадку не знайдено');
    }

    return { hint: `Підказка: Перша літера "${riddle.answer[0]}"` };
  }

  private async handleUserViolation(userId: string) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        violation_count: { increment: 1 },
        last_violation_at: new Date(),
      },
    });

    this.logger.warn(`Порушення для ${userId}: спроба ${updatedUser.violation_count}/3`);

    if (updatedUser.violation_count >= this.MAX_VIOLATIONS) {
      const bannedUntil = new Date();
      bannedUntil.setMinutes(bannedUntil.getMinutes() + this.BAN_DURATION_MINUTES);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          violation_count: 0,
          banned_until: bannedUntil,
        },
      });
      this.logger.error(`🚨 Користувач ${userId} забанений до ${bannedUntil}`);
    }
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
            this.logger.warn('Could not parse model message as JSON, using raw content', e);
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

  async getOnlyRiddlesFromChat(chatId: string, userId?: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        chat_id: chatId,
        role: 'model',
        is_initial: true,
      },
      include: {
        saved_riddle: userId
          ? {
            include: {
              saved_by: {
                where: { user_id: userId },
              },
            },
          }
          : true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      savedRiddle: msg.saved_riddle
        ? {
          id: msg.saved_riddle.id,
          is_public: msg.saved_riddle.is_public,
        }
        : null,
    }));
  }

  private async saveMessage(chatId: string, role: string, content: string, isInitial = false) {
    try {
      this.logger.debug(
        `Збереження повідомлення: role=${role}, is_initial=${isInitial}, довжина=${content.length}`,
      );
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

  async saveToUserCollection(userId: string, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { chat: true },
    });

    if (!message) throw new NotFoundException('Message not found');

    let content = message.content;
    let answer = '';
    try {
      const parsed = JSON.parse(message.content);
      content = parsed.content || message.content;
      answer = parsed.answer || '';
    } catch {}

    const riddle = await this.prisma.riddles.create({
      data: {
        content,
        answer,
        author_id: userId,
        complexity: message.chat.complexity,
        type: message.chat.type,
        is_public: false,
        source_message: {
          connect: { id: messageId },
        },
      },
    });

    return riddle;
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
      data: { is_public: !riddle.is_public },
    });
  }

  async toggleSaveRiddle(userId: string, riddleId: string): Promise<ToggleSaveResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.is_guest) {
      throw new ForbiddenException('Тільки зареєстровані користувачі можуть зберігати загадки');
    }

    const existingSave = await this.prisma.savedRiddles.findUnique({
      where: {
        user_id_riddle_id: { user_id: userId, riddle_id: riddleId },
      },
    });

    if (existingSave) {
      await this.prisma.savedRiddles.delete({
        where: { id: existingSave.id },
      });
      return { saved: false };
    }

    await this.prisma.savedRiddles.create({
      data: { user_id: userId, riddle_id: riddleId },
    });
    return { saved: true };
  }

  async deleteChat(chatId: string, userId: string): Promise<{ message: string }> {
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own chats');
    }

    await this.prisma.chat.delete({ where: { id: chatId } });

    return { message: 'Chat deleted successfully' };
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

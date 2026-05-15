import { Test, TestingModule } from '@nestjs/testing';
import { RiddlesService } from './riddles.service';
import { AiService } from './ai/ai.service';
import { PromptsService } from './prompts/prompts.service';
import { PrismaService } from '../prisma/prisma.service';
import { ExperienceService } from '../experience/experience.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { RiddleType } from '@prisma/client';

const mockAiService = {
  getModelName: jest.fn().mockReturnValue('gemini-test'),
  askGemini: jest.fn(),
  classifyIntent: jest.fn(),
  getContextualHint: jest.fn(),
  askGeminiChat: jest.fn(),
  consumeFallbackFlag: jest.fn().mockReturnValue(false),
};

const mockPromptsService = {
  getRenderedPrompt: jest.fn().mockResolvedValue('Rendered prompt text'),
};

const mockPrisma = {
  user: { findUnique: jest.fn(), update: jest.fn() },
  chat: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), findFirst: jest.fn(), delete: jest.fn() },
  message: { findFirst: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
  riddles: { findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  riddleAttempt: { findUnique: jest.fn(), upsert: jest.fn(), update: jest.fn() },
  savedRiddles: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
  $transaction: jest.fn(),
};

const mockExperienceService = {
  awardXpForSolving: jest.fn().mockResolvedValue(undefined),
};

const goodRiddle = { content: 'A riddle', answer: '42' };
const goodEval = { is_good: true, is_safe: true, reason: '' };

describe('RiddlesService', () => {
  let service: RiddlesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiddlesService,
        { provide: AiService, useValue: mockAiService },
        { provide: PromptsService, useValue: mockPromptsService },
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ExperienceService, useValue: mockExperienceService },
      ],
    }).compile();

    service = module.get<RiddlesService>(RiddlesService);
  });

  describe('generateRiddle', () => {
    it('generates and returns a riddle on first attempt', async () => {
      mockAiService.askGemini
        .mockResolvedValueOnce(goodRiddle)
        .mockResolvedValueOnce(goodEval);

      const result = await service.generateRiddle({
        topic: 'cats',
        settings: { complexity: 2, type: RiddleType.DANETKI },
      });

      expect(result.content).toBe('A riddle');
      expect(result.answer).toBe('42');
    });

    it('throws BadRequestException when riddle content is ERROR_OFF_TOPIC', async () => {
      mockAiService.askGemini.mockResolvedValueOnce({ content: 'ERROR_OFF_TOPIC', answer: 'NONE' });

      await expect(
        service.generateRiddle({ topic: 'a recipe', settings: { complexity: 1, type: RiddleType.DANETKI } }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when riddle is unsafe', async () => {
      mockAiService.askGemini
        .mockResolvedValueOnce(goodRiddle)
        .mockResolvedValueOnce({ is_good: false, is_safe: false, reason: 'violent content' });

      await expect(
        service.generateRiddle({ topic: 'cats', settings: { complexity: 1, type: RiddleType.DANETKI } }),
      ).rejects.toThrow(BadRequestException);
    });

    it('retries up to MAX_REGENERATION_ATTEMPTS and returns last result', async () => {
      const badEval = { is_good: false, is_safe: true, reason: 'poor quality' };
      // Alternate riddle + eval for 3 attempts
      mockAiService.askGemini
        .mockResolvedValueOnce(goodRiddle).mockResolvedValueOnce(badEval)
        .mockResolvedValueOnce(goodRiddle).mockResolvedValueOnce(badEval)
        .mockResolvedValueOnce(goodRiddle).mockResolvedValueOnce(badEval);

      const result = await service.generateRiddle({
        topic: 'cats',
        settings: { complexity: 1, type: RiddleType.LOGIC },
      });
      expect(result.content).toBe('A riddle');
    });
  });

  describe('createChat', () => {
    it('creates a chat and returns its id', async () => {
      mockPrisma.chat.create.mockResolvedValue({ id: 'chat-1' });

      const result = await service.createChat('u1', { complexity: 1, type: RiddleType.DANETKI });
      expect(result).toEqual({ chatId: 'chat-1' });
    });
  });

  describe('deleteChat', () => {
    it('deletes chat owned by user', async () => {
      mockPrisma.chat.findUnique.mockResolvedValue({ id: 'c1', user_id: 'u1' });
      mockPrisma.chat.delete.mockResolvedValue({});

      const result = await service.deleteChat('c1', 'u1');
      expect(result.message).toBe('Chat deleted successfully');
    });

    it('throws NotFoundException when chat not found', async () => {
      mockPrisma.chat.findUnique.mockResolvedValue(null);
      await expect(service.deleteChat('c1', 'u1')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when chat belongs to another user', async () => {
      mockPrisma.chat.findUnique.mockResolvedValue({ id: 'c1', user_id: 'other' });
      await expect(service.deleteChat('c1', 'u1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('deletes a riddle owned by the user', async () => {
      mockPrisma.riddles.findUnique.mockResolvedValue({ id: 'r1', author_id: 'u1' });
      mockPrisma.riddles.delete.mockResolvedValue({ id: 'r1' });

      const result = await service.remove('r1', 'u1');
      expect(result).toEqual({ id: 'r1' });
    });

    it('throws NotFoundException when riddle not found', async () => {
      mockPrisma.riddles.findUnique.mockResolvedValue(null);
      await expect(service.remove('r1', 'u1')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when user is not the author', async () => {
      mockPrisma.riddles.findUnique.mockResolvedValue({ id: 'r1', author_id: 'other' });
      await expect(service.remove('r1', 'u1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('toggleSaveRiddle', () => {
    it('throws ForbiddenException for guest users', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', is_guest: true });
      await expect(service.toggleSaveRiddle('u1', 'r1')).rejects.toThrow(ForbiddenException);
    });

    it('unsaves when save record already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', is_guest: false });
      mockPrisma.savedRiddles.findUnique.mockResolvedValue({ id: 's1' });
      mockPrisma.savedRiddles.delete.mockResolvedValue({});

      const result = await service.toggleSaveRiddle('u1', 'r1');
      expect(result).toEqual({ saved: false });
    });

    it('saves when no existing save record', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', is_guest: false });
      mockPrisma.savedRiddles.findUnique.mockResolvedValue(null);
      mockPrisma.savedRiddles.create.mockResolvedValue({});

      const result = await service.toggleSaveRiddle('u1', 'r1');
      expect(result).toEqual({ saved: true });
    });
  });

  describe('makeRiddlePublic', () => {
    it('toggles riddle visibility', async () => {
      mockPrisma.riddles.findFirst.mockResolvedValue({ id: 'r1', is_public: false, author_id: 'u1' });
      mockPrisma.riddles.update.mockResolvedValue({ id: 'r1', is_public: true });

      const result = await service.makeRiddlePublic('u1', 'r1');
      expect(result.is_public).toBe(true);
    });

    it('throws NotFoundException when riddle not found or wrong author', async () => {
      mockPrisma.riddles.findFirst.mockResolvedValue(null);
      await expect(service.makeRiddlePublic('u1', 'r1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('buyExtraAttempt', () => {
    it('throws BadRequestException when user has insufficient XP', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', xp: 5 });
      await expect(service.buyExtraAttempt('u1', 'r1')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when attempt is not blocked', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', xp: 50 });
      mockPrisma.riddleAttempt.findUnique.mockResolvedValue({ is_blocked: false });
      await expect(service.buyExtraAttempt('u1', 'r1')).rejects.toThrow(BadRequestException);
    });

    it('deducts XP and unblocks attempt on success', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', xp: 50 });
      mockPrisma.riddleAttempt.findUnique.mockResolvedValue({ id: 'a1', is_blocked: true });
      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          user: { update: jest.fn().mockResolvedValue({}) },
          riddleAttempt: { update: jest.fn().mockResolvedValue({ is_blocked: false }) },
        };
        return fn(tx);
      });

      const result = await service.buyExtraAttempt('u1', 'r1');
      expect(result.is_blocked).toBe(false);
    });
  });

  describe('getHintForXp', () => {
    it('throws ForbiddenException for guests', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', is_guest: true, xp: 100 });
      await expect(service.getHintForXp('u1', 'r1')).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException when XP < 10', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', is_guest: false, xp: 5 });
      await expect(service.getHintForXp('u1', 'r1')).rejects.toThrow(BadRequestException);
    });

    it('returns hint with first letter when user has enough XP', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', is_guest: false, xp: 20 });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.riddles.findUnique.mockResolvedValue({ id: 'r1', answer: 'water' });

      const result = await service.getHintForXp('u1', 'r1');
      expect(result.hint).toContain('w');
    });
  });

  describe('solveChallenge', () => {
    it('throws NotFoundException when riddle not found', async () => {
      mockPrisma.riddles.findUnique.mockResolvedValue(null);
      await expect(service.solveChallenge('u1', 'r1', 'guess')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when attempt is still blocked', async () => {
      mockPrisma.riddles.findUnique.mockResolvedValue({ id: 'r1', answer: 'water' });
      mockPrisma.riddleAttempt.findUnique.mockResolvedValue({
        id: 'a1',
        is_blocked: true,
        last_try: new Date(),
        attempts: 3,
      });

      await expect(service.solveChallenge('u1', 'r1', 'guess')).rejects.toThrow(ForbiddenException);
    });

    it('awards XP and upserts attempt on correct answer', async () => {
      mockPrisma.riddles.findUnique.mockResolvedValue({ id: 'r1', answer: 'water', content: 'What?' });
      mockPrisma.riddleAttempt.findUnique.mockResolvedValue(null);
      mockAiService.getContextualHint.mockResolvedValue({ is_solved: true, content: 'Correct!' });
      mockPrisma.riddleAttempt.upsert.mockResolvedValue({});

      const result = await service.solveChallenge('u1', 'r1', 'water');
      expect(result.success).toBe(true);
      expect(mockExperienceService.awardXpForSolving).toHaveBeenCalled();
    });

    it('returns failure result and blocks after 3 wrong attempts', async () => {
      mockPrisma.riddles.findUnique.mockResolvedValue({ id: 'r1', answer: 'water', content: 'What?' });
      mockPrisma.riddleAttempt.findUnique.mockResolvedValue({
        id: 'a1',
        is_blocked: false,
        last_try: new Date(),
        attempts: 2,
      });
      mockAiService.getContextualHint.mockResolvedValue({ is_solved: false, content: 'Try again' });
      mockPrisma.riddleAttempt.upsert.mockResolvedValue({});

      const result = await service.solveChallenge('u1', 'r1', 'wrong');
      expect(result.success).toBe(false);
      expect(result.is_blocked).toBe(true);
    });
  });

  describe('revealAnswer', () => {
    it('reveals the answer and clears the interactive riddle', async () => {
      mockPrisma.chat.findFirst.mockResolvedValue({
        id: 'c1',
        current_riddle_answer: 'water',
        user_id: 'u1',
      });
      mockPrisma.message.create.mockResolvedValue({});
      mockPrisma.chat.update.mockResolvedValue({});

      const result = await service.revealAnswer('c1', 'u1');
      expect(result.data.answer).toBe('water');
    });

    it('throws NotFoundException when chat not found', async () => {
      mockPrisma.chat.findFirst.mockResolvedValue(null);
      await expect(service.revealAnswer('c1', 'u1')).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when no active answer', async () => {
      mockPrisma.chat.findFirst.mockResolvedValue({
        id: 'c1',
        current_riddle_answer: null,
        user_id: 'u1',
      });
      await expect(service.revealAnswer('c1', 'u1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('processChatMessage', () => {
    const setupUser = (overrides: any = {}) =>
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        banned_until: null,
        violation_count: 0,
        ...overrides,
      });

    it('throws ForbiddenException for banned user', async () => {
      setupUser({ banned_until: new Date(Date.now() + 60_000) });
      mockAiService.classifyIntent.mockResolvedValue({ intent: 'NEW' });

      await expect(service.processChatMessage('c1', 'hello', 'u1')).rejects.toThrow(ForbiddenException);
    });

    it('reveals answer on GIVE_UP intent', async () => {
      setupUser();
      mockAiService.classifyIntent.mockResolvedValue({ intent: 'GIVE_UP' });
      mockPrisma.message.create.mockResolvedValue({});
      mockPrisma.chat.findFirst.mockResolvedValue({
        id: 'c1',
        current_riddle_answer: 'water',
        user_id: 'u1',
      });
      mockPrisma.chat.update.mockResolvedValue({});

      const result = await service.processChatMessage('c1', 'i give up', 'u1');
      expect(result.data.answer).toBe('water');
    });

    it('returns system message on INAPPROPRIATE intent and increments violations', async () => {
      setupUser({ violation_count: 0 });
      mockAiService.classifyIntent.mockResolvedValue({ intent: 'INAPPROPRIATE' });
      mockPrisma.user.update.mockResolvedValue({ violation_count: 1 });

      const result = await service.processChatMessage('c1', 'bad content', 'u1');
      expect(result.type).toBe('SYSTEM_MESSAGE');
    });

    it('returns off-topic system message immediately', async () => {
      setupUser();
      mockAiService.classifyIntent.mockResolvedValue({ intent: 'OFF_TOPIC' });

      const result = await service.processChatMessage('c1', 'write me code', 'u1');
      expect(result.type).toBe('SYSTEM_MESSAGE');
    });

    it('throws NotFoundException when chat not found on NEW intent', async () => {
      setupUser();
      mockAiService.classifyIntent.mockResolvedValue({ intent: 'NEW', topic: 'cats', type: RiddleType.DANETKI });
      mockPrisma.chat.findUnique.mockResolvedValue(null);

      await expect(service.processChatMessage('c1', 'new riddle', 'u1')).rejects.toThrow(NotFoundException);
    });

    it('handles REFINE intent for non-interactive chat', async () => {
      setupUser();
      mockAiService.classifyIntent.mockResolvedValue({ intent: 'REFINE' });
      mockPrisma.user.update.mockResolvedValue({ violation_count: 0 });
      mockPrisma.chat.findUnique.mockResolvedValue({
        id: 'c1',
        is_interactive: false,
        current_riddle_answer: null,
        complexity: 2,
        messages: [],
      });
      mockPrisma.message.findMany.mockResolvedValue([]);
      mockAiService.askGeminiChat.mockResolvedValue({ content: 'Hint text' });
      mockAiService.getModelName.mockReturnValue('gemini-test');
      mockAiService.consumeFallbackFlag.mockReturnValue(false);
      mockPrisma.message.create.mockResolvedValue({});

      const result = await service.processChatMessage('c1', 'a clue', 'u1');
      expect(result.type).toBe('REFINE_RIDDLE');
    });
  });

  describe('regenerateLastRiddle', () => {
    it('throws NotFoundException when no user message exists', async () => {
      mockPrisma.message.findFirst.mockResolvedValue(null);
      await expect(service.regenerateLastRiddle('c1', { complexity: 1, type: RiddleType.DANETKI }))
        .rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when no model message to regenerate', async () => {
      mockPrisma.message.findFirst
        .mockResolvedValueOnce({ id: 'm1', content: 'topic', createdAt: new Date() })
        .mockResolvedValueOnce(null);
      await expect(service.regenerateLastRiddle('c1', { complexity: 1, type: RiddleType.DANETKI }))
        .rejects.toThrow(NotFoundException);
    });

    it('regenerates a riddle when last message was initial', async () => {
      const userMsg = { id: 'm1', content: 'cats', createdAt: new Date() };
      const modelMsg = { id: 'm2', content: '{}', is_initial: true, createdAt: new Date() };
      mockPrisma.message.findFirst
        .mockResolvedValueOnce(userMsg)
        .mockResolvedValueOnce(modelMsg);
      mockPrisma.message.delete.mockResolvedValue({});
      mockAiService.askGemini
        .mockResolvedValueOnce(goodRiddle)
        .mockResolvedValueOnce(goodEval);
      mockPromptsService.getRenderedPrompt.mockResolvedValue('prompt');
      mockPrisma.chat.update.mockResolvedValue({});
      mockPrisma.message.create.mockResolvedValue({});

      const result = await service.regenerateLastRiddle('c1', { complexity: 1, type: RiddleType.DANETKI });
      expect(result.type).toBe('NEW_RIDDLE');
    });
  });

  describe('getChatHistory', () => {
    it('returns messages for the given chat and user', async () => {
      const messages = [{ id: 'm1', content: 'Hello' }];
      mockPrisma.message.findMany.mockResolvedValue(messages);

      const result = await service.getChatHistory('c1', 'u1');
      expect(result).toEqual(messages);
    });
  });

  describe('getOnlyRiddlesFromChat', () => {
    it('returns formatted riddle messages with saved riddle info', async () => {
      mockPrisma.message.findMany.mockResolvedValue([
        {
          id: 'm1',
          content: JSON.stringify({ content: 'Riddle text', answer: '42' }),
          createdAt: new Date(),
          saved_riddle: { id: 'r1', is_public: true },
        },
      ]);

      const result = await service.getOnlyRiddlesFromChat('c1', 'u1');
      expect(result).toHaveLength(1);
      expect(result[0].savedRiddle?.id).toBe('r1');
    });

    it('returns null savedRiddle when message has no saved riddle', async () => {
      mockPrisma.message.findMany.mockResolvedValue([
        { id: 'm1', content: 'raw text', createdAt: new Date(), saved_riddle: null },
      ]);

      const result = await service.getOnlyRiddlesFromChat('c1');
      expect(result[0].savedRiddle).toBeNull();
    });
  });

  describe('saveToUserCollection', () => {
    it('throws NotFoundException when message not found', async () => {
      mockPrisma.message.findUnique.mockResolvedValue(null);
      await expect(service.saveToUserCollection('u1', 'm1')).rejects.toThrow(NotFoundException);
    });

    it('creates a riddle from the message content', async () => {
      mockPrisma.message.findUnique.mockResolvedValue({
        id: 'm1',
        content: JSON.stringify({ content: 'A riddle', answer: '42' }),
        chat: { complexity: 2, type: RiddleType.DANETKI },
      });
      const created = { id: 'r1', content: 'A riddle' };
      mockPrisma.riddles.create.mockResolvedValue(created);

      const result = await service.saveToUserCollection('u1', 'm1');
      expect(result).toEqual(created);
    });
  });
});

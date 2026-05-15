import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ConfigService } from '@nestjs/config';

const mockSendMessage = jest.fn();
const mockStartChat = jest.fn().mockReturnValue({ sendMessage: mockSendMessage });
const mockGetGenerativeModel = jest.fn().mockReturnValue({ startChat: mockStartChat });

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  })),
}));

const mockConfigService = {
  get: jest.fn().mockReturnValue('fake-api-key'),
};

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockGetGenerativeModel.mockReturnValue({ startChat: mockStartChat });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  describe('getModelName', () => {
    it('returns the preferred model when specified', () => {
      const name = service.getModelName('gemini-pro');
      expect(name).toBe('gemini-pro');
    });

    it('returns the current active model when no preference given', () => {
      const name = service.getModelName();
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });
  });

  describe('consumeFallbackFlag', () => {
    it('returns false initially and resets to false after reading', () => {
      expect(service.consumeFallbackFlag()).toBe(false);
      expect(service.consumeFallbackFlag()).toBe(false);
    });
  });

  describe('askGemini', () => {
    it('returns parsed JSON from the AI response', async () => {
      mockSendMessage.mockResolvedValue({
        response: { text: () => '{"content":"riddle","answer":"42"}' },
      });

      const result = await service.askGemini<{ content: string; answer: string }>('Test prompt');
      expect(result).toEqual({ content: 'riddle', answer: '42' });
    });

    it('strips markdown code fences before parsing', async () => {
      mockSendMessage.mockResolvedValue({
        response: { text: () => '```json\n{"intent":"NEW"}\n```' },
      });

      const result = await service.askGemini<{ intent: string }>('Test');
      expect(result.intent).toBe('NEW');
    });

    it('throws InternalServerErrorException on unhandled error', async () => {
      mockSendMessage.mockRejectedValue(new Error('Unknown failure'));

      await expect(service.askGemini('prompt', 1, 'specific-model')).rejects.toThrow();
    });
  });

  describe('classifyIntent', () => {
    it('classifies a NEW intent and maps the riddle type', async () => {
      mockSendMessage.mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({ intent: 'NEW', type: 'DANETKI', style: null, topic: 'space' }),
        },
      });

      const result = await service.classifyIntent('Give me a riddle about space');
      expect(result.intent).toBe('NEW');
      expect(result.topic).toBe('space');
    });

    it('returns REFINE as fallback when AI call fails', async () => {
      mockSendMessage.mockRejectedValue(new Error('Network error'));

      const result = await service.classifyIntent('something');
      expect(result.intent).toBe('REFINE');
    });
  });

  describe('getContextualHint', () => {
    it('returns parsed hint with is_solved true', async () => {
      mockSendMessage.mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({ content: 'Correct!', is_solved: true, reasoning: 'matches' }),
        },
      });

      const result = await service.getContextualHint([], 'water', 'water');
      expect(result.is_solved).toBe(true);
      expect(result.content).toBe('Correct!');
    });

    it('returns fallback content on error', async () => {
      mockSendMessage.mockRejectedValue({ status: 500 });

      const result = await service.getContextualHint([], 'guess', 'answer', 1, 'specific-model');
      expect(result.is_solved).toBe(false);
      expect(result.content).toContain('unavailable');
    });
  });

  describe('askGeminiChat', () => {
    it('delegates to askGemini with updated history', async () => {
      mockSendMessage.mockResolvedValue({
        response: { text: () => '{"content":"response"}' },
      });

      const result = await service.askGeminiChat([], 'Hello');
      expect(result).toHaveProperty('content');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PromptsService } from './prompts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  aIPrompt: {
    findUnique: jest.fn(),
  },
};

describe('PromptsService', () => {
  let service: PromptsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromptsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PromptsService>(PromptsService);
  });

  describe('getRenderedPrompt', () => {
    it('renders a template by replacing all variables', async () => {
      mockPrisma.aIPrompt.findUnique.mockResolvedValue({
        name: 'danetki_generator',
        template: 'Topic: {{topic}}, Complexity: {{complexity}}',
      });

      const result = await service.getRenderedPrompt('danetki_generator', {
        topic: 'cats',
        complexity: 3,
      });

      expect(result).toBe('Topic: cats, Complexity: 3');
    });

    it('replaces multiple occurrences of the same variable', async () => {
      mockPrisma.aIPrompt.findUnique.mockResolvedValue({
        name: 'test',
        template: 'Hello {{name}}, welcome {{name}}!',
      });

      const result = await service.getRenderedPrompt('test', { name: 'Alice' });
      expect(result).toBe('Hello Alice, welcome Alice!');
    });

    it('throws NotFoundException when prompt template not found', async () => {
      mockPrisma.aIPrompt.findUnique.mockResolvedValue(null);

      await expect(
        service.getRenderedPrompt('missing_prompt', { topic: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns template unchanged when no variables provided', async () => {
      mockPrisma.aIPrompt.findUnique.mockResolvedValue({
        name: 'static',
        template: 'No variables here',
      });

      const result = await service.getRenderedPrompt('static', {});
      expect(result).toBe('No variables here');
    });
  });
});

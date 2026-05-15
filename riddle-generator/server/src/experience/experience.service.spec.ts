import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceService } from './experience.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

const mockPrisma = {
  $transaction: jest.fn(),
  user: { update: jest.fn() },
  solvedRiddle: { create: jest.fn() },
};

const mockNotifications = {
  notifyXpEarned: jest.fn().mockResolvedValue(undefined),
  notifyLevelUp: jest.fn().mockResolvedValue(undefined),
};

describe('ExperienceService', () => {
  let service: ExperienceService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperienceService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    service = module.get<ExperienceService>(ExperienceService);
  });

  describe('awardXpForSolving', () => {
    it('creates a solved riddle record and updates XP without leveling up', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          solvedRiddle: { create: jest.fn().mockResolvedValue({}) },
          user: {
            update: jest.fn().mockResolvedValue({ xp: 100, level: 1 }),
          },
        };
        return fn(tx);
      });

      await service.awardXpForSolving('user-1', 'A riddle about cats', 20);

      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(mockNotifications.notifyXpEarned).toHaveBeenCalledWith('user-1', 20);
      expect(mockNotifications.notifyLevelUp).not.toHaveBeenCalled();
    });

    it('sends level-up notification when XP crosses threshold', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          solvedRiddle: { create: jest.fn().mockResolvedValue({}) },
          user: {
            update: jest
              .fn()
              .mockResolvedValueOnce({ xp: 520, level: 1 })
              .mockResolvedValueOnce({ xp: 20, level: 2 }),
          },
        };
        return fn(tx);
      });

      await service.awardXpForSolving('user-1', 'content', 520);

      expect(mockNotifications.notifyLevelUp).toHaveBeenCalledWith('user-1', 2);
    });
  });

  describe('awardXpForActivity', () => {
    it('uses provided transaction client when given', async () => {
      const fakeTx = {
        user: { update: jest.fn().mockResolvedValue({ xp: 50, level: 1 }) },
      } as any;

      await service.awardXpForActivity('user-1', 'COMMENT_RECEIVED', 10, fakeTx);

      expect(fakeTx.user.update).toHaveBeenCalled();
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('runs its own transaction when no tx is provided', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          user: { update: jest.fn().mockResolvedValue({ xp: 50, level: 1 }) },
        };
        return fn(tx);
      });

      await service.awardXpForActivity('user-1', 'LIKE_RECEIVED', 5);

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('sends level-up notification without tx when level threshold crossed', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          user: {
            update: jest
              .fn()
              .mockResolvedValueOnce({ xp: 600, level: 1 })
              .mockResolvedValueOnce({ xp: 100, level: 2 }),
          },
        };
        return fn(tx);
      });

      await service.awardXpForActivity('user-1', 'LIKE_RECEIVED', 600);

      expect(mockNotifications.notifyLevelUp).toHaveBeenCalledWith('user-1', 2);
    });
  });
});

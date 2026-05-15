import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { PrismaService } from '../prisma/prisma.service';
import { ExperienceService } from '../experience/experience.service';
import { NotificationsService } from '../notifications/notifications.service';

const mockPrisma = {
  $transaction: jest.fn(),
  like: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
  riddles: { findUnique: jest.fn(), update: jest.fn() },
  user: { findUnique: jest.fn() },
};

const mockExperience = {
  awardXpForActivity: jest.fn().mockResolvedValue(undefined),
};

const mockNotifications = {
  notifyNewLike: jest.fn().mockResolvedValue(undefined),
};

describe('LikesService', () => {
  let service: LikesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ExperienceService, useValue: mockExperience },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
  });

  describe('toggleLike', () => {
    it('removes an existing like and returns liked: false', async () => {
      mockPrisma.like.findUnique.mockResolvedValue({ id: 'l1' });
      mockPrisma.$transaction.mockResolvedValue([{}, {}]);

      const result = await service.toggleLike('u1', 'r1');
      expect(result).toEqual({ liked: false });
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('creates a new like, awards XP, sends notification, returns liked: true', async () => {
      mockPrisma.like.findUnique.mockResolvedValue(null);
      mockPrisma.riddles.findUnique.mockResolvedValue({ author_id: 'author-1', content: 'Test' });
      mockPrisma.$transaction.mockResolvedValue([{}, {}]);
      mockPrisma.user.findUnique.mockResolvedValue({ name: 'Alice' });

      const result = await service.toggleLike('liker', 'r1');
      expect(result).toEqual({ liked: true });
      expect(mockExperience.awardXpForActivity).toHaveBeenCalledWith('author-1', 'LIKE_RECEIVED', 5);
      expect(mockNotifications.notifyNewLike).toHaveBeenCalled();
    });

    it('does NOT award XP when user likes their own riddle', async () => {
      mockPrisma.like.findUnique.mockResolvedValue(null);
      mockPrisma.riddles.findUnique.mockResolvedValue({ author_id: 'u1', content: 'Own' });
      mockPrisma.$transaction.mockResolvedValue([{}, {}]);

      const result = await service.toggleLike('u1', 'r1');
      expect(result).toEqual({ liked: true });
      expect(mockExperience.awardXpForActivity).not.toHaveBeenCalled();
    });
  });
});

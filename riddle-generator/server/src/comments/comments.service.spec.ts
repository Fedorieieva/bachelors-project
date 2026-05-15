import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { ExperienceService } from '../experience/experience.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockPrisma = {
  $transaction: jest.fn(),
  comment: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  riddles: { findUnique: jest.fn(), update: jest.fn() },
  user: { findUnique: jest.fn() },
};

const mockExperience = {
  awardXpForActivity: jest.fn().mockResolvedValue(undefined),
};

const mockNotifications = {
  notifyNewComment: jest.fn().mockResolvedValue(undefined),
};

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ExperienceService, useValue: mockExperience },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  describe('create', () => {
    it('creates comment, awards XP to author, and fires notification for different user', async () => {
      const newComment = { id: 'c1', content: 'Nice!', user_id: 'commenter', riddle_id: 'r1' };
      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          comment: { create: jest.fn().mockResolvedValue(newComment) },
          riddles: { update: jest.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });
      mockPrisma.riddles.findUnique.mockResolvedValue({ author_id: 'author-1' });
      mockPrisma.user.findUnique.mockResolvedValue({ name: 'Bob' });

      const result = await service.create('commenter', 'r1', 'Nice!');
      expect(result).toEqual(newComment);
      expect(mockExperience.awardXpForActivity).toHaveBeenCalledWith('author-1', 'COMMENT_RECEIVED', 10);
    });

    it('does NOT award XP when commenter is the riddle author', async () => {
      const newComment = { id: 'c1', content: 'Self', user_id: 'author-1', riddle_id: 'r1' };
      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          comment: { create: jest.fn().mockResolvedValue(newComment) },
          riddles: { update: jest.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });
      mockPrisma.riddles.findUnique.mockResolvedValue({ author_id: 'author-1' });

      await service.create('author-1', 'r1', 'Self');
      expect(mockExperience.awardXpForActivity).not.toHaveBeenCalled();
    });
  });

  describe('findPaginated', () => {
    it('returns paginated comments with meta', async () => {
      const comments = [{ id: 'c1' }, { id: 'c2' }];
      mockPrisma.comment.findMany.mockResolvedValue(comments);
      mockPrisma.comment.count.mockResolvedValue(5);

      const result = await service.findPaginated('r1', 1, 2);
      expect(result.data).toEqual(comments);
      expect(result.meta.totalItems).toBe(5);
      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.currentPage).toBe(1);
    });
  });

  describe('update', () => {
    it('updates comment content when user is owner', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({ id: 'c1', user_id: 'u1' });
      mockPrisma.comment.update.mockResolvedValue({ id: 'c1', content: 'Updated' });

      const result = await service.update('c1', 'u1', 'Updated');
      expect(result).toEqual({ id: 'c1', content: 'Updated' });
    });

    it('throws NotFoundException when comment not found', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(null);
      await expect(service.update('missing', 'u1', 'x')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when user is not the owner', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({ id: 'c1', user_id: 'other' });
      await expect(service.update('c1', 'u1', 'x')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('deletes comment and decrements comment count', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({ id: 'c1', user_id: 'u1', riddle_id: 'r1' });
      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          comment: { delete: jest.fn().mockResolvedValue({ id: 'c1' }) },
          riddles: { update: jest.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });

      await service.remove('c1', 'u1');
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('throws NotFoundException when comment not found', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing', 'u1')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when user is not the owner', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({ id: 'c1', user_id: 'other', riddle_id: 'r1' });
      await expect(service.remove('c1', 'u1')).rejects.toThrow(ForbiddenException);
    });
  });
});

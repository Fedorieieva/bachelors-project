import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationType } from '@prisma/client';

const mockPrisma = {
  notification: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
  },
};

const mockGateway = {
  sendToUser: jest.fn(),
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('createNotification', () => {
    it('creates a notification and sends it via gateway', async () => {
      const notif = { id: 'n1', userId: 'u1', type: NotificationType.LIKE, content: 'liked' };
      mockPrisma.notification.create.mockResolvedValue(notif);

      const result = await service.createNotification({
        userId: 'u1',
        type: NotificationType.LIKE,
        actorId: 'a1',
        content: 'liked',
      });

      expect(mockPrisma.notification.create).toHaveBeenCalled();
      expect(mockGateway.sendToUser).toHaveBeenCalledWith('u1', 'notification', notif);
      expect(result).toBe(notif);
    });
  });

  describe('getNotifications', () => {
    it('returns notifications for a user', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([{ id: 'n1' }]);
      const result = await service.getNotifications('u1');
      expect(result).toEqual([{ id: 'n1' }]);
      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'u1' } }),
      );
    });

    it('uses custom limit', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([]);
      await service.getNotifications('u1', 5);
      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 }),
      );
    });
  });

  describe('getUnreadCount', () => {
    it('returns count of unread notifications', async () => {
      mockPrisma.notification.count.mockResolvedValue(3);
      const result = await service.getUnreadCount('u1');
      expect(result).toEqual({ count: 3 });
    });
  });

  describe('markAsRead', () => {
    it('marks a specific notification as read', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 1 });
      await service.markAsRead('n1', 'u1');
      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'n1', userId: 'u1' } }),
      );
    });
  });

  describe('markAllAsRead', () => {
    it('marks all notifications as read for a user', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 5 });
      await service.markAllAsRead('u1');
      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'u1', isRead: false } }),
      );
    });
  });

  describe('clearAll', () => {
    it('deletes all notifications for a user', async () => {
      mockPrisma.notification.deleteMany.mockResolvedValue({ count: 2 });
      await service.clearAll('u1');
      expect(mockPrisma.notification.deleteMany).toHaveBeenCalledWith({ where: { userId: 'u1' } });
    });
  });

  describe('notifyNewComment', () => {
    it('creates a COMMENT notification when author differs from actor', async () => {
      mockPrisma.notification.create.mockResolvedValue({});
      await service.notifyNewComment('author-1', 'actor-2', 'Alice', 'riddle-1');
      expect(mockPrisma.notification.create).toHaveBeenCalled();
    });

    it('does NOT notify when author and actor are the same', async () => {
      await service.notifyNewComment('same', 'same', 'Alice', 'riddle-1');
      expect(mockPrisma.notification.create).not.toHaveBeenCalled();
    });
  });

  describe('notifyNewLike', () => {
    it('creates a LIKE notification when author differs from actor', async () => {
      mockPrisma.notification.create.mockResolvedValue({});
      await service.notifyNewLike('author-1', 'actor-2', 'Bob', 'riddle-1');
      expect(mockPrisma.notification.create).toHaveBeenCalled();
    });

    it('does NOT notify when author and actor are the same', async () => {
      await service.notifyNewLike('same', 'same', 'Bob', 'riddle-1');
      expect(mockPrisma.notification.create).not.toHaveBeenCalled();
    });
  });

  describe('notifyFollow', () => {
    it('creates a FOLLOW notification', async () => {
      mockPrisma.notification.create.mockResolvedValue({});
      await service.notifyFollow('target-1', 'actor-2', 'Carol');
      expect(mockPrisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ type: NotificationType.FOLLOW }),
        }),
      );
    });
  });

  describe('notifyLevelUp', () => {
    it('creates a LEVEL_UP notification', async () => {
      mockPrisma.notification.create.mockResolvedValue({});
      await service.notifyLevelUp('u1', 5);
      expect(mockPrisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ type: NotificationType.LEVEL_UP }),
        }),
      );
    });
  });

  describe('cleanupOldNotifications', () => {
    it('deletes notifications older than 7 days', async () => {
      mockPrisma.notification.deleteMany.mockResolvedValue({ count: 10 });
      await service.cleanupOldNotifications();
      expect(mockPrisma.notification.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ createdAt: expect.anything() }) }),
      );
    });
  });
});

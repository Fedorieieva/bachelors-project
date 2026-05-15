import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  follow: {
    create: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

const mockNotifications = {
  notifyProfileDeleted: jest.fn().mockResolvedValue(undefined),
  notifyFollow: jest.fn().mockResolvedValue(undefined),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('findOne', () => {
    it('returns user when found', async () => {
      const user = { id: 'u1', name: 'Alice' };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      await expect(service.findOne('u1')).resolves.toEqual(user);
    });

    it('throws NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('returns user by email', async () => {
      const user = { id: 'u1', email: 'a@b.com' };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      await expect(service.findByEmail('a@b.com')).resolves.toEqual(user);
    });

    it('returns null when email not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findByEmail('none@b.com')).resolves.toBeNull();
    });
  });

  describe('createUserOnly', () => {
    it('creates and returns a user', async () => {
      const dto = { email: 'a@b.com', name: 'A', is_guest: false, onboarding_completed: true, password: 'x' };
      const created = { id: 'u1', ...dto };
      mockPrisma.user.create.mockResolvedValue(created);
      await expect(service.createUserOnly(dto)).resolves.toEqual(created);
    });
  });

  describe('update', () => {
    it('updates and returns user', async () => {
      const updated = { id: 'u1', name: 'Bob' };
      mockPrisma.user.update.mockResolvedValue(updated);
      await expect(service.update('u1', { email: 'a@b.com', name: 'Bob' })).resolves.toEqual(updated);
    });

    it('throws NotFoundException on Prisma P2025', async () => {
      mockPrisma.user.update.mockRejectedValue({ code: 'P2025' });
      await expect(service.update('missing', { email: 'a@b.com' })).rejects.toThrow(NotFoundException);
    });

    it('rethrows unknown errors', async () => {
      const error = new Error('DB down');
      mockPrisma.user.update.mockRejectedValue(error);
      await expect(service.update('u1', { email: 'a@b.com' })).rejects.toThrow('DB down');
    });
  });

  describe('remove', () => {
    it('notifies followers before deleting the user', async () => {
      const user = { name: 'Alice', followers: [{ follower_id: 'f1' }, { follower_id: 'f2' }] };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockPrisma.user.delete.mockResolvedValue({ id: 'u1' });

      await service.remove('u1');

      expect(mockNotifications.notifyProfileDeleted).toHaveBeenCalledTimes(2);
      expect(mockPrisma.user.delete).toHaveBeenCalled();
    });

    it('throws NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('follow', () => {
    it('follows another user and fires notification', async () => {
      const record = { id: 'f1', follower_id: 'u1', following_id: 'u2' };
      mockPrisma.follow.create.mockResolvedValue(record);
      mockPrisma.user.findUnique.mockResolvedValue({ name: 'Alice' });

      const result = await service.follow('u1', 'u2');
      expect(result).toEqual(record);
      expect(mockNotifications.notifyFollow).toHaveBeenCalled();
    });

    it('throws BadRequestException when following self', async () => {
      await expect(service.follow('u1', 'u1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('unfollow', () => {
    it('deletes the follow record', async () => {
      mockPrisma.follow.delete.mockResolvedValue({});
      await expect(service.unfollow('u1', 'u2')).resolves.toBeUndefined();
    });

    it('throws NotFoundException on delete failure', async () => {
      mockPrisma.follow.delete.mockRejectedValue(new Error('not found'));
      await expect(service.unfollow('u1', 'u2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFollowers / getFollowing', () => {
    it('returns followers list', async () => {
      mockPrisma.follow.findMany.mockResolvedValue([{ follower: { id: 'f1' } }]);
      const result = await service.getFollowers('u1');
      expect(result).toEqual([{ id: 'f1' }]);
    });

    it('returns following list', async () => {
      mockPrisma.follow.findMany.mockResolvedValue([{ following: { id: 'f2' } }]);
      const result = await service.getFollowing('u1');
      expect(result).toEqual([{ id: 'f2' }]);
    });
  });

  describe('changePassword', () => {
    it('throws BadRequestException for guest users', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', is_guest: true, password: null });
      await expect(service.changePassword('u1', 'old', 'new')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when current password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', is_guest: false, password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.changePassword('u1', 'wrong', 'new')).rejects.toThrow(BadRequestException);
    });

    it('updates password when current password is correct', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', is_guest: false, password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashed');
      mockPrisma.user.update.mockResolvedValue({});

      await service.changePassword('u1', 'correct', 'newpass');
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { password: 'newHashed' } }),
      );
    });
  });

  describe('isFollowing', () => {
    it('returns true when follow record exists', async () => {
      mockPrisma.follow.findUnique.mockResolvedValue({ id: 'r1' });
      await expect(service.isFollowing('u1', 'u2')).resolves.toBe(true);
    });

    it('returns false when follow record does not exist', async () => {
      mockPrisma.follow.findUnique.mockResolvedValue(null);
      await expect(service.isFollowing('u1', 'u2')).resolves.toBe(false);
    });
  });

  describe('getUserStats', () => {
    it('returns user stats', async () => {
      const user = {
        name: 'Alice',
        avatar_url: null,
        xp: 100,
        level: 2,
        riddles_solved: 5,
        rating: 4.5,
        _count: { riddles: 3, followers: 10, following: 7, likes: 20 },
      };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      const result = await service.getUserStats('u1');
      expect(result.profile.name).toBe('Alice');
      expect(result.social.followersCount).toBe(10);
    });

    it('throws NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getUserStats('missing')).rejects.toThrow(NotFoundException);
    });
  });
});

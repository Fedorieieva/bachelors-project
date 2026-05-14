import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User, Follow } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { UserStatsResponseDto } from './dto/user-stats.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUserOnly(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: createUserDto });
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw e;
    }
  }

  async remove(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { name: true, followers: { select: { follower_id: true } } },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const notifyJobs = user.followers.map(({ follower_id }) =>
      this.notificationsService.notifyProfileDeleted(follower_id, user.name || 'Someone'),
    );
    await Promise.allSettled(notifyJobs);

    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw e;
    }
  }

  async follow(followerId: string, followingId: string): Promise<Follow> {
    if (followerId === followingId) {
      throw new BadRequestException('Ви не можете підписатися на самого себе');
    }

    const [record, actor] = await Promise.all([
      this.prisma.follow.create({
        data: { follower_id: followerId, following_id: followingId },
      }),
      this.prisma.user.findUnique({ where: { id: followerId }, select: { name: true } }),
    ]);

    void this.notificationsService.notifyFollow(followingId, followerId, actor?.name || 'Someone');

    return record;
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    try {
      await this.prisma.follow.delete({
        where: {
          follower_id_following_id: {
            follower_id: followerId,
            following_id: followingId,
          },
        },
      });
    } catch (e) {
      this.logger.error('Unfollow failed', e);
      throw new NotFoundException('Підписку не знайдено');
    }
  }

  async getFollowers(userId: string): Promise<User[]> {
    const follows = await this.prisma.follow.findMany({
      where: { following_id: userId },
      include: { follower: true },
    });
    return follows.map(f => f.follower);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const follows = await this.prisma.follow.findMany({
      where: { follower_id: userId },
      include: { following: true },
    });
    return follows.map(f => f.following);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findOne(userId);

    if (user.is_guest || !user.password) {
      throw new BadRequestException('Guest users cannot change passwords');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const record = await this.prisma.follow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: followerId,
          following_id: followingId,
        },
      },
    });
    return !!record;
  }

  async getUserStats(userId: string): Promise<UserStatsResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        avatar_url: true,
        xp: true,
        level: true,
        riddles_solved: true,
        rating: true,
        _count: {
          select: {
            riddles: true,
            followers: true,
            following: true,
            likes: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      profile: {
        name: user.name,
        avatar_url: user.avatar_url,
        level: user.level,
        xp: user.xp,
      },
      activity: {
        solvedRiddles: user.riddles_solved,
        createdRiddles: user._count.riddles,
        totalLikes: user._count.likes,
      },
      social: {
        followersCount: user._count.followers,
        followingCount: user._count.following,
      },
      reputation: user.rating,
    };
  }
}

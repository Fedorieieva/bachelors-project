import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicFeed(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: { is_public: true },
        include: {
          author: {
            select: { id: true, name: true, is_guest: true },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.riddles.count({
        where: { is_public: true },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSavedFeed(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.savedRiddles.findMany({
        where: { user_id: userId },
        include: {
          riddle: {
            include: {
              author: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.savedRiddles.count({ where: { user_id: userId } }),
    ]);

    return {
      items: items.map(i => i.riddle),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserFeed(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: { author_id: userId },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.riddles.count({ where: { author_id: userId } }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFollowingFeed(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const following = await this.prisma.follow.findMany({
      where: { follower_id: userId },
      select: { following_id: true },
    });

    const followingIds = following.map(f => f.following_id);

    if (followingIds.length === 0) {
      return {
        items: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: {
          author_id: { in: followingIds },
          is_public: true,
        },
        include: {
          author: {
            select: { id: true, name: true, is_guest: true },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.riddles.count({
        where: {
          author_id: { in: followingIds },
          is_public: true,
        },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

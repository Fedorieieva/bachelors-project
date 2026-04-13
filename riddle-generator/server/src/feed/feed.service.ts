import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeedResponseDto, FeedRiddleItem } from './feed.dto';
import { Prisma } from '@prisma/client';

type RiddleWithFullRelations = Prisma.RiddlesGetPayload<{
  include: {
    author: { select: { id: true; name: true; level: true; avatar_url: true } };
    RiddleAttempt: true;
    likes: true;
    saved_by: true;
  };
}>;

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  private getFeedInclude(userId?: string) {
    return {
      author: {
        select: { id: true, name: true, level: true, avatar_url: true },
      },
      RiddleAttempt: userId ? { where: { user_id: userId } } : true,
      likes: userId ? { where: { user_id: userId } } : true,
      saved_by: userId ? { where: { user_id: userId } } : true,
    } satisfies Prisma.RiddlesInclude;
  }

  private formatRiddleItem(
    riddle: RiddleWithFullRelations,
    userId?: string,
  ): FeedRiddleItem {
    const attempt = riddle.RiddleAttempt.find((a) => a.user_id === userId);
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const isSolved = attempt?.attempts === -1;
    const isCurrentlyBlocked = !isSolved && !!(attempt?.is_blocked && attempt.last_try > oneHourAgo);

    return {
      id: riddle.id,
      content: riddle.content,
      is_public: riddle.is_public,
      created_at: riddle.created_at,
      complexity: riddle.complexity,
      type: riddle.type,
      author: {
        id: riddle.author.id,
        name: riddle.author.name,
        level: riddle.author.level || 1,
        avatar_url: riddle.author.avatar_url || null,
      },
      is_solved: isSolved,
      can_attempt: !isSolved && !isCurrentlyBlocked,
      remaining_attempts: isSolved ? 0 : Math.max(0, 3 - (attempt?.attempts || 0)),
      needs_unlock: isCurrentlyBlocked,
      answer: isSolved ? riddle.answer : null,

      is_liked: userId ? riddle.likes.length > 0 : false,
      is_saved: userId ? riddle.saved_by.length > 0 : false,
      likes_count: riddle.likes_count,
      comments_count: riddle.comments_count,
    };
  }

  async getPublicFeed(userId: string | undefined, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: { is_public: true },
        include: this.getFeedInclude(userId),
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.riddles.count({ where: { is_public: true } }),
    ]);

    return {
      items: items.map((item) => this.formatRiddleItem(item, userId)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getMyPublicFeed(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: { author_id: userId, is_public: true },
        include: this.getFeedInclude(userId),
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.riddles.count({ where: { author_id: userId, is_public: true } }),
    ]);

    return {
      items: items.map((item) => this.formatRiddleItem(item, userId)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getMyPrivateFeed(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: { author_id: userId, is_public: false },
        include: this.getFeedInclude(userId),
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.riddles.count({ where: { author_id: userId, is_public: false } }),
    ]);

    return {
      items: items.map((item) => this.formatRiddleItem(item, userId)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSavedOtherFeed(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [savedRecords, total] = await Promise.all([
      this.prisma.savedRiddles.findMany({
        where: {
          user_id: userId,
          riddle: { author_id: { not: userId } }
        },
        include: {
          riddle: { include: this.getFeedInclude(userId) },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.savedRiddles.count({
        where: { user_id: userId, riddle: { author_id: { not: userId } } }
      }),
    ]);

    return {
      items: savedRecords.map((record) => this.formatRiddleItem(record.riddle, userId)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getFollowingFeed(
    userId: string,
    page: number,
    limit: number,
  ): Promise<FeedResponseDto<FeedRiddleItem>> {
    const skip = (page - 1) * limit;

    const following = await this.prisma.follow.findMany({
      where: { follower_id: userId },
      select: { following_id: true },
    });

    const followingIds = following.map((f) => f.following_id);

    if (followingIds.length === 0) {
      return { items: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }

    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: { author_id: { in: followingIds }, is_public: true },
        include: this.getFeedInclude(userId),
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.riddles.count({
        where: { author_id: { in: followingIds }, is_public: true },
      }),
    ]);

    return {
      items: items.map((item) =>
        this.formatRiddleItem(item as RiddleWithFullRelations, userId),
      ),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}

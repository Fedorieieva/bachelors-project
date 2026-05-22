import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak_count: number;
}

export interface LeaderboardPage {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
}

const USER_SELECT = {
  id: true,
  name: true,
  avatar_url: true,
  xp: true,
  level: true,
  streak_count: true,
} as const;

interface CacheEntry {
  payload: LeaderboardPage;
  expiresAt: number;
}

@Injectable()
export class LeaderboardService {
  private readonly CACHE_TTL_MS = 5 * 60 * 1000;
  private readonly cache = new Map<string, CacheEntry>();

  constructor(private readonly prisma: PrismaService) {}

  async getGlobalLeaderboard(page: number, limit: number): Promise<LeaderboardPage> {
    const key = `global:${page}:${limit}`;
    const cached = this.getCached(key);
    if (cached) return cached;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { is_guest: false },
        orderBy: { xp: 'desc' },
        skip,
        take: limit,
        select: USER_SELECT,
      }),
      this.prisma.user.count({ where: { is_guest: false } }),
    ]);

    const result: LeaderboardPage = {
      data: users.map((u, i) => ({ rank: skip + i + 1, ...u })),
      total,
      page,
      limit,
    };

    this.setCached(key, result);
    return result;
  }

  async getWeeklyLeaderboard(page: number, limit: number): Promise<LeaderboardPage> {
    const key = `weekly:${page}:${limit}`;
    const cached = this.getCached(key);
    if (cached) return cached;

    const skip = (page - 1) * limit;
    const weekStart = this.getStartOfWeek();

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { is_guest: false, last_active_at: { gte: weekStart } },
        orderBy: { xp: 'desc' },
        skip,
        take: limit,
        select: USER_SELECT,
      }),
      this.prisma.user.count({
        where: { is_guest: false, last_active_at: { gte: weekStart } },
      }),
    ]);

    const result: LeaderboardPage = {
      data: users.map((u, i) => ({ rank: skip + i + 1, ...u })),
      total,
      page,
      limit,
    };

    this.setCached(key, result);
    return result;
  }

  async getUserRank(userId: string, period: 'all' | 'weekly' = 'all'): Promise<{ rank: number }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    });

    if (!user) return { rank: 0 };

    const where =
      period === 'weekly'
        ? { is_guest: false, last_active_at: { gte: this.getStartOfWeek() }, xp: { gt: user.xp } }
        : { is_guest: false, xp: { gt: user.xp } };

    const count = await this.prisma.user.count({ where });
    return { rank: count + 1 };
  }

  private getCached(key: string): LeaderboardPage | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.payload;
  }

  private setCached(key: string, payload: LeaderboardPage): void {
    this.cache.set(key, { payload, expiresAt: Date.now() + this.CACHE_TTL_MS });
  }

  private getStartOfWeek(): Date {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }
}

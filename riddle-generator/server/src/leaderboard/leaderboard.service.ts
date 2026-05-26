import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PvpStatus } from '@prisma/client';

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak_count: number;
  riddles_solved: number;
  pvp_won_count: number;
  weekly_quests_count: number;
}

export interface LeaderboardPage {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
}

interface UserRow {
  id: string;
  name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak_count: number;
  riddles_solved: number;
  _count: { pvp_won: number; user_quests: number };
}

interface CacheEntry {
  payload: LeaderboardPage;
  expiresAt: number;
}

const USER_SELECT = {
  id: true,
  name: true,
  avatar_url: true,
  xp: true,
  level: true,
  streak_count: true,
  riddles_solved: true,
  _count: {
    select: {
      pvp_won: { where: { status: PvpStatus.FINISHED } },
      user_quests: { where: { is_completed: true } },
    },
  },
};

function toEntry(u: UserRow, rank: number): LeaderboardEntry {
  return {
    rank,
    id: u.id,
    name: u.name,
    avatar_url: u.avatar_url,
    xp: u.xp,
    level: u.level,
    streak_count: u.streak_count,
    riddles_solved: u.riddles_solved,
    pvp_won_count: u._count.pvp_won,
    weekly_quests_count: u._count.user_quests,
  };
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
    const [rawUsers, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { is_guest: false },
        orderBy: [{ level: 'desc' }, { xp: 'desc' }],
        skip,
        take: limit,
        select: USER_SELECT,
      }),
      this.prisma.user.count({ where: { is_guest: false } }),
    ]);

    const users = rawUsers as unknown as UserRow[];
    const result: LeaderboardPage = {
      data: users.map((u, i) => toEntry(u, skip + i + 1)),
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

    const [rawUsers, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { is_guest: false, last_active_at: { gte: weekStart } },
        orderBy: [{ level: 'desc' }, { xp: 'desc' }],
        skip,
        take: limit,
        select: USER_SELECT,
      }),
      this.prisma.user.count({
        where: { is_guest: false, last_active_at: { gte: weekStart } },
      }),
    ]);

    const users = rawUsers as unknown as UserRow[];
    const result: LeaderboardPage = {
      data: users.map((u, i) => toEntry(u, skip + i + 1)),
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
      select: { xp: true, level: true },
    });

    if (!user) return { rank: 0 };

    const baseWhere =
      period === 'weekly'
        ? { is_guest: false, last_active_at: { gte: this.getStartOfWeek() } }
        : { is_guest: false };

    const count = await this.prisma.user.count({
      where: {
        ...baseWhere,
        OR: [
          { level: { gt: user.level } },
          { level: user.level, xp: { gt: user.xp } },
        ],
      },
    });

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

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

export interface StreakUpdateResult {
  streak_count: number;
  xp_multiplier: number;
  last_active_at: Date | null;
  streakIncremented: boolean;
}

@Injectable()
export class StreakService {
  private readonly logger = new Logger(StreakService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async updateStreak(userId: string): Promise<StreakUpdateResult> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { streak_count: true, last_active_at: true, xp_multiplier: true },
    });

    if (!user) {
      return { streak_count: 0, xp_multiplier: 1.0, last_active_at: null, streakIncremented: false };
    }

    const now = new Date();
    const todayStr = this.toDateStr(now);
    const lastStr = user.last_active_at ? this.toDateStr(user.last_active_at) : null;

    if (lastStr === todayStr) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { last_active_at: now },
      });
      return {
        streak_count: user.streak_count,
        xp_multiplier: user.xp_multiplier,
        last_active_at: now,
        streakIncremented: false,
      };
    }

    const yesterday = new Date(now);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = this.toDateStr(yesterday);

    const newStreak = lastStr === yesterdayStr ? user.streak_count + 1 : 1;
    const newMultiplier = this.computeMultiplier(newStreak);
    const prevTierLevel = this.getTierLevel(user.xp_multiplier);
    const newTierLevel = this.getTierLevel(newMultiplier);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { streak_count: newStreak, last_active_at: now, xp_multiplier: newMultiplier },
      select: { streak_count: true, xp_multiplier: true, last_active_at: true },
    });

    this.logger.log(`[Streak] User ${userId}: ${user.streak_count} → ${newStreak} days (${newMultiplier}x)`);

    if (newTierLevel > prevTierLevel) {
      void this.notificationsService.createNotification({
        userId,
        type: NotificationType.STREAK_INCREMENTED,
        content: `🔥 ${newStreak}-day streak! Your XP multiplier is now ${newMultiplier}x`,
        metadata: { streak_count: newStreak, xp_multiplier: newMultiplier },
      });
    }

    return { ...updated, streakIncremented: true };
  }

  async getStreak(userId: string): Promise<{ streak_count: number; xp_multiplier: number; last_active_at: Date | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { streak_count: true, xp_multiplier: true, last_active_at: true },
    });
    return user ?? { streak_count: 0, xp_multiplier: 1.0, last_active_at: null };
  }

  computeMultiplier(streakDays: number): number {
    if (streakDays >= 14) return 3.0;
    if (streakDays >= 7) return 2.0;
    if (streakDays >= 3) return 1.5;
    return 1.0;
  }

  private toDateStr(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private getTierLevel(multiplier: number): number {
    if (multiplier >= 3.0) return 3;
    if (multiplier >= 2.0) return 2;
    if (multiplier >= 1.5) return 1;
    return 0;
  }
}

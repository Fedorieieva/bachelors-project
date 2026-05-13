import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExperienceService {
  private readonly XP_PER_LEVEL = 500;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async awardXpForSolving(userId: string, content: string, amount: number) {
    let leveledUp = false;
    let newLevel = 0;

    await this.prisma.$transaction(async (tx) => {
      await tx.solvedRiddle.create({
        data: {
          user_id: userId,
          content_preview: content.substring(0, 100),
          xp_earned: amount,
        },
      });
      const result = await this.updateUserXp(tx, userId, amount, true);
      leveledUp = result.leveledUp;
      newLevel = result.newLevel;
    });

    void this.notificationsService.notifyXpEarned(userId, amount);
    if (leveledUp) {
      void this.notificationsService.notifyLevelUp(userId, newLevel);
    }
  }

  async awardXpForActivity(
    userId: string,
    activityType: string,
    amount: number,
    tx?: Prisma.TransactionClient,
  ) {
    if (tx) {
      return this.updateUserXp(tx, userId, amount, false);
    }

    let leveledUp = false;
    let newLevel = 0;

    await this.prisma.$transaction(async (innerTx) => {
      const result = await this.updateUserXp(innerTx, userId, amount, false);
      leveledUp = result.leveledUp;
      newLevel = result.newLevel;
    });

    if (leveledUp) {
      void this.notificationsService.notifyLevelUp(userId, newLevel);
    }
  }

  private async updateUserXp(
    tx: Prisma.TransactionClient,
    userId: string,
    amount: number,
    isSolved: boolean,
  ): Promise<{ leveledUp: boolean; newLevel: number }> {
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        xp: { increment: amount },
        ...(isSolved && { riddles_solved: { increment: 1 } }),
      },
    });

    if (user.xp >= this.XP_PER_LEVEL) {
      const levelsGained = Math.floor(user.xp / this.XP_PER_LEVEL);
      const remainingXp = user.xp % this.XP_PER_LEVEL;
      const newLevel = user.level + levelsGained;

      await tx.user.update({
        where: { id: userId },
        data: { level: { increment: levelsGained }, xp: remainingXp },
      });

      return { leveledUp: true, newLevel };
    }

    return { leveledUp: false, newLevel: user.level };
  }
}

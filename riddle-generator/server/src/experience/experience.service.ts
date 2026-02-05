import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async awardXpForSolving(userId: string, content: string, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      await tx.solvedRiddle.create({
        data: {
          user_id: userId,
          content_preview: content.substring(0, 100),
          xp_earned: amount,
        },
      });
      await this.updateUserXp(tx, userId, amount, true);
    });
  }

  async awardXpForActivity(
    userId: string,
    activityType: string,
    amount: number,
    tx?: Prisma.TransactionClient
  ) {
    const prismaClient = tx || this.prisma;
    return this.updateUserXp(prismaClient, userId, amount, false);
  }

  private async updateUserXp(
    tx: Prisma.TransactionClient,
    userId: string,
    amount: number,
    isSolved: boolean
  ) {
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        xp: { increment: amount },
        ...(isSolved && { riddles_solved: { increment: 1 } }),
      },
    });

    const calculatedLevel = Math.floor(user.xp / 500) + 1;

    if (calculatedLevel > user.level) {
      await tx.user.update({
        where: { id: userId },
        data: { level: calculatedLevel },
      });
    }
  }
}

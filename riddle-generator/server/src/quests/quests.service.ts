import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, QuestType } from '@prisma/client';

interface QuestTemplate {
  title: string;
  description: string;
  quest_type: QuestType;
  target_count: number;
  xp_reward: number;
}

export interface QuestProgressResult {
  completed: boolean;
  xp_reward: number;
  quest_title: string;
}

@Injectable()
export class QuestsService {
  private readonly logger = new Logger(QuestsService.name);

  private readonly QUEST_POOL: QuestTemplate[] = [
    {
      title: 'Riddle Solver',
      description: 'Solve 3 riddles today',
      quest_type: QuestType.SOLVE_RIDDLES,
      target_count: 3,
      xp_reward: 50,
    },
    {
      title: 'Brain Teaser',
      description: 'Solve 2 logic riddles',
      quest_type: QuestType.SOLVE_LOGIC,
      target_count: 2,
      xp_reward: 40,
    },
    {
      title: 'XP Collector',
      description: 'Earn 100 XP today',
      quest_type: QuestType.EARN_XP,
      target_count: 100,
      xp_reward: 30,
    },
    {
      title: 'Math Wizard',
      description: 'Solve 2 math riddles',
      quest_type: QuestType.SOLVE_MATH,
      target_count: 2,
      xp_reward: 40,
    },
    {
      title: 'Visual Explorer',
      description: 'Generate 1 image riddle today',
      quest_type: QuestType.GENERATE_IMAGE_RIDDLE,
      target_count: 1,
      xp_reward: 60,
    },
    {
      title: 'Streak Keeper',
      description: 'Stay active for 3 consecutive days',
      quest_type: QuestType.MAINTAIN_STREAK,
      target_count: 3,
      xp_reward: 70,
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getDailyQuests(userId: string) {
    const now = new Date();
    const activeQuests = await this.prisma.quest.findMany({
      where: { is_active: true, expires_at: { gt: now } },
      include: { user_quests: { where: { user_id: userId } } },
    });

    return activeQuests.map((quest) => {
      const userQuest = quest.user_quests[0] ?? null;
      return {
        id: quest.id,
        title: quest.title,
        description: quest.description,
        quest_type: quest.quest_type,
        target_count: quest.target_count,
        xp_reward: quest.xp_reward,
        expires_at: quest.expires_at,
        progress: userQuest?.progress ?? 0,
        is_completed: userQuest?.is_completed ?? false,
        completed_at: userQuest?.completed_at ?? null,
      };
    });
  }

  async incrementProgress(
    userId: string,
    questType: QuestType,
    amount: number = 1,
  ): Promise<QuestProgressResult[]> {
    const now = new Date();

    const activeQuests = await this.prisma.quest.findMany({
      where: {
        quest_type: questType,
        is_active: true,
        expires_at: { gt: now },
        user_quests: { none: { user_id: userId, is_completed: true } },
      },
    });

    const results: QuestProgressResult[] = [];

    for (const quest of activeQuests) {
      const txResult = await this.prisma.$transaction(async (tx) => {
        // Atomically upsert with increment — no separate read before write
        const updated = await tx.userQuest.upsert({
          where: { user_id_quest_id: { user_id: userId, quest_id: quest.id } },
          create: {
            user_id: userId,
            quest_id: quest.id,
            progress: Math.min(amount, quest.target_count),
          },
          update: { progress: { increment: amount } },
        });

        // Race-safe completion: conditional update that only wins once
        if (updated.progress >= quest.target_count && !updated.is_completed) {
          const marked = await tx.userQuest.updateMany({
            where: { id: updated.id, is_completed: false },
            data: { is_completed: true, completed_at: new Date(), progress: quest.target_count },
          });

          if (marked.count > 0) {
            return { completed: true, xp_reward: quest.xp_reward, quest_title: quest.title };
          }
        }

        return { completed: false, xp_reward: 0, quest_title: quest.title };
      });

      // Fire notification outside the transaction so DB commit isn't blocked
      if (txResult.completed) {
        void this.notificationsService.createNotification({
          userId,
          type: NotificationType.QUEST_COMPLETED,
          content: `Quest completed: "${txResult.quest_title}" (+${txResult.xp_reward} XP)`,
          metadata: { xp_reward: txResult.xp_reward, quest_title: txResult.quest_title },
        });
      }

      results.push(txResult);
    }

    return results;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async seedDailyQuests(): Promise<void> {
    this.logger.log('[Quests] Running midnight cron — garbage collection + seeding...');

    // Garbage collection: wipe uncompleted UserQuest rows for expired quests
    const expiredQuests = await this.prisma.quest.findMany({
      where: { expires_at: { lt: new Date() }, is_active: false },
      select: { id: true },
    });

    if (expiredQuests.length > 0) {
      const expiredIds = expiredQuests.map((q) => q.id);
      const { count } = await this.prisma.userQuest.deleteMany({
        where: { quest_id: { in: expiredIds }, is_completed: false },
      });
      this.logger.log(`[Quests] Garbage collected ${count} stale uncompleted UserQuest rows.`);
    }

    // Deactivate current active quests
    await this.prisma.quest.updateMany({
      where: { is_active: true },
      data: { is_active: false },
    });

    // Select pool based on day of week
    const dayOfWeek = new Date().getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const selected: QuestTemplate[] = isWeekend
      ? [this.QUEST_POOL[3], this.QUEST_POOL[4], this.QUEST_POOL[5]]
      : [this.QUEST_POOL[0], this.QUEST_POOL[1], this.QUEST_POOL[2]];

    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999);

    await this.prisma.quest.createMany({
      data: selected.map((tpl) => ({ ...tpl, expires_at: expiresAt, is_active: true })),
    });

    this.logger.log(`[Quests] ${selected.length} daily quests seeded for today.`);
  }
}

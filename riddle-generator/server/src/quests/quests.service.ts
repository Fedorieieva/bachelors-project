import { Injectable, Logger, OnModuleInit, ForbiddenException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, Prisma, QuestType } from '@prisma/client';

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
export class QuestsService implements OnModuleInit {
  private readonly logger = new Logger(QuestsService.name);

  private readonly KYIV_OFFSET_MS = 3 * 60 * 60 * 1000;

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

  async onModuleInit(): Promise<void> {
    const now = new Date();
    const activeCount = await this.prisma.quest.count({
      where: { is_active: true, expires_at: { gt: now } },
    });

    if (activeCount === 0) {
      this.logger.log('[Quests] No active quests found on startup — auto-seeding today\'s quests...');
      await this.seedDailyQuests();
    }
  }

  async hydrateDailyQuestsForUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { is_guest: true },
    });

    if (!user || user.is_guest) {
      return;
    }

    const now = new Date();

    await this.prisma.userQuest.deleteMany({
      where: {
        user_id: userId,
        quest: { expires_at: { lt: now } },
      },
    });

    const activeQuests = await this.prisma.quest.findMany({
      where: { is_active: true, expires_at: { gt: now } },
      select: { id: true },
    });

    if (activeQuests.length === 0) return;

    await this.prisma.$transaction(
      activeQuests.map((q) =>
        this.prisma.userQuest.upsert({
          where: {
            user_id_quest_id: {
              user_id: userId,
              quest_id: q.id,
            },
          },
          update: {},
          create: {
            user_id: userId,
            quest_id: q.id,
            progress: 0,
            is_completed: false,
          },
        }),
      ),
    );
  }

  async getDailyQuests(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { is_guest: true },
    });

    if (!user || user.is_guest) {
      throw new ForbiddenException('Guests are restricted from participating in daily quests modules.');
    }

    await this.hydrateDailyQuestsForUser(userId);

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

  async updateQuestProgress(
    userId: string,
    type: QuestType,
    amount: number = 1,
  ): Promise<QuestProgressResult[]> {
    const now = new Date();

    const activeQuests = await this.prisma.quest.findMany({
      where: {
        quest_type: type,
        is_active: true,
        expires_at: { gt: now },
        user_quests: { none: { user_id: userId, is_completed: true } },
      },
    });

    const results: QuestProgressResult[] = [];

    for (const quest of activeQuests) {
      const txResult = await this.prisma.$transaction(async (tx) => {
        const updated = await tx.userQuest.upsert({
          where: { user_id_quest_id: { user_id: userId, quest_id: quest.id } },
          create: {
            user_id: userId,
            quest_id: quest.id,
            progress: Math.min(amount, quest.target_count),
          },
          update: { progress: { increment: amount } },
        });

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

    await this.prisma.userQuest.deleteMany({});

    await this.prisma.quest.deleteMany({});

    const expiresAt = this.getKyivEndOfDay();
    const kyivNow = new Date(Date.now() + this.KYIV_OFFSET_MS);
    const isWeekend = kyivNow.getUTCDay() === 0 || kyivNow.getUTCDay() === 6;

    const selected: QuestTemplate[] = isWeekend
      ? [this.QUEST_POOL[3], this.QUEST_POOL[4], this.QUEST_POOL[5]]
      : [this.QUEST_POOL[0], this.QUEST_POOL[1], this.QUEST_POOL[2]];

    await this.prisma.quest.createMany({
      data: selected.map((tpl) => ({ ...tpl, expires_at: expiresAt, is_active: true })),
    });

    this.logger.log(`[Quests] ${selected.length} daily quests seeded. Expires at ${expiresAt.toISOString()} UTC (23:59:59 Kyiv).`);
  }

  private getKyivEndOfDay(): Date {
    const kyivNow = new Date(Date.now() + this.KYIV_OFFSET_MS);
    return new Date(
      Date.UTC(
        kyivNow.getUTCFullYear(),
        kyivNow.getUTCMonth(),
        kyivNow.getUTCDate(),
        23,
        59,
        59,
        999,
      ) - this.KYIV_OFFSET_MS,
    );
  }
}

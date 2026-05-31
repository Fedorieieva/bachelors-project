import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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

  // UTC+3 — Ukraine runs on permanent Eastern European Summer Time since 2022
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

  // ─── Startup seed guard ───────────────────────────────────────────────────────

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

  // ─── Lazy hydration ───────────────────────────────────────────────────────────

  /**
   * Ensures every non-guest user has a UserQuest stub for each active quest of
   * the current calendar day.
   *
   * Called exclusively from GET /quests/daily to prevent parallel-request
   * collision spikes from auth-layer or middleware-level triggers.
   *
   * A P2002 unique-constraint violation is caught and silenced: it means a
   * concurrent request already inserted the rows, so we just return cleanly.
   */
  async hydrateDailyQuestsForUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { is_guest: true },
    });

    if (!user || user.is_guest) return;

    const now = new Date();

    // Purge ALL expired quest records for this user before seeding fresh ones.
    // No filter on is_completed — completed history from previous days is wiped too.
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

    try {
      await this.prisma.userQuest.createMany({
        data: activeQuests.map((q) => ({
          user_id: userId,
          quest_id: q.id,
          progress: 0,
        })),
        skipDuplicates: true,
      });
    } catch (err) {
      // A parallel request already inserted these rows — this is a no-op outcome.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        this.logger.debug(
          `[Quests] P2002 on hydration for user ${userId} — rows already exist from concurrent request, skipping`,
        );
        return;
      }
      throw err;
    }
  }

  // ─── Public API ───────────────────────────────────────────────────────────────

  async getDailyQuests(userId: string) {
    // Hydrate first so progress rows exist before we read them.
    // Trigger is deliberately scoped here — not in auth guards or middleware.
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

  /**
   * Central progress-tracking hook for all gameplay events.
   * Atomically increments progress and flags completion when the target is met.
   * Callers: riddles.service, pvp.service, streak flows.
   */
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

  // ─── Midnight cron ────────────────────────────────────────────────────────────

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
        where: { quest_id: { in: expiredIds } },
      });
      this.logger.log(`[Quests] Garbage collected ${count} expired UserQuest rows (completed + uncompleted).`);
    }

    // Deactivate current active quests
    await this.prisma.quest.updateMany({
      where: { is_active: true },
      data: { is_active: false },
    });

    // Resolve Kyiv calendar day for day-of-week selection and expiry boundary
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

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  /**
   * Returns 23:59:59.999 of the current calendar day in Kyiv time (UTC+3),
   * expressed as a UTC Date. Avoids server-locale drift on cloud instances
   * whose TZ env is set to UTC or another region.
   */
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

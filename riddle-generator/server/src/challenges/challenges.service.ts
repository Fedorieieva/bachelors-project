import { Injectable, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ExperienceService } from '../experience/experience.service';
import { StreakService } from '../streaks/streak.service';
import { QuestsService } from '../quests/quests.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AiService } from '../riddles/ai/ai.service';
import { NotificationType, QuestType } from '@prisma/client';

const CHALLENGE_XP = 150;
// Fires every Monday at 00:00 UTC
const WEEKLY_ROTATION_CRON = '0 0 * * 1';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);
  private provisioning = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly experienceService: ExperienceService,
    private readonly streakService: StreakService,
    private readonly questsService: QuestsService,
    private readonly notificationsService: NotificationsService,
    private readonly aiService: AiService,
  ) {}

  // ─── Weekly rotation ─────────────────────────────────────────

  @Cron(WEEKLY_ROTATION_CRON)
  async rotateWeeklyChallenge(): Promise<void> {
    this.logger.log('[Challenges] Weekly rotation triggered');
    await this.prisma.communityChallenge.updateMany({
      where: { is_active: true },
      data: { is_active: false },
    });
    await this.provisionWeeklyChallenge();
  }

  private async provisionWeeklyChallenge(): Promise<void> {
    if (this.provisioning) return;
    this.provisioning = true;
    try {
      const count = await this.prisma.riddles.count({
        where: { complexity: 5, is_public: true, is_verified: true },
      });

      if (count === 0) {
        this.logger.warn('[Challenges] No complexity-5 verified riddles available — skipping provision');
        return;
      }

      // Deterministic week seed — number of complete weeks since UNIX epoch
      const weekSeed = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
      const riddle = await this.prisma.riddles.findFirst({
        where: { complexity: 5, is_public: true, is_verified: true },
        skip: weekSeed % count,
        orderBy: { id: 'asc' },
      });

      if (!riddle) return;

      // Expires next Monday 00:00 UTC
      const endsAt = new Date();
      endsAt.setUTCDate(endsAt.getUTCDate() + ((8 - endsAt.getUTCDay()) % 7 || 7));
      endsAt.setUTCHours(0, 0, 0, 0);

      await this.prisma.communityChallenge.create({
        data: {
          title: `Week ${weekSeed} Challenge`,
          description: 'Solve this week\'s hardest brain-teaser before time runs out!',
          riddle_content: riddle.content,
          riddle_answer: riddle.answer,
          riddle_type: riddle.type,
          riddle_complexity: riddle.complexity,
          xp_reward: CHALLENGE_XP,
          starts_at: new Date(),
          ends_at: endsAt,
          is_active: true,
        },
      });

      this.logger.log(`[Challenges] Provisioned week-${weekSeed} challenge from riddle ${riddle.id}`);
    } catch (err) {
      this.logger.error(`[Challenges] Provision failed: ${(err as Error).message}`);
    } finally {
      this.provisioning = false;
    }
  }

  // ─── Shared fetch helper ──────────────────────────────────────

  private async fetchActiveRow() {
    const now = new Date();
    return this.prisma.communityChallenge.findFirst({
      where: { is_active: true, starts_at: { lte: now }, ends_at: { gt: now } },
      select: {
        id: true,
        title: true,
        description: true,
        riddle_content: true,
        riddle_type: true,
        riddle_complexity: true,
        xp_reward: true,
        starts_at: true,
        ends_at: true,
        _count: { select: { solvers: true } },
        solvers: {
          orderBy: { solved_at: 'asc' },
          take: 10,
          select: {
            id: true,
            solved_at: true,
            user: { select: { id: true, name: true, avatar_url: true } },
          },
        },
      },
    });
  }

  // ─── Queries ──────────────────────────────────────────────────

  async getCurrentChallenge(userId: string) {
    let row = await this.fetchActiveRow();

    // Lazy-load fallback: provision on first call if no active challenge exists
    if (!row) {
      await this.provisionWeeklyChallenge();
      row = await this.fetchActiveRow();
    }

    if (!row) return null;

    // Targeted single-row check — does NOT load all solvers
    const userSolver = await this.prisma.challengeSolver.findUnique({
      where: { user_id_challenge_id: { user_id: userId, challenge_id: row.id } },
      select: { id: true },
    });

    const { solvers, _count, ...rest } = row;
    return {
      ...rest,
      solver_count: _count.solvers,
      already_solved: !!userSolver,
      top_solvers: solvers,
    };
  }

  async submitSolution(challengeId: string, userId: string, guess: string) {
    const challenge = await this.prisma.communityChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) throw new NotFoundException('Challenge not found');
    if (new Date() > challenge.ends_at) throw new ForbiddenException('Challenge has already ended');

    // AI contextual validation — handles synonyms, phrasing variations, multilingual answers
    const aiResult = await this.aiService.getContextualHint([], guess, challenge.riddle_answer);
    if (!aiResult.is_solved) return { correct: false };

    // Race-safe: atomic claim — double-check inside TX, DB unique constraint is the final backstop
    const solverCreated = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.challengeSolver.findUnique({
        where: { user_id_challenge_id: { user_id: userId, challenge_id: challengeId } },
      });
      if (existing) return false;
      await tx.challengeSolver.create({ data: { user_id: userId, challenge_id: challengeId } });
      return true;
    });

    if (!solverCreated) throw new ForbiddenException('You have already solved this challenge');

    const xpEarned = await this.experienceService.awardXpForSolving(
      userId,
      `Community Challenge: ${challenge.title}`,
      CHALLENGE_XP,
    );

    const { streakIncremented } = await this.streakService.updateStreak(userId);
    await this.questsService.incrementProgress(userId, QuestType.SOLVE_RIDDLES);
    await this.questsService.incrementProgress(userId, QuestType.EARN_XP, xpEarned);
    if (streakIncremented) {
      await this.questsService.incrementProgress(userId, QuestType.MAINTAIN_STREAK);
    }

    void this.notificationsService.createNotification({
      userId,
      type: NotificationType.COMMUNITY_CHALLENGE_COMPLETED,
      content: `You solved the weekly challenge "${challenge.title}"! +${xpEarned} XP`,
      metadata: { challengeId, xp: xpEarned },
    });

    this.logger.log(`[Challenge] User ${userId} solved challenge ${challengeId} (+${xpEarned} XP)`);
    return { correct: true, xpEarned };
  }

  async getSolvedChallenges(userId: string) {
    return this.prisma.challengeSolver.findMany({
      where: { user_id: userId },
      orderBy: { solved_at: 'desc' },
      include: {
        challenge: {
          select: { id: true, title: true, xp_reward: true, ends_at: true },
        },
      },
    });
  }

  // Full history with speedrunner rank — used by /challenges/history
  async getSolvedHistory(userId: string) {
    const solved = await this.prisma.challengeSolver.findMany({
      where: { user_id: userId },
      orderBy: { solved_at: 'desc' },
      include: {
        challenge: {
          select: { id: true, title: true, xp_reward: true, ends_at: true, riddle_type: true },
        },
      },
    });

    return Promise.all(
      solved.map(async (s) => {
        // Rank = how many users solved it strictly before this user + 1
        const rank =
          (await this.prisma.challengeSolver.count({
            where: { challenge_id: s.challenge_id, solved_at: { lt: s.solved_at } },
          })) + 1;

        return {
          id: s.id,
          solved_at: s.solved_at,
          rank,
          challenge: s.challenge,
        };
      }),
    );
  }
}

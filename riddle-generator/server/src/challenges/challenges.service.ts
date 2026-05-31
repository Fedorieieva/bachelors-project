import { Injectable, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ExperienceService } from '../experience/experience.service';
import { StreakService } from '../streaks/streak.service';
import { QuestsService } from '../quests/quests.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AiService } from '../riddles/ai/ai.service';
import { NotificationType, QuestType } from '@prisma/client';

// Fires every Monday at 00:00 UTC
const WEEKLY_ROTATION_CRON = '0 0 * * 1';
const CHALLENGE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const CHALLENGE_TYPES = ['LOGIC', 'MATH', 'DANETKI', 'CROSSWORD'] as const;

const AI_THEMES = [
  'Ancient Civilizations',
  'Space Exploration',
  'Human Biology',
  'World Literature',
  'Philosophy and Ethics',
  'Quantum Physics',
  'Marine Biology',
  'Cryptography',
  'World Mythology',
  'Artificial Intelligence',
];

type ChallengeContent = {
  title: string;
  description: string;
  riddle_content: string;
  riddle_answer: string;
  riddle_type: string;
};

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly experienceService: ExperienceService,
    private readonly streakService: StreakService,
    private readonly questsService: QuestsService,
    private readonly notificationsService: NotificationsService,
    private readonly aiService: AiService,
  ) {}

  // ─── Weekly cron rotation ─────────────────────────────────────────────────

  @Cron(WEEKLY_ROTATION_CRON)
  async rotateWeeklyChallenge(): Promise<void> {
    this.logger.log('[Challenges] Weekly cron rotation triggered');
    await this.generateAndRotate();
  }

  // ─── AI challenge content generation ─────────────────────────────────────

  private async generateAiChallengeContent(): Promise<ChallengeContent> {
    const type = CHALLENGE_TYPES[Math.floor(Math.random() * CHALLENGE_TYPES.length)];
    const theme = AI_THEMES[Math.floor(Math.random() * AI_THEMES.length)];

    if (type === 'CROSSWORD') {
      const layout = await this.aiService.generateCrossword(theme, [], 'english', 12, 5);
      return {
        title: `Weekly Crossword: ${theme}`,
        description: "Fill in this week's expert crossword puzzle before time runs out!",
        riddle_content: JSON.stringify(layout),
        riddle_answer: 'CROSSWORD_COMPLETE',
        riddle_type: 'CROSSWORD',
      };
    }

    const typeGuidance =
      type === 'MATH'
        ? 'Create an advanced mathematical or algebraic problem with a single definite numerical answer.'
        : type === 'LOGIC'
          ? 'Create a sophisticated deductive or lateral thinking puzzle requiring multi-step reasoning.'
          : 'Create a mystery yes/no deductive scenario (danetki) where the solver must uncover the hidden situation.';

    const prompt = `You are a premium puzzle designer crafting an expert-level weekly community challenge.

Type: ${type}
Theme: ${theme}
Complexity: 5/5 (hardest — must challenge an advanced solver)

${typeGuidance}

Return ONLY valid JSON (no markdown fences) with exactly these four fields:
{
  "title": "short catchy title, max 60 characters",
  "description": "engaging teaser for the challenge page, max 180 characters",
  "riddle_content": "the full riddle, problem, or puzzle statement",
  "riddle_answer": "exact correct answer, 1-5 words"
}`;

    const result = await this.aiService.askGemini<{
      title: string;
      description: string;
      riddle_content: string;
      riddle_answer: string;
    }>(prompt);

    return {
      title: result.title,
      description: result.description,
      riddle_content: result.riddle_content,
      riddle_answer: result.riddle_answer,
      riddle_type: type,
    };
  }

  // ─── Rotation engine ──────────────────────────────────────────────────────
  //
  // Serverless-safe: AI generation happens outside the transaction (avoids
  // long-held DB locks). The transaction then does a double-check so that if a
  // concurrent worker already rotated, this one exits cleanly without writing a
  // second row. Any write error is swallowed; the subsequent fetchActiveRow in
  // getCurrentChallenge will pick up the race-winner's row automatically.

  private async generateAndRotate(): Promise<void> {
    let content: ChallengeContent;
    try {
      content = await this.generateAiChallengeContent();
    } catch (err) {
      this.logger.error(
        `[Challenges] AI generation failed during rotation: ${(err as Error).message}`,
      );
      return;
    }

    const now = new Date();
    const endsAt = new Date(now.getTime() + CHALLENGE_DURATION_MS);

    try {
      await this.prisma.$transaction(async (tx) => {
        // Race guard: abort if another worker already provisioned a fresh challenge
        const alreadyActive = await tx.communityChallenge.findFirst({
          where: { is_active: true, ends_at: { gt: now } },
          select: { id: true },
        });
        if (alreadyActive) {
          this.logger.debug(
            '[Challenges] Rotation skipped — concurrent worker already provisioned a challenge',
          );
          return;
        }

        // Atomically deactivate all stale active rows before creating the new one
        await tx.communityChallenge.updateMany({
          where: { is_active: true },
          data: { is_active: false },
        });

        await tx.communityChallenge.create({
          data: {
            title: content.title,
            description: content.description,
            riddle_content: content.riddle_content,
            riddle_answer: content.riddle_answer,
            riddle_type: content.riddle_type,
            riddle_complexity: 5,
            xp_reward: 500,
            starts_at: now,
            ends_at: endsAt,
            is_active: true,
          },
        });

        this.logger.log(
          `[Challenges] Provisioned AI-generated ${content.riddle_type} challenge: "${content.title}"`,
        );
      });
    } catch (err) {
      // Swallowed: the post-rotation fetchActiveRow in getCurrentChallenge will
      // find any race-created row, so the caller degrades gracefully to null.
      this.logger.error(
        `[Challenges] Rotation transaction failed: ${(err as Error).message}`,
      );
    }
  }

  // ─── Shared fetch helper ──────────────────────────────────────────────────

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

  // ─── Public API ───────────────────────────────────────────────────────────

  async getCurrentChallenge(userId: string) {
    let row = await this.fetchActiveRow();

    // Lazy hydration: no active non-expired challenge — rotate on-demand
    if (!row) {
      await this.generateAndRotate();
      row = await this.fetchActiveRow();
    }

    if (!row) return null;

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

    // Race-safe atomic claim — double-check inside TX; DB unique constraint is the final backstop
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
      challenge.xp_reward,
    );

    const { streakIncremented } = await this.streakService.updateStreak(userId);
    await this.questsService.updateQuestProgress(userId, QuestType.SOLVE_RIDDLES);
    await this.questsService.updateQuestProgress(userId, QuestType.EARN_XP, xpEarned);
    if (streakIncremented) {
      await this.questsService.updateQuestProgress(userId, QuestType.MAINTAIN_STREAK);
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

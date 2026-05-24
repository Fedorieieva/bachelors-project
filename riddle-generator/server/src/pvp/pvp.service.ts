import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExperienceService } from '../experience/experience.service';
import { StreakService } from '../streaks/streak.service';
import { QuestsService } from '../quests/quests.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AiService } from '../riddles/ai/ai.service';
import { PvpStatus, QuestType, NotificationType, RiddleType } from '@prisma/client';
import { AiRiddleResponse, CrosswordLayout } from '../riddles/ai/ai-responses.dto';

interface PvpAiRiddleResponse extends AiRiddleResponse {
  type?: string;
}

const WINNER_BASE_XP = 100;
const LOSER_CONSOLATION_XP = 20;

@Injectable()
export class PvpService {
  private readonly logger = new Logger(PvpService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly experienceService: ExperienceService,
    private readonly streakService: StreakService,
    private readonly questsService: QuestsService,
    private readonly notificationsService: NotificationsService,
    private readonly aiService: AiService,
  ) {}

  async createRoom(creatorId: string) {
    return this.prisma.pvpMatch.create({
      data: { creator_id: creatorId, status: PvpStatus.PENDING },
      select: { id: true, status: true, created_at: true },
    });
  }

  async getPendingRooms() {
    return this.prisma.pvpMatch.findMany({
      where: { status: PvpStatus.PENDING },
      orderBy: { created_at: 'desc' },
      take: 20,
      select: {
        id: true,
        created_at: true,
        creator: { select: { id: true, name: true, avatar_url: true, level: true } },
      },
    });
  }

  async getMatch(matchId: string, userId: string) {
    const match = await this.prisma.pvpMatch.findUnique({
      where: { id: matchId },
      include: {
        creator: { select: { id: true, name: true, avatar_url: true } },
        opponent: { select: { id: true, name: true, avatar_url: true } },
        winner: { select: { id: true, name: true } },
        riddle: { select: { id: true, content: true, complexity: true, type: true, image_url: true } },
      },
    });

    if (!match) throw new NotFoundException('Match not found');
    if (match.creator_id !== userId && match.opponent_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return match;
  }

  async getActiveMatchForUser(userId: string) {
    return this.prisma.pvpMatch.findFirst({
      where: {
        OR: [{ creator_id: userId }, { opponent_id: userId }],
        status: { in: [PvpStatus.PENDING, PvpStatus.ACTIVE] },
      },
      select: { id: true, status: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async joinRoom(matchId: string, opponentId: string) {
    const match = await this.prisma.pvpMatch.findUnique({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match not found');
    if (match.status !== PvpStatus.PENDING) throw new ForbiddenException('Match is not joinable');
    if (match.creator_id === opponentId) throw new ForbiddenException('Cannot join your own match');

    // ── Resolve creator's preferred language from their most recent chat ──
    const creatorChat = await this.prisma.chat.findFirst({
      where: { user_id: match.creator_id },
      orderBy: { createdAt: 'desc' },
      select: { language: true },
    });
    const riddleLanguage = creatorChat?.language ?? 'english';

    // ── Random generation parameters ────────────────────────────
    const pvpTopics = [
      'ancient mysteries',
      'cyberpunk paradoxes',
      'abstract geometry',
      'detective cold cases',
      'everyday objects with a twist',
      'space exploration',
      'time paradoxes',
      'natural phenomena',
      'optical illusions',
      'impossible machines',
    ];
    const randomTopic = pvpTopics[Math.floor(Math.random() * pvpTopics.length)];

    // ── 50/50 dice: crossword vs text riddle ─────────────────────
    const isCrosswordRound = Math.random() < 0.5;
    // Complexity 3-5 for both paths — PvP is always a challenge
    const randomComplexity = Math.floor(Math.random() * 3) + 3;
    // Crossword word count: 9-20 words
    const crosswordWordCount = Math.floor(Math.random() * 12) + 9;

    // ── Persist the freshly generated riddle ─────────────────────
    const riddle = await (async () => {
      // ── Crossword path ──────────────────────────────────────────
      if (isCrosswordRound) {
        let layout: CrosswordLayout | null = null;
        try {
          layout = await this.aiService.generateCrossword(randomTopic, [], riddleLanguage, crosswordWordCount, randomComplexity);
        } catch (err) {
          this.logger.warn(
            `[PvP] Crossword generation failed for match ${matchId}, falling back to text. ${err instanceof Error ? err.message : String(err)}`,
          );
        }

        if (layout) {
          this.logger.log(
            `[PvP] Crossword for match ${matchId} — complexity: ${randomComplexity}, words: ${crosswordWordCount}, topic: "${randomTopic}"`,
          );
          return this.prisma.riddles.create({
            data: {
              content: JSON.stringify(layout),
              answer: 'CROSSWORD_COMPLETE',
              prompt_context: { source: 'pvp', topic: randomTopic, type: 'CROSSWORD', complexity: randomComplexity, word_count: crosswordWordCount, language: riddleLanguage },
              complexity: randomComplexity,
              type: RiddleType.CROSSWORD,
              is_public: false,
              is_verified: true,
              author_id: match.creator_id,
            },
          });
        }
      }

      // ── Text riddle path (default or crossword fallback) ────────
      const generationPrompt = `Generate a riddle about the theme "${randomTopic}" at complexity level ${randomComplexity} out of 5.

After generating the riddle, evaluate its content and classify it as exactly one of these types:
- CLASSIC: traditional wordplay, metaphor, or poetic object-description riddle
- MATH: requires arithmetic, counting, or explicit numerical reasoning
- LOGIC: requires deductive or inductive reasoning beyond simple wordplay
- DANETKI: a mystery scenario designed to be solved by asking yes/no questions

CRITICAL LANGUAGE RULE: The "content" and "answer" field values MUST be generated strictly in the following language: "${riddleLanguage}". Do not default to English unless this is the explicitly requested language.

RETURN JSON ONLY — no markdown, no extra text:
{
  "content": "the riddle text presented to the player",
  "answer": "the single correct answer word or short phrase",
  "type": "CLASSIC" | "MATH" | "LOGIC" | "DANETKI",
  "reasoning": "brief internal note on how you constructed this riddle"
}`;

      let aiResult: PvpAiRiddleResponse;
      try {
        aiResult = await this.aiService.askGemini<PvpAiRiddleResponse>(generationPrompt, 3);
      } catch (error) {
        this.logger.warn(
          `[PvP] AI generation failed for match ${matchId} — using fallback riddle. Error: ${error instanceof Error ? error.message : String(error)}`,
        );
        aiResult = {
          content:
            'I have cities, but no houses live there. Mountains, but no trees grow. Water, but no fish swim. Roads, but no cars drive. What am I?',
          answer: 'A map',
          type: 'LOGIC',
          reasoning: 'Hardcoded fallback riddle used because AI generation was unavailable.',
        };
      }

      const riddleType = this.resolveRiddleType(aiResult.type);
      this.logger.log(
        `[PvP] Text riddle for match ${matchId} — type: ${riddleType}, complexity: ${randomComplexity}, topic: "${randomTopic}"`,
      );
      return this.prisma.riddles.create({
        data: {
          content: aiResult.content,
          answer: aiResult.answer,
          prompt_context: { source: 'pvp', topic: randomTopic, type: riddleType, complexity: randomComplexity, language: riddleLanguage, reasoning: aiResult.reasoning },
          complexity: randomComplexity,
          type: riddleType,
          is_public: false,
          is_verified: true,
          author_id: match.creator_id,
        },
      });
    })();

    // ── Activate match with the new riddle atomically ─────────────
    const updated = await this.prisma.pvpMatch.update({
      where: { id: matchId },
      data: {
        opponent_id: opponentId,
        riddle_id: riddle.id,
        status: PvpStatus.ACTIVE,
        started_at: new Date(),
      },
      include: {
        creator: { select: { id: true, name: true, avatar_url: true } },
        opponent: { select: { id: true, name: true, avatar_url: true } },
        riddle: { select: { id: true, content: true, complexity: true, type: true, image_url: true } },
      },
    });

    void this.notificationsService.createNotification({
      userId: match.creator_id,
      type: NotificationType.PVP_CHALLENGE_RECEIVED,
      content: `${updated.opponent?.name ?? 'A player'} joined your PvP duel!`,
      metadata: { matchId },
    });

    return updated;
  }

  async submitGuess(
    matchId: string,
    userId: string,
    guess: string,
    answers?: Record<string, string>,
  ): Promise<{ correct: boolean; winnerId?: string; loserId?: string; xpEarned?: number }> {
    const match = await this.prisma.pvpMatch.findUnique({
      where: { id: matchId },
      include: { riddle: true },
    });

    if (!match) throw new NotFoundException('Match not found');
    if (match.status !== PvpStatus.ACTIVE) throw new ForbiddenException('Match is not active');
    if (match.creator_id !== userId && match.opponent_id !== userId) {
      throw new ForbiddenException('Not a participant');
    }
    if (!match.riddle) throw new ForbiddenException('No riddle assigned to match');

    // ── Crossword match: server validates DB progress against layout ──
    if (match.riddle.type === RiddleType.CROSSWORD) {
      if (guess !== 'CROSSWORD_COMPLETE') return { correct: false };

      // Parse the stored layout from riddle content
      let layout: CrosswordLayout;
      try {
        layout = JSON.parse(match.riddle.content) as CrosswordLayout;
      } catch {
        this.logger.error(`[PvP] Could not parse crossword layout for match ${matchId}`);
        return { correct: false };
      }

      const db = this.prisma as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      // Atomic save: persist the final answers payload before validating
      if (answers && Object.keys(answers).length > 0) {
        await db.crosswordProgress.upsert({
          where: { user_id_riddle_id: { user_id: userId, riddle_id: match.riddle.id } },
          create: { user_id: userId, riddle_id: match.riddle.id, progress: answers },
          update: { progress: answers },
        });
      }

      // Read this player's persisted grid state from the DB
      const cp = await db.crosswordProgress.findUnique({
        where: { user_id_riddle_id: { user_id: userId, riddle_id: match.riddle.id } },
        select: { progress: true },
      });

      if (!cp?.progress) return { correct: false };

      const progress = cp.progress as Record<string, string>;

      // Validate every word matches the solution using the same normaliser as the client
      const allCorrect = layout.words.every((word) => {
        const typed = progress[String(word.number)] ?? '';
        return this.normalizeCrosswordAnswer(typed) === this.normalizeCrosswordAnswer(word.word);
      });

      if (!allCorrect) {
        this.logger.warn(`[PvP] Crossword completion rejected for user ${userId} — grid not fully solved`);
        return { correct: false };
      }
    } else {
      // ── Fast-path: local string normalisation (sub-millisecond) ──
      const answerText = match.riddle.answer ?? '';
      let isSolvedLocally = false;

      if (answerText) {
        const normalizedGuess = this.normalizeAnswer(guess);
        const normalizedAnswer = this.normalizeAnswer(answerText);
        isSolvedLocally =
          normalizedGuess === normalizedAnswer ||
          normalizedAnswer.split(' ').includes(normalizedGuess);
      }

      if (!isSolvedLocally) {
        // ── Semantic fallback: AI handles synonyms, phrasing variants, and multilingual answers ──
        const riddleContext = [
          { role: 'user' as const, parts: [{ text: match.riddle.content }] },
        ];
        const aiResult = await this.aiService.getContextualHint(riddleContext, guess, match.riddle.answer);
        if (!aiResult.is_solved) return { correct: false };
      }
    }

    const loserId = match.creator_id === userId ? match.opponent_id! : match.creator_id;

    // Atomic commit — only one concurrent winner can land
    const committed = await this.prisma.$transaction(async (tx) => {
      const locked = await tx.pvpMatch.findUnique({
        where: { id: matchId },
        select: { status: true },
      });
      if (locked?.status === PvpStatus.FINISHED) return null;

      return tx.pvpMatch.update({
        where: { id: matchId },
        data: { status: PvpStatus.FINISHED, winner_id: userId, finished_at: new Date() },
      });
    });

    if (!committed) return { correct: true };

    const winnerXp = await this.experienceService.awardXpForSolving(
      userId,
      `PvP Match #${matchId.slice(0, 8)}`,
      WINNER_BASE_XP,
    );
    await this.experienceService.awardXpForActivity(loserId, 'pvp_consolation', LOSER_CONSOLATION_XP);

    const [winnerStreak, loserStreak] = await Promise.all([
      this.streakService.updateStreak(userId),
      this.streakService.updateStreak(loserId),
    ]);

    await this.questsService.incrementProgress(userId, QuestType.SOLVE_RIDDLES);
    await this.questsService.incrementProgress(userId, QuestType.EARN_XP, winnerXp);
    if (winnerStreak.streakIncremented) {
      await this.questsService.incrementProgress(userId, QuestType.MAINTAIN_STREAK);
    }
    if (loserStreak.streakIncremented) {
      await this.questsService.incrementProgress(loserId, QuestType.MAINTAIN_STREAK);
    }

    void this.notificationsService.createNotification({
      userId,
      type: NotificationType.PVP_MATCH_WON,
      content: `You won the PvP duel! +${winnerXp} XP`,
      metadata: { matchId, xp: winnerXp },
    });
    void this.notificationsService.createNotification({
      userId: loserId,
      type: NotificationType.PVP_MATCH_LOST,
      content: 'You lost the PvP duel. Keep practicing!',
      metadata: { matchId },
    });

    this.logger.log(`[PvP] Match ${matchId} finished — winner: ${userId}, loser: ${loserId}, xp: ${winnerXp}`);
    return { correct: true, winnerId: userId, loserId, xpEarned: winnerXp };
  }

  private resolveRiddleType(raw: string | undefined): RiddleType {
    const normalized = (raw ?? '').toUpperCase().trim();
    const valid = new Set(Object.values(RiddleType));
    return valid.has(normalized as RiddleType) ? (normalized as RiddleType) : RiddleType.LOGIC;
  }

  private normalizeAnswer(s: string): string {
    return s
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Mirrors the client-side CrosswordResult normaliser for server-side grid validation. */
  private normalizeCrosswordAnswer(s: string): string {
    return s.toUpperCase().replace(/[\s'\-]/g, '');
  }

  async cancelMatch(matchId: string, userId: string) {
    const match = await this.prisma.pvpMatch.findUnique({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match not found');
    if (match.creator_id !== userId) throw new ForbiddenException('Only the creator can cancel');
    if (match.status !== PvpStatus.PENDING) throw new ForbiddenException('Cannot cancel a non-pending match');

    return this.prisma.pvpMatch.update({
      where: { id: matchId },
      data: { status: PvpStatus.CANCELLED },
      select: { id: true, status: true },
    });
  }

  // System-level cancel (disconnect grace expiry, no ownership check)
  async forceCancel(matchId: string): Promise<void> {
    await this.prisma.pvpMatch.updateMany({
      where: {
        id: matchId,
        status: { in: [PvpStatus.PENDING, PvpStatus.ACTIVE] },
      },
      data: { status: PvpStatus.CANCELLED, finished_at: new Date() },
    });
    this.logger.warn(`[PvP] Match ${matchId} force-cancelled (disconnect grace expired)`);
  }

  async getHistory(userId: string) {
    return this.prisma.pvpMatch.findMany({
      where: {
        OR: [{ creator_id: userId }, { opponent_id: userId }],
        status: { in: [PvpStatus.FINISHED, PvpStatus.CANCELLED] },
      },
      orderBy: { created_at: 'desc' },
      take: 30,
      include: {
        creator: { select: { id: true, name: true, avatar_url: true } },
        opponent: { select: { id: true, name: true, avatar_url: true } },
        winner: { select: { id: true, name: true } },
        riddle: { select: { id: true, content: true, complexity: true, type: true } },
      },
    });
  }
}

import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExperienceService } from '../experience/experience.service';
import { StreakService } from '../streaks/streak.service';
import { QuestsService } from '../quests/quests.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AiService } from '../riddles/ai/ai.service';
import { PvpStatus, QuestType, NotificationType } from '@prisma/client';

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

    const count = await this.prisma.riddles.count({ where: { is_public: true, is_verified: true } });
    if (count === 0) throw new ForbiddenException('No riddles available for match');
    const skip = Math.floor(Math.random() * count);
    const riddle = await this.prisma.riddles.findFirst({
      where: { is_public: true, is_verified: true },
      skip,
    });
    if (!riddle) throw new ForbiddenException('No riddles available');

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

    // AI contextual validation — handles synonyms, phrasing variations, multilingual answers
    const aiResult = await this.aiService.getContextualHint([], guess, match.riddle.answer);
    if (!aiResult.is_solved) return { correct: false };

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

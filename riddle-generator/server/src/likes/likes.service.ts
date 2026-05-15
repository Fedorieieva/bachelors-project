import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExperienceService } from '../experience/experience.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly experienceService: ExperienceService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async toggleLike(userId: string, riddleId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: { user_id_riddle_id: { user_id: userId, riddle_id: riddleId } },
    });

    if (existingLike) {
      await this.prisma.$transaction([
        this.prisma.like.delete({ where: { id: existingLike.id } }),
        this.prisma.riddles.update({
          where: { id: riddleId },
          data: { likes_count: { decrement: 1 } },
        }),
      ]);
      return { liked: false };
    }

    const riddle = await this.prisma.riddles.findUnique({
      where: { id: riddleId },
      select: { author_id: true, content: true },
    });

    await this.prisma.$transaction([
      this.prisma.like.create({ data: { user_id: userId, riddle_id: riddleId } }),
      this.prisma.riddles.update({
        where: { id: riddleId },
        data: { likes_count: { increment: 1 } },
      }),
    ]);

    if (riddle && riddle.author_id !== userId) {
      await this.experienceService.awardXpForActivity(riddle.author_id, 'LIKE_RECEIVED', 5);

      const actor = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      void this.notificationsService.notifyNewLike(
        riddle.author_id,
        userId,
        actor?.name || 'Someone',
        riddleId,
      );
    }

    return { liked: true };
  }
}

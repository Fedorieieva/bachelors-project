import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExperienceService } from '../experience/experience.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly experienceService: ExperienceService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(userId: string, riddleId: string, content: string) {
    const comment = await this.prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: { content, user_id: userId, riddle_id: riddleId },
      });
      await tx.riddles.update({
        where: { id: riddleId },
        data: { comments_count: { increment: 1 } },
      });
      return newComment;
    });

    const riddle = await this.prisma.riddles.findUnique({
      where: { id: riddleId },
      select: { author_id: true },
    });

    if (riddle && riddle.author_id !== userId) {
      await this.experienceService.awardXpForActivity(riddle.author_id, 'COMMENT_RECEIVED', 10);

      const actor = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      void this.notificationsService.notifyNewComment(
        riddle.author_id,
        userId,
        actor?.name || 'Someone',
        riddleId,
      );
    }

    return comment;
  }

  async findPaginated(riddleId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [comments, totalCount] = await Promise.all([
      this.prisma.comment.findMany({
        where: { riddle_id: riddleId },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { id: true, name: true, avatar_url: true } } },
      }),
      this.prisma.comment.count({ where: { riddle_id: riddleId } }),
    ]);

    return {
      data: comments,
      meta: {
        totalItems: totalCount,
        itemCount: comments.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  }

  async update(id: string, userId: string, content: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Коментар не знайдено');
    if (comment.user_id !== userId)
      throw new ForbiddenException('Ви можете редагувати лише власні коментарі');
    return this.prisma.comment.update({ where: { id }, data: { content } });
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Коментар не знайдено');
    if (comment.user_id !== userId)
      throw new ForbiddenException('Ви можете видаляти лише власні коментарі');

    return this.prisma.$transaction(async (tx) => {
      const deleted = await tx.comment.delete({ where: { id } });
      await tx.riddles.update({
        where: { id: comment.riddle_id },
        data: { comments_count: { decrement: 1 } },
      });
      return deleted;
    });
  }
}

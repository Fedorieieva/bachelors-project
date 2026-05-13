import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, Prisma } from '@prisma/client';

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  actorId?: string;
  content: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly gateway: NotificationsGateway,
    private readonly prisma: PrismaService,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        actorId: dto.actorId ?? null,
        content: dto.content,
        metadata: (dto.metadata as Prisma.InputJsonValue) ?? undefined,
      },
      include: { actor: { select: { id: true, name: true, avatar_url: true } } },
    });

    this.gateway.sendToUser(dto.userId, 'notification', notification);
    return notification;
  }

  async getNotifications(userId: string, limit = 30) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { actor: { select: { id: true, name: true, avatar_url: true } } },
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async clearAll(userId: string) {
    return this.prisma.notification.deleteMany({ where: { userId } });
  }

  async notifyNewComment(riddleAuthorId: string, actorId: string, actorName: string, riddleId: string) {
    if (riddleAuthorId === actorId) return;
    return this.createNotification({
      userId: riddleAuthorId,
      type: NotificationType.COMMENT,
      actorId,
      content: `${actorName} commented on your riddle`,
      metadata: { riddleId },
    });
  }

  async notifyNewLike(riddleAuthorId: string, actorId: string, actorName: string, riddleId: string) {
    if (riddleAuthorId === actorId) return;
    return this.createNotification({
      userId: riddleAuthorId,
      type: NotificationType.LIKE,
      actorId,
      content: `${actorName} liked your riddle`,
      metadata: { riddleId },
    });
  }

  async notifyFollow(followingId: string, actorId: string, actorName: string) {
    return this.createNotification({
      userId: followingId,
      type: NotificationType.FOLLOW,
      actorId,
      content: `${actorName} started following you`,
      metadata: { actorId },
    });
  }

  async notifyLevelUp(userId: string, newLevel: number) {
    return this.createNotification({
      userId,
      type: NotificationType.LEVEL_UP,
      content: `Level up! You reached level ${newLevel}`,
      metadata: { level: newLevel },
    });
  }

  async notifyXpEarned(userId: string, amount: number) {
    return this.createNotification({
      userId,
      type: NotificationType.XP_EARNED,
      content: `You earned ${amount} XP`,
      metadata: { xp: amount },
    });
  }

  async notifyProfileDeleted(followerId: string, deletedUserName: string) {
    return this.createNotification({
      userId: followerId,
      type: NotificationType.PROFILE_DELETED,
      content: `${deletedUserName} deleted their account`,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldNotifications() {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const result = await this.prisma.notification.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    console.log(`[NotificationsService] Cleaned up ${result.count} old notifications`);
  }
}

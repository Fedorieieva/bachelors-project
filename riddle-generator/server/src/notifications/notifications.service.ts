import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly gateway: NotificationsGateway,
    private readonly prisma: PrismaService,
  ) {}

  async notifyNewComment(riddleAuthorId: string, commenterName: string, riddleId: string) {
    this.gateway.sendToUser(riddleAuthorId, 'notification', {
      type: 'COMMENT',
      message: `${commenterName} прокоментував вашу загадку!`,
      riddleId,
    });
  }

  async notifyNewLike(riddleAuthorId: string, likerName: string, riddleId: string) {
    this.gateway.sendToUser(riddleAuthorId, 'notification', {
      type: 'LIKE',
      message: `${likerName} вподобав вашу загадку!`,
      riddleId,
    });
  }

  async notifyNewRiddleFromFollower(followerId: string, authorName: string, riddleId: string) {
    this.gateway.sendToUser(followerId, 'notification', {
      type: 'NEW_RIDDLE',
      message: `${authorName} опублікував нову загадку!`,
      riddleId,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

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

    await this.prisma.$transaction([
      this.prisma.like.create({
        data: { user_id: userId, riddle_id: riddleId },
      }),
      this.prisma.riddles.update({
        where: { id: riddleId },
        data: { likes_count: { increment: 1 } },
      }),
    ]);
    return { liked: true };
  }
}

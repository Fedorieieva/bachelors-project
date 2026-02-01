import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../utils/decorators/public.decorator';

@Controller('feed')
export class FeedController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('public')
  @Public()
  async getPublicFeed(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: { is_public: true },
        include: {
          author: { select: { name: true } },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prisma.riddles.count({ where: { is_public: true } }),
    ]);

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / take),
      },
    };
  }
}

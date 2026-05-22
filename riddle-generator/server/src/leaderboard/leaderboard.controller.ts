import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  getLeaderboard(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('period') period: string = 'all',
  ) {
    const resolvedPeriod = period === 'weekly' ? 'weekly' : 'all';
    return resolvedPeriod === 'weekly'
      ? this.leaderboardService.getWeeklyLeaderboard(page, limit)
      : this.leaderboardService.getGlobalLeaderboard(page, limit);
  }

  @Get('rank')
  getMyRank(
    @CurrentUser() user: User,
    @Query('period') period: string = 'all',
  ) {
    const resolvedPeriod = period === 'weekly' ? 'weekly' : 'all';
    return this.leaderboardService.getUserRank(user.id, resolvedPeriod);
  }
}

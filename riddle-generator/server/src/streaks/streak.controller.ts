import { Controller, Get } from '@nestjs/common';
import { StreakService } from './streak.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('streaks')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get('me')
  getMyStreak(@CurrentUser() user: User) {
    return this.streakService.getStreak(user.id);
  }
}

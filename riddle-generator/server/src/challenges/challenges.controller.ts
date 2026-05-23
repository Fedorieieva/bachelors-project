import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { User } from '@prisma/client';
import { CurrentUser } from '../utils/decorators/user.decorator';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get('current')
  getCurrent(@CurrentUser() user: User) {
    return this.challengesService.getCurrentChallenge(user.id);
  }

  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() body: { guess: string },
  ) {
    return this.challengesService.submitSolution(id, user.id, body.guess);
  }

  @Get('solved')
  getSolved(@CurrentUser() user: User) {
    return this.challengesService.getSolvedChallenges(user.id);
  }

  @Get('history')
  getHistory(@CurrentUser() user: User) {
    return this.challengesService.getSolvedHistory(user.id);
  }
}

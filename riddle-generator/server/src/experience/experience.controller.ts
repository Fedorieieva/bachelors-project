import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import { User } from '@prisma/client';

const CROSSWORD_COMPLETION_XP = 50;

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post('crossword')
  @HttpCode(HttpStatus.OK)
  async awardCrosswordXp(@CurrentUser() user: User): Promise<{ xp_earned: number }> {
    const xp = await this.experienceService.awardXpForSolving(
      user.id,
      'crossword',
      CROSSWORD_COMPLETION_XP,
    );
    return { xp_earned: xp };
  }
}

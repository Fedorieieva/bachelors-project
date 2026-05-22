import { Controller, Get } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get('daily')
  getDailyQuests(@CurrentUser() user: User) {
    return this.questsService.getDailyQuests(user.id);
  }
}

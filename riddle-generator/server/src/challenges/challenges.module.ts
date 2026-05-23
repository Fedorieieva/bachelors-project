import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ExperienceModule } from '../experience/experience.module';
import { StreakModule } from '../streaks/streak.module';
import { QuestsModule } from '../quests/quests.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AiModule } from '../riddles/ai/ai.module';

@Module({
  imports: [PrismaModule, ExperienceModule, StreakModule, QuestsModule, NotificationsModule, AiModule],
  providers: [ChallengesService],
  controllers: [ChallengesController],
  exports: [ChallengesService],
})
export class ChallengesModule {}

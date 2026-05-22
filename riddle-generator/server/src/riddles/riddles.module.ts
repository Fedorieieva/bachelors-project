import { Module } from '@nestjs/common';
import { RiddlesController } from './riddles.controller';
import { RiddlesService } from './riddles.service';
import { AiModule } from './ai/ai.module';
import { PromptsModule } from './prompts/prompts.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ExperienceModule } from '../experience/experience.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { StreakModule } from '../streaks/streak.module';
import { QuestsModule } from '../quests/quests.module';

@Module({
  imports: [AiModule, PromptsModule, PrismaModule, ExperienceModule, NotificationsModule, CloudinaryModule, StreakModule, QuestsModule],
  controllers: [RiddlesController],
  providers: [RiddlesService],
  exports: [RiddlesService],
})
export class RiddlesModule {}

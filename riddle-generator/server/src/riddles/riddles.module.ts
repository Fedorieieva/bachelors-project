import { Module } from '@nestjs/common';
import { RiddlesController } from './riddles.controller';
import { RiddlesService } from './riddles.service';
import { AiModule } from './ai/ai.module';
import { PromptsModule } from './prompts/prompts.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ExperienceModule } from '../experience/experience.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [AiModule, PromptsModule, PrismaModule, ExperienceModule, NotificationsModule],
  controllers: [RiddlesController],
  providers: [RiddlesService],
  exports: [RiddlesService],
})
export class RiddlesModule {}

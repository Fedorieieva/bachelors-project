import { Module } from '@nestjs/common';
import { PvpService } from './pvp.service';
import { PvpGateway } from './pvp.gateway';
import { PvpController } from './pvp.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ExperienceModule } from '../experience/experience.module';
import { StreakModule } from '../streaks/streak.module';
import { QuestsModule } from '../quests/quests.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SessionModule } from '../sessions/session.module';
import { AiModule } from '../riddles/ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    ExperienceModule,
    StreakModule,
    QuestsModule,
    NotificationsModule,
    SessionModule,
    AiModule,
  ],
  providers: [PvpService, PvpGateway],
  controllers: [PvpController],
  exports: [PvpService],
})
export class PvpModule {}

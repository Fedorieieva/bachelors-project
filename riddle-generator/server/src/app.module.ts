import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './sessions/session.module';
import { AuthModule } from './users/auth/auth.module';
import { AuthGuard } from './users/auth/guards/auth.guard';
import { UserModule } from './users/user.module';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { RiddlesModule } from './riddles/riddles.module';
import { PromptsModule } from './riddles/prompts/prompts.module';
import { AiModule } from './riddles/ai/ai.module';
import { FeedModule } from './feed/feed.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { ExperienceModule } from './experience/experience.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { StreakModule } from './streaks/streak.module';
import { QuestsModule } from './quests/quests.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { PvpModule } from './pvp/pvp.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NestScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    SessionModule,
    AuthModule,
    NotificationsModule,
    RiddlesModule,
    PromptsModule,
    AiModule,
    FeedModule,
    LikesModule,
    CommentsModule,
    ExperienceModule,
    CloudinaryModule,
    StreakModule,
    QuestsModule,
    LeaderboardModule,
    PvpModule,
    ChallengesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}

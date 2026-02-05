import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './sessions/session.module';
import { AuthModule } from './users/auth/auth.module';
import { AuthGuard } from './users/auth/auth.guard';
import { UserModule } from './users/user.module';
import { Cron, ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notifications/notification.module';
import { SessionService } from './sessions/session.service';
import { PrismaModule } from './prisma/prisma.module';
import { RiddlesModule } from './riddles/riddles.module';
import { PromptsModule } from './riddles/prompts/prompts.module';
import { AiModule } from './riddles/ai/ai.module';
import { FeedModule } from './feed/feed.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { ExperienceModule } from './experience/experience.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NestScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    SessionModule,
    AuthModule,
    NotificationModule,
    RiddlesModule,
    PromptsModule,
    AiModule,
    FeedModule,
    LikesModule,
    CommentsModule,
    ExperienceModule,
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
export class AppModule {
  private readonly logger = new Logger(AppModule.name);
  constructor(private readonly sessionService: SessionService) {}

  @Cron('0 0 * * *')
  async cleanOldSessions() {
    await this.sessionService.cleanupExpiredSessions();
    this.logger.log('🧹 Old sessions cleaned');
  }
}

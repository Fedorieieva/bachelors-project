import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SessionModule } from '../sessions/session.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, SessionModule, NotificationsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, PrismaModule],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { SessionModule } from '../../sessions/session.module';
import { UserModule } from '../user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

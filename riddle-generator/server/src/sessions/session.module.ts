import 'dotenv/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SessionService } from './session.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.EXPIRES_AT as JwtSignOptions['expiresIn'],
      },
    }),
  ],
  providers: [SessionService],
  exports: [SessionService, JwtModule, PrismaModule],
})
export class SessionModule {}

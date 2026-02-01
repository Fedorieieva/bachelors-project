import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import 'dotenv/config';
import { ValidateTokenResult } from './dto/validate.token.result.dto';
import { User, Session } from '@prisma/client';
import { safeMs } from '../utils/safeMs';
import { PrismaService } from '../prisma/prisma.service';

type SessionWithUser = Session & { user: User };

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createForUser(user: User): Promise<Session> {
    const payload = { userId: user.id, email: user.email };
    const options: JwtSignOptions = {
      secret: process.env.SECRET,
      expiresIn: process.env.EXPIRES_AT as JwtSignOptions['expiresIn'],
    };
    const token = this.jwtService.sign(payload, options);
    const decoded = this.jwtService.decode<{ exp?: number; userId: string }>(token);
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date();

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as JwtSignOptions['expiresIn'],
    });

    return this.prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        refresh_token: refreshToken,
        expires_at: expiresAt,
        last_activity_at: new Date(),
        created_at: new Date(),
      },
    });
  }

  async validateToken(token: string): Promise<ValidateTokenResult | null> {
    const now = new Date();
    try {
      this.jwtService.verify<{
        userId: string;
        email: string;
      }>(token, { secret: process.env.SECRET });

      const session = await this.prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!session || session.expires_at < now) return null;

      const refreshTokenBeforeExpires = safeMs(process.env.REFRESH_TOKEN_BEFORE_EXPIRES ?? '1h');
      const timeLeft = session.expires_at.getTime() - now.getTime();

      if (timeLeft < refreshTokenBeforeExpires) {
        const refreshed = await this.refreshSession(session);
        return { user: refreshed.user, newToken: refreshed.token };
      }

      return { user: session.user };
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(`Invalid or expired token: ${e.message}`);
      }
      return null;
    }
  }

  async refreshSession(session: SessionWithUser): Promise<SessionWithUser> {
    const payload = { userId: session.userId, email: session.user.email };
    const token = this.jwtService.sign(payload, {
      secret: process.env.SECRET,
      expiresIn: process.env.EXPIRES_AT as JwtSignOptions['expiresIn'],
    });

    const decoded = this.jwtService.decode<{ exp?: number; userId: string }>(token);
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date();

    return this.prisma.session.update({
      where: { id: session.id },
      data: {
        token: token,
        expires_at: expiresAt,
        last_activity_at: new Date(),
      },
      include: { user: true },
    });
  }

  async cleanupExpiredSessions(): Promise<void> {
    const maxAge = safeMs(process.env.CLEAN_SESSION_TOKEN_AFTER ?? '30d');
    const sessionClean = new Date(Date.now() - maxAge);

    await this.prisma.session.deleteMany({
      where: {
        expires_at: {
          lt: sessionClean,
        },
      },
    });
  }

  async refreshByRefreshToken(refreshToken: string): Promise<(Session & { user: User }) | null> {
    try {
      const decoded = this.jwtService.verify<{ userId: string; email: string }>(refreshToken, {
        secret: process.env.SECRET,
      });

      const session = await this.prisma.session.findUnique({
        where: { refresh_token: refreshToken },
        include: { user: true },
      });

      if (!session || session.userId !== decoded.userId) return null;

      return this.refreshSession(session);
    } catch {
      return null;
    }
  }

  async findAll(): Promise<SessionWithUser[]> {
    return this.prisma.session.findMany({
      include: { user: true },
    });
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.session.delete({
        where: { id: id },
      });
    } catch (e) {
      if (e.code === 'P2025') {
        throw new Error('Session not found');
      }
      throw e;
    }
  }
}

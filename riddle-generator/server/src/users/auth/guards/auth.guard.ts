import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { SessionService } from '../../../sessions/session.service';
import { AuthRequest } from '../dto/auth.request.dto';
import { IS_PUBLIC_KEY } from '../../../utils/decorators/public.decorator';
import { setAuthCookies } from '../../../utils/setAuthCookies';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly sessionService: SessionService,
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const response = context.switchToHttp().getResponse<Response>();

    const token = request.cookies?.access_token || request.headers['authorization']?.split(' ')[1];
    const refreshToken = request.cookies?.refresh_token;

    if (!token) {
      const guest = await this.authService.createAnonymousUser();

      setAuthCookies(response, {
        accessToken: guest.token,
        refreshToken: guest.refreshToken,
      });

      request.user = guest.user;
      return true;
    }

    try {
      const result = await this.sessionService.validateToken(token);

      if (result) {
        if (result.newToken) {
          setAuthCookies(response, { accessToken: result.newToken });
        }
        request.user = result.user;
        return true;
      }

      if (refreshToken) {
        const refreshed = await this.sessionService.refreshByRefreshToken(refreshToken);
        if (refreshed) {
          setAuthCookies(response, { accessToken: refreshed.token });
          request.user = refreshed.user;
          return true;
        }
      }

      if (isPublic) {
        const guest = await this.authService.createAnonymousUser();
        setAuthCookies(response, { accessToken: guest.token, refreshToken: guest.refreshToken });
        request.user = guest.user;
        return true;
      }

      throw new UnauthorizedException('Invalid session');
    } catch (error) {
      if (isPublic) {
        const guest = await this.authService.createAnonymousUser();
        request.user = guest.user;
        return true;
      }
      throw error;
    }
  }
}

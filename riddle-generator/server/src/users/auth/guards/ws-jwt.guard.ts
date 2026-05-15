import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SessionService } from '../../../sessions/session.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();

      const token =
        client.handshake.headers['authorization']?.split(' ')[1] ||
        (client.handshake.query?.token as string);

      if (!token) {
        throw new WsException('Unauthorized: No token provided');
      }

      const result = await this.sessionService.validateToken(token);

      if (!result?.user) {
        throw new WsException('Unauthorized: Invalid token');
      }

      client.data.user = result.user;

      return true;
    } catch (err) {
      this.logger.error(`WS Auth Error: ${err.message}`);
      return false;
    }
  }
}

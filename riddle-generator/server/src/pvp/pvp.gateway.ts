import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { UseGuards, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../users/auth/guards/ws-jwt.guard';
import { PvpService } from './pvp.service';
import { SessionService } from '../sessions/session.service';

const DISCONNECT_GRACE_MS = 10_000;

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'pvp' })
export class PvpGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PvpGateway.name);

  // userId → currently connected socketId
  private readonly connectedUsers = new Map<string, string>();
  // userId → pending disconnect timer
  private readonly disconnectTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly pvpService: PvpService,
    private readonly sessionService: SessionService,
  ) {}

  async handleConnection(client: Socket) {
    const token =
      (client.handshake.auth as { token?: string })?.token ||
      client.handshake.headers['authorization']?.split(' ')[1] ||
      (client.handshake.query?.token as string);

    if (!token) {
      this.logger.warn(`[PvP WS] Rejected — no token (socket ${client.id})`);
      client.disconnect();
      return;
    }

    const result = await this.sessionService.validateToken(token).catch(() => null);
    if (!result?.user) {
      this.logger.warn(`[PvP WS] Rejected — invalid token (socket ${client.id})`);
      client.disconnect();
      return;
    }

    client.data.user = result.user;
    const userId = result.user.id as string;

    // If the user is reconnecting within the grace window, cancel the pending disconnect timer
    const pending = this.disconnectTimers.get(userId);
    if (pending) {
      clearTimeout(pending);
      this.disconnectTimers.delete(userId);
      this.logger.log(`[PvP WS] User ${userId} reconnected — grace timer cancelled`);
    }

    this.connectedUsers.set(userId, client.id);
    client.join(`user_${userId}`);
    this.logger.log(`[PvP WS] User ${userId} authenticated (socket ${client.id})`);
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user as { id: string } | undefined;
    if (!user) return;

    const userId = user.id;
    this.connectedUsers.delete(userId);
    this.logger.log(`[PvP WS] User ${userId} disconnected — ${DISCONNECT_GRACE_MS}ms grace window started`);

    const timer = setTimeout(() => {
      this.disconnectTimers.delete(userId);
      void this.handleGraceExpired(userId);
    }, DISCONNECT_GRACE_MS);

    this.disconnectTimers.set(userId, timer);
  }

  private async handleGraceExpired(userId: string) {
    if (this.connectedUsers.has(userId)) return; // reconnected during grace

    try {
      const match = await this.pvpService.getActiveMatchForUser(userId);
      if (!match) return;

      this.logger.warn(`[PvP WS] Grace expired for ${userId} — force-cancelling match ${match.id}`);
      await this.pvpService.forceCancel(match.id);
      this.server.to(`match_${match.id}`).emit('match_cancelled', {
        matchId: match.id,
        reason: 'opponent_disconnected',
      });
    } catch (err) {
      this.logger.error(`[PvP WS] Grace-expiry handler failed: ${(err as Error).message}`);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('create_room')
  async handleCreateRoom(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
    if (!user) throw new WsException('Unauthorized');
    try {
      const match = await this.pvpService.createRoom(user.id);
      client.join(`match_${match.id}`);
      client.emit('room_created', { matchId: match.id, status: 'PENDING' });
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string },
  ) {
    const user = client.data.user;
    if (!user) throw new WsException('Unauthorized');
    try {
      const match = await this.pvpService.joinRoom(data.matchId, user.id);
      client.join(`match_${match.id}`);

      const riddlePayload = match.riddle
        ? { id: match.riddle.id, content: match.riddle.content, image_url: match.riddle.image_url, complexity: match.riddle.complexity }
        : null;

      this.server.to(`match_${match.id}`).emit('match_started', {
        matchId: match.id,
        riddle: riddlePayload,
        creator: match.creator,
        opponent: match.opponent,
      });
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('submit_guess')
  async handleSubmitGuess(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; guess: string },
  ) {
    const user = client.data.user;
    if (!user) throw new WsException('Unauthorized');
    try {
      const result = await this.pvpService.submitGuess(data.matchId, user.id, data.guess);
      if (!result.correct) {
        client.emit('guess_result', { correct: false });
        return;
      }
      this.server.to(`match_${data.matchId}`).emit('match_over', {
        winnerId: result.winnerId,
        loserId: result.loserId,
        xpEarned: result.xpEarned,
      });
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('cancel_room')
  async handleCancelRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string },
  ) {
    const user = client.data.user;
    if (!user) throw new WsException('Unauthorized');
    try {
      await this.pvpService.cancelMatch(data.matchId, user.id);
      this.server.to(`match_${data.matchId}`).emit('match_cancelled', { matchId: data.matchId });
      client.leave(`match_${data.matchId}`);
    } catch (err) {
      client.emit('error', { message: (err as Error).message });
    }
  }

  notifyMatchStarted(matchId: string, payload: unknown) {
    this.server.to(`match_${matchId}`).emit('match_started', payload);
  }

  notifyMatchOver(matchId: string, payload: unknown) {
    this.server.to(`match_${matchId}`).emit('match_over', payload);
  }
}

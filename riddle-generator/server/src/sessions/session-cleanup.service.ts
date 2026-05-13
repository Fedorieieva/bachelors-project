import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SessionService } from './session.service';

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

  constructor(private readonly sessionService: SessionService) {}

  @Cron('0 0 * * *')
  async cleanOldSessions(): Promise<void> {
    await this.sessionService.cleanupExpiredSessions();
    this.logger.log('Old sessions cleaned');
  }
}

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CheckPermissionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CheckPermissionMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    this.logger.log(`🔒 Checking permissions for ${req.method} ${req.originalUrl}`);
    next();
  }
}

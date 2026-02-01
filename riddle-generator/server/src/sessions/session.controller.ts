import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ValidateTokenResult } from './dto/validate.token.result.dto';
import { User } from '@prisma/client';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
  private readonly logger = new Logger(SessionController.name);
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async createSession(@Body() body: { user: User }) {
    try {
      return await this.sessionService.createForUser(body.user);
    } catch (error) {
      this.logger.error('Error creating session', error);
      throw new HttpException('Error creating session', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('validate')
  async validateToken(@Body() body: { token: string }): Promise<ValidateTokenResult> {
    const result = await this.sessionService.validateToken(body.token);
    if (!result) throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    return result;
  }

  @Get()
  async getAll() {
    return await this.sessionService.findAll();
  }

  @Delete(':id')
  async removeSession(@Param('id') id: string) {
    await this.sessionService.remove(id);
    return { message: `Session ${id} deleted successfully` };
  }
}

import { Controller, Get, Post, Delete, Param, Body, Request } from '@nestjs/common';
import { PvpService } from './pvp.service';
import { User } from '@prisma/client';
import { CurrentUser } from '../utils/decorators/user.decorator';

@Controller('pvp')
export class PvpController {
  constructor(private readonly pvpService: PvpService) {}

  @Get('pending')
  getPending() {
    return this.pvpService.getPendingRooms();
  }

  @Get('history')
  getHistory(@CurrentUser() user: User) {
    return this.pvpService.getHistory(user.id);
  }

  @Get('match/:id')
  getMatch(@Param('id') id: string, @CurrentUser() user: User) {
    return this.pvpService.getMatch(id, user.id);
  }

  @Post('create')
  createRoom(@CurrentUser() user: User) {
    return this.pvpService.createRoom(user.id);
  }

  @Post('join/:id')
  joinRoom(@Param('id') id: string, @CurrentUser() user: User) {
    return this.pvpService.joinRoom(id, user.id);
  }

  @Post('match/:id/guess')
  submitGuess(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() body: { guess: string; answers?: Record<string, string> },
  ) {
    return this.pvpService.submitGuess(id, user.id, body.guess, body.answers);
  }

  @Delete('match/:id')
  cancelMatch(@Param('id') id: string, @CurrentUser() user: User) {
    return this.pvpService.cancelMatch(id, user.id);
  }
}

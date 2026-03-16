import { Controller, Post, Body, Param, Get, Put, Delete, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { RiddlesService } from './riddles.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import * as PrismaModels from '@prisma/client';
import { RiddleDto, RiddleSettingsDto } from './dto/riddle-settings.dto';
import { SaveRiddleDto } from './dto/riddle-persistence.dto';
import { Public } from '../utils/decorators/public.decorator';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@Controller('riddles')
export class RiddlesController {
  constructor(
    private readonly riddlesService: RiddlesService,
    private readonly prisma: PrismaService,
    ) {}

  @ApiOperation({
    summary: 'Generate Riddle',
    description: 'Trigger AI to generate a riddle based on a topic and specific settings.',
  })
  @ApiResponse({ status: 201, description: 'Riddle successfully generated.' })
  @ApiResponse({ status: 400, description: 'Invalid parameters or safety violation.' })
  @Public()
  @Post('generate')
  async createGeneratedRiddle(@Body() dto: RiddleDto) {
    return this.riddlesService.generateRiddle(dto);
  }

  @Public()
  @Post('chat/:chatId/regenerate')
  async regenerateRiddle(@Param('chatId') chatId: string, @Body() settings: RiddleSettingsDto) {
    return this.riddlesService.regenerateLastRiddle(chatId, settings);
  }

  @ApiOperation({ summary: 'Initialize a new game chat session' })
  @Public()
  @Post('chat/init')
  async initializeChat(@CurrentUser() user: PrismaModels.User) {
    return this.riddlesService.createChat(user.id);
  }

  @ApiOperation({
    summary: 'Process Chat Message',
    description:
      'The main engine for playing. Handles guesses, requests for hints, or generating new content within an existing chat.',
  })
  @ApiParam({ name: 'chatId', format: 'uuid', description: 'The active game session ID.' })
  @ApiResponse({ status: 200, description: 'Successfully processed message.' })
  @ApiResponse({ status: 403, description: 'User is banned due to content violations.' })
  @Public()
  @Post('chat/:chatId')
  async handleChat(
    @Param('chatId') chatId: string,
    @Body() dto: RiddleDto,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.processChatMessage(chatId, dto.topic, dto.settings, user.id);
  }

  @ApiOperation({
    summary: 'Reveal Answer',
    description:
      'Force reveal the answer to the current riddle and disable interactive mode for this session.',
  })
  @ApiResponse({ status: 200, description: 'Answer revealed.' })
  @Public()
  @Post('chat/:chatId/reveal')
  async revealAnswer(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.revealAnswer(chatId, user.id);
  }

  @Public()
  @Get('chat/:chatId/history')
  async getChatHistory(@Param('chatId') chatId: string, @CurrentUser() user: PrismaModels.User) {
    return this.riddlesService.getChatHistory(chatId, user.id);
  }

  @ApiOperation({
    summary: 'Save to Collection',
    description:
      'Persistently store a generated riddle in the database. Only available for registered users.',
  })
  @ApiResponse({ status: 201, description: 'Riddle saved to personal collection.' })
  @ApiResponse({ status: 403, description: 'Guests cannot save riddles.' })
  @Post('save')
  async saveRiddle(
    @Body() riddleData: { content: string; answer: string; prompt_context: SaveRiddleDto },
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.saveToUserCollection(user.id, riddleData);
  }

  @Put(':id/public')
  async togglePublic(@Param('id') riddleId: string, @CurrentUser() user: PrismaModels.User) {
    return this.riddlesService.makeRiddlePublic(user.id, riddleId);
  }

  @Post(':id/save')
  async toggleSave(
    @Param('id', ParseUUIDPipe) riddleId: string,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.toggleSaveRiddle(user.id, riddleId);
  }

  @Delete(':id')
  async removeRiddle(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: PrismaModels.User,
  ) {
    await this.riddlesService.remove(id, user.id);
    return { message: 'Riddle deleted successfully' };
  }

  @Post(':id/solve')
  async solve(
    @Param('id') id: string,
    @Body('guess') guess: string,
    @CurrentUser() user: PrismaModels.User,
    ) {
    return this.riddlesService.solveChallenge(user.id, id, guess);
  }

  @Post(':id/surrender')
  async surrender(
    @Param('id') id: string,
    @CurrentUser() user: PrismaModels.User,
  ) {
    const riddle = await this.prisma.riddles.findUnique({ where: { id } });

    if (!riddle) {
      throw new NotFoundException('Riddle not found');
    }

    return { answer: riddle.answer };
  }
  @Post(':id/buy-attempt')
  async buyAttempt(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.buyExtraAttempt(user.id, id);
  }

}

import { Controller, Post, Body, Param, Get, Put, Delete, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { RiddlesService } from './riddles.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import * as PrismaModels from '@prisma/client';
import { RiddleDto, RiddleSettingsDto } from './dto/riddle-settings.dto';
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

  @Post('chat/init')
  async initializeChat(
    @CurrentUser() user: PrismaModels.User,
    @Body() settings: RiddleSettingsDto,
  ) {
    return this.riddlesService.createChat(user.id, settings);
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
    @Body() body: { topic: string; model?: string },
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.processChatMessage(chatId, body.topic, user.id, body.model);
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
  async getChatHistory(
    @Param('chatId') chatId: string,
    @CurrentUser() user: PrismaModels.User
  ) {
    return this.riddlesService.getChatHistory(chatId, user.id);
  }

  @Public()
  @Get('chat/:chatId/riddle-messages')
  async getOnlyRiddlesFromChat(
    @Param('chatId') chatId: string,
    @CurrentUser() user: PrismaModels.User
  ) {
    return this.riddlesService.getOnlyRiddlesFromChat(chatId, user.id);
  }

  @ApiOperation({
    summary: 'Save to Collection',
    description:
      'Persistently storage a generated riddle in the database. Only available for registered users.',
  })
  @ApiResponse({ status: 201, description: 'Riddle saved to personal collection.' })
  @ApiResponse({ status: 403, description: 'Guests cannot save riddles.' })
  @Post('save/:messageId')
  async saveRiddle(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.saveToUserCollection(user.id, messageId);
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

  @Delete('chat/:chatId')
  async deleteChat(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.deleteChat(chatId, user.id);
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

  @Get(':id/hint-xp')
  async getHint(@Param('id') id: string, @CurrentUser() user: PrismaModels.User) {
    return this.riddlesService.getHintForXp(user.id, id);
  }

  @Get('chats')
  async getUserChats(@CurrentUser() user: PrismaModels.User) {
    const chats = await this.prisma.chat.findMany({
      where: { user_id: user.id },
      include: {
        messages: {
          where: { role: 'user' },
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return chats.map(chat => {
      const firstMessage = chat.messages[0]?.content || 'Нова загадка';
      return {
        id: chat.id,
        title: firstMessage,
        createdAt: chat.createdAt,
      };
    });
  }
}

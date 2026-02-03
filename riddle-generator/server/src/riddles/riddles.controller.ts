import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Query,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RiddlesService } from './riddles.service';
import { RiddleDto, RiddleSettingsDto } from './dto/riddle.dto';
import { Public } from '../utils/decorators/public.decorator';
import { CurrentUser } from '../utils/decorators/user.decorator';
import * as PrismaModels from '@prisma/client';

@Controller('riddles')
export class RiddlesController {
  constructor(private readonly riddlesService: RiddlesService) {}

  @Post('generate')
  async createGeneratedRiddle(@Body() dto: RiddleDto, @CurrentUser() user: PrismaModels.User) {
    const generatedData = await this.riddlesService.generateRiddle(dto);
    return this.riddlesService.createRiddle(user.id, generatedData);
  }

  @Post('chat/:chatId/regenerate')
  async regenerateRiddle(
    @Param('chatId') chatId: string,
    @Body() settings: RiddleSettingsDto,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.regenerateLastRiddle(chatId, settings, user.id);
  }

  @Post('chat/init')
  async initializeChat(@CurrentUser() user: PrismaModels.User) {
    return this.riddlesService.createChat(user.id);
  }

  @Post('chat/:chatId')
  async handleChat(
    @Param('chatId') chatId: string,
    @Body() dto: RiddleDto,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.processChatMessage(chatId, dto.topic, dto.settings, user.id);
  }

  @Post('chat/:chatId/reveal')
  async revealAnswer(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.revealAnswer(chatId, user.id);
  }

  @Get('chat/:chatId/history')
  async getChatHistory(@Param('chatId') chatId: string, @CurrentUser() user: PrismaModels.User) {
    return this.riddlesService.getChatHistory(chatId, user.id);
  }

  @Post('save')
  async saveRiddle(
    @Body() riddleData: { content: string; answer: string; prompt_context: any },
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.saveToUserCollection(user.id, riddleData);
  }

  @Put(':id/public')
  async togglePublic(@Param('id') riddleId: string, @CurrentUser() user: PrismaModels.User) {
    return this.riddlesService.makeRiddlePublic(user.id, riddleId);
  }

  @Get('my')
  async getMyRiddles(
    @CurrentUser() user: PrismaModels.User,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.riddlesService.getMyRiddles(user.id, Number(page), Number(limit));
  }

  @Public()
  @Get('public')
  async getPublicFeed(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.riddlesService.getPublicRiddles(Number(page), Number(limit));
  }

  @Delete(':id')
  async removeRiddle(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: PrismaModels.User,
  ) {
    await this.riddlesService.remove(id, user.id);
    return { message: 'Riddle deleted successfully' };
  }
}

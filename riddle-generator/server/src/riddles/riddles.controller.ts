import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RiddlesService } from './riddles.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import * as PrismaModels from '@prisma/client';
import { RiddleDto, RiddleSettingsDto } from './dto/riddle-settings.dto';
import { SaveRiddleDto } from './dto/riddle-persistence.dto';
import { Public } from '../utils/decorators/public.decorator';

@Controller('riddles')
export class RiddlesController {
  constructor(private readonly riddlesService: RiddlesService) {}

  @Public()
  @Post('generate')
  async createGeneratedRiddle(
    @Body() dto: RiddleDto,
  ) {
    return this.riddlesService.generateRiddle(dto);
  }

  @Public()
  @Post('chat/:chatId/regenerate')
  async regenerateRiddle(
    @Param('chatId') chatId: string,
    @Body() settings: RiddleSettingsDto,
  ) {
    return this.riddlesService.regenerateLastRiddle(chatId, settings);
  }

  @Public()
  @Post('chat/init')
  async initializeChat(@CurrentUser() user: PrismaModels.User) {
    return this.riddlesService.createChat(user.id);
  }

  @Public()
  @Post('chat/:chatId')
  async handleChat(
    @Param('chatId') chatId: string,
    @Body() dto: RiddleDto,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.processChatMessage(chatId, dto.topic, dto.settings, user.id);
  }

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

  @Post('save')
  async saveRiddle(
    @Body() riddleData: { content: string; answer: string; prompt_context: SaveRiddleDto },
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.riddlesService.saveToUserCollection(user.id, riddleData);
  }

  @Put(':id/public')
  async togglePublic(
    @Param('id') riddleId: string,
    @CurrentUser() user: PrismaModels.User
  ) {
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
}

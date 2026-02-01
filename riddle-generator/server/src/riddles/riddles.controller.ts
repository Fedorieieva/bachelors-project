import {
  Controller,
  Post,
  Body,
  Req,
  Param,
  Get,
  Put,
  Query,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RiddlesService } from './riddles.service';
import { RiddleDto } from './dto/riddle.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../utils/decorators/public.decorator';

@Controller('riddles')
export class RiddlesController {
  constructor(
    private readonly riddlesService: RiddlesService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('generate')
  async createGeneratedRiddle(
    @Body() dto: RiddleDto,
    @Req() req: any, // Тут буде req.user після AuthGuard або вашого middleware
  ) {
    const generatedData = await this.riddlesService.generateRiddle(dto);

    return this.prisma.riddles.create({
      data: {
        content: generatedData.content,
        answer: generatedData.answer,
        prompt_context: generatedData.prompt_context
          ? JSON.parse(JSON.stringify(generatedData.prompt_context))
          : null,
        author_id: req.user.id,
        is_public: false,
      },
    });
  }

  @Post('chat/init')
  async initializeChat(@Req() req: any) {
    return this.riddlesService.createChat(req.user.id);
  }

  @Post('chat/:chatId')
  async handleChat(
    @Param('chatId') chatId: string,
    @Body() chatDto: { message: string; settings: RiddleDto },
    @Req() req: any,
  ) {
    return this.riddlesService.processChatMessage(
      chatId,
      chatDto.message,
      chatDto.settings,
      req.user.id,
    );
  }

  @Get('chat/:chatId/history')
  async getChatHistory(@Param('chatId') chatId: string, @Req() req: any) {
    return this.prisma.message.findMany({
      where: {
        chat_id: chatId,
        chat: { user_id: req.user.id },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  @Post('save')
  async saveRiddle(
    @Body() riddleData: { content: string; answer: string; prompt_context: any },
    @Req() req: any,
  ) {
    return this.riddlesService.saveToUserCollection(req.user.id, riddleData);
  }

  @Put(':id/public')
  async togglePublic(@Param('id') riddleId: string, @Req() req: any) {
    return this.riddlesService.makeRiddlePublic(req.user.id, riddleId);
  }

  @Get('my')
  async getMyRiddles(
    @Req() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: { author_id: req.user.id },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prisma.riddles.count({ where: { author_id: req.user.id } }),
    ]);

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / take),
      },
    };
  }

  @Public()
  @Get('public')
  async getPublicFeed(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [items, total] = await Promise.all([
      this.prisma.riddles.findMany({
        where: {
          is_public: true,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              is_guest: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take,
      }),
      this.prisma.riddles.count({ where: { is_public: true } }),
    ]);

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / take),
      },
    };
  }

  @Delete(':id')
  async removeRiddle(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    await this.riddlesService.remove(id, req.user.id);
    return { message: 'Загадку та всі пов’язані дані успішно видалено' };
  }
}

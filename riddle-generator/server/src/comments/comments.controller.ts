import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../utils/decorators/public.decorator';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private prisma: PrismaService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post(':riddleId')
  async addComment(
    @Param('riddleId') riddleId: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    if (req.user.is_guest) {
      throw new ForbiddenException('Тільки зареєстровані користувачі можуть коментувати');
    }

    return this.prisma.$transaction(async tx => {
      const comment = await tx.comment.create({
        data: {
          content,
          user_id: req.user.id,
          riddle_id: riddleId,
        },
      });

      await tx.riddles.update({
        where: { id: riddleId },
        data: { comments_count: { increment: 1 } },
      });

      return comment;
    });
  }

  @Public()
  @Get('riddle/:riddleId')
  async getCommentsByRiddle(
    @Param('riddleId', ParseUUIDPipe) riddleId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.commentsService.findPaginated(riddleId, page, limit);
  }

  @Patch(':id')
  async updateComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    return this.commentsService.update(id, req.user.id, content);
  }

  @Delete(':id')
  async removeComment(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.commentsService.remove(id, req.user.id);
  }
}

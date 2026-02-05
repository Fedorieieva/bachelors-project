import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from '../utils/decorators/public.decorator';
import { CommentsService } from './comments.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import * as PrismaModels from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentPaginationDto, CreateCommentDto, UpdateCommentDto } from './comments.dto';


@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
  }

  @Post(':riddleId')
  @ApiOperation({ summary: 'Add a new comment to a riddle' })
  async addComment(
    @Param('riddleId', ParseUUIDPipe) riddleId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.commentsService.create(user.id, riddleId, createCommentDto.content);
  }

  @Public()
  @Get('riddle/:riddleId')
  @ApiOperation({ summary: 'Get paginated comments for a specific riddle' })
  async getCommentsByRiddle(
    @Param('riddleId', ParseUUIDPipe) riddleId: string,
    @Query() paginationDto: CommentPaginationDto,
  ) {
    const { page, limit } = paginationDto;
    return this.commentsService.findPaginated(riddleId, page, limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing comment' })
  async updateComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.commentsService.update(id, user.id, updateCommentDto.content);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  async removeComment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.commentsService.remove(id, user.id);
  }
}

import { Controller, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import * as PrismaModels from '@prisma/client';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle/:riddleId')
  async toggleLike(
    @Param('riddleId', ParseUUIDPipe) riddleId: string,
    @CurrentUser() user: PrismaModels.User,
  ) {
    return this.likesService.toggleLike(user.id, riddleId);
  }
}

import { Controller, Post, Param, Req, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle/:riddleId')
  async toggleLike(@Param('riddleId', ParseUUIDPipe) riddleId: string, @Req() req: any) {
    return this.likesService.toggleLike(req.user.id, riddleId);
  }
}

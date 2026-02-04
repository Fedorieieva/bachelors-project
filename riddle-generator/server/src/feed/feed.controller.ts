import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../utils/decorators/public.decorator';
import { FeedService } from './feed.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import * as PrismaModels from '@prisma/client';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('public')
  @Public()
  async getPublicFeed(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.feedService.getPublicFeed(Number(page), Number(limit));
  }

  @Get('saved')
  async getSaved(
    @CurrentUser() user: PrismaModels.User,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.feedService.getSavedFeed(user.id, Number(page), Number(limit));
  }

  @Get('my')
  async getMyRiddles(
    @CurrentUser() user: PrismaModels.User,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.feedService.getUserFeed(user.id, Number(page), Number(limit));
  }

  @Get('following')
  async getFollowingFeed(
    @CurrentUser() user: PrismaModels.User,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.feedService.getFollowingFeed(user.id, Number(page), Number(limit));
  }
}

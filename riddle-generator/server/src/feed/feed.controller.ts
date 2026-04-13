import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../utils/decorators/public.decorator';
import { FeedService } from './feed.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import * as PrismaModels from '@prisma/client';
import { FeedPaginationDto, FeedResponseDto, FeedRiddleItem } from './feed.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Public()
  @Get('public')
  async getPublicFeed(
    @CurrentUser() user: PrismaModels.User | undefined,
    @Query() query: FeedPaginationDto
  ): Promise<FeedResponseDto<FeedRiddleItem>> {
    return this.feedService.getPublicFeed(user?.id, query.page, query.limit);
  }

  @Get('saved')
  async getSaved(
    @CurrentUser() user: PrismaModels.User,
    @Query() query: FeedPaginationDto,
  ): Promise<FeedResponseDto<FeedRiddleItem>> {
    return this.feedService.getSavedOtherFeed(user.id, query.page, query.limit);
  }

  @Get('my-public')
  async getMyPublicRiddles(
    @CurrentUser() user: PrismaModels.User,
    @Query() query: FeedPaginationDto,
  ): Promise<FeedResponseDto<FeedRiddleItem>> {
    return this.feedService.getMyPublicFeed(user.id, query.page, query.limit);
  }

  @Get('my-private')
  async getMyPrivateRiddles(
    @CurrentUser() user: PrismaModels.User,
    @Query() query: FeedPaginationDto,
  ): Promise<FeedResponseDto<FeedRiddleItem>> {
    return this.feedService.getMyPrivateFeed(user.id, query.page, query.limit);
  }

  @Get('following')
  async getFollowingFeed(
    @CurrentUser() user: PrismaModels.User,
    @Query() query: FeedPaginationDto,
  ): Promise<FeedResponseDto<FeedRiddleItem>> {
    return this.feedService.getFollowingFeed(user.id, query.page, query.limit);
  }
}

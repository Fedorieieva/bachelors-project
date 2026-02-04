import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../utils/decorators/public.decorator';
import { FeedService } from './feed.service';
import { CurrentUser } from '../utils/decorators/user.decorator';
import * as PrismaModels from '@prisma/client';
import { FeedPaginationDto, FeedResponseDto } from './feed.dto';
import { Riddles } from '@prisma/client';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Public()
  @Get('public')
  @Public()
  async getPublicFeed(@Query() query: FeedPaginationDto): Promise<FeedResponseDto<Riddles>> {
    return this.feedService.getPublicFeed(query.page, query.limit);
  }

  @Get('saved')
  async getSaved(
    @CurrentUser() user: PrismaModels.User,
    @Query() query: FeedPaginationDto,
  ): Promise<FeedResponseDto<Riddles>> {
    return this.feedService.getSavedFeed(user.id, query.page, query.limit);
  }

  @Get('my')
  async getMyRiddles(
    @CurrentUser() user: PrismaModels.User,
    @Query() query: FeedPaginationDto,
  ): Promise<FeedResponseDto<Riddles>> {
    return this.feedService.getUserFeed(user.id, query.page, query.limit);
  }

  @Get('following')
  async getFollowingFeed(
    @CurrentUser() user: PrismaModels.User,
    @Query() query: FeedPaginationDto,
  ): Promise<FeedResponseDto<Riddles>> {
    return this.feedService.getFollowingFeed(user.id, query.page, query.limit);
  }
}

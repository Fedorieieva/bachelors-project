import { SocialService } from '@/services/social-actions/social.service';
import { FeedResponse, FeedRiddle } from '@/types/social';
import { useInfiniteScroll, PaginatedPage } from '@/hooks/infinite-scroll/useInfiniteScroll';

export type FeedType = 'public' | 'saved' | 'my-public' | 'my-private' | 'following' | 'user-public';

const FEED_LIMIT = 10;

function getFetchFn(type: FeedType, userId?: string) {
  return async (page: number): Promise<PaginatedPage<FeedRiddle>> => {
    let response: FeedResponse;

    switch (type) {
      case 'public':
        response = await SocialService.getPublicFeed(page, FEED_LIMIT);
        break;
      case 'user-public':
        response = await SocialService.getPublicFeed(page, FEED_LIMIT, userId);
        break;
      case 'saved':
        response = await SocialService.getSavedFeed(page, FEED_LIMIT, userId);
        break;
      case 'my-public':
        response = await SocialService.getMyPublicFeed(page, FEED_LIMIT);
        break;
      case 'my-private':
        response = await SocialService.getMyPrivateFeed(page, FEED_LIMIT);
        break;
      case 'following':
        response = await SocialService.getFollowingFeed(page, FEED_LIMIT);
        break;
      default:
        throw new Error(`Unsupported feed type: ${type}`);
    }

    return {
      items: response.data ?? [],
      total: response.meta?.total ?? 0,
      page: response.meta?.page ?? page,
      totalPages: response.meta?.totalPages ?? 1,
    };
  };
}

export function useFeed(type: FeedType, userId?: string) {
  return useInfiniteScroll<FeedRiddle>({
    queryKey: userId ? ['feed', type, userId] : ['feed', type],
    fetchPage: getFetchFn(type, userId),
    direction: 'down',
    staleTime: 1000 * 60 * 2,
  });
}

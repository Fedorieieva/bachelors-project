import { SocialService } from '@/services/social-actions/social.service';
import { FeedRiddle } from '@/types/social';
import { useInfiniteScroll, PaginatedPage } from '@/hooks/infinite-scroll/useInfiniteScroll';

export type FeedType = 'public' | 'saved' | 'my-public' | 'my-private' | 'following';

const FEED_LIMIT = 10;

function getFetchFn(type: FeedType) {
  return async (page: number): Promise<PaginatedPage<FeedRiddle>> => {
    let response;

    switch (type) {
      case 'public':
        response = await SocialService.getPublicFeed(page, FEED_LIMIT);
        break;
      case 'saved':
        response = await SocialService.getSavedFeed(page, FEED_LIMIT);
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
      items: response.items ?? [],
      total: response.meta?.total ?? 0,
      page: response.meta?.page ?? page,
      totalPages: response.meta?.totalPages ?? 1,
    };
  };
}

export function useFeed(type: FeedType) {
  return useInfiniteScroll<FeedRiddle>({
    queryKey: ['feed', type],
    fetchPage: getFetchFn(type),
    direction: 'down',
    staleTime: 1000 * 60 * 2,
  });
}
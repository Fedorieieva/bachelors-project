import { SocialService } from '@/services/social-actions/social.service';
import { FeedRiddle } from '@/types/social';
import { useInfiniteScroll } from '@/hooks/infinite-scroll/useInfiniteScroll';

export type FeedType = 'public' | 'saved' | 'my-public' | 'my-private' | 'following';

const FEED_LIMIT = 10;

function getFetchFn(type: FeedType) {
  return (page: number) => {
    switch (type) {
      case 'public':    return SocialService.getPublicFeed(page, FEED_LIMIT);
      case 'saved':     return SocialService.getSavedFeed(page, FEED_LIMIT);
      case 'my-public': return SocialService.getMyPublicFeed(page, FEED_LIMIT);
      case 'my-private':return SocialService.getMyPrivateFeed(page, FEED_LIMIT);
      case 'following': return SocialService.getFollowingFeed(page, FEED_LIMIT);
    }
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
import { useQuery } from '@tanstack/react-query';
import { SocialService } from '@/services/social-actions/social.service';

export type FeedType = 'public' | 'saved' | 'my-public' | 'my-private' | 'following';

export const useFeed = (type: FeedType, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['feed', type, page],
    queryFn: () => {
      switch (type) {
        case 'public': return SocialService.getPublicFeed(page, limit);
        case 'saved': return SocialService.getSavedFeed(page, limit);
        case 'my-public': return SocialService.getMyPublicFeed(page, limit);
        case 'my-private': return SocialService.getMyPrivateFeed(page, limit);
        case 'following': return SocialService.getFollowingFeed(page, limit);
      }
    },
    staleTime: 1000 * 60 * 2,
  });
};
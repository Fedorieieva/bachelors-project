import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/services/users/user.service';

export const useUserStats = (userId?: string) => {
  return useQuery({
    queryKey: ['user-stats', userId || 'me'],
    queryFn: () => userId ? UserService.getUserStats(userId) : UserService.getMyStats(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useIsFollowing = (targetUserId: string, enabled = true) => {
  return useQuery({
    queryKey: ['is-following', targetUserId],
    queryFn: () => UserService.checkIsFollowing(targetUserId),
    enabled: enabled && !!targetUserId,
    staleTime: 1000 * 30,
  });
};

export const useFollowers = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => UserService.getFollowers(userId),
    enabled: enabled && !!userId,
  });
};

export const useFollowing = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => UserService.getFollowing(userId),
    enabled: enabled && !!userId,
  });
};

export const useSocialActions = (targetUserId: string) => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    queryClient.invalidateQueries({ queryKey: ['user-stats', targetUserId] });
    queryClient.invalidateQueries({ queryKey: ['is-following', targetUserId] });
    queryClient.invalidateQueries({ queryKey: ['followers', targetUserId] });
    queryClient.invalidateQueries({ queryKey: ['following', targetUserId] });
  };

  const follow = useMutation({
    mutationFn: () => UserService.followUser(targetUserId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['is-following', targetUserId] });
      const prev = queryClient.getQueryData<{ isFollowing: boolean }>(['is-following', targetUserId]);
      queryClient.setQueryData(['is-following', targetUserId], { isFollowing: true });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev !== undefined) {
        queryClient.setQueryData(['is-following', targetUserId], ctx.prev);
      }
    },
    onSuccess: invalidateAll,
  });

  const unfollow = useMutation({
    mutationFn: () => UserService.unfollowUser(targetUserId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['is-following', targetUserId] });
      const prev = queryClient.getQueryData<{ isFollowing: boolean }>(['is-following', targetUserId]);
      queryClient.setQueryData(['is-following', targetUserId], { isFollowing: false });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev !== undefined) {
        queryClient.setQueryData(['is-following', targetUserId], ctx.prev);
      }
    },
    onSuccess: invalidateAll,
  });

  return {
    follow: follow.mutate,
    isFollowingPending: follow.isPending,
    unfollow: unfollow.mutate,
    isUnfollowingPending: unfollow.isPending,
  };
};

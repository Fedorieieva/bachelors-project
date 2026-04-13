import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/services/users/user.service';

export const useUserStats = (userId?: string) => {
  return useQuery({
    queryKey: ['user-stats', userId || 'me'],
    queryFn: () => userId ? UserService.getUserStats(userId) : UserService.getMyStats(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useSocialActions = (targetUserId: string) => {
  const queryClient = useQueryClient();

  const follow = useMutation({
    mutationFn: () => UserService.followUser(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats', targetUserId] });
    }
  });

  const unfollow = useMutation({
    mutationFn: () => UserService.unfollowUser(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats', targetUserId] });
    }
  });

  return {
    follow: follow.mutate,
    isFollowing: follow.isPending,
    unfollow: unfollow.mutate,
    isUnfollowing: unfollow.isPending
  };
};
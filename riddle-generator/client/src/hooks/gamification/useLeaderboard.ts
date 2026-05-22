import { useQuery } from '@tanstack/react-query';
import { GamificationService } from '@/services/gamification.service';
import { LeaderboardPeriod } from '@/types/gamification';

export const useLeaderboard = (period: LeaderboardPeriod, page = 1, limit = 20) =>
  useQuery({
    queryKey: ['leaderboard', period, page],
    queryFn: () => GamificationService.getLeaderboard(page, limit, period),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

export const useMyRank = (period: LeaderboardPeriod) =>
  useQuery({
    queryKey: ['myRank', period],
    queryFn: () => GamificationService.getMyRank(period),
    staleTime: 1000 * 60,
    retry: 1,
  });

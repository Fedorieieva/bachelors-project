import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChallengeService } from '@/services/challenge.service';
import { useAppSelector } from '@/store/hooks';

export function useCommunityChallenge() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return useQuery({
    queryKey: ['community-challenge'],
    queryFn: () => ChallengeService.getCurrent(),
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
}

export function useSubmitChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ challengeId, guess }: { challengeId: string; guess: string }) =>
      ChallengeService.submit(challengeId, guess),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-challenge'] });
      queryClient.invalidateQueries({ queryKey: ['challenge-history'] });
      queryClient.invalidateQueries({ queryKey: ['dailyQuests'] });
      queryClient.invalidateQueries({ queryKey: ['userStreak'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}

export function useChallengeHistory() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return useQuery({
    queryKey: ['challenge-history'],
    queryFn: () => ChallengeService.getHistory(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

import { useQuery } from '@tanstack/react-query';
import { GamificationService } from '@/services/gamification.service';

export const useUserStreak = () =>
  useQuery({
    queryKey: ['userStreak'],
    queryFn: () => GamificationService.getUserStreak(),
    staleTime: 1000 * 60,
    retry: 1,
  });

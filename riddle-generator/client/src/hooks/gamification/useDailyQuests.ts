import { useQuery } from '@tanstack/react-query';
import { GamificationService } from '@/services/gamification.service';

export const useDailyQuests = () =>
  useQuery({
    queryKey: ['dailyQuests'],
    queryFn: () => GamificationService.getDailyQuests(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

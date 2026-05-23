import { useQuery } from '@tanstack/react-query';
import { PvpService } from '@/services/pvp.service';
import { useAppSelector } from '@/store/hooks';

export function usePvpHistory() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return useQuery({
    queryKey: ['pvp-history'],
    queryFn: () => PvpService.getHistory(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

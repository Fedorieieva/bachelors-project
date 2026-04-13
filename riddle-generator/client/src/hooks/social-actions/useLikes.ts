import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SocialService } from '@/services/social-actions/social.service';


export const useLikes = () => {
  const queryClient = useQueryClient();

  const toggleLike = useMutation({
    mutationFn: (riddleId: string) => SocialService.toggleLike(riddleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    }
  });

  return { toggleLike: toggleLike.mutate };
};
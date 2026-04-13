import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SocialService } from '@/services/social-actions/social.service';

export const useRiddleVisibility = (riddleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => SocialService.togglePublic(riddleId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      return data;
    },
  });
};
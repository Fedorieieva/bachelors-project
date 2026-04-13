import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SocialService } from '@/services/social-actions/social.service';

export const useSave = () => {
  const queryClient = useQueryClient();

  const toggleSave = useMutation({
    mutationFn: (riddleId: string) => SocialService.toggleSave(riddleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    }
  });

  return { toggleSave: toggleSave.mutate };
};
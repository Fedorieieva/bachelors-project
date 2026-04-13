import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/services/users/auth.service';
import { UpdateUserDto } from '@/types/auth';

export const useOnboarding = (userId: string) => {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (data: UpdateUserDto) => AuthService.updateProfile(userId, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['current-user'], updatedUser);
    },
    onError: (error: any) => {
      console.error('Onboarding update failed:', error.response?.data?.message);
    }
  });

  const completeOnboarding = (name: string) => {
    return updateProfile.mutate({
      name,
      onboarding_completed: true
    });
  };

  return {
    updateProfile: updateProfile.mutate,
    completeOnboarding,
    isSubmitting: updateProfile.isPending,
    error: updateProfile.error
  };
};


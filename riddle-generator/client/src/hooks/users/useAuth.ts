import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { LoginDto, RegisterDto, AuthResponse } from '@/types/auth';
import { AuthService } from '@/services/users/auth.service';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { persistor } from '@/store';
import { UserProfile } from '@/types/user';
import { useGlobalToast } from '@/providers/ToastProvider';

interface ApiError {
  message: string;
}

export const useRegister = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { showGlobalToast } = useGlobalToast();

  return useMutation<AuthResponse, AxiosError<ApiError>, RegisterDto>({
    mutationFn: (data: RegisterDto) => AuthService.register(data),
    onSuccess: (response) => {
      queryClient.clear();

      dispatch(setCredentials(response.user as UserProfile));
      router.push('/social-media');
    },
    onError: () => {
      showGlobalToast('Registration failed. Please check your details.', 'error');
    }
  });
};

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { showGlobalToast } = useGlobalToast();

  return useMutation<AuthResponse, AxiosError<ApiError>, LoginDto>({
    mutationFn: (data: LoginDto) => AuthService.login(data),
    onSuccess: (response) => {
      queryClient.clear();

      dispatch(setCredentials(response.user as UserProfile));
      router.push('/social-media');
    },
    onError: () => {
      showGlobalToast('Invalid email and/or password.', 'error');
    }
  });
};

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSettled: async () => {
      dispatch(logout());
      await persistor.purge();
      sessionStorage.clear();
      queryClient.clear();
      router.push('/social-media');
    },
  });
};
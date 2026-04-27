import { useMutation, useQueryClient } from '@tanstack/react-query'; // Додано useQueryClient
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { LoginDto, RegisterDto, AuthResponse } from '@/types/auth';
import { AuthService } from '@/services/users/auth.service';
import { setCredentials } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { UserProfile } from '@/types/user';

interface ApiError {
  message: string;
}

export const useRegister = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AxiosError<ApiError>, RegisterDto>({
    mutationFn: (data: RegisterDto) => AuthService.register(data),
    onSuccess: (response) => {
      queryClient.clear();

      dispatch(setCredentials(response.user as UserProfile));
      router.push('/social-media');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Registration failed';
      console.error('Registration failed:', message);
    }
  });
};

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AxiosError<ApiError>, LoginDto>({
    mutationFn: (data: LoginDto) => AuthService.login(data),
    onSuccess: (response) => {
      queryClient.clear();

      dispatch(setCredentials(response.user as UserProfile));
      router.push('/social-media');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed';
      console.error('Login failed:', message);
    }
  });
};
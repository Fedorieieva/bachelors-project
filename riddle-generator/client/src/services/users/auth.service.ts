import { apiClient } from '@/lib/api-client';
import { AuthResponse, LoginDto, RegisterDto, UpdateUserDto } from '@/types/auth';
import { User, UserStats } from '@/types/user';

export const AuthService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getMe(): Promise<UserStats> {
    const { data } = await apiClient.get<UserStats>('/users/profile/stats');
    return data;
  },

  async updateProfile(userId: string, data: UpdateUserDto): Promise<User> {
    const response = await apiClient.put<User>(`/users/${userId}`, data);
    return response.data;
  }
};
import { apiClient } from '@/lib/api-client';
import { UpdateUserDto } from '@/types/auth';
import { FollowRecord, UserProfile, UserStats } from '@/types/user';

export const UserService = {
  async getUserById(id: string): Promise<UserProfile> {
    const { data } = await apiClient.get<UserProfile>(`/users/${id}`);
    return data;
  },

  async updateProfile(id: string, updateData: UpdateUserDto): Promise<UserProfile> {
    const { data } = await apiClient.put<UserProfile>(`/users/${id}`, updateData);
    return data;
  },

  async deleteAccount(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/users/${id}`);
    return data;
  },

  async getMyStats(): Promise<UserStats> {
    const { data } = await apiClient.get<UserStats>('/users/profile/stats');
    return data;
  },

  async getUserStats(userId: string): Promise<UserStats> {
    const { data } = await apiClient.get<UserStats>(`/users/${userId}/stats`);
    return data;
  },

  async followUser(userId: string): Promise<FollowRecord> {
    const { data } = await apiClient.post<FollowRecord>(`/users/${userId}/follow`);
    return data;
  },

  async unfollowUser(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/unfollow`);
  },

  async getFollowers(userId: string): Promise<UserProfile[]> {
    const { data } = await apiClient.get<UserProfile[]>(`/users/${userId}/followers`);
    return data;
  },

  async getFollowing(userId: string): Promise<UserProfile[]> {
    const { data } = await apiClient.get<UserProfile[]>(`/users/${userId}/following`);
    return data;
  }
};
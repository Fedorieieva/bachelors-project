import { apiClient } from '@/lib/api-client';
import { ChangePasswordDto, UpdateUserDto } from '@/types/auth';
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

  async changePassword(dto: ChangePasswordDto): Promise<{ message: string }> {
    const { data } = await apiClient.patch<{ message: string }>('/users/password', dto);
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

  async checkIsFollowing(targetUserId: string): Promise<{ isFollowing: boolean }> {
    const { data } = await apiClient.get<{ isFollowing: boolean }>(`/users/profile/is-following/${targetUserId}`);
    return data;
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
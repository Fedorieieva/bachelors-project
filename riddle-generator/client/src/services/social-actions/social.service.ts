import { apiClient } from '@/lib/api-client';
import { FeedRiddle, PaginatedResponse } from '@/types/social';

export const SocialService = {
  async toggleLike(riddleId: string): Promise<{ liked: boolean }> {
    const { data } = await apiClient.post<{ liked: boolean }>(`/likes/toggle/${riddleId}`);
    return data;
  },

  async toggleSave(riddleId: string): Promise<{ saved: boolean }> {
    const { data } = await apiClient.post<{ saved: boolean }>(`/riddles/${riddleId}/save`);
    return data;
  },

  async togglePublic(riddleId: string): Promise<{ is_public: boolean }> {
    const { data } = await apiClient.put<{ is_public: boolean }>(`/riddles/${riddleId}/public`);
    return data;
  },

  async getPublicFeed(page = 1, limit = 10): Promise<PaginatedResponse<FeedRiddle>> {
    const { data } = await apiClient.get<PaginatedResponse<FeedRiddle>>('/feed/public', {
      params: { page, limit }
    });
    return data;
  },

  async getSavedFeed(page = 1, limit = 10): Promise<PaginatedResponse<FeedRiddle>> {
    const { data } = await apiClient.get<PaginatedResponse<FeedRiddle>>('/feed/saved', {
      params: { page, limit }
    });
    return data;
  },

  async getMyPublicFeed(page = 1, limit = 10): Promise<PaginatedResponse<FeedRiddle>> {
    const { data } = await apiClient.get<PaginatedResponse<FeedRiddle>>('/feed/my-public', {
      params: { page, limit }
    });
    return data;
  },

  async getMyPrivateFeed(page = 1, limit = 10): Promise<PaginatedResponse<FeedRiddle>> {
    const { data } = await apiClient.get<PaginatedResponse<FeedRiddle>>('/feed/my-private', {
      params: { page, limit }
    });
    return data;
  },

  async getFollowingFeed(page = 1, limit = 10): Promise<PaginatedResponse<FeedRiddle>> {
    const { data } = await apiClient.get<PaginatedResponse<FeedRiddle>>('/feed/following', {
      params: { page, limit }
    });
    return data;
  }
};
import { apiClient } from '@/lib/api-client';
import { Comment, PaginatedResponse } from '@/types/social';

export const CommentService = {
  async add(riddleId: string, content: string): Promise<Comment> {
    const { data } = await apiClient.post<Comment>(`/comments/${riddleId}`, { content });
    return data;
  },

  async getByRiddle(riddleId: string, page = 1, limit = 10): Promise<PaginatedResponse<Comment>> {
    const { data } = await apiClient.get<PaginatedResponse<Comment>>(`/comments/riddle/${riddleId}`, {
      params: { page, limit }
    });
    return data;
  },

  async update(id: string, content: string): Promise<Comment> {
    const { data } = await apiClient.patch<Comment>(`/comments/${id}`, { content });
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/comments/${id}`);
  }
};
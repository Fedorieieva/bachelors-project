import { apiClient } from '@/lib/api-client';

export interface Notification {
  id: string;
  type: 'COMMENT' | 'LIKE' | 'FOLLOW' | 'LEVEL_UP' | 'XP_EARNED' | 'PROFILE_DELETED' | 'NEW_RIDDLE' | 'RIDDLE_SOLVED';
  content: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  actor?: { id: string; name: string; avatar_url: string | null } | null;
}

export const NotificationService = {
  getAll: async (limit = 30): Promise<Notification[]> => {
    const res = await apiClient.get<Notification[]>('/notifications', { params: { limit } });
    return res.data;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const res = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return res.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },

  clearAll: async (): Promise<void> => {
    await apiClient.delete('/notifications');
  },
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/services/notifications/notification.service';
import { useAppSelector } from '@/store/hooks';

const NOTIFICATIONS_KEY = ['notifications'];
const UNREAD_COUNT_KEY = ['notifications', 'unread-count'];
const POLL_INTERVAL = 30_000;

export const useNotifications = () => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => NotificationService.getAll(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
    refetchInterval: POLL_INTERVAL,
  });
};

export const useUnreadCount = () => {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return useQuery({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: () => NotificationService.getUnreadCount(),
    enabled: isAuthenticated,
    staleTime: 0,
    refetchInterval: POLL_INTERVAL,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });
};

export const useClearAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => NotificationService.clearAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });
};

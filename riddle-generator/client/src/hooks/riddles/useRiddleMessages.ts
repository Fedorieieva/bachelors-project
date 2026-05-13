import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useGlobalToast } from '@/providers/ToastProvider';
import { useTranslations } from 'next-intl';

export interface RiddleMessageItem {
  id: string;
  content: string;
  createdAt: string;
  savedRiddle: {
    id: string;
    is_public: boolean;
  } | null;
}

async function fetchRiddleMessages(chatId: string): Promise<RiddleMessageItem[]> {
  const { data } = await apiClient.get<RiddleMessageItem[]>(
    `/riddles/chat/${chatId}/riddle-messages`
  );
  return data;
}

export function useRiddleMessages(chatId?: string) {
  const queryClient = useQueryClient();
  const { showGlobalToast } = useGlobalToast();
  const t = useTranslations('toasts');

  const query = useQuery<RiddleMessageItem[], Error, RiddleMessageItem[]>({
    queryKey: ['riddle-messages', chatId],
    queryFn: () => fetchRiddleMessages(chatId!),
    enabled: !!chatId,
  });

  const saveToCollection = useMutation({
    mutationFn: (messageId: string) =>
      apiClient.post(`/riddles/save/${messageId}`).then((r) => r.data),
    onSuccess: () => {
      showGlobalToast(t('riddleSaved'), 'success');
      queryClient.invalidateQueries({ queryKey: ['riddle-messages', chatId] });
    },
    onError: () => {
      showGlobalToast(t('riddleSaveError'), 'error');
    },
  });

  const togglePublic = useMutation({
    mutationFn: (riddleId: string) =>
      apiClient.put(`/riddles/${riddleId}/public`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riddle-messages', chatId] });
    },
    onError: () => {
      showGlobalToast(t('visibilityError'), 'error');
    },
  });

  return {
    riddleMessages: (query.data ?? []) as RiddleMessageItem[],
    isLoading: query.isLoading,
    saveToCollection: saveToCollection.mutate,
    isSaving: saveToCollection.isPending,
    togglePublic: togglePublic.mutate,
    isTogglingPublic: togglePublic.isPending,
  };
}
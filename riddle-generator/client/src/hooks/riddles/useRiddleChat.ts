import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RiddleService } from '@/services/riddle.service';
import { RiddleSettings, ChatResponse } from '@/types/riddle';
import { useRouter } from 'next/navigation';
import { useGlobalToast } from '@/providers/ToastProvider';

interface SendMessageResult {
  response: ChatResponse;
  activeId: string;
}

export const useRiddleChat = (chatId?: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showGlobalToast } = useGlobalToast();

  const historyQuery = useQuery({
    queryKey: ['chat-history', chatId],
    queryFn: () => RiddleService.getChatHistory(chatId!),
    enabled: !!chatId,
    staleTime: 0,
  });

  const sendMessage = useMutation<SendMessageResult, Error, { topic: string; settings: RiddleSettings }>({
    mutationFn: async ({ topic, settings }) => {
      let activeId = chatId;

      if (!activeId) {
        const { chatId: newId } = await RiddleService.initializeChat(settings);
        activeId = newId;
        window.history.replaceState(null, '', `/chat/${activeId}`);
      }

      const response = await RiddleService.sendChatMessage(activeId, topic);
      return { response, activeId };
    },
    onSuccess: (data) => {
      const { activeId } = data;
      queryClient.invalidateQueries({ queryKey: ['chat-history', activeId] });
      queryClient.invalidateQueries({ queryKey: ['user-stats', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      if (!chatId) router.replace(`/chat/${activeId}`, { scroll: false });
    },
    onError: (error: Error) => {
      showGlobalToast(error.message || 'Помилка відправки', 'error');
    }
  });

  const regenerateMutation = useMutation<ChatResponse, Error, RiddleSettings>({
    mutationFn: async (settings: RiddleSettings) => {
      if (!chatId) throw new Error('Chat ID is required for regeneration');
      return RiddleService.regenerateRiddle(chatId, settings);
    },
    onSuccess: () => {
      showGlobalToast('Загадку успішно оновлено', 'success');
      queryClient.invalidateQueries({ queryKey: ['chat-history', chatId] });
      queryClient.invalidateQueries({ queryKey: ['user-stats', 'me'] });
    },
    onError: (error: Error) => {
      showGlobalToast(error.message || 'Не вдалося перегенерувати загадку', 'error');
    }
  });

  return {
    messages: historyQuery.data || [],
    sendGuess: (text: string, settings: RiddleSettings) =>
      sendMessage.mutate({ topic: text, settings }),
    isSending: sendMessage.isPending,
    regenerate: (settings: RiddleSettings) => regenerateMutation.mutate(settings),
    isRegenerating: regenerateMutation.isPending,
  };
};
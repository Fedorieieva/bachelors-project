import { useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { RiddleService } from '@/services/riddle.service';
import { RiddleSettings, ChatResponse, Message } from '@/types/riddle';
import { useRouter } from 'next/navigation';
import { useGlobalToast } from '@/providers/ToastProvider';
import { useMemo, useCallback } from 'react';
import { PaginatedPage } from '@/hooks/infinite-scroll/useInfiniteScroll';

const MESSAGES_LIMIT = 20;

interface SendMessageResult {
  response: ChatResponse;
  activeId: string;
}

async function fetchMessagesPage(chatId: string, page: number): Promise<PaginatedPage<Message>> {
  const messages = await RiddleService.getChatHistory(chatId, page, MESSAGES_LIMIT);
  const items = Array.isArray(messages) ? messages : [];

  return {
    items: items,
    total: items.length,
    page: page,
    totalPages: items.length < MESSAGES_LIMIT ? page : page + 1,
  };
}

export function useRiddleChat(chatId?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showGlobalToast } = useGlobalToast();

  const historyQuery = useInfiniteQuery<
    PaginatedPage<Message>,
    Error,
    InfiniteData<PaginatedPage<Message>, number>,
    [string, string],
    number
  >({
    queryKey: ['chat-history', chatId ?? ''],
    queryFn: ({ pageParam }) => fetchMessagesPage(chatId!, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: !!chatId,
    staleTime: 0,
  });

  const messages = useMemo<Message[]>(() => {
    if (!historyQuery.data) return [];
    const reversed = [...historyQuery.data.pages].reverse();
    return reversed.flatMap((page) => page.items);
  }, [historyQuery.data]);

  const loadOlderMessages = useCallback(() => {
    if (historyQuery.hasNextPage && !historyQuery.isFetchingNextPage) {
      historyQuery.fetchNextPage();
    }
  }, [historyQuery]);

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
    onSuccess: ({ activeId }) => {
      queryClient.invalidateQueries({ queryKey: ['chat-history', activeId] });
      queryClient.invalidateQueries({ queryKey: ['user-stats', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      if (!chatId) router.replace(`/chat/${activeId}`, { scroll: false });
    },
    onError: (error: Error) => {
      showGlobalToast(error.message || 'Помилка відправки', 'error');
    },
  });

  const regenerateMutation = useMutation<ChatResponse, Error, RiddleSettings>({
    mutationFn: (settings: RiddleSettings) => {
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
    },
  });

  return {
    messages,
    sendGuess: (text: string, settings: RiddleSettings) =>
      sendMessage.mutate({ topic: text, settings }),
    isSending: sendMessage.isPending,
    regenerate: (settings: RiddleSettings) => regenerateMutation.mutate(settings),
    isRegenerating: regenerateMutation.isPending,

    loadOlderMessages,
    isFetchingOlder: historyQuery.isFetchingNextPage,
    hasOlderMessages: historyQuery.hasNextPage,
  };
}
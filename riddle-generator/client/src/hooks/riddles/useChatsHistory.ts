import { apiClient } from '@/lib/api-client';
import { PaginatedPage, useInfiniteScroll } from '@/hooks/infinite-scroll/useInfiniteScroll';

export interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: string;
}

async function fetchChatsPage(page: number): Promise<PaginatedPage<ChatHistoryItem>> {
  const { data } = await apiClient.get<ChatHistoryItem[]>('/riddles/chats');

  return {
    items: data,
    total: data.length,
    page: 1,
    totalPages: 1,
  };
}

export function useChats() {
  const result = useInfiniteScroll<ChatHistoryItem>({
    queryKey: ['chats-history'],
    fetchPage: fetchChatsPage,
    direction: 'down',
    staleTime: 1000 * 60,
  });

  return {
    chats: result.items,
    isLoading: result.isLoading,
    isFetchingMore: result.isFetchingNextPage,
    hasMore: result.hasNextPage,
    loadMore: result.fetchNextPage,
    error: result.error,
  };
}
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: string;
}

export const useChats = () => {
  const [chats, setChats] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get<ChatHistoryItem[]>('/riddles/chats');
      setChats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch chats'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return { chats, isLoading, error, refetch: fetchChats };
};
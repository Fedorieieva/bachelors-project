import { apiClient } from '@/lib/api-client';
import {
  ChatResponse,
  RiddleSettings,
  Message,
  SolveResult,
  XpTransactionResponse,
  SavedRiddle,
  ToggleResponse
} from '@/types/riddle';
import { PaginatedPage } from '@/hooks/infinite-scroll/useInfiniteScroll';

export const RiddleService = {
  async initializeChat(settings: RiddleSettings): Promise<{ chatId: string }> {
    const { data } = await apiClient.post<{ chatId: string }>('/riddles/chat/init', settings);
    return data;
  },

  async sendChatMessage(
    chatId: string,
    topic: string,
  ): Promise<ChatResponse> {
    const { data } = await apiClient.post<ChatResponse>(`/riddles/chat/${chatId}`, {
      topic
    });
    return data;
  },

  async getChatHistory(
    chatId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedPage<Message>> {
    const { data } = await apiClient.get<PaginatedPage<Message>>(
      `/riddles/chat/${chatId}/history`,
      { params: { page, limit } }
    );
    return data;
  },

  async regenerateRiddle(chatId: string, settings: RiddleSettings): Promise<ChatResponse> {
    const { data } = await apiClient.post<ChatResponse>(`/riddles/chat/${chatId}/regenerate`, settings);
    return data;
  },

  async revealAnswer(chatId: string): Promise<ChatResponse> {
    const { data } = await apiClient.post<ChatResponse>(`/riddles/chat/${chatId}/reveal`);
    return data;
  },

  async solveChallenge(riddleId: string, guess: string): Promise<SolveResult> {
    const { data } = await apiClient.post<SolveResult>(`/riddles/${riddleId}/solve`, { guess });
    return data;
  },

  async buyExtraAttempt(riddleId: string): Promise<XpTransactionResponse> {
    const { data } = await apiClient.post<XpTransactionResponse>(`/riddles/${riddleId}/buy-attempt`);
    return data;
  },

  async getHintForXp(riddleId: string): Promise<XpTransactionResponse> {
    const { data } = await apiClient.get<XpTransactionResponse>(`/riddles/${riddleId}/hint-xp`);
    return data;
  },

  async saveToCollection(messageId: string): Promise<SavedRiddle> {
    const { data } = await apiClient.post<SavedRiddle>(`/riddles/save/${messageId}`);
    return data;
  },

  async deleteRiddle(riddleId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/riddles/${riddleId}`);
    return data;
  },

  async togglePublic(riddleId: string): Promise<SavedRiddle> {
    const { data } = await apiClient.put<SavedRiddle>(`/riddles/${riddleId}/public`);
    return data;
  },

  async toggleSave(riddleId: string): Promise<ToggleResponse> {
    const { data } = await apiClient.post<ToggleResponse>(`/riddles/${riddleId}/save`);
    return data;
  }
};
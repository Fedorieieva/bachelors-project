import { apiClient } from '@/lib/api-client';
import { PvpMatch, PendingRoom, GuessResult } from '@/types/pvp';

export const PvpService = {
  async getPending(): Promise<PendingRoom[]> {
    const { data } = await apiClient.get<PendingRoom[]>('/pvp/pending');
    return data;
  },

  async getMatch(matchId: string): Promise<PvpMatch> {
    const { data } = await apiClient.get<PvpMatch>(`/pvp/match/${matchId}`);
    return data;
  },

  async getHistory(): Promise<PvpMatch[]> {
    const { data } = await apiClient.get<PvpMatch[]>('/pvp/history');
    return data;
  },

  async createRoom(): Promise<{ id: string; status: string }> {
    const { data } = await apiClient.post<{ id: string; status: string }>('/pvp/create');
    return data;
  },

  async joinRoom(matchId: string): Promise<PvpMatch> {
    const { data } = await apiClient.post<PvpMatch>(`/pvp/join/${matchId}`);
    return data;
  },

  async submitGuess(matchId: string, guess: string): Promise<GuessResult> {
    const { data } = await apiClient.post<GuessResult>(`/pvp/match/${matchId}/guess`, { guess });
    return data;
  },

  async cancelMatch(matchId: string): Promise<void> {
    await apiClient.delete(`/pvp/match/${matchId}`);
  },
};

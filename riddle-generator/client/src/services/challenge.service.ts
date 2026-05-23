import { apiClient } from '@/lib/api-client';
import { CommunityChallenge, ChallengeResult, SolvedChallengeRecord } from '@/types/pvp';

export const ChallengeService = {
  async getCurrent(): Promise<CommunityChallenge | null> {
    const { data } = await apiClient.get<CommunityChallenge | null>('/challenges/current');
    return data;
  },

  async submit(challengeId: string, guess: string): Promise<ChallengeResult> {
    const { data } = await apiClient.post<ChallengeResult>(`/challenges/${challengeId}/submit`, { guess });
    return data;
  },

  async getHistory(): Promise<SolvedChallengeRecord[]> {
    const { data } = await apiClient.get<SolvedChallengeRecord[]>('/challenges/history');
    return data;
  },
};

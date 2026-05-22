import { apiClient } from '@/lib/api-client';
import { DailyQuest, LeaderboardPage, LeaderboardPeriod, UserStreak } from '@/types/gamification';

export const GamificationService = {
  async getDailyQuests(): Promise<DailyQuest[]> {
    const { data } = await apiClient.get<DailyQuest[]>('/quests/daily');
    return data;
  },

  async getUserStreak(): Promise<UserStreak> {
    const { data } = await apiClient.get<UserStreak>('/streaks/me');
    return data;
  },

  async getLeaderboard(
    page = 1,
    limit = 20,
    period: LeaderboardPeriod = 'all',
  ): Promise<LeaderboardPage> {
    const { data } = await apiClient.get<LeaderboardPage>('/leaderboard', {
      params: { page, limit, period },
    });
    return data;
  },

  async getMyRank(period: LeaderboardPeriod = 'all'): Promise<{ rank: number }> {
    const { data } = await apiClient.get<{ rank: number }>('/leaderboard/rank', {
      params: { period },
    });
    return data;
  },
};

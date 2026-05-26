export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  quest_type: string;
  target_count: number;
  xp_reward: number;
  expires_at: string;
  progress: number;
  is_completed: boolean;
  completed_at: string | null;
}

export interface UserStreak {
  streak_count: number;
  xp_multiplier: number;
  last_active_at: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak_count: number;
  riddles_solved: number;
  pvp_won_count: number;
  weekly_quests_count: number;
}

export interface LeaderboardPage {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
}

export type LeaderboardPeriod = 'all' | 'weekly';

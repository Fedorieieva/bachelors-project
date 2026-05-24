export type PvpStatus = 'PENDING' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';

export interface PvpPlayer {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

export interface PvpRiddle {
  id: string;
  content: string;
  complexity: number;
  type?: string;
  image_url?: string | null;
  /** Parsed when type === 'CROSSWORD' — content is JSON-serialised CrosswordLayout */
  layout?: import('./riddle').CrosswordLayout;
}

export interface PvpMatch {
  id: string;
  status: PvpStatus;
  creator: PvpPlayer;
  opponent: PvpPlayer | null;
  winner: Pick<PvpPlayer, 'id' | 'name'> | null;
  riddle: PvpRiddle | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface PendingRoom {
  id: string;
  created_at: string;
  creator: PvpPlayer & { level: number };
}

export interface GuessResult {
  correct: boolean;
  winnerId?: string;
  loserId?: string;
  xpEarned?: number;
}

// ─── Community Challenge ──────────────────────────────────────

export interface ChallengeTopSolver {
  id: string;
  solved_at: string;
  user: {
    id: string;
    name: string | null;
    avatar_url: string | null;
  };
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  riddle_content: string;
  riddle_type?: string;
  riddle_complexity?: number;
  xp_reward: number;
  starts_at: string;
  ends_at: string;
  solver_count: number;
  already_solved: boolean;
  top_solvers?: ChallengeTopSolver[];
}

export interface ChallengeResult {
  correct: boolean;
  xpEarned?: number;
}

// ─── Challenge History ────────────────────────────────────────

export interface SolvedChallengeRecord {
  id: string;
  solved_at: string;
  rank: number;
  challenge: {
    id: string;
    title: string;
    xp_reward: number;
    ends_at: string;
    riddle_type?: string;
  };
}

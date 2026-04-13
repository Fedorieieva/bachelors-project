export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface UserProfile extends User {
  level: number;
  xp: number;
  is_guest: boolean;
  onboarding_completed: boolean;
  created_at: string;
  avatar_url: string | null;
}

export interface UserStats {
  profile: {
    name: string | null;
    avatar_url: string | null;
    level: number;
    xp: number;
  };
  activity: {
    solvedRiddles: number;
    createdRiddles: number;
    totalLikes: number;
  };
  social: {
    followersCount: number;
    followingCount: number;
  };
  reputation: number;
}

export interface FollowRecord {
  follower_id: string;
  following_id: string;
  created_at: string;
}
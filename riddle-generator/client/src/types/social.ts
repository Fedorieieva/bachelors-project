import { SavedRiddle } from './riddle';

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  riddle_id: string;
  created_at: string;
  user: {
    id: string;
    name: string | null;
    avatar_url: string | null;
  };
}

export interface PaginationMeta {
  totalItems?: number;
  total?: number;
  itemCount?: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  page?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  riddle_id: string;
  created_at: string;
  user: {
    id: string;
    name: string | null;
    avatar_url: string | null;
  };
}

export interface FeedRiddle {
  id: string;
  content: string;
  answer: string | null;
  complexity: number;
  type: string;
  is_public: boolean;
  created_at: string;
  author: {
    id: string;
    name: string | null;
    level: number;
    avatar_url: string | null;
  };
  is_solved: boolean;
  can_attempt: boolean;
  remaining_attempts: number;
  needs_unlock: boolean;
  is_liked: boolean;
  is_saved: boolean;
  likes_count: number;
  comments_count: number;
}

export type FeedResponse = PaginatedResponse<FeedRiddle>;
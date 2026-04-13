import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FeedPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}

export interface FeedMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class FeedResponseDto<T> {
  items: T[];
  meta: FeedMetaDto;
}

export interface FeedRiddleItem {
  id: string;
  content: string;
  answer: string | null;
  complexity: number;
  type: string;
  is_public: boolean;
  created_at: Date;
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

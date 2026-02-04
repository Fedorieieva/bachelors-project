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

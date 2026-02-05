import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This riddle is very clever!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateCommentDto {
  @ApiProperty({
    description: 'The updated content of the comment',
    example: 'Actually, I think the answer is silence.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CommentPaginationDto {
  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 10;
}

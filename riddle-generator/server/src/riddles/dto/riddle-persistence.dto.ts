import { IsString, IsNotEmpty } from 'class-validator';
import { RiddleType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export interface RiddleMetadata {
  message: string;
  complexity: number;
  language: string;
  prompt_name: string;
  generation_attempts: number;
  type: RiddleType;
  style: string;
}

export class SaveRiddleDto {
  @ApiProperty({
    example: 'What has keys but no locks?',
    description: 'The riddle text',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'A piano',
    description: 'The correct answer',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({
    description: 'Technical metadata for the riddle',
    example: {
      message: 'piano',
      complexity: 2,
      language: 'english',
      type: 'classic',
      style: 'neutral',
    },
  })
  @IsNotEmpty()
  prompt_context: Record<string, unknown>;
}

export interface DeleteResponse {
  message: string;
}

export interface ToggleSaveResponse {
  saved: boolean;
}

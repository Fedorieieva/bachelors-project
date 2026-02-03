import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  ValidateNested, IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum RiddleType {
  DANETKI = 'danetki',
  CLASSIC = 'classic',
  LOGIC = 'logic',
  MATH = 'math',
}

export class RiddleSettingsDto {
  @IsOptional()
  @IsEnum(RiddleType)
  type: RiddleType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  complexity: number;

  @IsOptional()
  @IsEnum(['ukrainian', 'english', 'spanish', 'french', 'german'])
  language?: string;

  @IsOptional()
  @IsBoolean()
  is_interactive?: boolean;
}

export class RiddleDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ValidateNested()
  @Type(() => RiddleSettingsDto)
  @IsNotEmpty()
  settings: RiddleSettingsDto;
}

export interface AiRiddleResponse {
  content: string;
  answer: string;
}

export interface RiddleIntentAnalysis {
  intent: 'NEW' | 'REFINE' | 'OFF_TOPIC';
  type?: RiddleType;
  style?: string;
  topic?: string;
}

export interface EvaluationResult {
  is_good: boolean;
  reason?: string;
}

export interface AiRiddleResponse {
  content: string;
  answer: string;
}

export enum ChatResponseType {
  NEW_RIDDLE = 'NEW_RIDDLE',
  REFINE_RIDDLE = 'REFINE_RIDDLE',
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
}

export interface ChatResponseDto {
  type: ChatResponseType;
  data: {
    content: string;
    answer?: string;
    prompt_context?: Record<string, unknown>;
  };
}

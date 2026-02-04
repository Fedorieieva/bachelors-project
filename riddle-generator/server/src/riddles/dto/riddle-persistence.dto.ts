import { IsString, IsNotEmpty } from 'class-validator';
import { RiddleType } from './riddle-settings.dto';

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
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsNotEmpty()
  prompt_context: Record<string, unknown>;
}

export interface DeleteResponse {
  message: string;
}

export interface ToggleSaveResponse {
  saved: boolean;
}

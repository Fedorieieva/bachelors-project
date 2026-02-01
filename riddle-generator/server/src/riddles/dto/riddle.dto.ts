import { IsString, IsNumber, Min, Max, IsEnum, IsOptional, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum RiddleType {
  DANETKI = 'danetki',
  CLASSIC = 'classic',
  LOGIC = 'logic',
  MATH = 'math',
}

export class RiddleSettingsDto {
  @IsEnum(RiddleType)
  type: RiddleType;

  @IsNumber()
  @Min(1)
  @Max(5)
  complexity: number;

  @IsEnum(['ukrainian', 'english', 'spanish', 'french', 'german'])
  language: string;
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

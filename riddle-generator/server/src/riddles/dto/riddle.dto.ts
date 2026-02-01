import { IsString, IsNumber, Min, Max, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RiddleType {
  DANETKI = 'danetki',
  CLASSIC = 'classic',
  LOGIC = 'logic',
  MATH = 'math',
}

export class RiddleDto {
  @IsOptional()
  @IsString()
  topic?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  complexity: number;

  @IsString()
  @IsEnum(['ukrainian', 'english', 'spanish', 'french', 'german'])
  language: string;

  @ApiProperty({ enum: RiddleType, default: RiddleType.DANETKI })
  @IsEnum(RiddleType)
  @IsOptional()
  type?: RiddleType = RiddleType.DANETKI;
}

export interface AiRiddleResponse {
  content: string;
  answer: string;
}

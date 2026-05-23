import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
  Matches,
  IsArray,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RiddleType } from '@prisma/client';

export class RiddleSettingsDto {
  @ApiPropertyOptional({
    enum: RiddleType,
    example: RiddleType.LOGIC,
    description: 'The category of the riddle',
  })
  @IsOptional()
  @IsEnum(RiddleType)
  type: RiddleType;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 5,
    example: 3,
    description: 'Difficulty level from 1 to 5',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  complexity: number;

  @ApiPropertyOptional({
    example: 'english',
    description: 'Language of the generated content (deprecated — AI auto-detects from topic)',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Enables interactive hint mode',
  })
  @IsOptional()
  @IsBoolean()
  is_interactive?: boolean;

  @ApiPropertyOptional({
    example: 'gemini-2.0-flash',
    description: 'Gemini model to use for generation',
  })
  @IsOptional()
  @IsString()
  @Matches(/^gemini-[\w.-]+$/, { message: 'Invalid model name format' })
  model?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'When true, generates an illustrative image for the riddle via Pollinations.ai',
  })
  @IsOptional()
  @IsBoolean()
  generate_image?: boolean;
}

export class RiddleDto {
  @ApiProperty({ example: 'Що стоїть посеред Києва?' })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({ type: RiddleSettingsDto })
  @ValidateNested()
  @Type(() => RiddleSettingsDto)
  @IsNotEmpty()
  settings: RiddleSettingsDto;
}

export class CrosswordGenerateDto {
  @ApiProperty({ example: 'Space exploration', description: 'Theme driving word and clue selection' })
  @IsString()
  @IsNotEmpty()
  theme: string;

  @ApiPropertyOptional({
    example: ['ORBIT', 'NEBULA'],
    description: 'Words that must appear in the puzzle; AI writes their clues',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customWords?: string[];

  @ApiPropertyOptional({ example: 'english', description: 'Language for words and clues' })
  @IsOptional()
  @IsString()
  language?: string;
}

export class CrosswordSaveDto {
  @ApiProperty({ description: 'Crossword layout returned by the generate endpoint' })
  @IsNotEmpty()
  layout: Record<string, unknown>;

  @ApiProperty({ example: 'Space exploration' })
  @IsString()
  @IsNotEmpty()
  theme: string;

  @ApiPropertyOptional({ example: 'english' })
  @IsOptional()
  @IsString()
  language?: string;
}

export class CrosswordProgressDto {
  @ApiProperty({ description: 'Map of word number (as string) to the user\'s typed answer' })
  @IsObject()
  progress: Record<string, string>;
}

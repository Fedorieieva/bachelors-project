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

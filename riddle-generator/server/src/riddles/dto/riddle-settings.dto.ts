import { IsString, IsNumber, Min, Max, IsEnum, IsOptional, IsNotEmpty, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

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

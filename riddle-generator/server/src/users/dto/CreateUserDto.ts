import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength, IsBoolean, IsEmail } from 'class-validator';
import { BaseUserDto } from './BaseUser.dto';

export class CreateUserDto extends BaseUserDto {
  @ApiProperty({
    example: 'securePassword123',
    description: 'Password must be at least 6 characters',
  })
  @IsNotEmpty()
  @MinLength(6)
  declare password?: string | null;

  @ApiProperty({
    example: 'something@i.ua',
    description: 'User email',
  })
  @IsNotEmpty()
  @IsEmail()
  declare email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare name?: string;

  @ApiProperty({
    example: false,
    description: 'Onboarding completed',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  onboarding_completed?: boolean;

  @ApiProperty({
    example: false,
    description: 'is guest',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_guest?: boolean;
}

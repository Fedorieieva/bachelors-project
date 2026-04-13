import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { BaseUserDto } from './BaseUser.dto';

export class UpdateUserDto extends BaseUserDto {
  @ApiProperty({
    example: 'updated@example.com',
    required: false,
    description: 'New email (optional)',
  })
  @IsOptional()
  @IsEmail()
  declare email: string;

  @ApiProperty({
    example: 'newStrongPassword456',
    required: false,
    description: 'New password (optional)',
  })
  @IsOptional()
  @MinLength(6)
  declare password?: string;

  @ApiProperty({ example: 'Jane Doe', required: false, description: 'New name (optional)' })
  @IsOptional()
  declare name?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;
}

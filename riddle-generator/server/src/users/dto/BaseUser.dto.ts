import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', required: false, description: 'User password' })
  @IsOptional()
  @MinLength(6)
  password?: string | null;

  @ApiProperty({ example: 'John Doe', required: false, description: 'User name' })
  @IsOptional()
  name?: string;
}

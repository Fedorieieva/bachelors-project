import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { BaseUserDto } from './BaseUser.dto';

export class CreateUserDto extends BaseUserDto {
  @ApiProperty({
    example: 'securePassword123',
    description: 'Password must be at least 6 characters',
  })
  @IsNotEmpty()
  @MinLength(6)
  declare password?: string;

  @ApiProperty({
    example: 'something@i.ua',
    description: 'User email',
  })
  @IsNotEmpty()
  declare email: string;

  declare is_guest?: boolean;
}

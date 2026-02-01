import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { BaseUserDto } from '../../dto/BaseUser.dto';

export class LoginDto extends BaseUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password' })
  @IsNotEmpty()
  declare password: string;
}

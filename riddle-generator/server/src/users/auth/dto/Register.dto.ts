import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../../dto/CreateUserDto';

export class RegisterDto extends CreateUserDto {
  @ApiProperty({ example: 'John Doe', required: false, description: 'Optional user name' })
  declare name?: string;
}

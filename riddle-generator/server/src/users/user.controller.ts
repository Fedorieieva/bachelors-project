import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  ParseUUIDPipe,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { CurrentUser } from '../utils/decorators/user.decorator';
import * as PrismaModels from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID (UUID)' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID (UUID)' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID (UUID)' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.remove(id);
    return { message: `User ${id} deleted successfully` };
  }

  @Post(':id/follow')
  @ApiOperation({ summary: 'Follow user' })
  async follow(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: PrismaModels.User) {
    return this.userService.follow(user.id, id);
  }

  @Delete(':id/unfollow')
  @ApiOperation({ summary: 'Unfollow user' })
  async unfollow(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: PrismaModels.User) {
    return this.userService.unfollow(user.id, id);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Followers list' })
  async getFollowers(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getFollowers(id);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Following list' })
  async getFollowing(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getFollowing(id);
  }
}

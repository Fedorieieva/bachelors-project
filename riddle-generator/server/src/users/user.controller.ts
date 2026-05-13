import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  ParseUUIDPipe,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { ChangePasswordDto } from './dto/ChangePassword.dto';
import { CurrentUser } from '../utils/decorators/user.decorator';
import * as PrismaModels from '@prisma/client';
import { Follow, User } from '@prisma/client';
import { Public } from '../utils/decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID (UUID)' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
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
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateUserDto): Promise<User> {
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

  @Patch('password')
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password or guest user' })
  async changePassword(
    @CurrentUser() user: PrismaModels.User,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.userService.changePassword(user.id, dto.currentPassword, dto.newPassword);
    return { message: 'Password changed successfully' };
  }

  @Post(':id/follow')
  @ApiOperation({ summary: 'Follow user' })
  async follow(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: PrismaModels.User,
  ): Promise<Follow> {
    return this.userService.follow(user.id, id);
  }

  @Delete(':id/unfollow')
  @ApiOperation({ summary: 'Unfollow user' })
  async unfollow(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: PrismaModels.User,
  ): Promise<void> {
    return this.userService.unfollow(user.id, id);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Followers list' })
  async getFollowers(@Param('id', ParseUUIDPipe) id: string): Promise<User[]> {
    return this.userService.getFollowers(id);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Following list' })
  async getFollowing(@Param('id', ParseUUIDPipe) id: string): Promise<User[]> {
    return this.userService.getFollowing(id);
  }

  @Get('profile/stats')
  async getMyStats(@CurrentUser() user: PrismaModels.User) {
    return this.userService.getUserStats(user.id);
  }

  @Get('profile/is-following/:targetId')
  async checkIsFollowing(
    @Param('targetId', ParseUUIDPipe) targetId: string,
    @CurrentUser() user: PrismaModels.User,
  ): Promise<{ isFollowing: boolean }> {
    const isFollowing = await this.userService.isFollowing(user.id, targetId);
    return { isFollowing };
  }

  @Public()
  @Get(':id/stats')
  async getUserStats(@Param('id', ParseUUIDPipe) userId: string) {
    return this.userService.getUserStats(userId);
  }
}

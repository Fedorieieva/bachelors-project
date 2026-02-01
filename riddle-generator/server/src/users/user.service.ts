import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User, Follow } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUserOnly(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: createUserDto });
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw e;
    }
  }

  async remove(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw e;
    }
  }

  async follow(followerId: string, followingId: string): Promise<Follow> {
    if (followerId === followingId) {
      throw new BadRequestException('Ви не можете підписатися на самого себе');
    }

    return this.prisma.follow.create({
      data: {
        follower_id: followerId,
        following_id: followingId,
      },
    });
  }

  async unfollow(followerId: string, followingId: string): Promise<Follow> {
    try {
      return await this.prisma.follow.delete({
        where: {
          follower_id_following_id: {
            follower_id: followerId,
            following_id: followingId,
          },
        },
      });
    } catch (e) {
      throw new NotFoundException('Підписку не знайдено');
    }
  }

  async getFollowers(userId: string): Promise<User[]> {
    const follows = await this.prisma.follow.findMany({
      where: { following_id: userId },
      include: { follower: true },
    });
    return follows.map(f => f.follower);
  }

  async getFollowing(userId: string): Promise<User[]> {
    const follows = await this.prisma.follow.findMany({
      where: { follower_id: userId },
      include: { following: true },
    });
    return follows.map(f => f.following);
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class UserProfileStatsDto {
  @ApiProperty({ example: 'John Doe' })
  name: string | null;

  @ApiProperty({ example: 5 })
  level: number;

  @ApiProperty({ example: 2450 })
  xp: number;
}

export class UserActivityStatsDto {
  @ApiProperty({ example: 12 })
  solvedRiddles: number;

  @ApiProperty({ example: 5 })
  createdRiddles: number;

  @ApiProperty({ example: 120 })
  totalLikes: number;
}

export class UserSocialStatsDto {
  @ApiProperty({ example: 45 })
  followersCount: number;

  @ApiProperty({ example: 30 })
  followingCount: number;
}

export class UserStatsResponseDto {
  @ApiProperty()
  profile: UserProfileStatsDto;

  @ApiProperty()
  activity: UserActivityStatsDto;

  @ApiProperty()
  social: UserSocialStatsDto;

  @ApiProperty({ example: 4.8, description: 'User rating based on activity and likes' })
  reputation: number;
}

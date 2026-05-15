export type AvatarSize = 'sm' | 'md' | 'lg';
export type BadgeType = 'xp' | 'level';
export type BadgePosition = 'left' | 'right';

export interface AvatarProps {
  userName: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  badge?: {
    type: 'xp' | 'level';
    value: number;
    position?: 'left' | 'right';
  };
  priority?: boolean;
  className?: string;
}
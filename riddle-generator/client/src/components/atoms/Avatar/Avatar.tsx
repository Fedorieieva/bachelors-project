import React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '../Typography/Typography';
import { AvatarProps } from './Avatar.types';
import styles from './Avatar.module.scss';

export const Avatar: React.FC<AvatarProps> = ({
  userName,
  avatarUrl,
  size = 'md',
  badge,
  className,
}) => {
  const firstLetter = userName.charAt(0);

  const badgeSizeClass = {
    sm: styles.badgeSm,
    md: styles.badgeMd,
    lg: styles.badgeLg,
  }[size];

  return (
    <div className={cn(styles.avatarWrapper, styles[size], className)}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={userName} />
      ) : (
        <span className={styles.initials}>{firstLetter}</span>
      )}

      {badge && (
        <div
          className={cn(
            styles.badge,
            styles[badge.type],
            badgeSizeClass,
            styles[badge.position || 'right']
          )}
        >
          <Typography
            variant="details"
            className="font-semibold leading-none"
            style={{ fontSize: size === 'sm' ? '10px' : '12px' }}
          >
            {badge.type === 'xp' ? `XP ${badge.value}` : `Level ${badge.value}`}
          </Typography>
        </div>
      )}
    </div>
  );
};
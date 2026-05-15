import React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '../Typography/Typography';
import { AvatarProps } from './Avatar.types';
import styles from './Avatar.module.scss';

function optimizeCloudinaryUrl(url: string): string {
  if (!url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_140,h_140,c_fill,g_face,f_auto,q_auto/');
}

export const Avatar: React.FC<AvatarProps> = ({
  userName,
  avatarUrl,
  size = 'md',
  badge,
  priority = false,
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
        <img
          src={optimizeCloudinaryUrl(avatarUrl)}
          alt={userName}
          fetchPriority={priority ? 'high' : 'auto'}
        />
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
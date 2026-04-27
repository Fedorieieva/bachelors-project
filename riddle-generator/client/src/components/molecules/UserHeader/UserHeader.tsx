"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/atoms/Typography/Typography';
import styles from './UserHeader.module.scss';

type UserHeaderSize = 'xs' | 'sm' | 'md' | 'lg';

interface UserHeaderProps {
  userId: string;
  userName: string;
  avatarUrl?: string | null;
  size?: UserHeaderSize;
  className?: string;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  userId,
  userName,
  avatarUrl,
  size = 'md',
  className,
}) => {
  const getNameVariant = () => {
    switch (size) {
      case 'xs': return 'details';
      case 'sm': return 'caption';
      case 'md': return 'input-secondary';
      case 'lg': return 'h3';
      default: return 'input-secondary';
    }
  };

  return (
    <Link
      href={`/profile/${userId}`}
      className={cn(styles.header, styles[size], className)}
    >
      <div className={styles.avatarWrapper}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${userName}'s avatar`}
            className={styles.avatar}
          />
        ) : (
          <div className={cn(styles.avatar, styles.placeholder)}>
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className={styles.info}>
        <Typography variant={getNameVariant()} className={styles.name}>
          {userName}
        </Typography>
      </div>
    </Link>
  );
};
"use client";

import React from 'react';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { useTranslations } from 'next-intl';
import styles from './ProfileStats.module.scss';

interface ProfileStatsProps {
  userName: string;
  avatarUrl?: string | null;
  level: number;
  xp: number;
  followers: number;
  following: number;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  isLoading?: boolean;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  userName,
  avatarUrl,
  level,
  xp,
  followers,
  following,
  isOwnProfile = false,
  isFollowing = false,
  onFollowToggle,
  isLoading = false,
  onFollowersClick,
  onFollowingClick,
}) => {
  const t = useTranslations('profileStats');
  const XP_PER_LEVEL = 500;
  const currentLevelXp = xp % XP_PER_LEVEL;
  const xpPercentage = Math.min((currentLevelXp / XP_PER_LEVEL) * 100, 100);

  return (
    <div className={styles.container}>
      <div className={styles.avatarSection}>
        <Avatar
          userName={userName}
          avatarUrl={avatarUrl}
          size="lg"
          badge={{ type: 'level', value: level, position: 'right' }}
        />
      </div>

      <div className={styles.socialStats}>
        <button
          className={styles.statItem}
          onClick={onFollowersClick}
          disabled={!onFollowersClick}
        >
          <Typography variant="body" className="font-semibold text-white">{followers}</Typography>
          <Typography variant="details" className="text-white/60">{t('followers')}</Typography>
        </button>
        <button
          className={styles.statItem}
          onClick={onFollowingClick}
          disabled={!onFollowingClick}
        >
          <Typography variant="body" className="font-semibold text-white">{following}</Typography>
          <Typography variant="details" className="text-white/60">{t('following')}</Typography>
        </button>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.xpLabelWrapper}>
          <div
            className={styles.xpBadgeContainer}
            style={{ left: `${xpPercentage}%` }}
          >
            <Typography variant="details" className={styles.xpBadge}>{xp}</Typography>
          </div>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.fill} style={{ width: `${xpPercentage}%` }} />
        </div>

        {!isOwnProfile && (
          <div className={styles.actionWrapper}>
            <Button
              variant={isFollowing ? 'colored-glass-inactive' : 'primary-glow'}
              size="full"
              onClick={onFollowToggle}
              isLoading={isLoading}
              className={styles.followBtn}
            >
              {isFollowing ? t('unfollow') : t('follow')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
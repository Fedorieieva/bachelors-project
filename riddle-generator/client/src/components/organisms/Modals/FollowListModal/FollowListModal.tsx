"use client";

import React from 'react';
import Link from 'next/link';
import { Modal } from '@/components/atoms/Modal/Modal';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import { Button } from '@/components/atoms/Button/Button';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Preloader } from '@/components/atoms/Preloader/Preloader';
import { useFollowers, useFollowing, useIsFollowing, useSocialActions } from '@/hooks/users/useUser';
import { useAppSelector } from '@/store/hooks';
import { UserProfile } from '@/types/user';
import { useTranslations } from 'next-intl';
import styles from './FollowListModal.module.scss';

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'followers' | 'following';
  userId: string;
}

interface UserRowProps {
  user: UserProfile;
  currentUserId: string | undefined;
  isAuthenticated: boolean;
  initialIsFollowing?: boolean;
}

const UserRow: React.FC<UserRowProps> = ({ user, currentUserId, isAuthenticated, initialIsFollowing }) => {
  const t = useTranslations('followListModal');
  const isSelf = currentUserId === user.id;
  const isOtherUser = !isSelf;
  const { data: followData, isLoading: checkLoading } = useIsFollowing(
    user.id,
    isAuthenticated && isOtherUser && initialIsFollowing === undefined,
  );

  const isFollowingUser = initialIsFollowing === undefined ? (followData?.isFollowing ?? false) : initialIsFollowing;
  const { follow, unfollow, isFollowingPending, isUnfollowingPending } = useSocialActions(user.id);

  const handleToggle = () => {
    if (isFollowingUser) {
      unfollow();
    } else {
      follow();
    }
  };

  return (
    <div className={styles.userRow}>
      <Link href={`/profile/${user.id}`} className={styles.userInfo}>
        <Avatar
          userName={user.name || t('anonymous')}
          avatarUrl={user.avatar_url}
          size="sm"
        />
        <Typography variant="body" className={styles.userName}>
          {user.name || t('anonymous')}
        </Typography>
      </Link>

      {isAuthenticated && isOtherUser && (
        <Button
          variant={isFollowingUser ? 'colored-glass-inactive' : 'primary-glow'}
          size="auto"
          onClick={handleToggle}
          isLoading={isFollowingPending || isUnfollowingPending || checkLoading}
          className={styles.followBtn}
        >
          {isFollowingUser ? t('unfollow') : t('follow')}
        </Button>
      )}
    </div>
  );
};

export const FollowListModal: React.FC<FollowListModalProps> = ({
  isOpen,
  onClose,
  type,
  userId,
}) => {
  const t = useTranslations('followListModal');
  const { user: currentUser, isAuthenticated } = useAppSelector((state) => state.auth);
  const isOwnProfile = currentUser?.id === userId;

  const { data: followers, isLoading: loadingFollowers } = useFollowers(userId, isOpen && type === 'followers');
  const { data: following, isLoading: loadingFollowing } = useFollowing(userId, isOpen && type === 'following');

  const list: UserProfile[] = type === 'followers' ? (followers ?? []) : (following ?? []);
  const isLoading = type === 'followers' ? loadingFollowers : loadingFollowing;

  const title = type === 'followers' ? t('followers') : t('following');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className={styles.modal}>
      <div className={styles.container}>
        {isLoading && <Preloader />}

        {!isLoading && list.length === 0 && (
          <Typography variant="body" className={styles.empty}>
            {type === 'followers' ? t('noFollowers') : t('notFollowing')}
          </Typography>
        )}

        {!isLoading && list.length > 0 && (
          <div className={styles.list}>
            {list.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                currentUserId={currentUser?.id}
                isAuthenticated={isAuthenticated}
                // When viewing own following list, all entries are already followed
                initialIsFollowing={type === 'following' && isOwnProfile ? true : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

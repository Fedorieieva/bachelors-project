"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useUserStats, useSocialActions, useIsFollowing } from '@/hooks/users/useUser';
import { useAppSelector } from '@/store/hooks';
import { ProfileStats } from '@/components/organisms/ProfileStats/ProfileStats';
import { FeedList } from '@/components/organisms/FeedList/FeedList';
import { Button } from '@/components/atoms/Button/Button';
import { Preloader } from '@/components/atoms/Preloader/Preloader';
import { FollowListModal } from '@/components/organisms/Modals/FollowListModal/FollowListModal';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import styles from './ProfilePage.module.scss';
import { FeedType } from '@/hooks/social-actions/useFeed';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const { id } = useParams<{ id: string }>();
  const { data: stats, isLoading } = useUserStats(id);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const isMyProfile = isAuthenticated && user?.id === id;
  const shouldShowFollowButton = isAuthenticated && !isMyProfile;

  const { data: followData } = useIsFollowing(id, shouldShowFollowButton);
  const isFollowingUser = followData?.isFollowing ?? false;

  const { follow, unfollow, isFollowingPending, isUnfollowingPending } = useSocialActions(id);

  const [activeTab, setActiveTab] = useState<FeedType>('my-public');
  const [followModal, setFollowModal] = useState<'followers' | 'following' | null>(null);

  if (isLoading || !stats) return <Preloader />;

  return (
    <div className={cn(styles.page, { [styles.myProfile]: isMyProfile })}>
      <ProfileStats
        userName={stats.profile.name || 'Anonymous'}
        avatarUrl={stats.profile.avatar_url}
        level={stats.profile.level}
        xp={stats.profile.xp}
        followers={stats.social.followersCount}
        following={stats.social.followingCount}
        isOwnProfile={!shouldShowFollowButton}
        isFollowing={isFollowingUser}
        onFollowToggle={() => isFollowingUser ? unfollow() : follow()}
        isLoading={isFollowingPending || isUnfollowingPending}
        onFollowersClick={() => setFollowModal('followers')}
        onFollowingClick={() => setFollowModal('following')}
      />

      <div className={styles.feedWrapper}>
        <div className={styles.tabs}>
          <Button
            variant={activeTab === 'my-public' ? 'simple-tab' : 'simple'}
            onClick={() => setActiveTab('my-public')}
          >
            {t('posted')}
          </Button>

          {isMyProfile && (
            <Button
              variant={activeTab === 'my-private' ? 'simple-tab' : 'simple'}
              onClick={() => setActiveTab('my-private')}
            >
              {t('private')}
            </Button>
          )}

          <Button
            variant={activeTab === 'saved' ? 'simple-tab' : 'simple'}
            onClick={() => setActiveTab('saved')}
          >
            {t('saved')}
          </Button>
        </div>
        <FeedList type={activeTab} />
      </div>

      <FollowListModal
        isOpen={followModal !== null}
        onClose={() => setFollowModal(null)}
        type={followModal ?? 'followers'}
        userId={id}
      />
    </div>
  );
}

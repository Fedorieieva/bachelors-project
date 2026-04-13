"use client";

import React, { useState, use } from 'react'; // Додано use для розгортання params
import { useParams } from 'next/navigation';
import { useUserStats, useSocialActions } from '@/hooks/users/useUser'; // Додано хук дій
import { useAppSelector } from '@/store/hooks';
import { ProfileStats } from '@/components/organisms/ProfileStats/ProfileStats';
import { FeedList } from '@/components/organisms/FeedList/FeedList';
import { Button } from '@/components/atoms/Button/Button';
import { Preloader } from '@/components/atoms/Preloader/Preloader';
import { cn } from '@/lib/utils';
import styles from './ProfilePage.module.scss';
import { FeedType } from '@/hooks/social-actions/useFeed';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: stats, isLoading } = useUserStats(id);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Логіка підписки
  const { follow, unfollow, isFollowing, isUnfollowing } = useSocialActions(id);

  const [activeTab, setActiveTab] = useState<FeedType>('my-public');

  if (isLoading || !stats) return <Preloader />;

  const isMyProfile = isAuthenticated && user?.id === id;
  const shouldShowFollowButton = isAuthenticated && !isMyProfile;

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
        isFollowing={stats.social.isFollowing}
        onFollowToggle={() => stats.social.isFollowing ? unfollow() : follow()}
        isLoading={isFollowing || isUnfollowing}
      />

      <div className={styles.feedWrapper}>
        <div className={styles.tabs}>
          <Button
            variant={activeTab === 'my-public' ? 'simple-tab' : 'simple'}
            onClick={() => setActiveTab('my-public')}
          >
            Posted
          </Button>

          {isMyProfile && (
            <Button
              variant={activeTab === 'my-private' ? 'simple-tab' : 'simple'}
              onClick={() => setActiveTab('my-private')}
            >
              Private
            </Button>
          )}

          <Button
            variant={activeTab === 'saved' ? 'simple-tab' : 'simple'}
            onClick={() => setActiveTab('saved')}
          >
            Saved
          </Button>
        </div>
        <FeedList type={activeTab} />
      </div>
    </div>
  );
}
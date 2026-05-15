"use client";

import React from 'react';
import styles from './FeedList.module.scss';
import { FeedType, useFeed } from '@/hooks/social-actions/useFeed';
import { RiddleCard } from '@/components/molecules/Riddle/RiddleCard/RiddleCard';
import { FeedRiddle } from '@/types/social';
import { Preloader } from '@/components/atoms/Preloader/Preloader';
import { Typography } from '@/components/atoms/Typography';
import { InfiniteScrollList } from '@/components/organisms/InfiniteScrollList/InfiniteScrollList';
import { useTranslations } from 'next-intl';

interface FeedListProps {
  type: FeedType;
  userId?: string;
}

export const FeedList: React.FC<FeedListProps> = ({ type, userId }) => {
  const t = useTranslations('feedList');
  const { items, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useFeed(type, userId);

  if (error) {
    return (
      <div className="py-10 text-center">
        <Typography variant="details-error">{t('loadError')}</Typography>
      </div>
    );
  }

  return (
    <InfiniteScrollList<FeedRiddle>
      items={items}
      isLoading={isLoading}
      isFetchingMore={isFetchingNextPage}
      hasMore={hasNextPage}
      onLoadMore={fetchNextPage}
      direction="down"
      className={styles.feedContainer}
      renderItem={(riddle) => (
        <RiddleCard
          id={riddle.id}
          userId={riddle.author.id}
          userName={riddle.author.name || 'Anonymous'}
          avatarUrl={riddle.author.avatar_url}
          content={riddle.content}
          complexity={riddle.complexity}
          type={riddle.type}
          likesCount={riddle.likes_count}
          commentsCount={riddle.comments_count}
          isLiked={riddle.is_liked}
          isSaved={riddle.is_saved}
          isSolved={riddle.is_solved}
          isPublic={riddle.is_public}
          canAttempt={riddle.can_attempt}
        />
      )}
      renderEmpty={() => (
        <div className="py-20 text-center w-full">
          <Typography variant="details">{t('empty')}</Typography>
        </div>
      )}
      renderLoader={() => (
        <div className="py-4 flex justify-center">
          <Preloader />
        </div>
      )}
    />
  );
};
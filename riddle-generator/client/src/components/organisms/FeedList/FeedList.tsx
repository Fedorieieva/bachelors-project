"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FeedList.module.scss';
import { FeedType, useFeed } from '@/hooks/social-actions/useFeed';
import { RiddleCard } from '@/components/molecules/Riddle/RiddleCard/RiddleCard';
import { FeedRiddle } from '@/types/social';
import { Preloader } from '@/components/atoms/Preloader/Preloader';
import { Typography } from '@/components/atoms/Typography';

interface FeedListProps {
  type: FeedType;
}

export const FeedList: React.FC<FeedListProps> = ({ type }) => {
  const { data, isLoading, error } = useFeed(type);

  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <Typography variant='details-error'>Помилка завантаження стрічки</Typography>
      </div>
    );
  }

  const items = data?.items || [];

  return (
    <div className={styles.feedContainer}>
      <AnimatePresence mode='popLayout'>
        {items.length > 0 ? (
          items.map((riddle: FeedRiddle) => (
            <motion.div
              key={riddle.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: -100,
                transition: { duration: 0.3, ease: 'easeInOut' }
              }}
              className="w-full"
            >
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
            </motion.div>
          ))
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="py-20 text-center w-full"
          >
            <Typography variant='details'>
              Загадок поки немає у цій категорії
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
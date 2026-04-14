"use client";

import React from 'react';
import { CommentItem } from '@/components/molecules/CommentItem/CommentItem';
import { Button } from '@/components/atoms/Button/Button';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Preloader } from '@/components/atoms/Preloader/Preloader';
import { Comment } from '@/types/social';
import styles from './CommentSection.module.scss';
import { InfiniteScrollList } from '@/components/organisms/InfiniteScrollList/InfiniteScrollList';

interface CommentSectionProps {
  riddleId: string;
  comments: Comment[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onAddClick: () => void;
  onEditClick: (comment: Comment) => void;
  onDeleteClick: (id: string) => void;
  currentUserId?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
  currentUserId,
  onAddClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h3">Comments</Typography>
        <Button variant="grey-glass-link" onClick={onAddClick}>
          + Add comment
        </Button>
      </div>

      <InfiniteScrollList<Comment>
        items={comments}
        isLoading={isLoading}
        isFetchingMore={isFetchingMore}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        direction="down"
        className={styles.list}
        renderItem={(comment) => (
          <CommentItem
            id={comment.id}
            userId={comment.user_id}
            currentUserId={currentUserId}
            userName={comment.user.name || 'Anonymous'}
            avatarUrl={comment.user.avatar_url}
            content={comment.content}
            createdAt={comment.created_at}
            onEdit={() => onEditClick(comment)}
            onDelete={() => onDeleteClick(comment.id)}
          />
        )}
        renderEmpty={() => (
          <Typography variant="body" className={styles.empty}>
            No comments yet. Be the first to comment!
          </Typography>
        )}
        renderLoader={() => (
          <div className={styles.loading}>
            <Preloader />
          </div>
        )}
      />
    </div>
  );
};
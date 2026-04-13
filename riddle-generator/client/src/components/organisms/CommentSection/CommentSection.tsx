"use client";

import React from 'react';
import { CommentItem } from '@/components/molecules/CommentItem/CommentItem';
import { Button } from '@/components/atoms/Button/Button';
import { Typography } from '@/components/atoms/Typography/Typography';
import styles from './CommentSection.module.scss';

// Використовуємо інтерфейс, що відповідає даним з бекенду та social.ts
interface Comment {
  id: string;
  user: {
    id: string;
    name: string | null;
    avatar_url: string | null;
  };
  user_id: string; // Потрібно для перевірки власності коментаря
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  comments: Comment[];
  isLoading?: boolean;
  onAddClick: () => void;
  onEditClick: (comment: Comment) => void; // Додано
  onDeleteClick: (id: string) => void;      // Додано
  currentUserId?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  isLoading,
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

      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.loading}>Loading comments...</div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
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
          ))
        ) : (
          <Typography variant="body" className={styles.empty}>
            No comments yet. Be the first to comment!
          </Typography>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { Typography } from '@/components/atoms/Typography/Typography';
import { UserHeader } from '@/components/molecules/UserHeader/UserHeader';
import { Button } from '@/components/atoms/Button/Button';
import { formatDate } from '@/lib/formatters';
import PencilIcon from '@/assets/pencil-icon.svg';
import TrashIcon from '@/assets/trash-icon.svg';
import styles from './CommentItem.module.scss';

interface CommentItemProps {
  userName: string;
  userId: string;
  currentUserId?: string;
  avatarUrl?: string | null;
  content: string;
  createdAt: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  userName,
  userId,
  currentUserId,
  avatarUrl,
  content,
  createdAt,
  onEdit,
  onDelete,
}) => {
  const isOwnComment = userId === currentUserId;

  return (
    <div className={styles.comment}>
      <div className={styles.threadLine} />
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <UserHeader userId={userId} userName={userName} avatarUrl={avatarUrl} size="xs" />
          <div className={styles.rightHeader}>
            {isOwnComment && (
              <div className={styles.actions}>
                <Button variant="icon-only" onClick={onEdit} className={styles.actionBtn}>
                  <PencilIcon className={styles.editIcon} />
                </Button>
                <Button variant="icon-only" onClick={onDelete} className={styles.actionBtn}>
                  <TrashIcon className={styles.deleteIcon} />
                </Button>
              </div>
            )}
            <Typography variant="details" className={styles.date}>
              {formatDate(createdAt)}
            </Typography>
          </div>
        </div>
        <div className={styles.textBody}>
          <Typography variant="caption">{content}</Typography>
        </div>
      </div>
    </div>
  );
};
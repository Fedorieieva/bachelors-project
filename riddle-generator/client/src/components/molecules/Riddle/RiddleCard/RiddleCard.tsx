'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { useAppSelector } from '@/store/hooks';
import { useLikes } from '@/hooks/social-actions/useLikes';
import { useSave } from '@/hooks/social-actions/useSave';
import { useComments } from '@/hooks/social-actions/useComments';
import { CommentModal } from '@/components/organisms/Modals/CommentModal/CommentModal';
import { GuessModal } from '@/components/organisms/Modals/GuessModal/GuessModal';
import styles from './RiddleCard.module.scss';

import HeartIcon from '@/assets/heart-icon.svg';
import CommentIcon from '@/assets/comment-icon.svg';
import SaveIcon from '@/assets/save-icon.svg';
import PuzzleIcon from '@/assets/puzzle-icon.svg';
import SolvedIcon from '@/assets/check-icon.svg';
import LockIcon from '@/assets/lock-icon.svg';
import FlameIcon from '@/assets/flame-icon.svg';
import ZapIcon from '@/assets/zap-icon.svg';
import SproutIcon from '@/assets/sprout-icon.svg';
import TrashIcon from '@/assets/trash-icon.svg';

import { RiddleStatus, RiddleStatusModal } from '@/components/organisms/Modals/RiddleStatusModal/RiddleStatusModal';
import { useSolveRiddle, useRiddleEconomy, useDeleteRiddle } from '@/hooks/riddles/useRiddleActions';
import { UserHeader } from '@/components/molecules/UserHeader/UserHeader';
import { Badge, BadgeVariant } from '@/components/atoms/Badge/Badge';
import { RiddleBody } from '@/components/molecules/Riddle/RiddleBody/RiddleBody';
import { CommentSection } from '@/components/organisms/CommentSection/CommentSection';
import { useGlobalToast } from '@/providers/ToastProvider';
import { useTranslations } from 'next-intl';
import { ConfirmModal } from '@/components/organisms/Modals/ConfirmModal/ConfirmModal';
import { useRiddleVisibility } from '@/hooks/social-actions/useRiddleVisibility';
import { VisibilityToggle } from '../../VisibilityToggle/VisibilityToggle';
import { SolveResult } from '@/types/riddle';

interface RiddleCardProps {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string | null;
  content: string;
  complexity: number;
  type: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isSolved?: boolean;
  isPublic?: boolean;
  canAttempt?: boolean;
  className?: string;
}

const getComplexityConfig = (level: number): { variant: BadgeVariant; icon: React.ReactNode } => {
  if (level >= 4) return { variant: 'error', icon: <FlameIcon /> };
  if (level === 3) return { variant: 'warning', icon: <ZapIcon /> };
  return { variant: 'success', icon: <SproutIcon /> };
};

export const RiddleCard: React.FC<RiddleCardProps> = ({
  id,
  userId,
  userName,
  avatarUrl,
  content,
  complexity,
  type,
  likesCount: initialLikesCount = 0,
  commentsCount: initialCommentsCount = 0,
  isLiked: initialIsLiked = false,
  isSaved: initialIsSaved = false,
  isSolved: initialIsSolved = false,
  isPublic: initialIsPublic = false,
  canAttempt: initialCanAttempt = true,
  className,
}) => {
  const t = useTranslations('riddleCard');
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { mutate: toggleVisibility, isPending: isChangingVisibility } = useRiddleVisibility(id);
  const { toggleLike } = useLikes();
  const { toggleSave } = useSave();
  const {
    comments,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    totalComments,
    addComment,
    isSubmitting,
    updateComment,
    deleteComment,
  } = useComments(id);
  const { solveRiddle, isSolving } = useSolveRiddle(id);
  const { buyAttempt } = useRiddleEconomy(id);
  const { showGlobalToast } = useGlobalToast();
  const { deleteRiddle, isDeleting } = useDeleteRiddle();

  const [isPublicLocal, setIsPublicLocal] = useState(initialIsPublic);
  const [liked, setLiked] = useState(initialIsLiked);
  const [saved, setSaved] = useState(initialIsSaved);
  const [localLikesCount, setLocalLikesCount] = useState(initialLikesCount);
  const [showComments, setShowComments] = useState(false);
  const [editingComment, setEditingComment] = useState<{ id: string; content: string } | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const [solved, setSolved] = useState(initialIsSolved);
  const [canAttemptLocal, setCanAttemptLocal] = useState(initialCanAttempt);
  const [hasBoughtRetry, setHasBoughtRetry] = useState(false);

  const [isDeleteRiddleModalOpen, setIsDeleteRiddleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    status: RiddleStatus;
    correctAnswer?: string;
    attemptsRemaining?: number;
    xpEarned?: number;
  }>({
    isOpen: false,
    status: 'correct',
  });

  useEffect(() => {
    setLiked(initialIsLiked);
    setSaved(initialIsSaved);
    setLocalLikesCount(initialLikesCount);
    setSolved(initialIsSolved);
    setIsPublicLocal(initialIsPublic);
    setCanAttemptLocal(initialCanAttempt);
  }, [initialIsLiked, initialIsSaved, initialLikesCount, initialIsSolved, initialIsPublic, initialCanAttempt]);

  const hasCompletedOnboarding = !!(isAuthenticated && user?.onboarding_completed);
  const canInteract = hasCompletedOnboarding;
  const isOwnPost = user?.id === userId;
  const complexityConfig = getComplexityConfig(complexity);

  const displayCommentsCount = totalComments > 0 ? totalComments : initialCommentsCount;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canInteract) return;
    const newLiked = !liked;
    setLiked(newLiked);
    setLocalLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    toggleLike(id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canInteract || isOwnPost) return;
    setSaved(!saved);
    toggleSave(id);
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleVisibility(undefined, {
      onSuccess: (data) => {
        setIsPublicLocal(data.is_public);
        showGlobalToast(data.is_public ? t('madePublic') : t('madePrivate'));
      },
      onError: () => showGlobalToast(t('visibilityError'), 'error')
    });
  };

  const handleCommentSubmit = async (text: string) => {
    try {
      if (editingComment) {
        await updateComment({ id: editingComment.id, content: text });
        showGlobalToast(t('commentUpdated'));
      } else {
        await addComment(text);
        showGlobalToast(t('commentAdded'));
      }
      setIsCommentModalOpen(false);
      setEditingComment(null);
    } catch {
      showGlobalToast(t('actionFailed'), 'error');
    }
  };

  const handleDeleteClick = (id: string) => {
    setCommentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteRiddle(id);
    setIsDeleteRiddleModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (commentToDelete) {
      try {
        await deleteComment(commentToDelete);
        showGlobalToast(t('commentDeleted'));
      } catch {
        showGlobalToast(t('couldNotDelete'), 'error');
      } finally {
        setIsDeleteModalOpen(false);
        setCommentToDelete(null);
      }
    }
  };

  const handleGuessSubmit = (answer: string) => {
    solveRiddle(answer, {
      onSuccess: (data: SolveResult) => {
        setIsGuessModalOpen(false);

        let status: RiddleStatus = 'wrong';
        if (data.success) {
          status = 'correct';
          setSolved(true);
        } else if (data.is_blocked) {
          status = 'failed';
          setCanAttemptLocal(false);
        } else {
          setCanAttemptLocal((data.remaining_attempts ?? 0) > 0);
        }

        setStatusModal({
          isOpen: true,
          status: status,
          correctAnswer: data.answer,
          attemptsRemaining: data.remaining_attempts,
          xpEarned: data.xp_earned,
        });
      },
    });
  };

  const handleModalRetryAction = () => {
    if (statusModal.status === 'wrong') {
      setStatusModal(prev => ({ ...prev, isOpen: false }));
      setIsGuessModalOpen(true);
      return;
    }
    if (statusModal.status === 'failed') {
      buyAttempt(undefined, {
        onSuccess: () => {
          setHasBoughtRetry(true);
          setCanAttemptLocal(true);
          setStatusModal(prev => ({ ...prev, isOpen: false }));
          setIsGuessModalOpen(true);
        },
      });
    }
  };

  const handleToggleComments = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowComments(!showComments);
  };

  return (
    <>
      <div className={cn(styles.card, className)}>
        <div className={styles.header}>
          <UserHeader
            userId={userId}
            userName={userName}
            avatarUrl={avatarUrl}
            size="sm"
          />

          <div className={styles.badgeContainer}>
            <Badge variant="info">
              {type}
            </Badge>
            <Badge
              variant={complexityConfig.variant}
              icon={complexityConfig.icon}
            >
              {complexity}
            </Badge>

            {solved && (
              <Badge variant="success" glow icon={<SolvedIcon />}>
                {t('solved')}
              </Badge>
            )}
            {!solved && !canAttemptLocal && (
              <Badge variant="error" glow icon={<LockIcon />}>
                {t('blocked')}
              </Badge>
            )}
            {isOwnPost && (
              <div className={styles.badgeContainer}>
                <VisibilityToggle
                  isPublic={isPublicLocal}
                  onClick={handleToggleVisibility}
                  isLoading={isChangingVisibility}
                />
                <Button
                  variant="icon-only"
                  onClick={() => setIsDeleteRiddleModalOpen(true)}
                  title={t('deleteRiddleTitle')}
                >
                  <TrashIcon className={styles.deleteIcon} />
                </Button>
              </div>
            )}
          </div>
        </div>

        <RiddleBody content={content} className={styles.riddleBody} />

        <div className={styles.footer}>
          <div className={styles.actions}>
            {canInteract && (
              <div className={styles.actionsContainer}>
                <Button variant="icon-only" onClick={handleLike}>
                  <HeartIcon className={cn(styles.icon, styles.heart, { [styles.active]: liked })} />
                </Button>
                <Typography variant="details">{localLikesCount}</Typography>
              </div>
            )}

            <div className={styles.actionsContainer}>
              <Button variant="icon-only" onClick={handleToggleComments}>
                <CommentIcon className={cn(styles.icon, { [styles.active]: showComments })} />
              </Button>
              <Typography variant="details">{displayCommentsCount}</Typography>
            </div>

            {canInteract && !isOwnPost && (
              <div className={styles.actionsContainer}>
                <Button variant="icon-only" onClick={handleSave}>
                  <SaveIcon className={cn(styles.icon, styles.save, { [styles.active]: saved })} />
                </Button>
              </div>
            )}
          </div>

          {canInteract && !isOwnPost && !solved && canAttemptLocal && (
            <Button variant="icon-only" onClick={() => setIsGuessModalOpen(true)}>
              <PuzzleIcon className={cn(styles.icon, styles.puzzle)} />
            </Button>
          )}
        </div>

        {showComments && (
          <CommentSection
            comments={comments}
            isLoading={isLoading}
            isFetchingMore={isFetchingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            currentUserId={user?.id}
            canAddComment={hasCompletedOnboarding}
            onEditClick={(comment) => {
              setEditingComment({ id: comment.id, content: comment.content });
              setIsCommentModalOpen(true);
            }}
            onDeleteClick={handleDeleteClick}
            onAddClick={() => {
              setEditingComment(null);
              setIsCommentModalOpen(true);
            }}
          />
        )}
      </div>

      <CommentModal
        isOpen={isCommentModalOpen}
        initialText={editingComment?.content || ''}
        onClose={() => {
          setIsCommentModalOpen(false);
          setEditingComment(null);
        }}
        onSubmit={handleCommentSubmit}
        isLoading={isSubmitting}
      />

      <GuessModal
        isOpen={isGuessModalOpen}
        onClose={() => setIsGuessModalOpen(false)}
        onGuess={handleGuessSubmit}
        isLoading={isSolving}
      />

      <RiddleStatusModal
        isOpen={statusModal.isOpen}
        status={statusModal.status}
        attemptsRemaining={statusModal.attemptsRemaining}
        xpEarned={statusModal.xpEarned}
        hasBoughtRetry={hasBoughtRetry}
        onRetry={handleModalRetryAction}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={t('deleteCommentTitle')}
        description={t('deleteCommentDesc')}
        confirmText={t('deleteBtn')}
        variant="danger"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isSubmitting}
      />

      <ConfirmModal
        isOpen={isDeleteRiddleModalOpen}
        title={t('deleteRiddleTitle')}
        description={t('deleteRiddleDesc')}
        confirmText={t('deleteBtn')}
        variant="danger"
        isLoading={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
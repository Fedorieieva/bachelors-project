"use client";

import React from 'react';
import { Modal } from '@/components/atoms/Modal/Modal';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button/Button';
import styles from './RiddleStatusModal.module.scss';
import { cn } from '@/lib/utils';

export type RiddleStatus = 'correct' | 'wrong' | 'failed';

interface RiddleStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  status: RiddleStatus;
  correctAnswer?: string;
  attemptsRemaining?: number;
  hasBoughtRetry?: boolean;
  xpEarned?: number;
}

export const RiddleStatusModal: React.FC<RiddleStatusModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  status,
  attemptsRemaining = 0,
  hasBoughtRetry = false,
  xpEarned = 0
}) => {
  const config = {
    correct: {
      title: "Well done!",
      desc: "Your answer is correct",
      extra: `+${xpEarned} XP додано до вашого рівня`,
      primaryBtn: "Continue",
      secondaryBtn: "",
    },
    wrong: {
      title: "Hmm... close!",
      desc: "Not quite right. Try to look at it from another perspective.",
      extra: `You have ${attemptsRemaining} attempts left`,
      primaryBtn: "Close",
      secondaryBtn: "Try Again",
    },
    failed: {
      title: hasBoughtRetry ? "Still no luck?" : "Out of attempts!",
      desc: hasBoughtRetry
        ? "You've used your extra chance. This riddle is now locked for 1 hour."
        : "You've reached the limit for this riddle. Take a break and let your mind rest.",
      extra: "Come back in 1 hour to try again",
      primaryBtn: "Got it, see you later",
      secondaryBtn: "Spend 10 XP to retry",
    }
  };

  const current = config[status];

  const renderExtraText = (text: string) => {
    if (status === 'correct' && text.includes("XP")) {
      const parts = text.split(new RegExp(`(\\+${xpEarned} XP)`));
      return (
        <>
          {parts.map((part, i) =>
            part === `+${xpEarned} XP`
              ? <span key={i} className={styles.highlight}>{part}</span>
              : part
          )}
        </>
      );
    }
    return text;
  };

  const extraMarginTop = status === 'correct' ? '19px' : '0px';

  const containerClasses = cn(styles.container, {
    [styles.correct]: status === 'correct',
  });

  const handleSecondaryAction = () => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={current.title}
    >
      <div className={containerClasses}>
        <div>
          <Typography variant="input-secondary">
            {current.desc}
          </Typography>
        </div>

        {current.extra && (
          <div style={{ marginTop: extraMarginTop }}>
            <Typography variant="input-secondary">
              {renderExtraText(current.extra)}
            </Typography>
          </div>
        )}

        <div className={styles.actions}>
          <Button variant="colored-glass" onClick={onClose}>
            {current.primaryBtn}
          </Button>

          {status === 'wrong' && attemptsRemaining > 0 && (
            <Button variant="colored-glass-inactive" onClick={handleSecondaryAction}>
              {current.secondaryBtn}
            </Button>
          )}

          {status === 'failed' && !hasBoughtRetry && (
            <Button variant="colored-glass-inactive" onClick={handleSecondaryAction}>
              {current.secondaryBtn}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
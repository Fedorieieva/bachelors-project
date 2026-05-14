"use client";

import React from 'react';
import { Modal } from '@/components/atoms/Modal/Modal';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button/Button';
import styles from './RiddleStatusModal.module.scss';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export type RiddleStatus = 'correct' | 'wrong' | 'failed';

interface RiddleStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  status: RiddleStatus;
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
  const t = useTranslations('riddleStatusModal');

  const config = {
    correct: {
      title: t('correct.title'),
      desc: t('correct.desc'),
      extra: t('correct.extra', { xp: xpEarned }),
      primaryBtn: t('correct.primaryBtn'),
      secondaryBtn: "",
    },
    wrong: {
      title: t('wrong.title'),
      desc: t('wrong.desc'),
      extra: t('wrong.extra', { attempts: attemptsRemaining }),
      primaryBtn: t('wrong.primaryBtn'),
      secondaryBtn: t('wrong.secondaryBtn'),
    },
    failed: {
      title: hasBoughtRetry ? t('failed.titleBought') : t('failed.title'),
      desc: hasBoughtRetry ? t('failed.descBought') : t('failed.desc'),
      extra: t('failed.extra'),
      primaryBtn: t('failed.primaryBtn'),
      secondaryBtn: t('failed.secondaryBtn'),
    }
  };

  const current = config[status];

  const renderExtraText = (text: string) => {
    if (status === 'correct' && text.includes("XP")) {
      const parts = text.split(new RegExp(String.raw`(\+${xpEarned} XP)`));
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
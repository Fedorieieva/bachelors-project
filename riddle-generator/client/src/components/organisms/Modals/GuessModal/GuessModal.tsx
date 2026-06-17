"use client";

import React from 'react';
import { Modal } from '@/components/atoms/Modal/Modal';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { useTranslations } from 'next-intl';
import { CrosswordResult } from '@/components/organisms/Chat/CrosswordResult/CrosswordResult';
import { CrosswordLayout } from '@/types/riddle';
import styles from './GuessModal.module.scss';

interface GuessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuess: (answer: string) => void;
  isLoading?: boolean;
  crosswordLayout?: CrosswordLayout;
  riddleId?: string;
  onCrosswordComplete?: () => void;
  hideCrosswordControls?: boolean;
}

export const GuessModal: React.FC<GuessModalProps> = ({
  isOpen,
  onClose,
  onGuess,
  isLoading,
  crosswordLayout,
  riddleId,
  onCrosswordComplete,
  hideCrosswordControls = false,
}) => {
  const t = useTranslations('guessModal');
  const [answer, setAnswer] = React.useState('');

  React.useEffect(() => {
    if (!isOpen) setAnswer('');
  }, [isOpen]);

  const isButtonDisabled = !answer.trim() || isLoading;

  if (crosswordLayout) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} className={styles.crosswordModal}>
        <div className={styles.crosswordContainer}>
          <CrosswordResult
            layout={crosswordLayout}
            riddleId={riddleId}
            onReset={onClose}
            onComplete={onCrosswordComplete}
            hideControls={hideCrosswordControls}
          />
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('title')}>
      <div className={styles.container}>
        <Input
          placeholder={t('placeholder')}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          fullWidth
          disabled={isLoading}
        />
        <div className="flex justify-center mt-10">
          <Button
            variant="colored-glass"
            onClick={() => onGuess(answer)}
            disabled={isButtonDisabled}
            isLoading={isLoading}
          >
            {t('submit')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
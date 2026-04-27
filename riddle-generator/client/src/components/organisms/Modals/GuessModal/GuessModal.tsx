"use client";

import React from 'react';
import { Modal } from '@/components/atoms/Modal/Modal';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import styles from './GuessModal.module.scss';

interface GuessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuess: (answer: string) => void;
  isLoading?: boolean;
}

export const GuessModal: React.FC<GuessModalProps> = ({
  isOpen,
  onClose,
  onGuess,
  isLoading
}) => {
  const [answer, setAnswer] = React.useState('');

  React.useEffect(() => {
    if (!isOpen) setAnswer('');
  }, [isOpen]);

  const isButtonDisabled = !answer.trim() || isLoading;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guess this riddle">
      <div className={styles.container}>
        <Input
          placeholder="Enter your answer"
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
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};
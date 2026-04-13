"use client";

import React from 'react';
import { Modal } from '@/components/atoms/Modal/Modal';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'primary';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'primary',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className={styles.confirmModal}
    >
      <div className={styles.container}>
        <div className={styles.descriptionWrapper}>
          <Typography variant="body">
            {description}
          </Typography>
        </div>

        <div className={styles.footer}>
          <Button
            variant="grey-glass-link"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'primary' : 'colored-glass'}
            className={variant === 'danger' ? styles.dangerBtn : ''}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
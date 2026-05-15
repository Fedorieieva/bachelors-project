"use client";

import React from 'react';
import { Button } from '@/components/atoms/Button/Button';
import { cn } from '@/lib/utils';
import EyeIcon from '@/assets/eye-on-icon.svg';
import EyeOffIcon from '@/assets/eye-off-icon.svg';
import styles from './VisibilityToggle.module.scss';

interface VisibilityToggleProps {
  isPublic: boolean;
  onClick: (e: React.MouseEvent) => void;
  isLoading?: boolean;
  'aria-label'?: string;
}

export const VisibilityToggle: React.FC<VisibilityToggleProps> = ({ isPublic, onClick, isLoading, 'aria-label': ariaLabel }) => {
  return (
    <Button
      variant="icon-only"
      onClick={onClick}
      isLoading={isLoading}
      aria-label={ariaLabel}
      className={cn(styles.toggle, { [styles.public]: isPublic })}
    >
      {isPublic ? <EyeIcon className={styles.icon} /> : <EyeOffIcon className={styles.icon} />}
    </Button>
  );
};
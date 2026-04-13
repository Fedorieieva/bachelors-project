"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/atoms/Typography/Typography';
import styles from './RiddleBody.module.scss';

interface RiddleBodyProps {
  content: string;
  className?: string;
}

export const RiddleBody: React.FC<RiddleBodyProps> = ({ content, className }) => {
  return (
    <div className={cn(styles.riddleBody, 'riddleBody',className)}>
      <Typography variant="caption--placeholder" className={styles.content}>
        {content}
      </Typography>
    </div>
  );
};
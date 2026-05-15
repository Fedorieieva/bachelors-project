"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/atoms/Typography/Typography';
import styles from './Badge.module.scss';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: BadgeVariant;
  glow?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  icon,
  variant = 'default',
  glow = false,
  className,
}) => {
  return (
    <div
      className={cn(
        styles.badge,
        styles[variant],
        { [styles.glow]: glow },
        className
      )}
    >
      {icon}
      <Typography variant="details" className={styles.text}>
        {children}
      </Typography>
    </div>
  );
};
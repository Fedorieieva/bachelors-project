import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Logo.module.scss';
import LogoIcon from '@/assets/logo.svg';

export type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  className?: string;
  size?: LogoSize;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md'
}) => {
  const sizeClasses: Record<LogoSize, string> = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  };

  return (
    <div className={cn(styles.logoContainer, className)}>
      <div className={cn(styles.iconWrapper, sizeClasses[size])}>
        <LogoIcon />
      </div>

      <span className={styles.logoText}>
          GENIGMA
      </span>
    </div>
  );
};
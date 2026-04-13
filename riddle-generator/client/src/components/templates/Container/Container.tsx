import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Container.module.scss';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};
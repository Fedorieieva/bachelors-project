"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStreak } from '@/hooks/gamification/useUserStreak';
import { useAppSelector } from '@/store/hooks';
import styles from './StreakWidget.module.scss';
import { cn } from '@/lib/utils';
import FlameIcon from '@/assets/flame-icon.svg';

interface StreakWidgetProps {
  className?: string;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ className }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: streak } = useUserStreak();

  if (!isAuthenticated || !streak) return null;

  const { streak_count, xp_multiplier } = streak;
  const isActive = streak_count > 0;

  return (
    <AnimatePresence>
      <motion.div
        className={cn(styles.widget, { [styles.active]: isActive }, className)}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        title={`${streak_count}-day streak · ${xp_multiplier}x XP`}
      >
        <motion.span
          className={styles.flame}
          animate={isActive ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FlameIcon/>
        </motion.span>

        <span className={styles.count}>{streak_count}</span>

        {xp_multiplier > 1.0 && (
          <span className={styles.multiplier}>{xp_multiplier}x</span>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

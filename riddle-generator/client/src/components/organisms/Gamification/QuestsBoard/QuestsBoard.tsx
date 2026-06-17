"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Lock } from 'lucide-react';
import { useDailyQuests } from '@/hooks/gamification/useDailyQuests';
import { useAppSelector } from '@/store/hooks';
import { DailyQuest } from '@/types/gamification';
import styles from './QuestsBoard.module.scss';
import { cn } from '@/lib/utils';

const QuestCard: React.FC<{ quest: DailyQuest; index: number }> = ({ quest, index }) => {
  const progressPct = Math.min(100, Math.round((quest.progress / quest.target_count) * 100));

  return (
    <motion.div
      className={cn(styles.card, { [styles.completed]: quest.is_completed })}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.titleRow}>
          {quest.is_completed && (
            <CheckCircle size={15} className={styles.checkIcon} />
          )}
          <span className={styles.title}>{quest.title}</span>
        </div>
        <span className={styles.xpBadge}>
          <Zap size={10} />
          +{quest.xp_reward} XP
        </span>
      </div>

      <p className={styles.description}>{quest.description}</p>

      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: index * 0.07 + 0.15 }}
          />
        </div>
        <span className={styles.progressLabel}>
          {quest.progress} / {quest.target_count}
        </span>
      </div>
    </motion.div>
  );
};

export const QuestsBoard: React.FC = () => {
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { data: quests, isLoading, isError } = useDailyQuests();

  if (!authUser || authUser.is_guest) {
    return (
      <div className={styles.board}>
        <h3 className={styles.boardTitle}>Daily Quests</h3>
        <div className={styles.lockedContainer}>
          <Lock size={24} className={styles.lockIcon} />
          <p className={styles.lockedText}>
            Daily quests are exclusive to registered players. Sign up now to unlock daily challenges and track your progression!
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.board}>
        <h3 className={styles.boardTitle}>Daily Quests</h3>
        <div className={styles.skeleton}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !quests?.length) {
    return (
      <div className={styles.board}>
        <h3 className={styles.boardTitle}>Daily Quests</h3>
        <p className={styles.empty}>No quests available today. Check back tomorrow!</p>
      </div>
    );
  }

  const completed = quests.filter((q) => q.is_completed).length;

  return (
    <div className={styles.board}>
      <div className={styles.boardHeader}>
        <h3 className={styles.boardTitle}>Daily Quests</h3>
        <span className={styles.completionBadge}>{completed}/{quests.length}</span>
      </div>
      <div className={styles.questList}>
        {quests.map((quest, i) => (
          <QuestCard key={quest.id} quest={quest} index={i} />
        ))}
      </div>
    </div>
  );
};

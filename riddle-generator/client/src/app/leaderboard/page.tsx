"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Medal, Award, Flame } from 'lucide-react';
import { useLeaderboard, useMyRank } from '@/hooks/gamification/useLeaderboard';
import { QuestsBoard } from '@/components/organisms/Gamification/QuestsBoard/QuestsBoard';
import { useAppSelector } from '@/store/hooks';
import { LeaderboardEntry, LeaderboardPeriod } from '@/types/gamification';
import styles from './Leaderboard.module.scss';
import { cn } from '@/lib/utils';

const MEDAL_CLASSES = [styles.gold, styles.silver, styles.bronze] as const;

const PODIUM_ICON_DATA = [
  { Icon: Trophy, className: styles.medalGold },
  { Icon: Medal,  className: styles.medalSilver },
  { Icon: Award,  className: styles.medalBronze },
] as const;

function PodiumMedalIcon({ index }: { index: number }) {
  const { Icon, className } = PODIUM_ICON_DATA[index];
  return <Icon size={24} className={className} />;
}

function AvatarOrFallback({
  name,
  avatarUrl,
  className,
  fallbackClass,
}: {
  name: string | null;
  avatarUrl: string | null;
  className?: string;
  fallbackClass?: string;
}) {
  const initial = (name ?? '?')[0].toUpperCase();
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name ?? 'User'}
        width={56}
        height={56}
        className={className}
        unoptimized
      />
    );
  }
  return <div className={fallbackClass}>{initial}</div>;
}

function PodiumCard({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  return (
    <Link href={`/profile/${entry.id}`} className={styles.podiumLink}>
      <motion.div
        className={cn(styles.podiumCard, MEDAL_CLASSES[index])}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <PodiumMedalIcon index={index} />
        <AvatarOrFallback
          name={entry.name}
          avatarUrl={entry.avatar_url}
          className={styles.podiumAvatar}
          fallbackClass={styles.podiumAvatarFallback}
        />
        <span className={styles.podiumName}>{entry.name ?? 'Anonymous'}</span>
        <span className={styles.podiumXp}>{entry.xp.toLocaleString()} XP</span>
      </motion.div>
    </Link>
  );
}

function PlayerRow({
  entry,
  isCurrentUser,
  index,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  index: number;
}) {
  return (
    <Link href={`/profile/${entry.id}`} className={styles.listLink}>
      <motion.div
        className={cn(styles.listItem, { [styles.currentUser]: isCurrentUser })}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04, duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      >
        <span className={styles.listRank}>#{entry.rank}</span>
        <AvatarOrFallback
          name={entry.name}
          avatarUrl={entry.avatar_url}
          className={styles.listAvatar}
          fallbackClass={styles.listAvatarFallback}
        />
        <span className={styles.listName}>{entry.name ?? 'Anonymous'}</span>
        {entry.streak_count > 0 && (
          <span className={styles.listStreak}>
            <Flame size={13} className={styles.listStreakIcon} />
            {entry.streak_count}
          </span>
        )}
        <span className={styles.listXp}>{entry.xp.toLocaleString()} XP</span>
      </motion.div>
    </Link>
  );
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('all');
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useLeaderboard(period);
  const { data: rankData } = useMyRank(period);

  const entries = data?.data ?? [];
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const currentUserInList = entries.some((e) => e.id === authUser?.id);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Leaderboard</h1>

      <div className={styles.contentGrid}>
        <div className={styles.main}>
          <div className={styles.tabs}>
            <button
              className={cn(styles.tab, { [styles.tabActive]: period === 'all' })}
              onClick={() => setPeriod('all')}
            >
              All-Time Legends
            </button>
            <button
              className={cn(styles.tab, { [styles.tabActive]: period === 'weekly' })}
              onClick={() => setPeriod('weekly')}
            >
              Weekly Sprint
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                className={styles.loading}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={styles.skeletonRow} />
                ))}
              </motion.div>
            ) : entries.length === 0 ? (
              <motion.p
                key="empty"
                className={styles.empty}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No players found for this period.
              </motion.p>
            ) : (
              <motion.div
                key={period}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {top3.length > 0 && (
                  <div className={styles.podium}>
                    {top3.map((entry, i) => (
                      <PodiumCard key={entry.id} entry={entry} index={i} />
                    ))}
                  </div>
                )}

                <div className={styles.list}>
                  {rest.map((entry, i) => (
                    <PlayerRow
                      key={entry.id}
                      entry={entry}
                      isCurrentUser={entry.id === authUser?.id}
                      index={i}
                    />
                  ))}
                </div>

                {authUser && rankData && !currentUserInList && (
                  <div className={styles.myRankBanner}>
                    Your rank: <strong>#{rankData.rank}</strong>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.sidebar}>
          <QuestsBoard />
        </div>
      </div>
    </div>
  );
}

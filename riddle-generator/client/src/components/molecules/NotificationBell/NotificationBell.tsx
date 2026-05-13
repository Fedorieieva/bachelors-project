"use client";

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Heart, Star, UserPlus, UserX, MessageCircle, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useClearAllNotifications,
} from '@/hooks/notifications/useNotifications';
import { Notification } from '@/services/notifications/notification.service';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import styles from './NotificationBell.module.scss';
import { useOnClickOutside } from '@/hooks/utils/useOnClickOutside';

const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.97 },
};

function typeIcon(type: Notification['type']) {
  switch (type) {
    case 'LIKE': return <Heart size={14} />;
    case 'COMMENT': return <MessageCircle size={14} />;
    case 'FOLLOW': return <UserPlus size={14} />;
    case 'LEVEL_UP': return <Star size={14} />;
    case 'XP_EARNED': return <Zap size={14} />;
    case 'PROFILE_DELETED': return <UserX size={14} />;
    default: return <Bell size={14} />;
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export const NotificationBell: React.FC = () => {
  const t = useTranslations('notifications');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useNotifications();
  const { data: unreadData } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const clearAll = useClearAllNotifications();

  const unreadCount = unreadData?.count ?? 0;

  useOnClickOutside(wrapperRef, () => setOpen(false));

  const handleItemClick = (n: Notification) => {
    if (!n.isRead) markAsRead.mutate(n.id);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        className={styles.bell}
        onClick={() => setOpen((v) => !v)}
        aria-label={t('bellLabel')}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.dropdown}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: 'top right' }}
          >
            <div className={styles.dropdownPanel}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>{t('title')}</span>
                <div className={styles.dropdownActions}>
                  {unreadCount > 0 && (
                    <button
                      className={styles.actionBtn}
                      onClick={() => markAllAsRead.mutate()}
                      disabled={markAllAsRead.isPending}
                    >
                      {t('markAllRead')}
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      className={styles.actionBtn}
                      onClick={() => clearAll.mutate()}
                      disabled={clearAll.isPending}
                    >
                      {t('clearAll')}
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.list}>
                {notifications.length === 0 ? (
                  <p className={styles.empty}>{t('empty')}</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`${styles.item} ${!n.isRead ? styles.unread : ''}`}
                      onClick={() => handleItemClick(n)}
                    >
                      {n.actor ? (
                        <div className={styles.avatarWrap}>
                          <Avatar
                            userName={n.actor.name || '?'}
                            avatarUrl={n.actor.avatar_url}
                            size="sm"
                          />
                          <span className={styles.typeBadge}>{typeIcon(n.type)}</span>
                        </div>
                      ) : (
                        <span className={styles.iconWrap}>{typeIcon(n.type)}</span>
                      )}
                      <div className={styles.itemBody}>
                        <p className={styles.itemContent}>{n.content}</p>
                        <p className={styles.itemTime}>{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.isRead && <span className={styles.unreadDot} />}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

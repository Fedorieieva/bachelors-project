"use client";

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Share2, Plus } from 'lucide-react';
import { Logo } from '@/components/atoms/Logo/Logo';
import styles from './Sidebar.module.scss';
import { usePathname } from 'next/navigation';
import { useChats } from '@/hooks/riddles/useChatsHistory';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const { chats, isLoading } = useChats();
  const pathname = usePathname();
  const activeChatId = pathname?.startsWith('/chat/') ? pathname.split('/chat/')[1] : null;

  const sidebarVariants: Variants = {
    closed: { x: '-100%' },
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  const SidebarContent = () => (
    <>
      <div className={styles.header}>
        <Logo />
      </div>

      <nav className={styles.nav}>
        <div className={styles.actionButtons}>
          <Button
            variant="primary"
            href="/chat"
            leftIcon={<Plus size={20} />}
          >
            Новий чат
          </Button>

          <Button
            variant="primary"
            href="/social-media"
            leftIcon={<Share2 size={20} />}
          >
            Соціальна мережа
          </Button>
        </div>

        <div className={styles.historySection}>
          <Typography variant="details" className={styles.historyTitle}>
            Історія чатів
          </Typography>

          <div className={styles.historyList}>
            {isLoading ? (
              <div className="px-4 py-2 opacity-50">
                <Typography variant="body">Завантаження...</Typography>
              </div>
            ) : chats.length > 0 ? (
              chats.map((chat) => (
                <Button
                  key={chat.id}
                  variant={chat.id === activeChatId ? 'grey-glass-tab' : 'grey-glass-link'}
                  href={`/chat/${chat.id}`}
                  fullWidth
                >
                  <span className={styles.chatTitle}>{chat.title}</span>
                </Button>
              ))
            ) : (
              <Typography variant="body">Історія порожня</Typography>
            )}
          </div>
        </div>
      </nav>

      <div className={styles.footer}>
        <Button variant="grey-glass-link" href='/settings' fullWidth>
          Налаштування
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.aside className={styles.mobileSidebar} initial="closed" animate="open" exit="closed" variants={sidebarVariants}>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }
  return (
    <aside className={styles.sidebarContainer}>
      <SidebarContent />
    </aside>
  );
};
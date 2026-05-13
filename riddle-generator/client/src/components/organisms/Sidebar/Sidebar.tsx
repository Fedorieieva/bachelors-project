"use client";

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Share2, Plus, Trash2 } from 'lucide-react';
import { Logo } from '@/components/atoms/Logo/Logo';
import styles from './Sidebar.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { useChats, useDeleteChat, ChatHistoryItem } from '@/hooks/riddles/useChatsHistory';
import { InfiniteScrollList } from '@/components/organisms/InfiniteScrollList/InfiniteScrollList';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/store/hooks';
import { LanguageSwitcher } from '@/components/atoms/LanguageSwitcher/LanguageSwitcher';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const { chats, isLoading, isFetchingMore, hasMore, loadMore } = useChats();
  const { deleteChat, isDeleting, deletingId } = useDeleteChat();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('sidebar');
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isRegisteredUser = isAuthenticated && !user?.is_guest;
  const activeChatId: string | null = pathname?.startsWith('/chat/') ? pathname.split('/chat/')[1] : null;

  const handleDeleteChat = (chatId: string) => {
    if (chatId === activeChatId) {
      router.push('/chat');
    }
    deleteChat(chatId);
  };

  const sidebarVariants: Variants = {
    closed: { x: '-100%' },
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const SidebarContent = () => (
    <>
      <div className={styles.header}>
        <Logo />
      </div>

      <nav className={styles.nav}>
        <div className={styles.actionButtons}>
          <Button variant="primary" href="/chat" leftIcon={<Plus size={20} />}>
            {t('newChat')}
          </Button>
          <Button variant="primary" href="/social-media" leftIcon={<Share2 size={20} />}>
            {t('socialNetwork')}
          </Button>
        </div>

        <div className={styles.historySection}>
          <Typography variant="details" className={styles.historyTitle}>
            {t('chatHistory')}
          </Typography>

          <InfiniteScrollList<ChatHistoryItem>
            items={chats}
            isLoading={isLoading}
            isFetchingMore={isFetchingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            direction="down"
            className={styles.historyList}
            renderItem={(chat: ChatHistoryItem) => {
              const isActive = chat.id === activeChatId;
              const isThisDeleting = isDeleting && deletingId === chat.id;

              return (
                <div key={chat.id} className={styles.chatItem}>
                  <Button
                    variant={isActive ? 'grey-glass-tab' : 'grey-glass-link'}
                    href={`/chat/${chat.id}`}
                    fullWidth
                    className={styles.chatButton}
                  >
                    <span className={styles.chatTitle}>
                      {chat.title || t('untitled')}
                    </span>
                  </Button>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => { e.preventDefault(); handleDeleteChat(chat.id); }}
                    disabled={isThisDeleting}
                    title={t('deleteChat')}
                    aria-label={t('deleteChat')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            }}
            renderEmpty={() => (
              <Typography variant="body">{t('historyEmpty')}</Typography>
            )}
          />
        </div>
      </nav>

      <div className={styles.footer}>
        <div className={styles.langSwitcherWrapper}>
          <LanguageSwitcher />
        </div>
        {isRegisteredUser && (
          <Button variant="grey-glass-link" href="/settings" fullWidth>
            {t('settings')}
          </Button>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              className={styles.mobileSidebar}
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
            >
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
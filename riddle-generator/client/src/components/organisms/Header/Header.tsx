"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import { Button } from '@/components/atoms/Button/Button';
import { NotificationBell } from '@/components/molecules/NotificationBell/NotificationBell';
import styles from './Header.module.scss';
import { cn } from '@/lib/utils';
import { useUserStats } from '@/hooks/users/useUser';
import { useLogout } from '@/hooks/users/useAuth';
import { useTranslations } from 'next-intl';

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
  hideAvatar?: boolean;
}

const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.97 },
};

export const Header: React.FC<HeaderProps> = ({ onMenuClick, className, hideAvatar }) => {
  const { user: authUser, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: stats } = useUserStats();
  const logoutMutation = useLogout();
  const t = useTranslations('header');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const displayUser = stats?.profile || authUser;

  return (
    <header className={cn(styles.header, className)}>
      <Button
        variant="icon-only"
        onClick={onMenuClick}
        className={styles.burgerButton}
      >
        <Menu size={24} color="white" />
      </Button>

      <div className={styles.userStatus}>
        {isAuthenticated && authUser && <NotificationBell />}
        {!hideAvatar && (
          <>
            {isAuthenticated && authUser ? (
              <button
                type="button"
                aria-expanded={isDropdownOpen}
                aria-label={t('myProfile')}
                className={styles.avatarWrapper}
                onClick={() => setIsDropdownOpen((v) => !v)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Avatar
                  userName={displayUser?.name || 'User'}
                  avatarUrl={displayUser?.avatar_url}
                  size="md"
                  badge={{
                    type: 'xp',
                    value: displayUser?.xp || 0,
                    position: 'left'
                  }}
                />

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      className={styles.dropdown}
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className={styles.dropdownMenu}>
                        <Link
                          href={`/profile/${authUser.id}`}
                          className={styles.dropdownItem}
                        >
                          <User size={15} />
                          {t('myProfile')}
                        </Link>
                        <div className={styles.dropdownDivider} />
                        <button
                          className={cn(styles.dropdownItem, styles.dropdownItemDanger)}
                          onClick={() => logoutMutation.mutate()}
                          disabled={logoutMutation.isPending}
                        >
                          <LogOut size={15} />
                          {logoutMutation.isPending ? t('signingOut') : t('logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ) : (
              <Button
                href="/login"
                variant="colored-glass"
                size="auto"
              >
                {t('signIn')}
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
};
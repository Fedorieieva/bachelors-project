"use client";

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { Avatar } from '@/components/atoms/Avatar/Avatar';
import { Button } from '@/components/atoms/Button/Button';
import { Menu } from 'lucide-react';
import styles from './Header.module.scss';
import { cn } from '@/lib/utils';
import { useUserStats } from '@/hooks/users/useUser';

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
  hideAvatar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, className, hideAvatar }) => {
  const { user: authUser, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: stats } = useUserStats();

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
        {!hideAvatar && (
          <>
            {isAuthenticated && authUser ? (
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
            ) : (
              <Button
                href="/login"
                variant="colored-glass"
                size="auto"
              >
                Sign In
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
};
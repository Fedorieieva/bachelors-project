"use client";

import React, { useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { Sidebar } from '@/components/organisms/Sidebar/Sidebar';
import { Container } from '@/components/templates/Container/Container';
import styles from './MainLayout.module.scss';
import { Header } from '@/components/organisms/Header/Header';

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');

  const isOwnProfile =
    isAuthenticated &&
    user &&
    pathname.startsWith('/profile/') &&
    params.id === user.id;

  const isSettingsPage = pathname.startsWith('/settings');

  const shouldHideAvatar = isOwnProfile || isSettingsPage;

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layoutWrapper}>
      <Sidebar isMobile={false} />

      <Sidebar
        isMobile={true}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className={styles.contentWrapper}>
        <Container>
          <Header
            onMenuClick={() => setIsMobileMenuOpen(true)}
            hideAvatar={shouldHideAvatar}
          />

          {children}
        </Container>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { FeedList } from '@/components/organisms/FeedList/FeedList';
import { Button } from '@/components/atoms/Button/Button';
import { FeedType } from '@/hooks/social-actions/useFeed';
import { useAppSelector } from '@/store/hooks';
import { useTranslations } from 'next-intl';
import styles from './SocialPage.module.scss';

export default function SocialPage() {
  const t = useTranslations('socialMedia');
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<FeedType>('public');

  const feedType: FeedType = isAuthenticated ? activeTab : 'public';

  return (
    <div>
      {isAuthenticated && (
        <header className={styles.header}>
          <div className={styles.tabs}>
            <Button
              variant={activeTab === 'public' ? 'simple-tab' : 'simple'}
              onClick={() => setActiveTab('public')}
            >
              {t('allRiddles')}
            </Button>
            <Button
              variant={activeTab === 'following' ? 'simple-tab' : 'simple'}
              onClick={() => setActiveTab('following')}
            >
              {t('following')}
            </Button>
          </div>
        </header>
      )}

      <main>
        <FeedList type={feedType} />
      </main>
    </div>
  );
}

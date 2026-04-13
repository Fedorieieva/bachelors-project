"use client";

import React, { useState } from 'react';
import { FeedList } from '@/components/organisms/FeedList/FeedList';
import { Button } from '@/components/atoms/Button/Button';
import { FeedType } from '@/hooks/social-actions/useFeed';
import styles from './SocialPage.module.scss';

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<FeedType>('public');

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.tabs}>
          <Button
            variant={activeTab === 'public' ? 'simple-tab' : 'simple'}
            onClick={() => setActiveTab('public')}
          >
            All Riddles
          </Button>
          <Button
            variant={activeTab === 'following' ? 'simple-tab' : 'simple'}
            onClick={() => setActiveTab('following')}
          >
            Following
          </Button>
        </div>
      </header>

      <main>
        <FeedList type={activeTab} />
      </main>
    </div>
  );
}
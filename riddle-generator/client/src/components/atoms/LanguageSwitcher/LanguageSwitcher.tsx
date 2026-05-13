"use client";

import React, { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { setLocale } from '@/actions/locale';
import { cn } from '@/lib/utils';
import styles from './LanguageSwitcher.module.scss';
import { useTranslations } from 'next-intl';

export const LanguageSwitcher: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations('languageSwitcher');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    startTransition(async () => {
      await setLocale(newLocale);
      router.refresh();
    });
  };

  return (
    <div className={cn(styles.toggle, { [styles.pending]: isPending })}>
      <button
        className={cn(styles.btn, { [styles.active]: locale === 'uk' })}
        onClick={() => switchLocale('uk')}
        disabled={isPending}
        aria-label={t('switchToUk')}
      >
        UK
      </button>
      <span className={styles.divider} aria-hidden>|</span>
      <button
        className={cn(styles.btn, { [styles.active]: locale === 'en' })}
        onClick={() => switchLocale('en')}
        disabled={isPending}
        aria-label={t('switchToEn')}
      >
        EN
      </button>
    </div>
  );
};
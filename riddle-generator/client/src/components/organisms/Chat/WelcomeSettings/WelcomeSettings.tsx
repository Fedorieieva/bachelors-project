"use client";

import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { RiddleSettings, RiddleType } from '@/types/riddle';
import styles from './WelcomeSettings.module.scss';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

import GamepadIcon from '@/assets/gamepad-2-icon.svg';

interface WelcomeSettingsProps {
  initialSettings: RiddleSettings;
  onSync: (settings: RiddleSettings) => void;
}

const WelcomeSettingsSchema = Yup.object().shape({
  type: Yup.string().required(),
  complexity: Yup.number().min(1).max(5).required(),
  is_interactive: Yup.boolean(),
});

export const WelcomeSettings: React.FC<WelcomeSettingsProps> = ({
  initialSettings,
  onSync
}) => {
  const t = useTranslations('welcomeSettings');
  const formik = useFormik<RiddleSettings>({
    initialValues: initialSettings,
    validationSchema: WelcomeSettingsSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    onSync(formik.values);
  }, [formik.values, onSync]);

  return (
    <div className={styles.container}>
      <Typography variant="h2">{t('title')}</Typography>

      <div className={styles.form}>
        <div className={styles.field}>
          <Typography variant="details" className={styles.label}>{t('category')}</Typography>
          <div className={styles.optionsGrid}>
            {Object.values(RiddleType).map((t) => (
              <Button
                key={t}
                variant={formik.values.type === t ? 'colored-glass' : 'colored-glass-inactive'}
                onClick={() => formik.setFieldValue('type', t)}
                fullWidth
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <Typography variant="details" className={styles.label}>{t('difficulty')}</Typography>
          <div className={styles.complexityRow}>
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                className={cn(styles.levelDot, {
                  [styles.active]: formik.values.complexity >= level,
                })}
                onClick={() => formik.setFieldValue('complexity', level)}
              />
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <Typography variant="details" className={styles.label}>{t('gameMode')}</Typography>
          <Button
            type="button"
            variant="icon-only"
            onClick={() => formik.setFieldValue('is_interactive', !formik.values.is_interactive)}
            className={cn(styles.gameToggle, { [styles.active]: formik.values.is_interactive })}
          >
            <GamepadIcon className={styles.icon} />
          </Button>
        </div>
      </div>
    </div>
  );
};
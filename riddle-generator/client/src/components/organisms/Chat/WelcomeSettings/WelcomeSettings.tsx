"use client";

import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { Select } from '@/components/atoms/Select/Select';
import { RiddleSettings, RiddleType } from '@/types/riddle';
import styles from './WelcomeSettings.module.scss';
import { cn } from '@/lib/utils';

import GamepadIcon from '@/assets/gamepad-2-icon.svg';

interface WelcomeSettingsProps {
  initialSettings: RiddleSettings;
  onSync: (settings: RiddleSettings) => void;
}

const LANGUAGE_OPTIONS = [
  { label: 'Українська', value: 'ukrainian' },
  { label: 'English', value: 'english' },
  { label: 'Español', value: 'spanish' },
  { label: 'Français', value: 'french' },
  { label: 'Deutsch', value: 'german' },
];

const WelcomeSettingsSchema = Yup.object().shape({
  type: Yup.string().required(),
  complexity: Yup.number().min(1).max(5).required(),
  language: Yup.string().required(),
  is_interactive: Yup.boolean(),
});

export const WelcomeSettings: React.FC<WelcomeSettingsProps> = ({
                                                                  initialSettings,
                                                                  onSync
                                                                }) => {
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
      <Typography variant="h2">Налаштування</Typography>

      <div className={styles.form}>
        <div className={styles.field}>
          <Typography variant="details" className={styles.label}>Категорія</Typography>
          <div className={styles.optionsGrid}>
            {Object.values(RiddleType).map((t) => (
              <Button
                key={t}
                variant={formik.values.type === t ? 'colored-glass' : 'glass-inactive'}
                onClick={() => formik.setFieldValue('type', t)}
                fullWidth
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <Select
              label="Мова генерації"
              options={LANGUAGE_OPTIONS}
              value={formik.values.language}
              onChange={(val) => formik.setFieldValue('language', val)}
            />
          </div>

          <div className={styles.field}>
            <Typography variant="details" className={styles.label}>Складність</Typography>
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
        </div>

        <div className={styles.field}>
          <Typography variant="details" className={styles.label}>Ігровий режим</Typography>
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
"use client";

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { RiddleSettings, RiddleType } from '@/types/riddle';
import styles from './WelcomeSettings.module.scss';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

import GamepadIcon from '@/assets/gamepad-2-icon.svg';
import ZapIcon from '@/assets/zap-icon.svg';

interface WelcomeSettingsProps {
  initialSettings: RiddleSettings;
  onSync: (settings: RiddleSettings) => void;
  onGenerate?: (theme: string, customWords: string[]) => void;
  isGenerating?: boolean;
}

const WelcomeSettingsSchema = Yup.object().shape({
  type: Yup.string().required(),
  complexity: Yup.number().min(1).max(5).required(),
  is_interactive: Yup.boolean(),
  model: Yup.string(),
  generate_image: Yup.boolean(),
  crosswordTheme: Yup.string().when('type', {
    is: RiddleType.CROSSWORD,
    then: (s) => s.optional(),
    otherwise: (s) => s.optional(),
  }),
  crosswordCustomWords: Yup.array().of(Yup.string()).optional(),
});

export const WelcomeSettings: React.FC<WelcomeSettingsProps> = ({
  initialSettings,
  onSync,
  onGenerate,
  isGenerating = false,
}) => {
  const t = useTranslations('welcomeSettings');
  const [wordInput, setWordInput] = useState('');

  const formik = useFormik<RiddleSettings>({
    initialValues: { ...initialSettings },
    validationSchema: WelcomeSettingsSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    onSync(formik.values);
  }, [formik.values, onSync]);

  const isCrossword = formik.values.type === RiddleType.CROSSWORD;

  const handleAddWord = () => {
    const trimmed = (wordInput || '').trim().toUpperCase();
    if (!trimmed) return;
    const existing = formik.values.crosswordCustomWords ?? [];
    if (!existing.includes(trimmed)) {
      void formik.setFieldValue('crosswordCustomWords', [...existing, trimmed]);
    }
    setWordInput('');
  };

  const handleRemoveWord = (word: string) => {
    void formik.setFieldValue(
      'crosswordCustomWords',
      (formik.values.crosswordCustomWords ?? []).filter((w) => w !== word),
    );
  };

  const handleGenerate = () => {
    const theme = (formik.values.crosswordTheme || '').trim();
    if (!theme) return;
    onGenerate?.(theme, formik.values.crosswordCustomWords ?? []);
  };

  return (
    <div className={styles.container}>
      <Typography variant="h2">{t('title')}</Typography>

      <div className={styles.form}>
        {/* ── Type selector (all types, always visible) ── */}
        <div className={styles.field}>
          <Typography variant="details" className={styles.label}>{t('category')}</Typography>
          <div className={styles.optionsGrid}>
            {Object.values(RiddleType).map((type) => (
              <Button
                key={type}
                variant={formik.values.type === type ? 'colored-glass' : 'colored-glass-inactive'}
                onClick={() => {
                  void formik.setFieldValue('type', type);
                  // Reset crossword-specific fields when switching away
                  if (type !== RiddleType.CROSSWORD) {
                    void formik.setFieldValue('crosswordTheme', undefined);
                    void formik.setFieldValue('crosswordCustomWords', []);
                  }
                }}
                fullWidth
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* ── CROSSWORD-specific fields ── */}
        {isCrossword && (
          <>
            <div className={styles.field}>
              <Typography variant="details" className={styles.label}>
                {t('crosswordTheme')}
              </Typography>
              <input
                type="text"
                className={styles.themeInput}
                placeholder={t('crosswordThemePlaceholder')}
                value={formik.values.crosswordTheme ?? ''}
                onChange={(e) => void formik.setFieldValue('crosswordTheme', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <Typography variant="details" className={styles.label}>
                {t('crosswordWords')}
              </Typography>
              <div className={styles.chipInputWrapper}>
                <input
                  type="text"
                  className={styles.themeInput}
                  placeholder={t('crosswordWordsPlaceholder')}
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddWord();
                    }
                  }}
                />
                {(formik.values.crosswordCustomWords ?? []).length > 0 && (
                  <div className={styles.chips}>
                    {(formik.values.crosswordCustomWords ?? []).map((word) => (
                      <span key={word} className={styles.chip}>
                        {word}
                        <button type="button" onClick={() => handleRemoveWord(word)}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.crosswordActions}>
              <Button
                variant="colored-glass"
                onClick={handleGenerate}
                isLoading={isGenerating}
                disabled={!(formik.values.crosswordTheme || '').trim()}
                fullWidth
                leftIcon={<ZapIcon className={styles.zapIcon} />}
              >
                {t('crosswordGenerate')}
              </Button>
            </div>
          </>
        )}

        {/* ── Standard riddle fields (hidden for CROSSWORD) ── */}
        {!isCrossword && (
          <>
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
                    onClick={() => void formik.setFieldValue('complexity', level)}
                  />
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <Typography variant="details" className={styles.label}>{t('gameMode')}</Typography>
              <Button
                type="button"
                variant="icon-only"
                onClick={() =>
                  void formik.setFieldValue('is_interactive', !formik.values.is_interactive)
                }
                className={cn(styles.gameToggle, { [styles.active]: formik.values.is_interactive })}
              >
                <GamepadIcon className={styles.icon} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Message, RiddleSettings } from '@/types/riddle';
import { RiddleBody } from '@/components/molecules/Riddle/RiddleBody/RiddleBody';
import { Button } from '@/components/atoms/Button/Button';
import { useTranslations } from 'next-intl';
import RotateIcon from '@/assets/rotate-icon.svg';
import styles from './ChatMessageItem.module.scss';
import LightbulbIcon from '@/assets/lightbulb-icon.svg';

interface ChatMessageItemProps {
  msg: Message;
  index: number;
  isLast: boolean;
  isSending: boolean;
  onRegenerate: (settings: RiddleSettings) => void;
  isRegenerating: boolean;
  currentSettings: RiddleSettings;
  displayContent: string;
  onReveal?: () => void;
  isRevealing?: boolean;
  fullWidth?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  msg,
  isLast,
  isSending,
  onRegenerate,
  isRegenerating,
  onReveal,
  isRevealing,
  currentSettings,
  displayContent,
  fullWidth = false,
}) => {
  const t = useTranslations('chatMessageItem');
  const isModel = msg.role === 'model';
  const isMainRiddle = isModel && msg.is_initial;

  const parsedData = React.useMemo(() => {
    try {
      return JSON.parse(msg.content);
    } catch {
      return null;
    }
  }, [msg.content]);

  const isSolved = !!(parsedData?.xp_earned || parsedData?.is_solved);
  const isRevealed = isModel && parsedData === null;
  const isFinished = isSolved || isRevealed;
  const modelUsed: string | undefined = parsedData?.model_used;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(styles.messageRow, {
        [styles.userRow]: msg.role === 'user',
        [styles.fullWidth]: fullWidth,
      })}
    >
      <div className={styles.messageContentWrapper}>
        <RiddleBody
          content={displayContent}
          className={cn({ [styles.riddleStyle]: isMainRiddle })}
        />

        {isModel && modelUsed && (
          <div className={styles.modelBadge} title={t('generatedBy', { model: modelUsed })}>
            {modelUsed}
          </div>
        )}

        {isLast && isModel && !isSending && !isFinished && (
          <motion.div className={styles.actionsRow}>
            <Button
              variant="icon-only"
              onClick={() => onRegenerate(currentSettings)}
              isLoading={isRegenerating}
              className={styles.regenerateButton}
            >
              <RotateIcon />
            </Button>

            {isMainRiddle && (
              <Button
                variant="icon-only"
                onClick={onReveal}
                isLoading={isRevealing}
                title={t('revealAnswer')}
                className={styles.revealButton}
              >
                <LightbulbIcon />
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
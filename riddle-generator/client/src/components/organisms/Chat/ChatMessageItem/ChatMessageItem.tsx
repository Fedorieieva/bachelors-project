import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChatResponse, Message, RiddleSettings } from '@/types/riddle';
import { RiddleBody } from '@/components/molecules/Riddle/RiddleBody/RiddleBody';
import { Button } from '@/components/atoms/Button/Button';
import RotateIcon from '@/assets/rotate-icon.svg';
import styles from './ChatMessageItem.module.scss';

interface ChatMessageItemProps {
  msg: Message;
  index: number;
  isLast: boolean;
  isSending: boolean;
  onRegenerate: (settings: RiddleSettings) => void;
  isRegenerating: boolean;
  currentSettings: RiddleSettings;
  displayContent: string;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  msg,
  isLast,
  isSending,
  onRegenerate,
  isRegenerating,
  currentSettings,
  displayContent,
}) => {
  const isMainRiddle = msg.role === 'model' && msg.is_initial;

  let xpEarned: number | undefined;
  try {
    const parsed = JSON.parse(msg.content) as ChatResponse['data'];
    xpEarned = parsed.xp_earned;
  } catch (e) {}

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(styles.messageRow, { [styles.userRow]: msg.role === 'user' })}
    >
      <div className={styles.messageContentWrapper}>
        <RiddleBody
          content={displayContent}
          className={cn({ [styles.riddleStyle]: isMainRiddle })}
        />
        {isLast && msg.role === 'model' && !isSending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.actionsRow}
          >
            <Button
              variant="icon-only"
              onClick={() => onRegenerate(currentSettings)}
              isLoading={isRegenerating}
              className={styles.regenerateButton}
            >
              <RotateIcon />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
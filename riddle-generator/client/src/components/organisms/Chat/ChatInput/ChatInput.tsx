import React from 'react';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import SendIcon from '@/assets/send-icon.svg';
import styles from './ChatInput.module.scss';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  isSending: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, isSending }) => {
  return (
    <div className={styles.inputSection}>
      <div className={styles.inputWrapper}>
        <Input
          variant="multiline"
          placeholder="Введіть відповідь..."
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          fullWidth
          icon={
            <Button
              variant="icon-only"
              onClick={onSend}
              isLoading={isSending}
              disabled={!value.trim()}
            >
              <SendIcon />
            </Button>
          }
        />
      </div>
    </div>
  );
};
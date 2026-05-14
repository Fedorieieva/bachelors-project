"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Cpu, ChevronDown } from 'lucide-react';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { GEMINI_MODELS } from '@/types/riddle';
import SendIcon from '@/assets/send-icon.svg';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import styles from './ChatInput.module.scss';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  isSending: boolean;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

function getShortLabel(modelValue: string): string {
  const found = GEMINI_MODELS.find(m => m.value === modelValue);
  return found?.label.replace('Gemini ', '') ?? modelValue;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isSending,
  selectedModel,
  onModelChange,
}) => {
  const t = useTranslations('chatInput');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (e.target instanceof Node && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const showModelSelector = selectedModel !== undefined && onModelChange !== undefined;

  return (
    <div className={styles.inputSection}>
      <div className={styles.inputWrapper}>
        {showModelSelector && (
          <div className={styles.modelBar}>
            <div className={styles.modelSelectorRoot} ref={dropdownRef}>
              <button
                className={styles.modelChip}
                onClick={() => setDropdownOpen(v => !v)}
                type="button"
                title={t('selectModel')}
              >
                <Cpu size={12} className={styles.modelIcon} />
                <span className={styles.modelLabel}>{getShortLabel(selectedModel)}</span>
                <ChevronDown
                  size={12}
                  className={cn(styles.modelChevron, { [styles.chevronOpen]: dropdownOpen })}
                />
              </button>

              {dropdownOpen && (
                <div className={styles.modelDropdown}>
                  {GEMINI_MODELS.map(m => (
                    <button
                      key={m.value}
                      type="button"
                      className={cn(styles.modelOption, {
                        [styles.modelOptionActive]: m.value === selectedModel,
                      })}
                      onClick={() => {
                        onModelChange(m.value);
                        setDropdownOpen(false);
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <Input
          variant="multiline"
          placeholder={t('placeholder')}
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
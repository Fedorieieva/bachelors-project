"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { Theme, EmojiStyle, SuggestionMode } from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';
import { Modal } from '@/components/atoms/Modal/Modal';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import EmojiIcon from '@/assets/emoji.svg';
import { useTranslations } from 'next-intl';
import styles from './CommentModal.module.scss';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface CommentModalProps {
  isOpen: boolean;
  initialText?: string;
  onClose: () => void;
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  initialText = '',
  onClose,
  onSubmit,
  isLoading
}) => {
  const t = useTranslations('commentModal');
  const [text, setText] = useState(initialText);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pickerPortalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
    }
  }, [isOpen, initialText]);

  useEffect(() => {
    if (!isOpen) {
      setShowEmojiPicker(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, left: scrollX, behavior: 'instant' as ScrollBehavior });
    });
    return () => cancelAnimationFrame(frame);
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const getPickerPosition = () => {
    if (!triggerRef.current) return {};
    const rect = triggerRef.current.getBoundingClientRect();
    const pickerWidth = 320;
    const pickerHeight = 360;
    const gap = 8;

    let top = rect.top - pickerHeight - gap;
    let left = rect.right - pickerWidth;

    top = Math.max(gap, Math.min(top, window.innerHeight - pickerHeight - gap));
    left = Math.max(gap, Math.min(left, window.innerWidth - pickerWidth - gap));

    return {
      position: 'fixed' as const,
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 10001,
    };
  };

  const handleFormSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
    setShowEmojiPicker(false);
  };

  const handleInteractOutside = useCallback((event: Event) => {
    if (pickerPortalRef.current?.contains(event.target as Node)) {
      event.preventDefault();
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} onInteractOutside={handleInteractOutside}>
      <div className={styles.container}>
        <Input
          variant="multiline"
          placeholder={t('placeholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          isTransparent={true}
          icon={
            <Button
              variant='icon-only'
              ref={triggerRef}
              className={styles.emojiTrigger}
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiPicker(prev => !prev);
              }}
            >
              <EmojiIcon className={styles.icon} />
            </Button>
          }
        />

        {showEmojiPicker && mounted && createPortal(
          <>
            <button
              type="button"
              aria-label={t('closePicker')}
              className={styles.backdrop}
              onClick={() => setShowEmojiPicker(false)}
            />
            <div
              ref={pickerPortalRef}
              className={styles.portalWrapper}
              style={getPickerPosition()}
              onWheel={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className={styles.pickerContainer}>
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={Theme.DARK}
                  emojiStyle={EmojiStyle.NATIVE}
                  suggestedEmojisMode={SuggestionMode.RECENT}
                  lazyLoadEmojis={true}
                  width={320}
                  height={350}
                  autoFocusSearch={false}
                  searchDisabled
                  skinTonesDisabled
                />
              </div>
            </div>
          </>,
          document.body
        )}

        <div className={styles.footer}>
          <Button
            variant="colored-glass"
            onClick={handleFormSubmit}
            isLoading={isLoading}
            disabled={!text.trim()}
          >
            {t('submit')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

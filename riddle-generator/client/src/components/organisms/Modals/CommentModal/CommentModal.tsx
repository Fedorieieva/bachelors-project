"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { Modal } from '@/components/atoms/Modal/Modal';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import EmojiIcon from '@/assets/emoji.svg';
import styles from './CommentModal.module.scss';

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
  const [text, setText] = useState(initialText);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const getPickerPosition = () => {
    if (!triggerRef.current) return {};
    const rect = triggerRef.current.getBoundingClientRect();

    return {
      position: 'fixed' as const,
      top: `${rect.top - 360}px`,
      left: `${rect.left - 280}px`,
      zIndex: 10001,
    };
  };

  const handleFormSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
    setShowEmojiPicker(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <Input
          variant="multiline"
          placeholder="Enter your comment here"
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
                setShowEmojiPicker(!showEmojiPicker);
              }}
            >
              <EmojiIcon className={styles.icon} />
            </Button>
          }
        />

        {showEmojiPicker && mounted && createPortal(
          <>
            <div
              className={styles.backdrop}
              onClick={() => setShowEmojiPicker(false)}
            />
            <div
              className={styles.portalWrapper}
              style={getPickerPosition()}
              onWheel={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={Theme.DARK}
                width={320}
                height={350}
                autoFocusSearch={false}
                searchDisabled
                skinTonesDisabled
              />
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
            Comment
          </Button>
        </div>
      </div>
    </Modal>
  );
};
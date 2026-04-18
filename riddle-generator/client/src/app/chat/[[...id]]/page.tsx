"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useRiddleChat } from '@/hooks/riddles/useRiddleChat';
import { WelcomeSettings } from '@/components/organisms/Chat/WelcomeSettings/WelcomeSettings';
import { RiddleType, RiddleSettings, Message } from '@/types/riddle';
import { ChatMessageItem } from '@/components/organisms/Chat/ChatMessageItem/ChatMessageItem';
import { ChatInput } from '@/components/organisms/Chat/ChatInput/ChatInput';
import { Button } from '@/components/atoms/Button/Button';
import { useRiddleActions } from '@/hooks/riddles/useRiddleActions';
import styles from './ChatPage.module.scss';
import { RiddleCollectionModal } from '@/components/organisms/Modals/RiddlesCollectionModal/RiddlesCollectionModal';

const DEFAULT_SETTINGS: RiddleSettings = {
  type: RiddleType.LOGIC,
  complexity: 3,
  language: 'ukrainian',
  is_interactive: true,
};

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  const {
    messages,
    sendGuess,
    isSending,
    regenerate,
    isRegenerating,
    loadOlderMessages,
    isFetchingOlder,
    hasOlderMessages,
  } = useRiddleChat(chatId);

  const [inputValue, setInputValue] = useState('');
  const [currentSettings, setCurrentSettings] = useState<RiddleSettings>(DEFAULT_SETTINGS);
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);

  const { reveal, isRevealing, saveToCollection, togglePublic } = useRiddleActions(chatId as string);

  const saveScrollPosition = useCallback(() => {
    if (messagesContainerRef.current) {
      prevScrollHeightRef.current = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (!isFetchingOlder && messagesContainerRef.current && prevScrollHeightRef.current) {
      const diff = messagesContainerRef.current.scrollHeight - prevScrollHeightRef.current;
      messagesContainerRef.current.scrollTop += diff;
      prevScrollHeightRef.current = 0;
    }
  }, [isFetchingOlder, messages.length]);

  const scrollToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'instant',
        block: 'end',
      });
    });
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, optimisticMessage, isSending, scrollToBottom]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isSending) return;
    setOptimisticMessage(inputValue);
    sendGuess(inputValue, currentSettings);
    setInputValue('');
  }, [inputValue, currentSettings, sendGuess, isSending]);

  const displayMessages = useMemo<Message[]>(() => {
    const base = messages || [];
    if (!optimisticMessage) return base;
    const optMsg: Message = {
      id: 'optimistic',
      role: 'user',
      chat_id: chatId || '',
      content: optimisticMessage,
      is_initial: false,
      createdAt: new Date().toISOString(),
    };
    return [...base, optMsg];
  }, [messages, optimisticMessage, chatId]);

  const getDisplayContent = (msg: Message): string => {
    try {
      if (msg.role === 'model') {
        const parsed = JSON.parse(msg.content);
        return parsed.content || parsed.message || msg.content;
      }
    } catch {
      return msg.content;
    }
    return msg.content;
  };

  return (
    <div className={styles.chatPage}>
      {chatId && (
        <div className={styles.topActions}>
          <Button variant="grey-glass-tab" size="sm" onClick={() => setIsCollectionModalOpen(true)}>
            Колекція загадок
          </Button>
        </div>
      )}

      <div className={styles.messagesContainer} ref={messagesContainerRef}>
        <AnimatePresence mode="wait">
          {!chatId && messages.length === 0 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.welcomeWrapper}
            >
              <WelcomeSettings
                settings={currentSettings}
                onSettingsChange={setCurrentSettings}
              />
            </motion.div>
          ) : (
            <div className={styles.messagesList}>
              {hasOlderMessages && (
                <div>
                  <Button
                    variant="grey-glass-link"
                    onClick={loadOlderMessages}
                    isLoading={isFetchingOlder}
                  >
                    Завантажити попередні
                  </Button>
                </div>
              )}

              <LayoutGroup>
                {displayMessages.map((msg, index) => (
                  <ChatMessageItem
                    key={msg.id || `msg-${index}`}
                    msg={msg}
                    index={index}
                    isLast={index === displayMessages.length - 1}
                    isSending={isSending}
                    onRegenerate={regenerate}
                    isRegenerating={isRegenerating}
                    onReveal={() => reveal()}
                    isRevealing={isRevealing}
                    currentSettings={currentSettings}
                    displayContent={getDisplayContent(msg)}
                  />
                ))}
              </LayoutGroup>

              {isSending && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.loadingBubble}
                >
                  <div className={styles.dotTyping} />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.inputSticky}>
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isSending={isSending}
        />
      </div>

      <RiddleCollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        messages={messages}
        onSave={(id) => saveToCollection(id)}
        onTogglePublic={(riddleId) => togglePublic(riddleId)}
        savedRiddlesMap={{}}
      />
    </div>
  );
}
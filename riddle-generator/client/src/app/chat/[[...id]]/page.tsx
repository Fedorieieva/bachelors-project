"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useRiddleChat } from '@/hooks/riddles/useRiddleChat';
import { WelcomeSettings } from '@/components/organisms/Chat/WelcomeSettings/WelcomeSettings';
import { RiddleType, RiddleSettings, Message } from '@/types/riddle';
import { ChatMessageItem } from '@/components/organisms/Chat/ChatMessageItem/ChatMessageItem';
import { ChatInput } from '@/components/organisms/Chat/ChatInput/ChatInput';
import styles from './ChatPage.module.scss';

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

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);

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

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel || !chatId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasOlderMessages && !isFetchingOlder) {
          saveScrollPosition();
          loadOlderMessages();
        }
      },
      { rootMargin: '200px 0px 0px 0px', threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasOlderMessages, isFetchingOlder, loadOlderMessages, chatId, saveScrollPosition]);

  useEffect(() => {
    if (!isSending && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === 'model') {
        setOptimisticMessage(null);
      }
    }
  }, [isSending, messages]);

  const scrollToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'instant',
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
    if (!optimisticMessage) return messages;
    const optMsg: Message = {
      id: 'optimistic',
      role: 'user',
      content: optimisticMessage,
      is_initial: false,
    };
    return [...messages, optMsg];
  }, [messages, optimisticMessage]);

  const getDisplayContent = (msg: Message): string => {
    if (!msg || !msg.role) return '';

    if (msg.role === 'user') return msg.content || '';

    try {
      const content = msg.content;
      if (typeof content === 'string' && content.trim().startsWith('{')) {
        const parsed: unknown = JSON.parse(content);
        if (
          parsed !== null &&
          typeof parsed === 'object' &&
          !Array.isArray(parsed)
        ) {
          const record = parsed as Record<string, unknown>;
          const value = record['content'] ?? record['message'] ?? record['reasoning'];
          if (typeof value === 'string') return value;
        }
      }
    } catch (e) {
      return msg.content || '';
    }

    return msg.content || '';
  };

  return (
    <div className={styles.chatPage}>
      <div ref={messagesContainerRef} className={styles.messagesContainer}>
        <AnimatePresence mode="popLayout" initial={false}>
          {displayMessages.length === 0 && !chatId ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={styles.welcomeWrapper}
            >
              <WelcomeSettings
                initialSettings={currentSettings}
                onSync={setCurrentSettings}
              />
            </motion.div>
          ) : (
            <div key="chat-flow" className={styles.messagesList}>
              <div ref={topSentinelRef} aria-hidden="true" style={{ height: 1 }}>
                {isFetchingOlder && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.messageRow}
                  >
                    <div className={styles.loadingBubble}>
                      <div className={styles.dotTyping} />
                    </div>
                  </motion.div>
                )}
              </div>

              <LayoutGroup>
                {displayMessages.map((msg, index) => {
                  if (!msg) return null;

                  return (
                    <ChatMessageItem
                      key={msg.id || `msg-${index}`}
                      msg={msg}
                      index={index}
                      isLast={index === displayMessages.length - 1}
                      isSending={isSending}
                      onRegenerate={regenerate}
                      isRegenerating={isRegenerating}
                      currentSettings={currentSettings}
                      displayContent={getDisplayContent(msg)}
                    />
                  );
                })}
              </LayoutGroup>

              {isSending && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.messageRow}
                >
                  <div className={styles.loadingBubble}>
                    <div className={styles.dotTyping} />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        isSending={isSending}
      />
    </div>
  );
}
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useRiddleChat } from '@/hooks/riddles/useRiddleChat';
import { WelcomeSettings } from '@/components/organisms/Chat/WelcomeSettings/WelcomeSettings';
import { RiddleType, RiddleSettings, Message } from '@/types/riddle';
import styles from './ChatPage.module.scss';
import { ChatMessageItem } from '@/components/organisms/Chat/ChatMessageItem/ChatMessageItem';
import { ChatInput } from '@/components/organisms/Chat/ChatInput/ChatInput';

const DEFAULT_SETTINGS: RiddleSettings = {
  type: RiddleType.LOGIC,
  complexity: 3,
  language: 'ukrainian',
  is_interactive: true
};

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;

  const { messages, sendGuess, isSending, regenerate, isRegenerating } = useRiddleChat(chatId);

  const [inputValue, setInputValue] = useState('');
  const [currentSettings, setCurrentSettings] = useState<RiddleSettings>(DEFAULT_SETTINGS);
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSending && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'model') setOptimisticMessage(null);
    }
  }, [isSending, messages]);

  const scrollToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const scrollOptions: ScrollToOptions = {
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    };
    requestAnimationFrame(() => {
      container.scrollTo(scrollOptions);
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

  const displayMessages = useMemo(() => {
    if (!optimisticMessage) return messages;
    const optMsg: Message = {
      id: 'optimistic',
      role: 'user',
      content: optimisticMessage,
      is_initial: false
    };
    return [...messages, optMsg];
  }, [messages, optimisticMessage]);

  const getDisplayContent = (msg: Message): string => {
    if (msg.role === 'user') return msg.content;
    try {
      if (typeof msg.content === 'string' && msg.content.trim().startsWith('{')) {
        const parsed = JSON.parse(msg.content);
        return parsed.content || parsed.message || parsed.reasoning || msg.content;
      }
    } catch (e) { return msg.content; }
    return msg.content;
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
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
import { useDeleteRiddle, useRiddleActions } from '@/hooks/riddles/useRiddleActions';
import styles from './ChatPage.module.scss';
import { RiddleCollectionModal } from '@/components/organisms/Modals/RiddlesCollectionModal/RiddlesCollectionModal';
import { useRiddleMessages } from '@/hooks/riddles/useRiddleMessages';
import { useTranslations } from 'next-intl';

const MODEL_STORAGE_KEY = 'genigma-model';
const DEFAULT_MODEL = 'gemini-2.0-flash';

function getInitialSettings(): RiddleSettings {
  let savedModel = DEFAULT_MODEL;

  if (typeof globalThis.window !== 'undefined') {
    const stored = localStorage.getItem(MODEL_STORAGE_KEY);
    if (stored && !stored.startsWith('gemini-1.')) {
      savedModel = stored;
    } else if (stored) {
      localStorage.setItem(MODEL_STORAGE_KEY, DEFAULT_MODEL);
    }
  }

  return {
    type: RiddleType.LOGIC,
    complexity: 3,
    is_interactive: true,
    model: savedModel,
  };
}

export default function ChatPage() {
  const t = useTranslations('chatPage');
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
  } = useRiddleChat(chatId, (fallbackModel) => {
    setCurrentSettings(prev => ({ ...prev, model: fallbackModel }));
  });

  const {
    riddleMessages,
    saveToCollection,
    isSaving,
    togglePublic: togglePublicModal,
    isTogglingPublic,
  } = useRiddleMessages(chatId);

  const { deleteRiddle, isDeleting } = useDeleteRiddle(chatId);

  const { reveal, isRevealing } = useRiddleActions(chatId as string);

  const [inputValue, setInputValue] = useState('');
  const [currentSettings, setCurrentSettings] = useState<RiddleSettings>(getInitialSettings);
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  useEffect(() => {
    if (currentSettings.model) {
      localStorage.setItem(MODEL_STORAGE_KEY, currentSettings.model);
    }
  }, [currentSettings.model]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
          <Button variant="grey-glass-tab" size="auto" onClick={() => setIsCollectionModalOpen(true)}>
            {t('riddleCollection')}
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
                initialSettings={currentSettings}
                onSync={setCurrentSettings}
              />
            </motion.div>
          ) : (
            <div className={styles.messagesList}>
              {hasOlderMessages && (
                <div>
                  <Button
                    variant="grey-glass-link"
                    onClick={() => {
                      saveScrollPosition();
                      loadOlderMessages();
                    }}
                    isLoading={isFetchingOlder}
                  >
                    {t('loadOlder')}
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
          selectedModel={currentSettings.model}
          onModelChange={(model) =>
            setCurrentSettings(prev => ({ ...prev, model }))
          }
        />
      </div>

      <RiddleCollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        riddleMessages={riddleMessages}
        onSave={saveToCollection}
        onTogglePublic={togglePublicModal}
        onDelete={(id) => deleteRiddle(id)}
        isSaving={isSaving}
        isTogglingPublic={isTogglingPublic}
        isDeleting={isDeleting}
      />
    </div>
  );
}
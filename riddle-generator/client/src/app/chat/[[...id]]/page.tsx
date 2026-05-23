"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useRiddleChat } from '@/hooks/riddles/useRiddleChat';
import { useCrosswordGenerator } from '@/hooks/riddles/useCrosswordGenerator';
import { WelcomeSettings } from '@/components/organisms/Chat/WelcomeSettings/WelcomeSettings';
import { CrosswordResult } from '@/components/organisms/Chat/CrosswordResult/CrosswordResult';
import { IMAGE_GENERATION_MODEL, RiddleType, RiddleSettings, Message, CrosswordLayout } from '@/types/riddle';
import { RiddleService } from '@/services/riddle.service';
import { useGlobalToast } from '@/providers/ToastProvider';
import { ChatMessageItem } from '@/components/organisms/Chat/ChatMessageItem/ChatMessageItem';
import { ChatInput } from '@/components/organisms/Chat/ChatInput/ChatInput';
import { Button } from '@/components/atoms/Button/Button';
import { useDeleteRiddle, useRiddleActions } from '@/hooks/riddles/useRiddleActions';
import styles from './ChatPage.module.scss';
import { RiddleCollectionModal } from '@/components/organisms/Modals/RiddlesCollectionModal/RiddlesCollectionModal';
import { useRiddleMessages } from '@/hooks/riddles/useRiddleMessages';
import { useTranslations } from 'next-intl';

const MODEL_STORAGE_KEY = 'genigma-model';
const DEFAULT_MODEL = 'gemini-2.5-flash-lite';

function getInitialSettings(): RiddleSettings {
  let savedModel = DEFAULT_MODEL;

  if (globalThis.window !== undefined) {
    const stored = localStorage.getItem(MODEL_STORAGE_KEY);
    const isLegacy = stored && (
      stored.startsWith('gemini-1.') ||
      stored.startsWith('gemini-2.0') ||
      stored === 'gemini-2.5-flash-image'
    );
    if (stored && !isLegacy) {
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
    generate_image: savedModel === IMAGE_GENERATION_MODEL,
  };
}

interface ParsedCrossword {
  layout: CrosswordLayout;
  theme: string;
  riddle_id?: string;
}

function parseCrosswordMessage(content: string): ParsedCrossword | null {
  try {
    const p = JSON.parse(content) as { type?: string; layout?: CrosswordLayout; theme?: string; riddle_id?: string };
    if (p.type === 'CROSSWORD_LAYOUT' && p.layout?.words && p.layout?.gridSize) {
      return { layout: p.layout, theme: p.theme ?? '', riddle_id: p.riddle_id };
    }
  } catch {

  }
  return null;
}

export default function ChatPage() {
  const t = useTranslations('chatPage');
  const { showGlobalToast } = useGlobalToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const rawId = params.id;
  const chatId: string | undefined = Array.isArray(rawId) ? rawId[0] : rawId;

  const {
    messages,
    extraMessages,
    sendGuess,
    isSending,
    regenerate,
    isRegenerating,
    loadOlderMessages,
    isFetchingOlder,
    hasOlderMessages,
  } = useRiddleChat(chatId, (fallbackModel) => {
    setCurrentSettings(prev => ({
      ...prev,
      model: fallbackModel,
      generate_image: fallbackModel === IMAGE_GENERATION_MODEL,
    }));
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

  const {
    layout: crosswordLayout,
    chatId: crosswordChatId,
    riddleId: crosswordRiddleId,
    isGenerating: isCrosswordGenerating,
    error: crosswordError,
    generate: generateCrossword,
    reset: resetCrossword,
  } = useCrosswordGenerator();

  useEffect(() => {
    if (crosswordChatId && !chatId) {
      router.push(`/chat/${crosswordChatId}`);
    }
  }, [crosswordChatId, chatId, router]);

  const parsedCrossword = useMemo<ParsedCrossword | null>(() => {
    for (const msg of messages) {
      if (msg.role !== 'model') continue;
      const parsed = parseCrosswordMessage(msg.content);
      if (parsed) return parsed;
    }
    return null;
  }, [messages]);

  const activeCrossword = parsedCrossword
    ?? (crosswordLayout ? { layout: crosswordLayout, theme: '', riddle_id: crosswordRiddleId ?? undefined } : null);
  const activeRiddleId = parsedCrossword?.riddle_id ?? crosswordRiddleId ?? undefined;

  const [isShared, setIsShared] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [crosswordInitialAnswers, setCrosswordInitialAnswers] = useState<Record<number, string> | undefined>(undefined);
  const [crosswordIsSolved, setCrosswordIsSolved] = useState(false);

  // Fetch persisted progress / solved state when we know the riddleId
  useEffect(() => {
    if (!activeRiddleId) return;
    RiddleService.getRiddleById(activeRiddleId)
      .then((detail) => {
        if (detail.is_solved) {
          setCrosswordIsSolved(true);
          setCrosswordInitialAnswers(undefined);
        } else if (detail.crossword_progress) {
          const asNumbers = Object.fromEntries(
            Object.entries(detail.crossword_progress).map(([k, v]) => [Number(k), v]),
          ) as Record<number, string>;
          setCrosswordInitialAnswers(asNumbers);
        }
      })
      .catch(() => {/* guest or network error — play without progress */});
  }, [activeRiddleId]);

  const progressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel any pending debounced save when unmounting
  useEffect(() => {
    return () => {
      if (progressDebounceRef.current) clearTimeout(progressDebounceRef.current);
    };
  }, []);

  const handleProgressChange = useCallback((answers: Record<number, string>) => {
    if (!activeRiddleId) return;
    if (progressDebounceRef.current) clearTimeout(progressDebounceRef.current);
    progressDebounceRef.current = setTimeout(() => {
      const asStrings = Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [k, v]),
      ) as Record<string, string>;
      void RiddleService.saveProgress(activeRiddleId, asStrings);
    }, 1200);
  }, [activeRiddleId]);

  const handleShare = useCallback(async () => {
    if (!activeRiddleId) return;
    setIsSharing(true);
    try {
      await RiddleService.togglePublic(activeRiddleId);
      setIsShared(true);
      showGlobalToast('Crossword shared to the social feed!', 'success');
    } catch {
      showGlobalToast('Failed to share crossword', 'error');
    } finally {
      setIsSharing(false);
    }
  }, [activeRiddleId, showGlobalToast]);

  const handleCrosswordComplete = useCallback(async () => {
    if (!activeRiddleId) return;
    try {
      const result = await RiddleService.completeCrossword(activeRiddleId);
      if (result.xp_earned > 0) {
        showGlobalToast(`+${result.xp_earned} XP — crossword solved!`, 'success');
      }
      void queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    } catch {
      // award XP failed — non-fatal
    }
  }, [activeRiddleId, showGlobalToast, queryClient]);

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

  const handleWelcomeGenerate = useCallback((theme: string, customWords: string[]) => {
    void generateCrossword({ theme, customWords, language: currentSettings.language });
  }, [generateCrossword, currentSettings.language]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isSending) return;
    setOptimisticMessage(inputValue);
    sendGuess(inputValue, currentSettings);
    setInputValue('');
  }, [inputValue, currentSettings, sendGuess, isSending]);

  const displayMessages = useMemo<Message[]>(() => {
    const base = messages || [];
    const withOptimistic: Message[] = optimisticMessage
      ? [
          ...base,
          {
            id: 'optimistic',
            role: 'user' as const,
            chat_id: chatId || '',
            content: optimisticMessage,
            is_initial: false,
            createdAt: new Date().toISOString(),
          },
        ]
      : base;
    return extraMessages.length > 0 ? [...withOptimistic, ...extraMessages] : withOptimistic;
  }, [messages, extraMessages, optimisticMessage, chatId]);

  const getDisplayContent = (msg: Message): string => {
    try {
      if (msg.role === 'model') {
        const parsed = JSON.parse(msg.content) as Record<string, unknown>;
        return (typeof parsed.content === 'string' ? parsed.content : null)
          ?? (typeof parsed.message === 'string' ? parsed.message : null)
          ?? msg.content;
      }
    } catch {
      return msg.content;
    }
    return msg.content;
  };

  const getDisplayImageUrl = (msg: Message): string | undefined => {
    if (msg.role !== 'model') return undefined;
    try {
      const parsed = JSON.parse(msg.content) as Record<string, unknown>;
      if (typeof parsed.image_url === 'string') return parsed.image_url;
    } catch {
      return undefined;
    }
    return undefined;
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
          {activeCrossword ? (
            <motion.div
              key="crossword"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.welcomeWrapper}
            >
              <CrosswordResult
                layout={activeCrossword.layout}
                riddleId={activeRiddleId}
                onReset={parsedCrossword ? () => router.push('/chat') : resetCrossword}
                onComplete={() => void handleCrosswordComplete()}
                onShare={() => void handleShare()}
                isSharing={isSharing}
                isShared={isShared}
                initialAnswers={crosswordInitialAnswers}
                isSolved={crosswordIsSolved}
                onProgressChange={handleProgressChange}
              />
            </motion.div>
          ) : !chatId && messages.length === 0 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.welcomeWrapper}
            >
              {crosswordError ? (
                <div className={styles.crosswordError}>
                  <WelcomeSettings
                    initialSettings={currentSettings}
                    onSync={setCurrentSettings}
                    onGenerate={handleWelcomeGenerate}
                    isGenerating={isCrosswordGenerating}
                  />
                  <p className={styles.errorMsg}>{crosswordError}</p>
                </div>
              ) : (
                <WelcomeSettings
                  initialSettings={currentSettings}
                  onSync={setCurrentSettings}
                  onGenerate={handleWelcomeGenerate}
                  isGenerating={isCrosswordGenerating}
                />
              )}
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
                    isLast={index === displayMessages.length - 1}
                    isSending={isSending}
                    onRegenerate={regenerate}
                    isRegenerating={isRegenerating}
                    onReveal={() => reveal()}
                    isRevealing={isRevealing}
                    currentSettings={currentSettings}
                    displayContent={getDisplayContent(msg)}
                    imageUrl={getDisplayImageUrl(msg)}
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

      {!activeCrossword && !(currentSettings.type === RiddleType.CROSSWORD && !chatId && messages.length === 0) && (
        <div className={styles.inputSticky}>
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            isSending={isSending}
            selectedModel={currentSettings.model}
            onModelChange={(model) =>
              setCurrentSettings(prev => ({
                ...prev,
                model,
                generate_image: model === IMAGE_GENERATION_MODEL,
              }))
            }
          />
        </div>
      )}

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

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
import { Modal } from '@/components/atoms/Modal/Modal';
import { useRiddleMessages } from '@/hooks/riddles/useRiddleMessages';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

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
  // Derive the explicit language string from the active next-intl locale so
  // that Gemini generates content in the user's current UI language rather
  // than defaulting to English. Extend the mapping below as new locales land.
  const locale = useLocale();
  const localeLanguage = locale === 'uk' ? 'ukrainian' : 'english';
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
  } = useRiddleChat(
    chatId,
    // onModelFallback — sync the UI model selector to whichever model the backend fell back to
    (fallbackModel) => {
      setCurrentSettings(prev => ({
        ...prev,
        model: fallbackModel,
        generate_image: fallbackModel === IMAGE_GENERATION_MODEL,
      }));
    },
    // onMessageSettled — clear the optimistic ghost bubble once the mutation settles
    // (success or error) so the message is never duplicated in the display list.
    () => setOptimisticMessage(null),
  );

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

  const allParsedCrosswords = useMemo<ParsedCrossword[]>(() => {
    const result: ParsedCrossword[] = [];
    for (const msg of messages) {
      if (msg.role !== 'model') continue;
      const parsed = parseCrosswordMessage(msg.content);
      if (parsed) result.push(parsed);
    }
    return result;
  }, [messages]);

  const [crosswordIndex, setCrosswordIndex] = useState(0);

  // Clamp index when older messages load additional crosswords
  useEffect(() => {
    if (allParsedCrosswords.length > 0 && crosswordIndex >= allParsedCrosswords.length) {
      setCrosswordIndex(allParsedCrosswords.length - 1);
    }
  }, [allParsedCrosswords.length, crosswordIndex]);

  const parsedCrossword = allParsedCrosswords[crosswordIndex] ?? null;

  const activeCrossword = parsedCrossword
    ?? (crosswordLayout ? { layout: crosswordLayout, theme: '', riddle_id: crosswordRiddleId ?? undefined } : null);
  const activeRiddleId = parsedCrossword?.riddle_id ?? crosswordRiddleId ?? undefined;

  const [isShared, setIsShared] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isUnsharing, setIsUnsharing] = useState(false);
  const [crosswordIsPublic, setCrosswordIsPublic] = useState(false);
  const [crosswordInitialAnswers, setCrosswordInitialAnswers] = useState<Record<number, string> | undefined>(undefined);
  const [crosswordIsSolved, setCrosswordIsSolved] = useState(false);

  // Fetch persisted progress / solved state / public state when riddleId is known
  useEffect(() => {
    if (!activeRiddleId) return;
    // Reset session-local share state when switching crosswords
    setIsShared(false);
    setCrosswordIsPublic(false);
    setCrosswordInitialAnswers(undefined);
    setCrosswordIsSolved(false);
    RiddleService.getRiddleById(activeRiddleId)
      .then((detail) => {
        setCrosswordIsPublic(detail.is_public ?? false);
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
      setCrosswordIsPublic(true);
      showGlobalToast('Crossword shared to the social feed!', 'success');
    } catch {
      showGlobalToast('Failed to share crossword', 'error');
    } finally {
      setIsSharing(false);
    }
  }, [activeRiddleId, showGlobalToast]);

  const handleUnshare = useCallback(async () => {
    if (!activeRiddleId) return;
    setIsUnsharing(true);
    try {
      await RiddleService.unpublishCrossword(activeRiddleId);
      setCrosswordIsPublic(false);
      showGlobalToast('Crossword removed from the feed.', 'success');
    } catch {
      showGlobalToast('Failed to remove crossword from feed.', 'error');
    } finally {
      setIsUnsharing(false);
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

  // ── Inline "New Crossword" panel (session-bound, no redirect) ────────────────
  const [isNewPanelOpen, setIsNewPanelOpen] = useState(false);
  const [inlineTheme, setInlineTheme] = useState('');
  const [inlineComplexity, setInlineComplexity] = useState(3);
  const [inlineWordCount, setInlineWordCount] = useState(10);
  const [isInlineGenerating, setIsInlineGenerating] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  // Auto-advance paginator when messages reload with a newly appended crossword
  const prevCrosswordCountRef = useRef(0);
  useEffect(() => {
    if (allParsedCrosswords.length > prevCrosswordCountRef.current && prevCrosswordCountRef.current > 0) {
      setCrosswordIndex(allParsedCrosswords.length - 1);
    }
    prevCrosswordCountRef.current = allParsedCrosswords.length;
  }, [allParsedCrosswords.length]);

  const handleInlineGenerate = useCallback(async () => {
    if (!inlineTheme.trim() || !chatId) return;
    setIsInlineGenerating(true);
    setInlineError(null);
    try {
      const layout = await RiddleService.generateCrossword({
        theme: inlineTheme.trim(),
        complexity: inlineComplexity,
        wordCount: inlineWordCount,
        // Use the locale-derived language so inline crossword clues are also
        // generated in the user's current UI language.
        language: localeLanguage,
      });
      await RiddleService.saveCrossword({
        layout,
        theme: inlineTheme.trim(),
        language: localeLanguage,
        chatId,
      });
      void queryClient.invalidateQueries({ queryKey: ['chat-history', chatId] });
      setIsNewPanelOpen(false);
      setInlineTheme('');
    } catch {
      setInlineError(t('newCrosswordError'));
    } finally {
      setIsInlineGenerating(false);
    }
  }, [inlineTheme, inlineComplexity, inlineWordCount, chatId, localeLanguage, queryClient, t]);

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
    void generateCrossword({
      theme,
      customWords,
      // Use locale-derived language for welcome-screen crossword generation too.
      language: localeLanguage,
      complexity: currentSettings.complexity,
      wordCount: currentSettings.crosswordWordCount ?? 10,
    });
  }, [generateCrossword, localeLanguage, currentSettings.complexity, currentSettings.crosswordWordCount]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isSending) return;
    setOptimisticMessage(inputValue);

    // Build a sanitized settings object:
    //  1. Strip crossword-only fields for non-CROSSWORD types so the NestJS
    //     ValidationPipe (forbidNonWhitelisted: true) never sees unknown keys.
    //  2. Force the language field from the active next-intl locale so Gemini
    //     generates content in the user's current UI language, not English.
    const settingsToSend: RiddleSettings = {
      ...currentSettings,
      language: localeLanguage,
    };
    if (settingsToSend.type !== RiddleType.CROSSWORD) {
      delete settingsToSend.crosswordTheme;
      delete settingsToSend.crosswordCustomWords;
      delete settingsToSend.crosswordWordCount;
    }

    sendGuess(inputValue, settingsToSend);
    setInputValue('');
    // Note: optimisticMessage is cleared via the onMessageSettled callback
    // passed to useRiddleChat, which fires in both onSuccess and onError.
    // This avoids a race where clearing it here would remove the bubble before
    // the real message arrives from the server.
  }, [inputValue, currentSettings, localeLanguage, sendGuess, isSending]);

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
          {allParsedCrosswords.length > 1 ? (
            <div className={styles.crosswordPaginator}>
              <button
                className={styles.paginatorBtn}
                onClick={() => setCrosswordIndex(i => Math.max(0, i - 1))}
                disabled={crosswordIndex === 0}
                aria-label="Previous crossword"
              >
                ←
              </button>
              <span className={styles.paginatorCount}>
                {crosswordIndex + 1}&thinsp;/&thinsp;{allParsedCrosswords.length}
              </span>
              <button
                className={styles.paginatorBtn}
                onClick={() => setCrosswordIndex(i => Math.min(allParsedCrosswords.length - 1, i + 1))}
                disabled={crosswordIndex === allParsedCrosswords.length - 1}
                aria-label="Next crossword"
              >
                →
              </button>
            </div>
          ) : (
            <Button variant="grey-glass-tab" size="auto" onClick={() => setIsCollectionModalOpen(true)}>
              {t('riddleCollection')}
            </Button>
          )}
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
                onNewCrossword={chatId ? () => setIsNewPanelOpen(true) : undefined}
                onComplete={() => void handleCrosswordComplete()}
                onShare={() => void handleShare()}
                isSharing={isSharing}
                isShared={isShared}
                isPublic={crosswordIsPublic}
                onUnshare={() => void handleUnshare()}
                isUnsharing={isUnsharing}
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

      {/* Inline "New Crossword" generation panel — no redirect, session-bound */}
      <Modal
        isOpen={isNewPanelOpen}
        onClose={() => { setIsNewPanelOpen(false); setInlineError(null); }}
        title={t('newCrosswordTitle')}
      >
        <div className={styles.inlinePanel}>
          {/* Theme */}
          <div className={styles.inlinePanelField}>
            <span className={styles.inlinePanelLabel}>{t('newCrosswordTheme')}</span>
            <input
              className={styles.inlinePanelInput}
              type="text"
              placeholder={t('newCrosswordThemePlaceholder')}
              value={inlineTheme}
              onChange={(e) => setInlineTheme(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && inlineTheme.trim()) void handleInlineGenerate(); }}
              autoFocus
            />
          </div>

          {/* Complexity */}
          <div className={styles.inlinePanelField}>
            <span className={styles.inlinePanelLabel}>{t('newCrosswordComplexity')}</span>
            <div className={styles.inlinePanelComplexity}>
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={cn(styles.inlinePanelDot, { [styles.active]: inlineComplexity >= level })}
                  onClick={() => setInlineComplexity(level)}
                />
              ))}
            </div>
          </div>

          {/* Word count */}
          <div className={styles.inlinePanelField}>
            <span className={styles.inlinePanelLabel}>{t('newCrosswordWordCount')}</span>
            <div className={styles.inlinePanelSliderRow}>
              <span className={styles.inlinePanelSliderValue}>
                {t('newCrosswordWordCountValue', { count: inlineWordCount })}
              </span>
              <input
                type="range"
                className={styles.inlinePanelSlider}
                min={5}
                max={20}
                step={1}
                value={inlineWordCount}
                onChange={(e) => setInlineWordCount(Number(e.target.value))}
              />
            </div>
          </div>

          {inlineError && <p className={styles.inlinePanelError}>{inlineError}</p>}

          <Button
            variant="colored-glass"
            fullWidth
            onClick={() => void handleInlineGenerate()}
            isLoading={isInlineGenerating}
            disabled={!inlineTheme.trim()}
          >
            {t('newCrosswordGenerate')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

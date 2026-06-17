"use client";

import { useState, useCallback } from 'react';
import { RiddleService } from '@/services/riddle.service';
import { CrosswordLayout, CrosswordGenerateRequest } from '@/types/riddle';

interface CrosswordGeneratorState {
  layout: CrosswordLayout | null;
  chatId: string | null;
  riddleId: string | null;
  isGenerating: boolean;
  error: string | null;
}

const INITIAL_STATE: CrosswordGeneratorState = {
  layout: null,
  chatId: null,
  riddleId: null,
  isGenerating: false,
  error: null,
};

export function useCrosswordGenerator() {
  const [state, setState] = useState<CrosswordGeneratorState>(INITIAL_STATE);

  const generate = useCallback(async (req: CrosswordGenerateRequest) => {
    setState({ layout: null, chatId: null, riddleId: null, isGenerating: true, error: null });
    try {
      const layout = await RiddleService.generateCrossword(req);

      let chatId: string | null = null;
      let riddleId: string | null = null;
      try {
        const saved = await RiddleService.saveCrossword({
          layout,
          theme: req.theme,
          language: req.language,
        });
        chatId = saved.chatId;
        riddleId = saved.riddleId;
      } catch {
      }

      setState({ layout, chatId, riddleId, isGenerating: false, error: null });
    } catch (err: unknown) {
      const httpStatus = (err as { response?: { status?: number } }).response?.status;
      const message =
        httpStatus === 429
          ? 'AI is at capacity — please try again in a moment.'
          : 'Crossword generation failed. Please try again.';
      setState({ layout: null, chatId: null, riddleId: null, isGenerating: false, error: message });
    }
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  return {
    layout: state.layout,
    chatId: state.chatId,
    riddleId: state.riddleId,
    isGenerating: state.isGenerating,
    error: state.error,
    generate,
    reset,
  };
}

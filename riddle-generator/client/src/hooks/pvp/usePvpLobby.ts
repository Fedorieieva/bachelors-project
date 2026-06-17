"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { PvpService } from '@/services/pvp.service';
import { PvpMatch, GuessResult, PendingRoom } from '@/types/pvp';

type LobbyPhase = 'idle' | 'waiting' | 'active' | 'finished';

interface LobbyState {
  phase: LobbyPhase;
  matchId: string | null;
  match: PvpMatch | null;
  guessResult: GuessResult | null;
  error: string | null;
}

const POLL_WAITING_MS = 3000;
const POLL_ACTIVE_MS = 2000;
const POLL_PENDING_MS = 10_000;

export function usePvpLobby() {
  const [state, setState] = useState<LobbyState>({
    phase: 'idle',
    matchId: null,
    match: null,
    guessResult: null,
    error: null,
  });
  const [pendingRooms, setPendingRooms] = useState<PendingRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const mountedRef = useRef(true);

  const isPollingRef = useRef(false);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      isPollingRef.current = false;
      if (pollTimerRef.current !== null) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, []);

  const clearPoll = useCallback(() => {
    isPollingRef.current = false;
    if (pollTimerRef.current !== null) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const fetchPending = useCallback(async () => {
    try {
      const rooms = await PvpService.getPending();
      if (mountedRef.current) setPendingRooms(rooms);
    } catch {
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const run = async () => {
      await fetchPending();
      if (!cancelled) {
        timerId = setTimeout(() => void run(), POLL_PENDING_MS);
      }
    };

    void run();

    return () => {
      cancelled = true;
      if (timerId !== null) clearTimeout(timerId);
    };
  }, [fetchPending]);

  const startPoll = useCallback(
    (matchId: string, interval: number) => {
      clearPoll();
      isPollingRef.current = true;

      const tick = async () => {
        if (!isPollingRef.current || !mountedRef.current) return;

        try {
          const match = await PvpService.getMatch(matchId);

          if (!isPollingRef.current || !mountedRef.current) return;

          const nextPhase: LobbyPhase =
            match.status === 'ACTIVE'
              ? 'active'
              : match.status === 'FINISHED' || match.status === 'CANCELLED'
                ? 'finished'
                : 'waiting';

          setState((prev) => ({ ...prev, match, phase: nextPhase }));

          if (nextPhase === 'finished') {
            isPollingRef.current = false;
            return;
          }
        } catch {
        }

        if (isPollingRef.current && mountedRef.current) {
          pollTimerRef.current = setTimeout(tick, interval);
        }
      };

      pollTimerRef.current = setTimeout(tick, interval);
    },
    [clearPoll],
  );

  useEffect(() => {
    if (!state.matchId) return;
    if (state.phase === 'waiting') startPoll(state.matchId, POLL_WAITING_MS);
    else if (state.phase === 'active') startPoll(state.matchId, POLL_ACTIVE_MS);
    else clearPoll();

    return clearPoll;
  }, [state.phase, state.matchId, startPoll, clearPoll]);

  const createRoom = useCallback(async () => {
    setIsLoading(true);
    setState((prev) => ({ ...prev, error: null }));
    try {
      const created = await PvpService.createRoom();
      setState((prev) => ({ ...prev, phase: 'waiting', matchId: created.id, match: null }));
      await fetchPending();
    } catch (err) {
      setState((prev) => ({ ...prev, error: (err as Error).message }));
    } finally {
      setIsLoading(false);
    }
  }, [fetchPending]);

  const joinRoom = useCallback(
    async (matchId: string) => {
      setIsLoading(true);
      setState((prev) => ({ ...prev, error: null }));
      try {
        const match = await PvpService.joinRoom(matchId);
        const phase: LobbyPhase = match.status === 'ACTIVE' ? 'active' : 'waiting';
        setState((prev) => ({ ...prev, phase, matchId: match.id, match }));
        await fetchPending();
      } catch (err) {
        const httpStatus = (err as { response?: { status?: number } }).response?.status;
        const message =
          httpStatus === 403
            ? 'This arena room is already full or has been closed by the creator.'
            : ((err as Error).message ?? 'Failed to join the room. Please try again.');
        setState((prev) => ({ ...prev, error: message }));
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPending],
  );

  const submitGuess = useCallback(
    async (guess: string, answers?: Record<string, string>): Promise<GuessResult | null> => {
      if (!state.matchId) return null;
      try {
        const result = await PvpService.submitGuess(state.matchId, guess, answers);
        if (result.correct) {
          setState((prev) => ({ ...prev, phase: 'finished', guessResult: result }));
          clearPoll();
        }
        return result;
      } catch (err) {
        setState((prev) => ({ ...prev, error: (err as Error).message }));
        return null;
      }
    },
    [state.matchId, clearPoll],
  );

  const cancelRoom = useCallback(async () => {
    if (!state.matchId) return;
    try {
      await PvpService.cancelMatch(state.matchId);
    } catch {
    } finally {
      clearPoll();
      setState({ phase: 'idle', matchId: null, match: null, guessResult: null, error: null });
      await fetchPending();
    }
  }, [state.matchId, clearPoll, fetchPending]);

  const reset = useCallback(() => {
    clearPoll();
    setState({ phase: 'idle', matchId: null, match: null, guessResult: null, error: null });
    void fetchPending();
  }, [clearPoll, fetchPending]);

  return {
    ...state,
    pendingRooms,
    isLoading,
    createRoom,
    joinRoom,
    submitGuess,
    cancelRoom,
    reset,
    refreshPending: fetchPending,
  };
}

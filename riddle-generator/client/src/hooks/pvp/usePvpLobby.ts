"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { PvpService } from '@/services/pvp.service';
import { PvpMatch, PvpStatus, GuessResult, PendingRoom } from '@/types/pvp';

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
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const fetchPending = useCallback(async () => {
    try {
      const rooms = await PvpService.getPending();
      setPendingRooms(rooms);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    void fetchPending();
    const id = setInterval(fetchPending, 10_000);
    return () => clearInterval(id);
  }, [fetchPending]);

  const pollMatch = useCallback(async (matchId: string) => {
    try {
      const match = await PvpService.getMatch(matchId);
      const nextPhase: LobbyPhase =
        match.status === 'ACTIVE' ? 'active'
        : match.status === 'FINISHED' || match.status === 'CANCELLED' ? 'finished'
        : 'waiting';

      setState((prev) => ({ ...prev, match, phase: nextPhase }));

      if (nextPhase === 'finished') clearPoll();
    } catch {
      // network blip — keep polling
    }
  }, [clearPoll]);

  const startPolling = useCallback((matchId: string, interval: number) => {
    clearPoll();
    pollRef.current = setInterval(() => void pollMatch(matchId), interval);
  }, [clearPoll, pollMatch]);

  useEffect(() => {
    if (!state.matchId) return;
    if (state.phase === 'waiting') startPolling(state.matchId, POLL_WAITING_MS);
    else if (state.phase === 'active') startPolling(state.matchId, POLL_ACTIVE_MS);
    else clearPoll();

    return clearPoll;
  }, [state.phase, state.matchId, startPolling, clearPoll]);

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

  const joinRoom = useCallback(async (matchId: string) => {
    setIsLoading(true);
    setState((prev) => ({ ...prev, error: null }));
    try {
      const match = await PvpService.joinRoom(matchId);
      const phase: LobbyPhase = match.status === 'ACTIVE' ? 'active' : 'waiting';
      setState((prev) => ({ ...prev, phase, matchId: match.id, match }));
      await fetchPending();
    } catch (err) {
      setState((prev) => ({ ...prev, error: (err as Error).message }));
    } finally {
      setIsLoading(false);
    }
  }, [fetchPending]);

  const submitGuess = useCallback(async (guess: string): Promise<GuessResult | null> => {
    if (!state.matchId) return null;
    try {
      const result = await PvpService.submitGuess(state.matchId, guess);
      if (result.correct) {
        setState((prev) => ({ ...prev, phase: 'finished', guessResult: result }));
        clearPoll();
      }
      return result;
    } catch (err) {
      setState((prev) => ({ ...prev, error: (err as Error).message }));
      return null;
    }
  }, [state.matchId, clearPoll]);

  const cancelRoom = useCallback(async () => {
    if (!state.matchId) return;
    try {
      await PvpService.cancelMatch(state.matchId);
    } catch {
      // silent — already removed or not creator
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

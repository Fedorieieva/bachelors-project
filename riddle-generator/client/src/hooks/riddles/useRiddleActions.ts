import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RiddleService } from '@/services/riddle.service';
import { RiddleSettings, SolveResult } from '@/types/riddle';

export const useRiddleActions = (chatId: string) => {
  const queryClient = useQueryClient();

  const regenerate = useMutation({
    mutationFn: (settings: RiddleSettings) => RiddleService.regenerateRiddle(chatId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history', chatId] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    }
  });

  const reveal = useMutation({
    mutationFn: () => RiddleService.revealAnswer(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history', chatId] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    }
  });

  return {
    regenerate: regenerate.mutate,
    isRegenerating: regenerate.isPending,
    reveal: reveal.mutate,
    isRevealing: reveal.isPending,
  };
};

export const useSolveRiddle = (riddleId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (guess: string) => RiddleService.solveChallenge(riddleId, guess),
    onSuccess: (data: SolveResult) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['user-stats', 'me'] });
        queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      }
    }
  });

  return {
    solveRiddle: mutation.mutate,
    isSolving: mutation.isPending,
    result: mutation.data,
    error: mutation.error,
  };
};

export const useRiddleEconomy = (riddleId: string) => {
  const queryClient = useQueryClient();

  const invalidateUserData = () => {
    queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    queryClient.invalidateQueries({ queryKey: ['user-stats', 'me'] });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
  };

  const buyAttempt = useMutation({
    mutationFn: () => RiddleService.buyExtraAttempt(riddleId),
    onSuccess: () => {
      invalidateUserData();
    }
  });

  const getHint = useMutation({
    mutationFn: () => RiddleService.getHintForXp(riddleId),
    onSuccess: () => {
      invalidateUserData();
    }
  });

  return {
    buyAttempt: buyAttempt.mutate,
    getHint: getHint.mutate,
    isProcessing: buyAttempt.isPending || getHint.isPending
  };
};
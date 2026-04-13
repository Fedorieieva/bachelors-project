import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentService } from '@/services/social-actions/comment.service';

export const useComments = (riddleId: string, page = 1) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['comments', riddleId, page],
    queryFn: () => CommentService.getByRiddle(riddleId, page),
    enabled: !!riddleId,
    staleTime: 1000 * 30,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', riddleId] });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
  };

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => CommentService.add(riddleId, content),
    onSuccess: invalidate,
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      CommentService.update(id, content),
    onSuccess: invalidate,
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => CommentService.delete(id),
    onSuccess: invalidate,
  });

  return {
    ...query,
    addComment: addCommentMutation.mutateAsync,
    updateComment: updateCommentMutation.mutateAsync,
    deleteComment: deleteCommentMutation.mutateAsync,
    isSubmitting: addCommentMutation.isPending || updateCommentMutation.isPending,
  };
};
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentService } from '@/services/social-actions/comment.service';
import { Comment } from '@/types/social';
import { PaginatedPage, useInfiniteScroll } from '@/hooks/infinite-scroll/useInfiniteScroll';

const COMMENTS_LIMIT = 10;

export function useComments(riddleId: string) {
  const queryClient = useQueryClient();

  const scrollResult = useInfiniteScroll<Comment>({
    queryKey: ['comments', riddleId],
    fetchPage: async (page: number): Promise<PaginatedPage<Comment>> => {
      const response = await CommentService.getByRiddle(riddleId, page, COMMENTS_LIMIT);

      return {
        items: response.data,
        total: response.meta.totalItems ?? 0,
        page: response.meta.currentPage,
        totalPages: response.meta.totalPages,
      };
    },
    direction: 'down',
    enabled: !!riddleId,
    staleTime: 1000 * 30,
  });

  const invalidate = (): void => {
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
    comments: scrollResult.items,
    isLoading: scrollResult.isLoading,
    isFetchingMore: scrollResult.isFetchingNextPage,
    hasMore: scrollResult.hasNextPage,
    loadMore: scrollResult.fetchNextPage,
    error: scrollResult.error,
    totalComments: scrollResult.totalItems,

    addComment: addCommentMutation.mutateAsync,
    updateComment: updateCommentMutation.mutateAsync,
    deleteComment: deleteCommentMutation.mutateAsync,
    isSubmitting: addCommentMutation.isPending || updateCommentMutation.isPending,
  };
}
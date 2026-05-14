import {
  useInfiniteQuery,
  InfiniteData,
  QueryKey,
  GetNextPageParamFunction,
  GetPreviousPageParamFunction,
} from '@tanstack/react-query';
import { useMemo } from 'react';

export interface PaginatedPage<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export type ScrollDirection = 'down' | 'up';

interface UseInfiniteScrollOptions<T> {
  queryKey: QueryKey;
  fetchPage: (page: number) => Promise<PaginatedPage<T>>;
  direction?: ScrollDirection;
  enabled?: boolean;
  staleTime?: number;
  limit?: number;
}

interface UseInfiniteScrollResult<T> {
  items: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
  error: Error | null;
  totalItems: number;
}

export function useInfiniteScroll<T>({
  queryKey,
  fetchPage,
  direction = 'down',
  enabled = true,
  staleTime = 1000 * 60 * 2,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const getNextPageParam: GetNextPageParamFunction<number, PaginatedPage<T>> = (lastPage) => {
    return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
  };

  const getPreviousPageParam: GetPreviousPageParamFunction<number, PaginatedPage<T>> = (firstPage) => {
    return firstPage.page > 1 ? firstPage.page - 1 : undefined;
  };

  const query = useInfiniteQuery<
    PaginatedPage<T>,
    Error,
    InfiniteData<PaginatedPage<T>, number>,
    QueryKey,
    number
  >({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 1,
    getNextPageParam,
    getPreviousPageParam,
    enabled,
    staleTime,
  });

  const items = useMemo<T[]>(() => {
    if (!query.data) return [];
    const allItems = query.data.pages.flatMap((page) => page.items);
    return direction === 'up' ? [...allItems].reverse() : allItems;
  }, [query.data, direction]);

  const totalItems = query.data?.pages[0]?.total ?? 0;

  return {
    items,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    isFetchingPreviousPage: query.isFetchingPreviousPage,
    hasNextPage: query.hasNextPage,
    hasPreviousPage: query.hasPreviousPage,
    fetchNextPage: query.fetchNextPage,
    fetchPreviousPage: query.fetchPreviousPage,
    error: query.error,
    totalItems,
  };
}
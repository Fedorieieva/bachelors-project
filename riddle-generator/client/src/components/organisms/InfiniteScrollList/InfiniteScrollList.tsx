"use client";

import React, { useEffect, useRef, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollDirection } from '@/hooks/infinite-scroll/useInfiniteScroll';

interface InfiniteScrollListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderLoader?: () => ReactNode;

  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  direction?: ScrollDirection;
  threshold?: string;
  className?: string;
  listClassName?: string;
  preserveScrollOnLoad?: boolean;
}

function DefaultLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
      <div
        style={{
          width: 24,
          height: 24,
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          opacity: 0.5,
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function InfiniteScrollList<T extends { id: string }>({
  items = [],
  renderItem,
  renderEmpty,
  renderLoader,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
  direction = 'down',
  threshold = '200px',
  className,
  listClassName,
  preserveScrollOnLoad = false,
}: InfiniteScrollListProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const prevItemCountRef = useRef<number>(items.length);

  useEffect(() => {
    if (!preserveScrollOnLoad || direction !== 'up') return;
    if (items.length > prevItemCountRef.current) {
      const container = containerRef.current;
      if (container) {
        const diff = container.scrollHeight - prevScrollHeightRef.current;
        container.scrollTop += diff;
      }
    }
    prevItemCountRef.current = items.length;
  }, [items.length, direction, preserveScrollOnLoad]);

  const saveScrollHeight = useCallback(() => {
    if (containerRef.current) {
      prevScrollHeightRef.current = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const rootMarginValue =
      direction === 'up'
        ? `${threshold} 0px 0px 0px`
        : `0px 0px ${threshold} 0px`;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          if (preserveScrollOnLoad && direction === 'up') saveScrollHeight();
          onLoadMore();
        }
      },
      { rootMargin: rootMarginValue, threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, onLoadMore, direction, threshold, preserveScrollOnLoad, saveScrollHeight]);

  const loader = renderLoader ? renderLoader() : <DefaultLoader />;

  if (isLoading) {
    return (
      <div className={className}>
        {loader}
      </div>
    );
  }

  if (items.length === 0 && !isFetchingMore) {
    return renderEmpty ? renderEmpty() : null;
  }

  return (
    <div ref={containerRef} className={className}>
      {direction === 'up' && (
        <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }}>
          {isFetchingMore && loader}
        </div>
      )}

      <AnimatePresence mode="popLayout" initial={false}>
        {items.length === 0 && !isFetchingMore ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {renderEmpty?.()}
          </motion.div>
        ) : (
          <div className={listClassName}>
            {items.map((item, index) => {
              if (!item) return null;

              return (
                <motion.div
                  key={item.id || `empty-${index}`}
                  layout
                  initial={{ opacity: 0, y: direction === 'up' ? -10 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60, transition: { duration: 0.25 } }}
                >
                  {renderItem(item, index)}
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {direction === 'down' && (
        <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }}>
          {isFetchingMore && loader}
        </div>
      )}
    </div>
  );
}
"use client";

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { CrosswordLayout, CrosswordWord } from '@/types/riddle';
import { Typography } from '@/components/atoms/Typography/Typography';
import { Button } from '@/components/atoms/Button/Button';
import { cn } from '@/lib/utils';
import styles from './CrosswordResult.module.scss';

interface CrosswordResultProps {
  layout: CrosswordLayout;
  riddleId?: string;
  onReset: () => void;
  onNewCrossword?: () => void;
  onComplete?: () => void;
  onShare?: () => void;
  isSharing?: boolean;
  isShared?: boolean;
  isPublic?: boolean;
  onUnshare?: () => void;
  isUnsharing?: boolean;
  initialAnswers?: Record<number, string>;
  isSolved?: boolean;
  onProgressChange?: (answers: Record<number, string>) => void;
  hideControls?: boolean;
}

type WordStatus = 'pending' | 'correct' | 'wrong';

interface CellData {
  letter: string;
  number?: number;
  wordNumbers: string[];
}

function normalizeWord(s: string): string {
  return s.toUpperCase().replace(/[\s'\-]/g, '');
}

function wordKey(word: CrosswordWord): string {
  return `${word.number}-${word.direction}`;
}

function getWordStatus(input: string, target: string): WordStatus {
  const n = normalizeWord(input);
  const t = normalizeWord(target);
  if (n === t) return 'correct';
  if (n.length >= t.length) return 'wrong';
  return 'pending';
}

function buildCellMap(words: CrosswordWord[]): Map<string, CellData> {
  const map = new Map<string, CellData>();
  for (const word of words) {
    const compoundKey = wordKey(word);
    for (let i = 0; i < word.word.length; i++) {
      const cx = word.direction === 'across' ? word.x + i : word.x;
      const cy = word.direction === 'across' ? word.y : word.y + i;
      const key = `${cx},${cy}`;
      const existing = map.get(key);
      if (existing) {
        if (!existing.wordNumbers.includes(compoundKey)) {
          existing.wordNumbers.push(compoundKey);
        }
        if (i === 0 && existing.number === undefined) {
          existing.number = word.number;
        }
      } else {
        map.set(key, {
          letter: word.word[i],
          number: i === 0 ? word.number : undefined,
          wordNumbers: [compoundKey],
        });
      }
    }
  }
  return map;
}

function getCellStatus(cell: CellData, wordStatuses: Record<string, WordStatus>): WordStatus {
  const statuses = cell.wordNumbers.map((key) => wordStatuses[key] ?? 'pending');

  if (statuses.some((s) => s === 'correct')) return 'correct';
  if (statuses.some((s) => s === 'wrong')) return 'wrong';
  return 'pending';
}

function layoutKey(layout: CrosswordLayout): string {
  return layout.words.map((w) => `${w.number}:${w.word}`).join('|');
}

export const CrosswordResult: React.FC<CrosswordResultProps> = ({
  layout,
  riddleId,
  onReset,
  onNewCrossword,
  onComplete,
  onShare,
  isSharing = false,
  isShared = false,
  isPublic = false,
  onUnshare,
  isUnsharing = false,
  initialAnswers,
  isSolved = false,
  onProgressChange,
  hideControls = false,
}) => {
  const solvedAnswers = useMemo<Record<string, string>>(
    () => Object.fromEntries(layout.words.map((w) => [wordKey(w), w.word])),
    [layout.words],
  );

  const normalizedInitialAnswers = useMemo<Record<string, string>>(() => {
    if (!initialAnswers) return {};
    const out: Record<string, string> = {};
    for (const word of layout.words) {
      const val = initialAnswers[word.number];
      if (val !== undefined) out[wordKey(word)] = val;
    }
    return out;
  }, [initialAnswers, layout.words]);

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>(
    () => (isSolved ? solvedAnswers : normalizedInitialAnswers),
  );

  const [focusedWordNumber, setFocusedWordNumber] = useState<number | null>(null);

  const completedRef = useRef(false);

  const isSolvedRef = useRef(isSolved);
  isSolvedRef.current = isSolved;

  const layoutKeyRef = useRef<string>(layoutKey(layout));

  const clearTimersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const cellMap = useMemo(() => buildCellMap(layout.words), [layout.words]);
  const { rows, cols } = layout.gridSize;

  const sortedWords = useMemo(
    () =>
      [...layout.words].sort((a, b) =>
        a.number !== b.number ? a.number - b.number : a.direction === 'across' ? -1 : 1,
      ),
    [layout.words],
  );

  const wordStatuses = useMemo<Record<string, WordStatus>>(() => {
    const out: Record<string, WordStatus> = {};
    for (const word of layout.words) {
      out[wordKey(word)] = getWordStatus(userAnswers[wordKey(word)] ?? '', word.word);
    }
    return out;
  }, [userAnswers, layout.words]);

  const displayLetters = useMemo<Map<string, string>>(() => {
    const map = new Map<string, string>();
    const ordered = [...layout.words].sort((a, b) => {
      const ca = wordStatuses[wordKey(a)] === 'correct' ? 1 : 0;
      const cb = wordStatuses[wordKey(b)] === 'correct' ? 1 : 0;
      return ca - cb;
    });
    for (const word of ordered) {
      const input = userAnswers[wordKey(word)] ?? '';
      for (let i = 0; i < word.word.length; i++) {
        const cx = word.direction === 'across' ? word.x + i : word.x;
        const cy = word.direction === 'across' ? word.y : word.y + i;
        const ch = input[i];
        if (ch) map.set(`${cx},${cy}`, ch.toUpperCase());
      }
    }
    return map;
  }, [userAnswers, layout.words, wordStatuses]);

  const allCorrect = useMemo(
    () => layout.words.length > 0 && layout.words.every((w) => wordStatuses[wordKey(w)] === 'correct'),
    [layout.words, wordStatuses],
  );

  useEffect(() => {
    if (allCorrect && !completedRef.current && !isSolved) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [allCorrect, onComplete, isSolved]);

  useEffect(() => {
    const key = layoutKey(layout);

    if (key !== layoutKeyRef.current) {
      layoutKeyRef.current = key;
      clearTimersRef.current.forEach((t) => clearTimeout(t));
      clearTimersRef.current.clear();
      completedRef.current = false;
      setUserAnswers(isSolved ? solvedAnswers : normalizedInitialAnswers);
      return;
    }

    if (!normalizedInitialAnswers || isSolved) return;

    setUserAnswers((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const word of layout.words) {
        const key = wordKey(word);
        const serverVal = normalizedInitialAnswers[key] ?? '';
        const localVal = prev[key] ?? '';
        if (serverVal && !localVal && word.number !== focusedWordNumber) {
          next[key] = serverVal;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [layout, isSolved, solvedAnswers, normalizedInitialAnswers, focusedWordNumber]);

  useEffect(() => {
    return () => {
      clearTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const toExternalAnswers = useCallback(
    (internal: Record<string, string>): Record<number, string> => {
      const out: Record<number, string> = {};
      for (const word of layout.words) {
        const val = internal[wordKey(word)];
        if (val !== undefined) out[word.number] = val;
      }
      return out;
    },
    [layout.words],
  );

  const handleChange = useCallback(
    (word: CrosswordWord, value: string) => {
      if (isSolved) return;

      const key = wordKey(word);

      const pending = clearTimersRef.current.get(word.number);
      if (pending) {
        clearTimeout(pending);
        clearTimersRef.current.delete(word.number);
      }

      setUserAnswers((prev) => {
        const next = { ...prev, [key]: value };
        onProgressChange?.(toExternalAnswers(next));
        return next;
      });

      if (getWordStatus(value, word.word) === 'wrong') {
        const timer = setTimeout(() => {
          clearTimersRef.current.delete(word.number);
          if (isSolvedRef.current) return;
          setUserAnswers((prev) => {
            if ((prev[key] ?? '') !== value) return prev;
            const next = { ...prev, [key]: '' };
            onProgressChange?.(toExternalAnswers(next));
            return next;
          });
        }, 1200);
        clearTimersRef.current.set(word.number, timer);
      }
    },
    [isSolved, onProgressChange, toExternalAnswers],
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h2">Crossword</Typography>
        {!hideControls && (
          <Button variant="grey-glass-link" onClick={onNewCrossword ?? onReset}>
            New crossword
          </Button>
        )}
      </div>

      {allCorrect && (
        <div className={styles.successBanner}>
          <span className={styles.successText}>Well done! You solved the crossword!</span>
          {riddleId && (
            isPublic ? (
              <Button
                variant="grey-glass-tab"
                size="auto"
                onClick={onUnshare}
                isLoading={isUnsharing}
              >
                Remove from Feed
              </Button>
            ) : (
              onShare && (
                <Button
                  variant="colored-glass"
                  size="auto"
                  onClick={onShare}
                  isLoading={isSharing}
                  disabled={isShared}
                >
                  {isShared ? 'Shared!' : 'Share to Feed'}
                </Button>
              )
            )
          )}
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.gridWrapper}>
          <div
            className={styles.colLabels}
            style={{ gridTemplateColumns: `repeat(${cols}, 36px)` }}
          >
            {Array.from({ length: cols }, (_, c) => (
              <div key={c} className={styles.colLabelCell}>
                {c < 26
                  ? String.fromCharCode(65 + c)
                  : `A${String.fromCharCode(65 + (c - 26))}`}
              </div>
            ))}
          </div>

          <div
            className={styles.grid}
            style={{ gridTemplateColumns: `repeat(${cols}, 36px)` }}
          >
            {Array.from({ length: rows }, (_, r) =>
              Array.from({ length: cols }, (_, c) => {
                const key = `${c},${r}`;
                const cell = cellMap.get(key);
                if (!cell) return <div key={key} className={styles.blackCell} />;
                const status = getCellStatus(cell, wordStatuses);
                const displayChar = displayLetters.get(key) ?? '';
                return (
                  <div
                    key={key}
                    className={cn(styles.whiteCell, {
                      [styles.cellCorrect]: status === 'correct',
                      [styles.cellWrong]: status === 'wrong',
                    })}
                  >
                    {cell.number !== undefined && (
                      <span className={styles.cellNum}>{cell.number}</span>
                    )}
                    <span className={styles.cellLetter}>{displayChar}</span>
                  </div>
                );
              }),
            )}
          </div>
        </div>

        <div className={styles.clueInputList}>
          {sortedWords.map((word, idx) => {
            const status = wordStatuses[wordKey(word)];
            const isLocked = status === 'correct' || isSolved;
            return (
              <div
                key={wordKey(word)}
                className={cn(styles.clueRow, {
                  [styles.clueCorrect]: status === 'correct',
                  [styles.clueWrong]: status === 'wrong',
                })}
              >
                <span className={styles.clueLabel}>
                  {word.number}&thinsp;{word.direction === 'across' ? 'A' : 'D'}
                </span>
                <span className={styles.clueText}>{word.clue}</span>
                <input
                  className={cn(styles.clueInput, {
                    [styles.inputCorrect]: status === 'correct',
                    [styles.inputWrong]: status === 'wrong',
                  })}
                  id={`clue-${wordKey(word)}`}
                  name={`clue-${wordKey(word)}`}
                  type="text"
                  maxLength={word.word.length}
                  placeholder={`${normalizeWord(word.word).length} letters`}
                  value={userAnswers[wordKey(word)] ?? ''}
                  onChange={(e) => handleChange(word, e.target.value)}
                  onFocus={() => setFocusedWordNumber(word.number)}
                  onBlur={() => setFocusedWordNumber(null)}
                  disabled={isLocked}
                  aria-label={`${word.number} ${word.direction}`}
                  spellCheck={false}
                  autoComplete="new-password"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

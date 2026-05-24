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
  /** When provided, replaces onReset on the header button to open an in-session generation panel */
  onNewCrossword?: () => void;
  onComplete?: () => void;
  onShare?: () => void;
  isSharing?: boolean;
  isShared?: boolean;
  /** True when the riddle is already published to the social feed */
  isPublic?: boolean;
  onUnshare?: () => void;
  isUnsharing?: boolean;
  /** Pre-loaded partial answers from the DB (word number → typed string) */
  initialAnswers?: Record<number, string>;
  /** True when the riddle was already solved in a previous session */
  isSolved?: boolean;
  /** Called whenever the user changes an answer so the parent can debounce-save progress */
  onProgressChange?: (answers: Record<number, string>) => void;
}

type WordStatus = 'pending' | 'correct' | 'wrong';

interface CellData {
  letter: string;
  number?: number;
  wordNumbers: number[];
}

function normalizeWord(s: string): string {
  return s.toUpperCase().replace(/[\s'\-]/g, '');
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
    for (let i = 0; i < word.word.length; i++) {
      const cx = word.direction === 'across' ? word.x + i : word.x;
      const cy = word.direction === 'across' ? word.y : word.y + i;
      const key = `${cx},${cy}`;
      const existing = map.get(key);
      if (existing) {
        if (!existing.wordNumbers.includes(word.number)) {
          existing.wordNumbers.push(word.number);
        }
        if (i === 0 && existing.number === undefined) {
          existing.number = word.number;
        }
      } else {
        map.set(key, {
          letter: word.word[i],
          number: i === 0 ? word.number : undefined,
          wordNumbers: [word.number],
        });
      }
    }
  }
  return map;
}

function getCellStatus(cell: CellData, wordStatuses: Record<number, WordStatus>): WordStatus {
  const statuses = cell.wordNumbers.map((n) => wordStatuses[n] ?? 'pending');
  if (statuses.some((s) => s === 'correct')) return 'correct';
  if (statuses.some((s) => s === 'wrong')) return 'wrong';
  return 'pending';
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
}) => {
  const solvedAnswers = useMemo<Record<number, string>>(
    () => Object.fromEntries(layout.words.map((w) => [w.number, w.word])),
    [layout.words],
  );

  const [userAnswers, setUserAnswers] = useState<Record<number, string>>(
    () => (isSolved ? solvedAnswers : (initialAnswers ?? {})),
  );
  const completedRef = useRef(false);

  const cellMap = useMemo(() => buildCellMap(layout.words), [layout.words]);
  const { rows, cols } = layout.gridSize;

  const sortedWords = useMemo(
    () =>
      [...layout.words].sort((a, b) =>
        a.number !== b.number ? a.number - b.number : a.direction === 'across' ? -1 : 1,
      ),
    [layout.words],
  );

  const wordStatuses = useMemo<Record<number, WordStatus>>(() => {
    const out: Record<number, WordStatus> = {};
    for (const word of layout.words) {
      out[word.number] = getWordStatus(userAnswers[word.number] ?? '', word.word);
    }
    return out;
  }, [userAnswers, layout.words]);

  // Correct words are processed LAST so their letters win at intersection cells,
  // preventing pending/wrong word inputs from overwriting locked correct letters.
  const displayLetters = useMemo<Map<string, string>>(() => {
    const map = new Map<string, string>();
    const ordered = [...layout.words].sort((a, b) => {
      const ca = wordStatuses[a.number] === 'correct' ? 1 : 0;
      const cb = wordStatuses[b.number] === 'correct' ? 1 : 0;
      return ca - cb;
    });
    for (const word of ordered) {
      const input = userAnswers[word.number] ?? '';
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
    () => layout.words.length > 0 && layout.words.every((w) => wordStatuses[w.number] === 'correct'),
    [layout.words, wordStatuses],
  );

  useEffect(() => {
    if (allCorrect && !completedRef.current && !isSolved) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [allCorrect, onComplete, isSolved]);

  useEffect(() => {
    completedRef.current = false;
    setUserAnswers(isSolved ? solvedAnswers : (initialAnswers ?? {}));
  }, [layout, isSolved, solvedAnswers, initialAnswers]);

  const handleChange = useCallback((wordNumber: number, value: string) => {
    if (isSolved) return;
    setUserAnswers((prev) => {
      const next = { ...prev, [wordNumber]: value };
      onProgressChange?.(next);
      return next;
    });
  }, [isSolved, onProgressChange]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h2">Crossword</Typography>
        <Button variant="grey-glass-link" onClick={onNewCrossword ?? onReset}>
          New crossword
        </Button>
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
        {/* Visual grid with chess-style column labels */}
        <div className={styles.gridWrapper}>
          {/* Column header: A, B, C… */}
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

        {/* Per-clue input list */}
        <div className={styles.clueInputList}>
          {sortedWords.map((word, idx) => {
            const status = wordStatuses[word.number];
            const isLocked = status === 'correct' || isSolved;
            return (
              <div
                key={`${word.direction}-${word.number}`}
                className={cn(styles.clueRow, {
                  [styles.clueCorrect]: status === 'correct',
                  [styles.clueWrong]: status === 'wrong',
                })}
              >
                <span className={styles.clueLabel}>
                  {idx + 1}&thinsp;{word.direction === 'across' ? 'A' : 'D'}
                </span>
                <span className={styles.clueText}>{word.clue}</span>
                <input
                  className={cn(styles.clueInput, {
                    [styles.inputCorrect]: status === 'correct',
                    [styles.inputWrong]: status === 'wrong',
                  })}
                  type="text"
                  maxLength={word.word.length}
                  placeholder={`${normalizeWord(word.word).length} letters`}
                  value={userAnswers[word.number] ?? ''}
                  onChange={(e) => handleChange(word.number, e.target.value)}
                  disabled={isLocked}
                  aria-label={`${word.number} ${word.direction}`}
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

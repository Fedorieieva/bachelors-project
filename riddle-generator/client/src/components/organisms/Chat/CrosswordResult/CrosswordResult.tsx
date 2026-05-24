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
  /** Hides the "New crossword" header button — use in PvP and read-only history contexts */
  hideControls?: boolean;
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

/** Stable fingerprint based on word content — survives reference churn across polls. */
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
  const solvedAnswers = useMemo<Record<number, string>>(
    () => Object.fromEntries(layout.words.map((w) => [w.number, w.word])),
    [layout.words],
  );

  const [userAnswers, setUserAnswers] = useState<Record<number, string>>(
    () => (isSolved ? solvedAnswers : (initialAnswers ?? {})),
  );

  // Word number whose input is currently held in browser focus.
  // Used by the hydration gate to skip overwriting the cell being edited.
  const [focusedWordNumber, setFocusedWordNumber] = useState<number | null>(null);

  const completedRef = useRef(false);

  // Live mirror of the isSolved prop. Updated every render so that the
  // 1200ms delayed-clear timer reads the current value at fire time, not
  // the stale closure value from when the timer was scheduled. This prevents
  // the clear from running after the puzzle is solved or the match ends.
  const isSolvedRef = useRef(isSolved);
  isSolvedRef.current = isSolved;

  // Fingerprint of the last layout that triggered a full state reset.
  // Guards against same-riddle re-renders (PvP polling, React Strict Mode)
  // resetting userAnswers mid-session.
  const layoutKeyRef = useRef<string>(layoutKey(layout));

  // Per-word delayed-clear timers. One entry per word that is showing a
  // wrong-answer highlight. Stored in a ref so they survive re-renders and
  // are drained on unmount.
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

  // Fire onComplete exactly once per puzzle session when all words are solved.
  useEffect(() => {
    if (allCorrect && !completedRef.current && !isSolved) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [allCorrect, onComplete, isSolved]);

  // Unified layout-change + server-hydration effect.
  //
  // Branch A — layout fingerprint changed (new riddle):
  //   Full state reset. All pending clears are cancelled and answers are
  //   seeded from initialAnswers (or solvedAnswers if already solved).
  //
  // Branch B — same riddle, initialAnswers updated (background DB sync):
  //   Selective hydration. Only words that are locally empty AND not currently
  //   focused are eligible. This lets a returning player's saved progress load
  //   without disturbing any cell they are actively editing.
  useEffect(() => {
    const key = layoutKey(layout);

    if (key !== layoutKeyRef.current) {
      // ── Branch A: new riddle ─────────────────────────────────────
      layoutKeyRef.current = key;
      clearTimersRef.current.forEach((t) => clearTimeout(t));
      clearTimersRef.current.clear();
      completedRef.current = false;
      setUserAnswers(isSolved ? solvedAnswers : (initialAnswers ?? {}));
      return;
    }

    // ── Branch B: same riddle — partial hydration only ───────────
    // Skip entirely when there is no server payload or puzzle is already solved.
    if (!initialAnswers || isSolved) return;

    setUserAnswers((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const [rawNum, serverVal] of Object.entries(initialAnswers)) {
        const num = Number(rawNum);
        const localVal = prev[num] ?? '';
        // Hydrate only if: the local cell is empty AND the word is not focused
        if (serverVal && !localVal && num !== focusedWordNumber) {
          next[num] = serverVal;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [layout, isSolved, solvedAnswers, initialAnswers, focusedWordNumber]);

  // Drain all pending delayed-clear timers when the component unmounts.
  // This covers the PvP match-end path: ActiveMatchPanel unmounts CrosswordResult
  // when isFinished becomes true, and this cleanup runs immediately.
  useEffect(() => {
    return () => {
      clearTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleChange = useCallback(
    (wordNumber: number, value: string) => {
      if (isSolved) return;

      // User resumed typing — cancel any in-flight delayed clear for this word
      const pending = clearTimersRef.current.get(wordNumber);
      if (pending) {
        clearTimeout(pending);
        clearTimersRef.current.delete(wordNumber);
      }

      setUserAnswers((prev) => {
        const next = { ...prev, [wordNumber]: value };
        onProgressChange?.(next);
        return next;
      });

      // Schedule a delayed clear only when the word slot is fully filled and wrong.
      // If the match ends or the puzzle is solved during the 1200ms window,
      // isSolvedRef.current will be true and the clear is aborted — leaving
      // letters intact for post-match grid inspection.
      const word = layout.words.find((w) => w.number === wordNumber);
      if (word && getWordStatus(value, word.word) === 'wrong') {
        const timer = setTimeout(() => {
          clearTimersRef.current.delete(wordNumber);
          // Abort if the puzzle was solved or match terminated during the delay
          if (isSolvedRef.current) return;
          setUserAnswers((prev) => {
            // Guard: skip if the user already changed the value since scheduling
            if ((prev[wordNumber] ?? '') !== value) return prev;
            const next = { ...prev, [wordNumber]: '' };
            onProgressChange?.(next);
            return next;
          });
        }, 1200);
        clearTimersRef.current.set(wordNumber, timer);
      }
    },
    [isSolved, onProgressChange, layout.words],
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
        {/* Visual grid with chess-style column labels */}
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
                  onFocus={() => setFocusedWordNumber(word.number)}
                  onBlur={() => setFocusedWordNumber(null)}
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

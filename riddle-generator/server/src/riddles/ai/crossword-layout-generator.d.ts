declare module 'crossword-layout-generator' {
  interface CrosswordItem {
    answer: string;
    clue: string;
    startx: number;
    starty: number;
    orientation: 'across' | 'down' | 'none';
    position: number;
  }

  interface CrosswordResult {
    result: CrosswordItem[];
    rows: number;
    cols: number;
    table: string[][];
    table_string: string;
  }

  export function generateLayout(
    words: Array<{ answer: string; clue: string }>,
  ): CrosswordResult;
}

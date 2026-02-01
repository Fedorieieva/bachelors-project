type MsFunction = (value: string | number) => number | string | undefined;

import rawMs from 'ms';
const ms: MsFunction = rawMs as MsFunction;

export function safeMs(value: string, fallbackMs = 0): number {
  const result = ms(value);
  return typeof result === 'number' ? result : fallbackMs;
}

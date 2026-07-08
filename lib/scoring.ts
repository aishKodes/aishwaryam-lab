export const LEVEL_TOTAL = 100;
export const TOTAL_POSSIBLE = 500;

export const NUMERIC_SCORE = {
  answer: 60,
  theorem: 20,
  correspondence: 20
} as const;

export function formatDelta(delta: number) {
  if (delta > 0) {
    return `+${delta}`;
  }

  return `${delta}`;
}

export function isCloseNumber(value: number, expected: number, tolerance = 0.01) {
  return Number.isFinite(value) && Math.abs(value - expected) <= tolerance;
}

export function clampScore(value: number, max = LEVEL_TOTAL) {
  return Math.max(0, Math.min(max, Math.round(value)));
}

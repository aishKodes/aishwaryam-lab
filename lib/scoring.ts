export const SCORE = {
  correctAnswer: 100,
  correctTheorem: 50,
  correctCorrespondence: 50,
  trapMistake: -20
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

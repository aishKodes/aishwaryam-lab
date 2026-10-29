export type ArithmeticProgression = { a: number; d: number; n: number };

export function validateAP({ a, d, n }: ArithmeticProgression): void {
  if (
    !Number.isFinite(a) ||
    !Number.isFinite(d) ||
    !Number.isInteger(n) ||
    n < 1 ||
    n > 1000
  ) {
    throw new RangeError(
      "Use finite terms and a whole number of terms from 1 to 1000.",
    );
  }
}

export function apTerms(ap: ArithmeticProgression): number[] {
  validateAP(ap);
  return Array.from({ length: ap.n }, (_, index) => ap.a + index * ap.d);
}

export function apLastTerm(ap: ArithmeticProgression): number {
  validateAP(ap);
  return ap.a + (ap.n - 1) * ap.d;
}

export function apSum(ap: ArithmeticProgression): number {
  return (ap.n / 2) * (ap.a + apLastTerm(ap));
}

export function naturalPairs(n: number) {
  validateAP({ a: 1, d: 1, n });
  return {
    pairCount: Math.floor(n / 2),
    pairSum: n + 1,
    centre: n % 2 === 1 ? (n + 1) / 2 : null,
    total: apSum({ a: 1, d: 1, n }),
  };
}

export function compactIndices(n: number): (number | null)[] {
  validateAP({ a: 0, d: 0, n });
  return n <= 10
    ? Array.from({ length: n }, (_, i) => i)
    : [0, 1, 2, 3, null, n - 3, n - 2, n - 1];
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 6 }).format(
    value,
  );
}

export function isNumericAnswer(input: string, expected: number): boolean {
  return (
    input.trim() !== "" &&
    Number.isFinite(Number(input)) &&
    Math.abs(Number(input) - expected) < 0.000001
  );
}

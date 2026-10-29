import test from "node:test";
import assert from "node:assert/strict";
import {
  apTerms,
  apSum,
  apLastTerm,
  naturalPairs,
  compactIndices,
  isNumericAnswer,
} from "../lib/ap.ts";
import { gaussStages } from "../data/gauss-lesson.ts";

test("the seven teacher-paced stages fit the 35-minute lesson", () => {
  assert.equal(gaussStages.length, 7);
  assert.equal(
    gaussStages.reduce((minutes, stage) => minutes + stage.minutes, 0),
    35,
  );
});

test("lesson examples and natural-number pairs are exact", () => {
  assert.equal(apSum({ a: 1, d: 1, n: 100 }), 5050);
  assert.equal(apSum({ a: 10, d: 5, n: 7 }), 175);
  assert.equal(apSum({ a: 3, d: 4, n: 8 }), 136);
  assert.equal(apSum({ a: 1, d: 1, n: 20 }), 210);
  assert.equal(apSum({ a: 2, d: 3, n: 5 }), 40);
  assert.deepEqual(naturalPairs(9), {
    pairCount: 4,
    pairSum: 10,
    centre: 5,
    total: 45,
  });
  assert.deepEqual(naturalPairs(10), {
    pairCount: 5,
    pairSum: 11,
    centre: null,
    total: 55,
  });
  assert.deepEqual(naturalPairs(1), {
    pairCount: 0,
    pairSum: 2,
    centre: 1,
    total: 1,
  });
});

test("zero, negative and fractional differences, including one term", () => {
  assert.equal(apSum({ a: 5, d: 0, n: 9 }), 45);
  assert.equal(apSum({ a: 10, d: -3, n: 5 }), 20);
  assert.equal(apSum({ a: -8, d: 2, n: 1 }), -8);
  assert.deepEqual(apTerms({ a: 1.5, d: -0.5, n: 4 }), [1.5, 1, 0.5, 0]);
});

test("displayed terms, last term, paired columns and sum agree across the input space", () => {
  for (const a of [-50, -1, 0, 3, 20]) {
    for (const d of [-10, -0.5, 0, 2, 9]) {
      for (const n of [1, 2, 3, 9, 10, 101, 1000]) {
        const ap = { a, d, n };
        const terms = apTerms(ap);
        assert.equal(terms.at(-1), apLastTerm(ap));
        assert.equal(
          terms.reduce((sum, term) => sum + term, 0),
          apSum(ap),
        );
        terms.forEach((term, i) =>
          assert.equal(term + terms[n - 1 - i], a + apLastTerm(ap)),
        );
        compactIndices(n)
          .filter((i) => i !== null)
          .forEach((i) => assert.ok(i >= 0 && i < n));
      }
    }
  }
});

test("invalid input does not silently produce a wrong total", () => {
  for (const n of [0, -1, 1.5, NaN, Infinity, 1001])
    assert.throws(() => apSum({ a: 1, d: 1, n }), RangeError);
  assert.throws(() => apTerms({ a: Infinity, d: 1, n: 2 }), RangeError);
  assert.equal(isNumericAnswer("", 0), false);
  assert.equal(isNumericAnswer("   ", 0), false);
  assert.equal(isNumericAnswer("175", 175), true);
  assert.equal(isNumericAnswer("NaN", 0), false);
});

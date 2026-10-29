"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Undo2,
} from "lucide-react";
import {
  apLastTerm,
  apSum,
  apTerms,
  compactIndices,
  formatNumber as fmt,
  isNumericAnswer,
  naturalPairs,
} from "@/lib/ap";
import { assessmentQuestions } from "@/data/gauss-lesson";
import { MathExpression as Math } from "./MathExpression";

export function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <div className="ap-prompt">
      <Lightbulb size={21} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

export function MysteryStage({
  active,
  onNext,
}: {
  active: boolean;
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running || !active || countdown === 0) return;
    const id = window.setInterval(
      () => setCountdown((s) => MathMax(0, s - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [running, active, countdown]);

  return (
    <>
      <div className="ap-stage-heading">
        <p className="ap-kicker">01 / A question that changed the way we add</p>
        <h1>
          The boy who added
          <br />
          <em>100 numbers.</em>
        </h1>
        <p>
          A traditional story tells of a young Carl Friedrich Gauss who
          surprised his teacher with a remarkably quick sum. The details vary.
          The mathematical idea endures.
        </p>
      </div>
      <div className="ap-number-wall" aria-label="The numbers 1 to 100">
        {Array.from({ length: 100 }, (_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.003 }}
          >
            {i + 1}
          </motion.span>
        ))}
      </div>
      <div className="ap-challenge-line">
        <Math
          tex={String.raw`1+2+3+\cdots+99+100=${revealed ? "5050" : "?"}`}
        />
        <div className="ap-mini-timer">
          <span aria-live="off">{countdown}s</span>
          <button
            className="ap-icon"
            title={
              running ? "Pause thinking time" : "Start 30-second thinking time"
            }
            aria-label={
              running ? "Pause thinking time" : "Start 30-second thinking time"
            }
            onClick={() => setRunning(!running)}
          >
            {running ? <Pause /> : <Play />}
          </button>
          <button
            className="ap-icon"
            title="Reset thinking time"
            aria-label="Reset thinking time"
            onClick={() => {
              setCountdown(30);
              setRunning(false);
            }}
          >
            <RotateCcw />
          </button>
        </div>
      </div>
      <div className="ap-action-row">
        <label className="ap-inline-field">
          Our prediction
          <input
            inputMode="numeric"
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            placeholder="?"
            aria-label="Class prediction"
          />
        </label>
        <button
          className="ap-button ap-secondary"
          onClick={() => setRevealed(!revealed)}
        >
          {revealed ? "Conceal total" : "Reveal total"}
        </button>
        <button className="ap-button" onClick={onNext}>
          Can we find a smarter way?
          <ArrowRight size={20} />
        </button>
      </div>
      <Prompt>
        How could we add these numbers without adding them one at a time?
      </Prompt>
    </>
  );
}

function MathMax(a: number, b: number) {
  return a > b ? a : b;
}

export function CardStage() {
  const [pairs, setPairs] = useState<[number, number][]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [conclusion, setConclusion] = useState(false);
  const used = pairs.flat();
  const equal = pairs.length === 5 && pairs.every(([a, b]) => a + b === 11);
  function select(value: number) {
    setConclusion(false);
    if (selected === value) setSelected(null);
    else if (selected === null) setSelected(value);
    else {
      setPairs((previous) => [...previous, [selected, value]]);
      setSelected(null);
    }
  }
  return (
    <>
      <div className="ap-stage-heading">
        <p className="ap-kicker">02 / From your desk to the screen</p>
        <h1>
          Ten cards.
          <br />
          <em>One hidden pattern.</em>
        </h1>
        <p>
          Arrange your physical cards into pairs. Which arrangement makes every
          pair equal?
        </p>
      </div>
      <div className="ap-activity-toolbar">
        <span>{pairs.length} / 5 pairs formed</span>
        <div className="ap-action-row">
          <button
            className="ap-icon"
            title="Undo last pair"
            aria-label="Undo last pair"
            disabled={!pairs.length}
            onClick={() => {
              setPairs((p) => p.slice(0, -1));
              setSelected(null);
              setConclusion(false);
            }}
          >
            <Undo2 />
          </button>
          <button
            className="ap-icon"
            title="Reset cards"
            aria-label="Reset cards"
            onClick={() => {
              setPairs([]);
              setSelected(null);
              setConclusion(false);
            }}
          >
            <RotateCcw />
          </button>
        </div>
      </div>
      <div className="ap-card-bank" aria-label="Number cards">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
          <motion.button
            layout
            key={value}
            className={`ap-number-card ${selected === value ? "selected" : ""}`}
            aria-label={`Card ${value}`}
            aria-pressed={selected === value}
            disabled={used.includes(value)}
            onClick={() => select(value)}
            whileTap={{ scale: 0.95 }}
          >
            {value}
            <span>
              {used.includes(value)
                ? "paired"
                : selected === value
                  ? "selected"
                  : ""}
            </span>
          </motion.button>
        ))}
      </div>
      <div className="ap-pair-tray" aria-live="polite">
        {pairs.length === 0 ? (
          <p className="ap-muted">
            Which two cards will you bring together first?
          </p>
        ) : (
          pairs.map(([a, b], i) => (
            <motion.div
              className={`ap-pair ap-pair-${i}`}
              key={`${a}-${b}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>{a}</span>
              <b>+</b>
              <span>{b}</span>
              <b>=</b>
              <strong>{a + b}</strong>
            </motion.div>
          ))
        )}
      </div>
      {pairs.length === 5 && !equal && (
        <Prompt>
          The totals are not all equal yet. Which pairs could you exchange?
        </Prompt>
      )}
      {equal && (
        <div className="ap-action-row">
          <button className="ap-button" onClick={() => setConclusion(true)}>
            Connect the discovery
            <ArrowRight size={20} />
          </button>
        </div>
      )}
      {conclusion && (
        <div className="ap-result" data-testid="card-conclusion">
          <p>Opposite ends. Equal totals.</p>
          <Math tex="5\text{ equal pairs}\times11=55" />
          <p>What would happen with 100 numbers instead of 10?</p>
        </div>
      )}
      {!conclusion && (
        <Prompt>
          As one number increases by 1, what happens to its partner?
        </Prompt>
      )}
    </>
  );
}

export function GaussSumStage() {
  const [n, setN] = useState(100);
  const [paired, setPaired] = useState(false);
  const [mode, setMode] = useState<"physical" | "double">("physical");
  const info = naturalPairs(n);
  const indices = compactIndices(n);
  return (
    <>
      <div className="ap-stage-heading">
        <p className="ap-kicker">03 / Scale the discovery</p>
        <h1>
          A hundred numbers.
          <br />
          <em>The same idea.</em>
        </h1>
        <p>
          Match the two ends. Every inward step changes the partners, but not
          their sum.
        </p>
      </div>
      <div className="ap-experiment-controls">
        <label className="ap-range-label">
          Last number <output>{n}</output>
          <input
            aria-label="Last natural number"
            type="range"
            min="1"
            max="200"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
          />
        </label>
        <div className="ap-segmented" aria-label="Pairing model">
          <button
            aria-pressed={mode === "physical"}
            onClick={() => setMode("physical")}
          >
            Physical pairs
          </button>
          <button
            aria-pressed={mode === "double"}
            onClick={() => setMode("double")}
          >
            Two copies
          </button>
        </div>
      </div>
      <div className="ap-sequence-board">
        <div className="ap-sequence-label">
          Forward <span>1 to {n}</span>
        </div>
        <div
          className="ap-term-row"
          style={{
            gridTemplateColumns: `repeat(${indices.length}, minmax(0, 1fr))`,
          }}
        >
          {indices.map((index, i) => (
            <div className="ap-term" key={i}>
              {index === null ? "···" : index + 1}
            </div>
          ))}
        </div>
        <div className="ap-sequence-label">
          Reverse{" "}
          <span>
            {n} to 1
            {mode === "double"
              ? " · a second copy"
              : " · partners from the opposite end"}
          </span>
        </div>
        <div
          className="ap-term-row"
          style={{
            gridTemplateColumns: `repeat(${indices.length}, minmax(0, 1fr))`,
          }}
        >
          {indices.map((index, i) => (
            <motion.div
              layout
              className={`ap-term ap-term-reverse ${paired ? "paired" : ""}`}
              key={i}
            >
              {index === null ? "···" : n - index}
            </motion.div>
          ))}
        </div>
        {paired && (
          <div
            className="ap-term-row ap-sum-row"
            style={{
              gridTemplateColumns: `repeat(${indices.length}, minmax(0, 1fr))`,
            }}
          >
            {indices.map((index, i) => (
              <span key={i}>{index === null ? "···" : n + 1}</span>
            ))}
          </div>
        )}
      </div>
      {!paired && (
        <button className="ap-button" onClick={() => setPaired(true)}>
          Pair opposite ends
          <ArrowDown size={20} />
        </button>
      )}
      {paired && (
        <div className="ap-result" aria-live="polite">
          {mode === "physical" ? (
            <>
              <p>
                {n} {n === 1 ? "number" : "numbers"} → {info.pairCount} physical
                pairs
                {info.centre !== null ? ` + centre term ${info.centre}` : ""}
              </p>
              <Math
                tex={String.raw`S=${info.pairCount}\times${info.pairSum}${info.centre !== null ? `+${info.centre}` : ""}=${info.total}`}
              />
              {info.centre !== null && (
                <p>
                  The middle card, {info.centre}, has no partner. Add it once.
                </p>
              )}
              {n > 1 && (
                <small>
                  The two rows locate partners; each physical pair is counted
                  only once.
                </small>
              )}
            </>
          ) : (
            <>
              <p>
                {n} columns, each summing to {n + 1}. This is twice the original
                sum.
              </p>
              <Math
                tex={String.raw`2S=${n}\times${n + 1}\qquad S=\frac{${n}(${n + 1})}{2}=${info.total}`}
              />
              <p>
                Two complete copies work for both odd and even numbers of terms.
              </p>
            </>
          )}
        </div>
      )}
      <Prompt>
        {n % 2
          ? "What happens to the unpaired middle number?"
          : "Why are there half as many physical pairs as numbers?"}
      </Prompt>
    </>
  );
}

const steps = [
  "Write the sum",
  "Make a second copy",
  "Reverse and pair",
  "Count the columns",
  "Divide by two",
];

function ParameterControl({
  symbol,
  label,
  value,
  min,
  max,
  onChange,
}: {
  symbol: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  return (
    <label>
      <span>
        {label} <b>{symbol}</b>
      </span>
      <div>
        <button
          className="ap-icon"
          aria-label={`Decrease ${symbol}`}
          title={`Decrease ${symbol}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          −
        </button>
        <input
          aria-label={label}
          type="number"
          step="1"
          min={min}
          max={max}
          value={draft}
          onBlur={() => setDraft(String(value))}
          onChange={(e) => {
            setDraft(e.target.value);
            const next = Number(e.target.value);
            if (
              e.target.value !== "" &&
              Number.isInteger(next) &&
              next >= min &&
              next <= max
            )
              onChange(next);
          }}
        />
        <button
          className="ap-icon"
          aria-label={`Increase ${symbol}`}
          title={`Increase ${symbol}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </label>
  );
}

export function FormulaStage() {
  const [a, setA] = useState(2);
  const [d, setD] = useState(3);
  const [n, setN] = useState(6);
  const [step, setStep] = useState(0);
  const ap = { a, d, n };
  const terms = apTerms(ap);
  const last = apLastTerm(ap);
  const sum = apSum(ap);
  const indices = compactIndices(n);
  const reverse = step >= 2;
  return (
    <>
      <div className="ap-stage-heading ap-heading-compact">
        <p className="ap-kicker">04 / From a pattern to a proof</p>
        <h1>
          The formula <em>discovery lab.</em>
        </h1>
        <p>
          Any first term. Any common difference. The same equal-pair structure.
        </p>
      </div>
      <div className="ap-parameters">
        {(
          [
            {
              key: "a",
              label: "First term",
              value: a,
              setter: setA,
              min: -50,
              max: 50,
            },
            {
              key: "d",
              label: "Common difference",
              value: d,
              setter: setD,
              min: -10,
              max: 10,
            },
            {
              key: "n",
              label: "Number of terms",
              value: n,
              setter: setN,
              min: 1,
              max: 100,
            },
          ] as const
        ).map((control) => (
          <ParameterControl
            key={control.key}
            symbol={control.key}
            label={control.label}
            value={control.value}
            min={control.min}
            max={control.max}
            onChange={control.setter}
          />
        ))}
      </div>
      <div className="ap-proof-heading">
        <span>Step {step + 1} / 5</span>
        <strong>{steps[step]}</strong>
        <span>
          Last term: {fmt(last)} · {n} {n === 1 ? "term" : "terms"}
        </span>
      </div>
      <div
        className={`ap-proof ${step === 4 ? "ap-proof-final" : ""}`}
        data-testid="formula-proof"
      >
        <Math
          tex={n === 1 ? "S_1=a" : String.raw`S_n=a+(a+d)+\cdots+[a+(n-1)d]`}
        />
        {step >= 1 && (
          <Math
            tex={
              n === 1
                ? "S_1=a"
                : reverse
                  ? String.raw`S_n=[a+(n-1)d]+\cdots+(a+d)+a`
                  : String.raw`S_n=a+(a+d)+\cdots+[a+(n-1)d]`
            }
          />
        )}
        <div className="ap-sequence-board ap-numeric-proof">
          <div className="ap-sequence-label">
            S <span>Our example</span>
          </div>
          <div
            className="ap-term-row"
            style={{
              gridTemplateColumns: `repeat(${indices.length}, minmax(0, 1fr))`,
            }}
          >
            {indices.map((i, key) => (
              <div className="ap-term" key={key}>
                {i === null ? "···" : fmt(terms[i])}
              </div>
            ))}
          </div>
          {step >= 1 && (
            <>
              <div className="ap-sequence-label">
                S <span>{reverse ? "Reversed" : "Second copy"}</span>
              </div>
              <div
                className="ap-term-row"
                style={{
                  gridTemplateColumns: `repeat(${indices.length}, minmax(0, 1fr))`,
                }}
              >
                {indices.map((i) => (
                  <motion.div
                    layout
                    transition={{ duration: 0.65 }}
                    className="ap-term ap-term-reverse"
                    key={i === null ? "gap" : reverse ? n - 1 - i : i}
                  >
                    {i === null ? "···" : fmt(terms[reverse ? n - 1 - i : i])}
                  </motion.div>
                ))}
              </div>
            </>
          )}
          {step >= 2 && (
            <div
              className="ap-term-row ap-sum-row"
              style={{
                gridTemplateColumns: `repeat(${indices.length}, minmax(0, 1fr))`,
              }}
            >
              {indices.map((i, key) => (
                <span key={key}>{i === null ? "···" : fmt(a + last)}</span>
              ))}
            </div>
          )}
        </div>
        {n > 10 && (
          <p className="ap-muted ap-small">
            The middle {n - 7} terms are condensed; all {n} terms are included
            in the calculation.
          </p>
        )}
        {step >= 2 && (
          <div className="ap-proof-fact">
            <span>Every column</span>
            <Math tex="a+l=2a+(n-1)d" />
          </div>
        )}
        {step >= 3 && (
          <>
            <Math tex="2S_n=n[2a+(n-1)d]" />
            <p className="ap-proof-caption">
              {n} equal columns × {fmt(a + last)} = {fmt(2 * sum)}. We have
              added two copies of the sum.
            </p>
          </>
        )}
        {step === 4 && (
          <div className="ap-final-formula" data-testid="final-formula">
            <Math tex="\boxed{S_n=\frac{n}{2}[2a+(n-1)d]}" />
            <Math tex="S_n=\frac{n}{2}(a+l)" />
            <p>
              For our example: {n} ÷ 2 × ({a} + {last < 0 ? `(${last})` : last})
              = <strong>{fmt(sum)}</strong>
            </p>
          </div>
        )}
      </div>
      <div className="ap-action-row">
        <button
          className="ap-icon"
          title="Previous derivation step"
          aria-label="Previous derivation step"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          <Undo2 />
        </button>
        <button
          className="ap-button"
          disabled={step === 4}
          onClick={() => setStep((s) => s + 1)}
        >
          {step === 4 ? "Derivation complete" : steps[step + 1]}
          <ArrowRight size={20} />
        </button>
      </div>
      <Prompt>
        {step < 2
          ? "What would happen if the second copy ran backwards?"
          : step < 4
            ? "Why is the left side twice the sum, rather than the sum?"
            : "Does the proof still work when d is zero, negative, or n is 1?"}
      </Prompt>
    </>
  );
}

function NumberCheck({
  label,
  expected,
  hint,
  explanation,
}: {
  label: string;
  expected: number;
  hint: string;
  explanation: React.ReactNode;
}) {
  const [value, setValue] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim() === "") return;
        setAttempted(true);
        setCorrect(isNumericAnswer(value, expected));
      }}
    >
      <div className="ap-action-row">
        <label className="ap-inline-field">
          {label}
          <input
            aria-label={label}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setAttempted(false);
            }}
            inputMode="decimal"
            required
            placeholder="?"
          />
        </label>
        <button className="ap-button" type="submit">
          Check prediction
          <Check size={20} />
        </button>
        <button
          className="ap-icon"
          title="Thinking hint"
          aria-label="Thinking hint"
          type="button"
          onClick={() => setShowHint(!showHint)}
        >
          <Lightbulb />
        </button>
      </div>
      {showHint && <p className="ap-feedback">{hint}</p>}
      {attempted && (
        <div
          className={`ap-feedback ${correct ? "correct" : ""}`}
          role="status"
        >
          {correct ? (
            <>
              <strong>Correct.</strong> {explanation}
            </>
          ) : (
            <>
              <strong>Not quite.</strong> {hint} Try again.
            </>
          )}
        </div>
      )}
    </form>
  );
}

export function ApplyStage() {
  const [parameters, setParameters] = useState({ a: "", d: "", n: "" });
  const [checked, setChecked] = useState(false);
  const [extension, setExtension] = useState(false);
  const identified =
    isNumericAnswer(parameters.a, 10) &&
    isNumericAnswer(parameters.d, 5) &&
    isNumericAnswer(parameters.n, 7);
  return (
    <>
      <div className="ap-stage-heading">
        <p className="ap-kicker">05 / Mathematics in everyday life</p>
        <h1>
          A little more.
          <br />
          <em>Every single day.</em>
        </h1>
        <p>
          A student saves ₹10 on the first day and increases the amount saved by
          ₹5 every day. How much will be saved in 7 days?
        </p>
      </div>
      <div className="ap-calendar" aria-label="Seven daily deposits">
        {[10, 15, 20, 25, 30, 35, 40].map((value, i) => (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <span>Day {i + 1}</span>
            <div
              className="ap-saving-bar"
              style={{ height: `${30 + value * 1.5}px` }}
            >
              <i aria-hidden="true">₹</i>
            </div>
            <strong>₹{value}</strong>
          </motion.div>
        ))}
      </div>
      <form
        className="ap-identify"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <p>Identify the AP</p>
        {(["a", "d", "n"] as const).map((key) => (
          <label key={key}>
            {key}
            <input
              required
              aria-label={`Savings ${key}`}
              inputMode="numeric"
              placeholder="?"
              value={parameters[key]}
              onChange={(e) => {
                setParameters((p) => ({ ...p, [key]: e.target.value }));
                setChecked(false);
              }}
            />
          </label>
        ))}
        <button
          className="ap-icon"
          type="submit"
          title="Check AP values"
          aria-label="Check AP values"
        >
          <Check />
        </button>
      </form>
      {checked && (
        <p
          className={`ap-feedback ${identified ? "correct" : ""}`}
          role="status"
        >
          {identified
            ? "Yes. Now combine the seven deposits."
            : "a is the first deposit, d is the daily increase, and n counts the days. Try those values again."}
        </p>
      )}
      <NumberCheck
        label="Total saved (₹)"
        expected={175}
        hint="The final deposit is not the total. Use seven times the average of the first and last deposits."
        explanation={<Math tex="S_7=\frac{7}{2}[2(10)+6(5)]=\text{₹}175" />}
      />
      <button
        className="ap-text-button"
        onClick={() => setExtension(!extension)}
      >
        {extension ? "Close extension" : "An extra challenge"}
        <ArrowRight size={18} />
      </button>
      {extension && (
        <div className="ap-extension">
          <h2>3, 7, 11, … for 8 terms</h2>
          <NumberCheck
            label="Sum of eight terms"
            expected={136}
            hint="Here a = 3 and d = 4. There are seven jumps to the last term."
            explanation="The last term is 31. The sum is 8 × (3 + 31) ÷ 2 = 136."
          />
        </div>
      )}
    </>
  );
}

export function ChallengeStage() {
  const [values, setValues] = useState(["", "", ""]);
  const [attempted, setAttempted] = useState([false, false, false]);
  const [correct, setCorrect] = useState([false, false, false]);
  const [hints, setHints] = useState([false, false, false]);
  function update(index: number, value: string) {
    setValues((v) => v.map((old, i) => (i === index ? value : old)));
    setAttempted((v) => v.map((old, i) => (i === index ? false : old)));
    setCorrect((v) => v.map((old, i) => (i === index ? false : old)));
  }
  function check(index: number) {
    if (!values[index].trim()) return;
    setAttempted((v) => v.map((old, i) => (i === index ? true : old)));
    setCorrect((v) =>
      v.map((old, i) =>
        i === index
          ? index === 2
            ? values[index] === "n-1"
            : isNumericAnswer(
                values[index],
                assessmentQuestions[index as 0 | 1].answer,
              )
          : old,
      ),
    );
  }
  return (
    <>
      <div className="ap-stage-heading ap-heading-compact">
        <p className="ap-kicker">06 / Pause. Think. Justify.</p>
        <h1>
          Three questions.
          <br />
          <em>One powerful idea.</em>
        </h1>
        <p>No race. Explain your reasoning before checking your answer.</p>
      </div>
      <div className="ap-assessment-summary">
        <span>Classroom check</span>
        <strong aria-live="polite">{correct.filter(Boolean).length} / 3</strong>
      </div>
      <div className="ap-question-list">
        {[0, 1, 2].map((index) => (
          <form
            key={index}
            className="ap-question"
            onSubmit={(e) => {
              e.preventDefault();
              check(index);
            }}
          >
            <span className="ap-question-number">0{index + 1}</span>
            <div>
              <h2>
                {index < 2
                  ? assessmentQuestions[index as 0 | 1].prompt
                  : "A student writes the formula below. What must replace n in the common-difference term?"}
              </h2>
              {index === 2 && (
                <Math tex="S_n=\frac{n}{2}[2a+\underbrace{n}_{?}d]" />
              )}
              <div className="ap-action-row">
                {index === 2 ? (
                  <fieldset className="ap-choice-set">
                    <legend className="ap-sr-only">Replacement for n</legend>
                    {["n+1", "n-1", "2n"].map((option) => (
                      <label
                        className={values[2] === option ? "chosen" : ""}
                        key={option}
                      >
                        <input
                          type="radio"
                          name="correction"
                          value={option}
                          checked={values[2] === option}
                          onChange={(e) => update(2, e.target.value)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </fieldset>
                ) : (
                  <label className="ap-inline-field">
                    <span className="ap-sr-only">
                      Answer to question {index + 1}
                    </span>
                    <input
                      aria-label={`Answer to question ${index + 1}`}
                      inputMode="numeric"
                      placeholder="Your sum"
                      value={values[index]}
                      onChange={(e) => update(index, e.target.value)}
                      required
                    />
                  </label>
                )}
                <button
                  type="submit"
                  className="ap-button ap-secondary"
                  disabled={!values[index].trim()}
                >
                  Check
                  <Check size={18} />
                </button>
                <button
                  type="button"
                  className="ap-icon"
                  title={`Hint for question ${index + 1}`}
                  aria-label={`Hint for question ${index + 1}`}
                  onClick={() =>
                    setHints((v) =>
                      v.map((old, i) => (i === index ? !old : old)),
                    )
                  }
                >
                  <Lightbulb size={20} />
                </button>
              </div>
              {hints[index] && (
                <p className="ap-feedback">
                  {index < 2
                    ? assessmentQuestions[index as 0 | 1].hint
                    : "How many jumps connect the first of five terms to the fifth?"}
                </p>
              )}
              {attempted[index] && (
                <p
                  className={`ap-feedback ${correct[index] ? "correct" : ""}`}
                  role="status"
                >
                  <strong>{correct[index] ? "Correct. " : "Not yet. "}</strong>
                  {index < 2
                    ? assessmentQuestions[index as 0 | 1][
                        correct[index] ? "explanation" : "hint"
                      ]
                    : correct[index]
                      ? "n terms contain n−1 jumps. The correct last term is a+(n−1)d, not a+nd."
                      : "Write out a, a+d, a+2d. Count jumps, not terms."}
                </p>
              )}
            </div>
          </form>
        ))}
      </div>
    </>
  );
}

export function ExitStage({ onReset }: { onReset: () => void }) {
  return (
    <>
      <div className="ap-stage-heading">
        <p className="ap-kicker">07 / An idea worth keeping</p>
        <h1>
          Don’t memorise the sum.
          <br />
          <em>See why it works.</em>
        </h1>
      </div>
      <div className="ap-concept-map">
        {[
          "Pattern",
          "Equal pairs",
          "Generalisation",
          "AP sum formula",
          "Application",
        ].map((label, i) => (
          <div key={label}>
            <span>0{i + 1}</span>
            <strong>{label}</strong>
            {i < 4 && <ArrowRight aria-hidden="true" />}
          </div>
        ))}
      </div>
      <div className="ap-exit-formulas">
        <Math tex="S_n=\frac{n}{2}[2a+(n-1)d]" />
        <Math tex="S_n=\frac{n}{2}(a+l)" />
        <p>Two copies. Equal columns. Divide by two.</p>
      </div>
      <Prompt>
        Can you explain why the sum formula works without merely memorising it?
      </Prompt>
      <div className="ap-exit-ticket">
        <p className="ap-kicker">Exit ticket</p>
        <h2>
          Nine days. ₹5 saved each day. No increase.
          <br />
          What is the total?
        </h2>
        <NumberCheck
          label="Exit ticket total (₹)"
          expected={45}
          hint="A common difference of zero is still an AP. Every one of the nine terms is 5."
          explanation="9 × 5 = ₹45. The AP formula works when d = 0 too."
        />
      </div>
      <button className="ap-text-button" onClick={onReset}>
        <RotateCcw size={18} />
        Start a fresh lesson
      </button>
    </>
  );
}

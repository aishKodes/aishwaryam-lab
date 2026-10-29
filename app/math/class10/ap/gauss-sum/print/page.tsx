"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { GAUSS_PATH, gaussStages } from "@/data/gauss-lesson";
import { MathExpression as Math } from "@/components/gauss/MathExpression";

function Page({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="ap-print-page">
      <header>
        <span>Aishwaryam Lab · Class X · NCERT</span>
        <span>
          Arithmetic progressions / {number.toString().padStart(2, "0")}
        </span>
      </header>
      <h1>{title}</h1>
      {children}
    </article>
  );
}

export default function PrintableTLM() {
  return (
    <main className="ap-print">
      <div className="ap-print-toolbar">
        <Link href={GAUSS_PATH}>← Back to the Gauss Lab</Link>
        <button className="ap-button" onClick={() => window.print()}>
          <Printer size={20} />
          Print A4 materials
        </button>
      </div>
      <Page number={1} title="Ten numbers. Many possibilities.">
        <p>
          Cut along the dotted lines. Place the cards on a desk or attach them
          to the board with reusable adhesive.
        </p>
        <div className="ap-print-cards">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
      </Page>
      <Page number={2} title="Can every pair be equal?">
        <p>
          Move your number cards into five pairs. Record your arrangement.
          Change it if you notice a better pattern.
        </p>
        <table className="ap-print-pairs">
          <thead>
            <tr>
              <th>Pair</th>
              <th>First card</th>
              <th>Partner</th>
              <th>Pair total</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td>{i}</td>
                <td>　</td>
                <td>　</td>
                <td>　</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>What do you notice?</h2>
        <div className="ap-writing-lines" />
        <h2>Explain your total without adding all ten numbers.</h2>
        <div className="ap-writing-lines" />
        <p>Extension: what changes if your cards run from 1 to 9?</p>
      </Page>
      <Page number={3} title="Forward. Reverse. Equal columns.">
        <p>
          Start with the numbers from 1 to 10. Write a second copy in reverse
          and add each column.
        </p>
        <table className="ap-print-pairs">
          <tbody>
            <tr>
              <th>S</th>
              {[1, 2, 3, 4, 5].map((n) => (
                <td key={n}>{n}</td>
              ))}
              <td>…</td>
              <td>10</td>
            </tr>
            <tr>
              <th>S</th>
              {[10, 9, 8, 7, 6].map((n) => (
                <td key={n}>{n}</td>
              ))}
              <td>…</td>
              <td>1</td>
            </tr>
            <tr>
              <th>2S</th>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <td key={n}>?</td>
              ))}
            </tr>
          </tbody>
        </table>
        <p>There are ______ columns. Each column adds to ______.</p>
        <Math tex="2S=\rule{1.2cm}{0.15mm}\times\rule{1.2cm}{0.15mm}" />
        <Math tex="S=\frac{\rule{1.2cm}{0.15mm}\times\rule{1.2cm}{0.15mm}}{2}" />
        <h2>Why divide by two?</h2>
        <div className="ap-writing-lines" />
        <h2>Try the same arrangement for 1 to 100.</h2>
        <p>Number of physical pairs: ______ · Sum of each pair: ______</p>
        <p>Total: ______</p>
        <h2>If there are 9 cards…</h2>
        <p>
          There are four physical pairs and an unpaired centre card. Write its
          value and explain how to count it exactly once.
        </p>
        <div className="ap-writing-lines" />
      </Page>
      <Page number={4} title="Discover the formula, one step at a time.">
        <p>
          Let the first term be a, the common difference d, and the number of
          terms n.
        </p>
        <h2>1. Find the last term</h2>
        <Math tex="l=a+(n-1)d" />
        <p>There are n terms, but only n−1 jumps from the first to the last.</p>
        <h2>2. Arrange two copies</h2>
        <Math tex="S_n=a+(a+d)+\cdots+l" />
        <Math tex="S_n=l+(l-d)+\cdots+a" />
        <h2>3. Add columns</h2>
        <p>Each column totals a+l. There are n columns.</p>
        <Math tex="2S_n=n(a+l)" />
        <h2>4. Return to one copy</h2>
        <Math tex="S_n=\frac{n}{2}(a+l)" />
        <Math tex="S_n=\frac{n}{2}[2a+(n-1)d]" />
        <h2>Explain, don’t just memorise.</h2>
        <p>Why are the column sums equal? Why is there a factor of one-half?</p>
        <div className="ap-writing-lines" />
        <p>Check the reasoning for d=0, d&lt;0 and n=1.</p>
      </Page>
      <Page number={5} title="Three small mathematical challenges">
        <p>Cut apart. Think first, explain second, calculate third.</p>
        <div className="ap-print-assessment">
          <h2>01 · Find a pattern</h2>
          <p>Find the sum of the first 20 natural numbers.</p>
          <p>Answer: __________ · My reasoning:</p>
          <div className="ap-writing-lines" />
        </div>
        <div className="ap-print-assessment">
          <h2>02 · Identify the AP</h2>
          <p>Find 2 + 5 + 8 + 11 + 14.</p>
          <p>a = _____ · d = _____ · n = _____ · Sum = _____</p>
          <div className="ap-writing-lines" />
        </div>
        <div className="ap-print-assessment">
          <h2>03 · Be the detective</h2>
          <Math tex="S_n=\frac{n}{2}[2a+nd]" />
          <p>Identify the mistake and explain how to correct it.</p>
          <div className="ap-writing-lines" />
        </div>
      </Page>
      <Page number={6} title="Teacher handout · A 35-minute discovery">
        <p>
          <strong>Aishwaryam Singh Tomar · 23SD11002</strong>
          <br />
          Class X Mathematics · NCERT · Sum of the first n terms of an AP
        </p>
        <h2>Before the lesson</h2>
        <p>
          Open the Gauss Lab, check projection and choose light or dark mode.
          Close Teacher Notes before projecting. Cut out cards 1–10 and prepare
          reusable adhesive. Keep the pairing chart available. Internet is not
          needed for the activities once the page is loaded; save offline
          beforehand for reloads.
        </p>
        <h2>Concrete → pictorial → abstract</h2>
        {gaussStages.map((stage, i) => (
          <div className="ap-print-stage-note" key={stage.short}>
            <strong>
              {i + 1}. {stage.short}
              <br />
              {stage.minutes} min
            </strong>
            <p>
              {stage.notes[0]}{" "}
              {i === 1
                ? "Mirror students’ card arrangements on screen. Do not arrange the equal pairs for them."
                : stage.notes[1]}
            </p>
          </div>
        ))}
        <div className="ap-print-answer-key">
          <h3>Teacher reference · keep separate from student cards</h3>
          <p>
            1–10: 55. 1–100: 5050. Savings: a=10, d=5, n=7, S=175. Extension:
            136. Assessment: 210; 40; replace nd by (n−1)d. Exit: 45.
          </p>
          <p>
            Support: use smaller sequences and actual cards. Extension: justify
            odd N, negative d or n=1. Evidence of learning: a student can
            explain equal columns and why the doubled total is halved.
          </p>
        </div>
      </Page>
    </main>
  );
}

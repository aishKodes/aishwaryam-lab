"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Eye, Gavel, Send } from "lucide-react";
import { courtCases, criterionLabels } from "@/data/missions";
import type { Criterion, FeedbackTone } from "@/types/game";
import { SCORE, formatDelta } from "@/lib/scoring";
import { cn } from "@/lib/cn";
import { useMissionHotkeys } from "@/hooks/useMissionHotkeys";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeedbackModal } from "@/components/ui/FeedbackModal";
import { CourtroomDiagram } from "@/components/visuals/CourtroomDiagram";

type CourtroomMissionProps = {
  onAwardScore: (delta: number, label: string) => void;
  onNextTeam: () => void;
  onComplete: (perfect: boolean) => void;
};

type CourtFeedback = {
  title: string;
  tone: FeedbackTone;
  body: string;
  delta: number;
};

const criteria: Criterion[] = ["AA", "SSS", "SAS", "not-enough"];

export function CourtroomMission({
  onAwardScore,
  onNextTeam,
  onComplete
}: CourtroomMissionProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Criterion | null>(null);
  const [answered, setAnswered] = useState<Record<string, Criterion>>({});
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<CourtFeedback | null>(null);
  const [revealOpen, setRevealOpen] = useState(false);
  const [done, setDone] = useState(false);

  const currentCase = courtCases[index];
  const answeredCount = Object.keys(answered).length;
  const perfect = done && mistakes === 0 && answeredCount === courtCases.length;

  const progress = useMemo(() => {
    return Math.round((answeredCount / courtCases.length) * 100);
  }, [answeredCount]);

  const submitVerdict = useCallback(() => {
    if (!selected || feedback || done || answered[currentCase.id]) {
      return;
    }

    const isCorrect = selected === currentCase.answer;
    const trap = !isCorrect && selected === currentCase.trapChoice;
    const delta = isCorrect
      ? selected === "not-enough"
        ? SCORE.correctAnswer
        : SCORE.correctAnswer + SCORE.correctTheorem
      : trap
        ? SCORE.trapMistake
        : 0;

    onAwardScore(delta, currentCase.title);
    setAnswered((current) => ({ ...current, [currentCase.id]: selected }));
    if (!isCorrect) {
      setMistakes((count) => count + 1);
    }
    setFeedback({
      title: isCorrect ? "Verdict sustained" : trap ? "Trap objection" : "Verdict overruled",
      tone: isCorrect ? "success" : trap ? "warning" : "danger",
      body: currentCase.explanation,
      delta
    });
  }, [answered, currentCase, done, feedback, onAwardScore, selected]);

  const revealCurrent = useCallback(() => {
    setRevealOpen(true);
  }, []);

  useMissionHotkeys({
    onNext: onNextTeam,
    onReveal: revealCurrent,
    onSubmit: submitVerdict
  });

  function continueAfterFeedback() {
    setFeedback(null);
    setSelected(null);

    if (index + 1 >= courtCases.length) {
      setDone(true);
      return;
    }

    setIndex((value) => value + 1);
  }

  if (done) {
    return (
      <div className="glass-panel grid flex-1 gap-5 rounded-xl p-5 lg:grid-cols-[0.95fr_1.05fr]">
        <CourtroomDiagram />
        <div className="flex flex-col justify-center space-y-5">
          <div className="inline-flex w-fit rounded-lg border border-emerald-300/35 bg-emerald-300/12 px-4 py-2 text-sm font-bold uppercase text-emerald-100">
            Courtroom debrief
          </div>
          <h2 className="text-4xl font-black">Criteria entered into evidence</h2>
          <p className="text-xl leading-9 text-slate-200">
            AA uses two equal angle pairs, SSS uses three proportional side pairs, and SAS uses two proportional including sides with the included angle equal. One angle and one side pair is not enough.
          </p>
          <div className="rounded-xl border border-slate-600/35 bg-slate-950/50 p-4 text-lg text-slate-300">
            Correct verdicts: {courtCases.length - mistakes} / {courtCases.length}
          </div>
          <SmartButton
            icon={<Check className="h-6 w-6" />}
            onClick={() => onComplete(perfect)}
            variant={perfect ? "success" : "primary"}
          >
            Complete Level 4
          </SmartButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid flex-1 gap-4 xl:grid-cols-[0.96fr_1.04fr]">
      <section className="glass-panel rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase text-cyan-200">Case file {index + 1} / {courtCases.length}</p>
            <h2 className="mt-1 text-3xl font-black">{currentCase.title}</h2>
          </div>
          <div className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 font-mono text-cyan-100">
            {progress}%
          </div>
        </div>
        <CourtroomDiagram />
      </section>

      <section className="glass-panel flex flex-col rounded-xl p-5">
        <div className="grid gap-3 lg:grid-cols-2">
          <EvidenceList title="Triangle ABC" items={currentCase.triangleA} />
          <EvidenceList title="Triangle PQR" items={currentCase.triangleB} />
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-amber-300/25 bg-amber-300/8 p-4 text-amber-100">
          <Gavel className="h-7 w-7 shrink-0" />
          <p className="text-lg font-bold">Choose the theorem or ruling that proves the case.</p>
        </div>

        <div className="mt-5 grid flex-1 gap-3 sm:grid-cols-2">
          {criteria.map((criterion) => (
            <button
              key={criterion}
              className={cn(
                "min-h-20 rounded-xl border p-4 text-left text-2xl font-black transition",
                selected === criterion
                  ? "border-cyan-200 bg-cyan-200 text-slate-950 shadow-glow"
                  : "border-slate-600/40 bg-slate-950/45 text-slate-100 hover:border-cyan-300/55 hover:bg-cyan-300/10"
              )}
              onClick={() => setSelected(criterion)}
            >
              {criterionLabels[criterion]}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <SmartButton className="flex-1" variant="ghost" icon={<Eye className="h-6 w-6" />} onClick={revealCurrent}>
            Teacher Reveal
          </SmartButton>
          <SmartButton className="flex-1" icon={<Send className="h-6 w-6" />} disabled={!selected} onClick={submitVerdict}>
            Submit
          </SmartButton>
        </div>
      </section>

      <FeedbackModal
        open={Boolean(feedback)}
        tone={feedback?.tone}
        title={feedback?.title ?? ""}
        footer={
          <SmartButton onClick={continueAfterFeedback}>
            {index + 1 >= courtCases.length ? "Debrief" : "Next Case"}
          </SmartButton>
        }
      >
        <p>{feedback?.body}</p>
        <p className="font-mono text-cyan-100">Score change: {formatDelta(feedback?.delta ?? 0)}</p>
      </FeedbackModal>

      <FeedbackModal
        open={revealOpen}
        tone="info"
        title="Teacher reveal"
        footer={<SmartButton onClick={() => setRevealOpen(false)}>Close</SmartButton>}
      >
        <p>Correct ruling: {criterionLabels[currentCase.answer]}</p>
        <p>{currentCase.explanation}</p>
      </FeedbackModal>
    </div>
  );
}

function EvidenceList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-600/35 bg-slate-950/50 p-4">
      <p className="mb-3 text-sm font-bold uppercase text-cyan-200">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-lg font-semibold text-slate-100">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Eye, Gavel, Send } from "lucide-react";
import { courtCases, criterionLabels } from "@/data/missions";
import type { Criterion, FeedbackTone, LevelResult } from "@/types/game";
import { LEVEL_TOTAL, clampScore } from "@/lib/scoring";
import { cn } from "@/lib/cn";
import { useMissionHotkeys } from "@/hooks/useMissionHotkeys";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeedbackModal } from "@/components/ui/FeedbackModal";
import { CourtroomDiagram } from "@/components/visuals/CourtroomDiagram";

type CourtroomMissionProps = {
  onComplete: (result: LevelResult) => void;
};

type CourtResponse = {
  caseId: string;
  title: string;
  selected: Criterion;
  correctAnswer: Criterion;
  isCorrect: boolean;
  trap: boolean;
};

type CourtFeedback = {
  title: string;
  tone: FeedbackTone;
  body: string;
  isCorrect: boolean;
};

const criteria: Criterion[] = ["AA", "SSS", "SAS", "not-enough"];

export function CourtroomMission({ onComplete }: CourtroomMissionProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Criterion | null>(null);
  const [responses, setResponses] = useState<CourtResponse[]>([]);
  const [feedback, setFeedback] = useState<CourtFeedback | null>(null);
  const [revealOpen, setRevealOpen] = useState(false);
  const [done, setDone] = useState(false);

  const currentCase = courtCases[index];
  const progress = useMemo(() => {
    return Math.round((responses.length / courtCases.length) * 100);
  }, [responses.length]);

  const correctCount = responses.filter((response) => response.isCorrect).length;
  const levelScore = clampScore((correctCount / courtCases.length) * LEVEL_TOTAL);
  const perfect = done && correctCount === courtCases.length;

  const submitVerdict = useCallback(() => {
    if (!selected || feedback || done) {
      return;
    }

    const isCorrect = selected === currentCase.answer;
    const trap = !isCorrect && selected === currentCase.trapChoice;
    const response: CourtResponse = {
      caseId: currentCase.id,
      title: currentCase.title,
      selected,
      correctAnswer: currentCase.answer,
      isCorrect,
      trap
    };

    setResponses((current) => [...current, response]);
    setFeedback({
      title: isCorrect ? "Verdict sustained" : trap ? "Trap objection" : "Verdict overruled",
      tone: isCorrect ? "success" : trap ? "warning" : "danger",
      body: currentCase.explanation,
      isCorrect
    });
  }, [currentCase, done, feedback, selected]);

  const revealCurrent = useCallback(() => {
    setRevealOpen(true);
  }, []);

  useMissionHotkeys({
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

  function completeLevel() {
    onComplete({
      levelId: 4,
      title: "Similarity Courtroom",
      score: levelScore,
      total: LEVEL_TOTAL,
      correct: perfect,
      summary: `${correctCount} of ${courtCases.length} similarity cases judged correctly.`,
      answers: {
        kind: "courtroom",
        correctCount,
        totalCases: courtCases.length,
        responses
      },
      completedAt: new Date().toISOString()
    });
  }

  if (done) {
    return (
      <div className="glass-panel grid flex-1 gap-5 rounded-xl p-4 sm:p-5 lg:grid-cols-[0.95fr_1.05fr]">
        <CourtroomDiagram />
        <div className="flex flex-col justify-center space-y-5">
          <div className="inline-flex w-fit rounded-lg border border-emerald-300/35 bg-emerald-300/12 px-4 py-2 text-sm font-bold uppercase text-emerald-100">
            Courtroom debrief
          </div>
          <h2 className="text-3xl font-black sm:text-4xl">Criteria entered into evidence</h2>
          <p className="text-lg leading-8 text-slate-200 sm:text-xl sm:leading-9">
            AA uses two equal angle pairs, SSS uses three proportional side pairs, and SAS uses two proportional including sides with the included angle equal. One angle and one side pair is not enough.
          </p>
          <div className="rounded-xl border border-slate-600/35 bg-slate-950/50 p-4 text-lg text-slate-300">
            Correct verdicts: {correctCount} / {courtCases.length}
            <span className="ml-3 font-mono text-cyan-100">{levelScore}/100</span>
          </div>
          <SmartButton
            icon={<Check className="h-6 w-6" />}
            onClick={completeLevel}
            variant={perfect ? "success" : "primary"}
          >
            Save Level 4
          </SmartButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid flex-1 gap-4 xl:grid-cols-[0.96fr_1.04fr]">
      <section className="glass-panel rounded-xl p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase text-cyan-200">
              Case file {index + 1} / {courtCases.length}
            </p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">{currentCase.title}</h2>
          </div>
          <div className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 font-mono text-cyan-100">
            {progress}%
          </div>
        </div>
        <CourtroomDiagram />
      </section>

      <section className="glass-panel flex flex-col rounded-xl p-4 sm:p-5">
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
                "min-h-16 rounded-xl border p-4 text-left text-xl font-black transition sm:min-h-20 sm:text-2xl",
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
          <SmartButton
            className="flex-1"
            variant="ghost"
            icon={<Eye className="h-6 w-6" />}
            onClick={revealCurrent}
          >
            Teacher Reveal
          </SmartButton>
          <SmartButton
            className="flex-1"
            icon={<Send className="h-6 w-6" />}
            disabled={!selected}
            onClick={submitVerdict}
          >
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
        <p className="font-mono text-cyan-100">
          Case status: {feedback?.isCorrect ? "correct" : "incorrect"}
        </p>
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
          <li
            key={item}
            className="rounded-lg border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-base font-semibold text-slate-100 sm:text-lg"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

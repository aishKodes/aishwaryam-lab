"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Send } from "lucide-react";
import { numericMissions } from "@/data/missions";
import type { Criterion, FeedbackTone, LevelId, LevelResult } from "@/types/game";
import { LEVEL_TOTAL, NUMERIC_SCORE, isCloseNumber } from "@/lib/scoring";
import { cn } from "@/lib/cn";
import { useMissionHotkeys } from "@/hooks/useMissionHotkeys";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeedbackModal } from "@/components/ui/FeedbackModal";
import { ShadowDiagram } from "@/components/visuals/ShadowDiagram";
import { ThalesGateDiagram } from "@/components/visuals/ThalesGateDiagram";

type NumericMissionPanelProps = {
  levelId: Extract<LevelId, 2 | 3 | 5>;
  onComplete: (result: LevelResult) => void;
};

type NumericFeedback = {
  title: string;
  tone: FeedbackTone;
  score: number;
  perfect: boolean;
  lines: string[];
};

export function NumericMissionPanel({ levelId, onComplete }: NumericMissionPanelProps) {
  const mission = numericMissions[levelId];
  const [answer, setAnswer] = useState("");
  const [theorem, setTheorem] = useState<Criterion | null>(null);
  const [correspondence, setCorrespondence] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<NumericFeedback | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [lastResult, setLastResult] = useState<LevelResult | null>(null);

  const answerValue = Number(answer);
  const diagram = useMemo(() => {
    if (levelId === 3) {
      return <ThalesGateDiagram unlocked={Boolean(lastResult?.correct)} />;
    }

    return <ShadowDiagram mode={levelId === 2 ? "tower" : "monument"} />;
  }, [lastResult?.correct, levelId]);

  const submitAnswer = useCallback(() => {
    if (submitted) {
      if (lastResult) {
        onComplete(lastResult);
      }
      return;
    }

    const answerCorrect = isCloseNumber(answerValue, mission.correctAnswer);
    const theoremCorrect = theorem === mission.correctTheorem;
    const correspondenceCorrect = correspondence === mission.correctCorrespondence;
    const trap = !answerCorrect && mission.trapAnswers.some((value) => isCloseNumber(answerValue, value, 0.05));
    const score =
      (answerCorrect ? NUMERIC_SCORE.answer : 0) +
      (theoremCorrect ? NUMERIC_SCORE.theorem : 0) +
      (correspondenceCorrect ? NUMERIC_SCORE.correspondence : 0);
    const perfect = answerCorrect && theoremCorrect && correspondenceCorrect;

    const lines = [
      answerCorrect
        ? "Measurement answer: correct."
        : "Measurement answer: not correct. Hint: keep corresponding lengths in the same order.",
      theoremCorrect
        ? "Theorem / criterion: correct."
        : "Theorem / criterion: not correct. Hint: identify why the triangles are similar.",
      correspondenceCorrect
        ? "Correspondence: correct."
        : "Correspondence: not correct. Hint: match height with height, shadow with shadow, or side-part with side-part."
    ];

    if (trap) {
      lines.push("Trap note: this answer matches a common inverted or mismatched ratio.");
    }

    const result: LevelResult = {
      levelId,
      title: mission.id === 2 ? "Shadow Machine" : mission.id === 3 ? "Thales Laser Gate" : "Boss Mission",
      score,
      total: LEVEL_TOTAL,
      correct: perfect,
      summary: perfect
        ? "Answer, theorem, and correspondence were all correct."
        : "One or more pieces of evidence need review.",
      answers: {
        kind: "numeric",
        enteredAnswer: answer,
        numericAnswer: answerValue,
        selectedTheorem: theorem,
        selectedCorrespondence: correspondence,
        answerCorrect,
        theoremCorrect,
        correspondenceCorrect,
        trap
      },
      completedAt: new Date().toISOString()
    };

    setSubmitted(true);
    setLastResult(result);
    setFeedback({
      title: perfect ? "Mission solved" : score > 0 ? "Partial evidence accepted" : trap ? "Trap mistake" : "Evidence rejected",
      tone: perfect ? "success" : score > 0 ? "warning" : trap ? "warning" : "danger",
      score,
      perfect,
      lines
    });
  }, [answer, answerValue, correspondence, lastResult, levelId, mission, onComplete, submitted, theorem]);

  useMissionHotkeys({
    onSubmit: submitAnswer
  });

  return (
    <div className="grid flex-1 gap-4 xl:grid-cols-[0.96fr_1.04fr]">
      <section className="glass-panel rounded-xl p-3 sm:p-5">
        {diagram}
      </section>

      <section className="glass-panel flex flex-col rounded-xl p-4 sm:p-5">
        <div className="rounded-xl border border-slate-600/35 bg-slate-950/50 p-4 sm:p-5">
          <p className="text-sm font-bold uppercase text-cyan-200">Challenge</p>
          <p className="mt-2 text-lg leading-8 text-slate-100 sm:text-xl sm:leading-9">
            {mission.problem}
          </p>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <label className="rounded-xl border border-slate-600/35 bg-slate-950/50 p-4">
            <span className="mb-2 block text-sm font-bold uppercase text-slate-400">
              {mission.inputLabel}
            </span>
            <div className="flex items-center gap-3">
              <input
                className="min-h-16 w-full rounded-lg border border-cyan-300/35 bg-slate-950/80 px-4 font-mono text-3xl font-black text-white placeholder:text-slate-600"
                inputMode="decimal"
                placeholder="x"
                value={answer}
                disabled={submitted}
                onChange={(event) => setAnswer(event.target.value)}
              />
              <span className="text-2xl font-black text-cyan-100">{mission.inputSuffix}</span>
            </div>
          </label>

          <div className="rounded-xl border border-slate-600/35 bg-slate-950/50 p-4">
            <p className="mb-3 text-sm font-bold uppercase text-slate-400">Theorem / criterion</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {mission.theoremOptions.map((option) => (
                <button
                  key={option.id}
                  disabled={submitted}
                  className={cn(
                    "min-h-14 rounded-lg border px-3 py-2 text-left font-bold transition disabled:opacity-55",
                    theorem === option.id
                      ? "border-cyan-200 bg-cyan-200 text-slate-950"
                      : "border-slate-600/40 bg-slate-950/45 text-slate-100 hover:border-cyan-300/55"
                  )}
                  onClick={() => setTheorem(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-600/35 bg-slate-950/50 p-4">
          <p className="mb-3 text-sm font-bold uppercase text-slate-400">Triangle correspondence</p>
          <div className="grid gap-2">
            {mission.correspondenceOptions.map((option) => (
              <button
                key={option.id}
                disabled={submitted}
                className={cn(
                  "min-h-14 rounded-lg border px-4 py-3 text-left text-base font-bold transition disabled:opacity-55",
                  correspondence === option.id
                    ? "border-emerald-200 bg-emerald-200 text-slate-950"
                    : "border-slate-600/40 bg-slate-950/45 text-slate-100 hover:border-emerald-300/55"
                )}
                onClick={() => setCorrespondence(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <SmartButton
            className="flex-1"
            icon={submitted ? <Check className="h-6 w-6" /> : <Send className="h-6 w-6" />}
            disabled={!submitted && (!answer || !theorem || !correspondence)}
            variant={submitted ? "success" : "primary"}
            onClick={submitAnswer}
          >
            {submitted ? "Save Level" : "Submit"}
          </SmartButton>
        </div>
      </section>

      <FeedbackModal
        open={Boolean(feedback)}
        tone={feedback?.tone}
        title={feedback?.title ?? ""}
        footer={<SmartButton onClick={() => setFeedback(null)}>Close</SmartButton>}
      >
        <div className="space-y-2">
          {feedback?.lines.map((line) => <p key={line}>{line}</p>)}
        </div>
        <p className="font-mono text-cyan-100">Level score: {feedback?.score ?? 0}/100</p>
      </FeedbackModal>
    </div>
  );
}

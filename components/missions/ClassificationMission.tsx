"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Eye, Send, ShieldQuestion } from "lucide-react";
import { classificationCards, classificationLabels } from "@/data/missions";
import type { Classification, FeedbackTone } from "@/types/game";
import { SCORE, formatDelta } from "@/lib/scoring";
import { cn } from "@/lib/cn";
import { useMissionHotkeys } from "@/hooks/useMissionHotkeys";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeedbackModal } from "@/components/ui/FeedbackModal";
import { SimilarityCardVisual } from "@/components/visuals/SimilarityCardVisual";

type ClassificationMissionProps = {
  onAwardScore: (delta: number, label: string) => void;
  onNextTeam: () => void;
  onComplete: (perfect: boolean) => void;
};

type FeedbackState = {
  title: string;
  tone: FeedbackTone;
  body: string;
  delta: number;
};

const choices: Classification[] = ["similar", "not-similar", "need-more-data"];

export function ClassificationMission({
  onAwardScore,
  onNextTeam,
  onComplete
}: ClassificationMissionProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Classification | null>(null);
  const [answered, setAnswered] = useState<Record<string, Classification>>({});
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [revealOpen, setRevealOpen] = useState(false);
  const [done, setDone] = useState(false);

  const currentCard = classificationCards[index];
  const answeredCount = Object.keys(answered).length;
  const perfect = done && mistakes === 0 && answeredCount === classificationCards.length;

  const progress = useMemo(() => {
    return Math.round((answeredCount / classificationCards.length) * 100);
  }, [answeredCount]);

  const submitChoice = useCallback(() => {
    if (!currentCard || !selected || feedback || done || answered[currentCard.id]) {
      return;
    }

    const isCorrect = selected === currentCard.answer;
    const trap = !isCorrect && selected === currentCard.trapChoice;
    const delta = isCorrect ? SCORE.correctAnswer : trap ? SCORE.trapMistake : 0;

    onAwardScore(delta, currentCard.title);
    setAnswered((current) => ({ ...current, [currentCard.id]: selected }));
    if (!isCorrect) {
      setMistakes((count) => count + 1);
    }

    setFeedback({
      title: isCorrect ? "Evidence accepted" : trap ? "Trap detected" : "Verdict rejected",
      tone: isCorrect ? "success" : trap ? "warning" : "danger",
      body: currentCard.explanation,
      delta
    });
  }, [answered, currentCard, done, feedback, onAwardScore, selected]);

  const revealCurrent = useCallback(() => {
    setRevealOpen(true);
  }, []);

  useMissionHotkeys({
    onNext: onNextTeam,
    onReveal: revealCurrent,
    onSubmit: submitChoice
  });

  function continueAfterFeedback() {
    setFeedback(null);
    setSelected(null);

    if (index + 1 >= classificationCards.length) {
      setDone(true);
      return;
    }

    setIndex((value) => value + 1);
  }

  if (done) {
    return (
      <div className="glass-panel grid flex-1 gap-5 rounded-xl p-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-cyan-300/25 bg-cyan-300/8 p-5">
          <SimilarityCardVisual visual="quads" />
        </div>
        <div className="flex flex-col justify-center space-y-5">
          <div className="inline-flex w-fit rounded-lg border border-emerald-300/35 bg-emerald-300/12 px-4 py-2 text-sm font-bold uppercase text-emerald-100">
            Classification debrief
          </div>
          <h2 className="text-4xl font-black">Similarity rule unlocked</h2>
          <p className="text-xl leading-9 text-slate-200">
            Similar figures have the same shape, not necessarily the same size. For polygons, corresponding angles must be equal and corresponding sides must be proportional.
          </p>
          <div className="rounded-xl border border-slate-600/35 bg-slate-950/50 p-4 text-lg text-slate-300">
            Correct cards: {classificationCards.length - mistakes} / {classificationCards.length}
          </div>
          <SmartButton
            icon={<Check className="h-6 w-6" />}
            onClick={() => onComplete(perfect)}
            variant={perfect ? "success" : "primary"}
          >
            Complete Level 1
          </SmartButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid flex-1 gap-4 xl:grid-cols-[0.94fr_1.06fr]">
      <section className="glass-panel rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase text-cyan-200">Evidence card {index + 1} / {classificationCards.length}</p>
            <h2 className="mt-1 text-3xl font-black">{currentCard.title}</h2>
          </div>
          <div className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 font-mono text-cyan-100">
            {progress}%
          </div>
        </div>
        <SimilarityCardVisual visual={currentCard.visual} />
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="glass-panel flex flex-col rounded-xl p-5">
        <div className="mb-5 rounded-xl border border-slate-600/35 bg-slate-950/50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/12 text-amber-100">
              <ShieldQuestion className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-slate-400">Clue</p>
              <p className="mt-1 text-xl leading-8 text-slate-100">{currentCard.clue}</p>
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-3">
          {choices.map((choice) => (
            <button
              key={choice}
              className={cn(
                "min-h-20 rounded-xl border p-4 text-left text-2xl font-black transition",
                selected === choice
                  ? "border-cyan-200 bg-cyan-200 text-slate-950 shadow-glow"
                  : "border-slate-600/40 bg-slate-950/45 text-slate-100 hover:border-cyan-300/55 hover:bg-cyan-300/10"
              )}
              onClick={() => setSelected(choice)}
            >
              {classificationLabels[choice]}
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
            onClick={submitChoice}
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
            {index + 1 >= classificationCards.length ? "Debrief" : "Next Card"}
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
        <p>Correct classification: {classificationLabels[currentCard.answer]}</p>
        <p>{currentCard.explanation}</p>
      </FeedbackModal>
    </div>
  );
}

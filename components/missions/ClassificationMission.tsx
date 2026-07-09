"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Send, ShieldQuestion } from "lucide-react";
import { classificationCards, classificationLabels } from "@/data/missions";
import type { Classification, FeedbackTone, LevelResult } from "@/types/game";
import { LEVEL_TOTAL, clampScore } from "@/lib/scoring";
import { cn } from "@/lib/cn";
import { useMissionHotkeys } from "@/hooks/useMissionHotkeys";
import { SmartButton } from "@/components/ui/SmartButton";
import { FeedbackModal } from "@/components/ui/FeedbackModal";
import { SimilarityCardVisual } from "@/components/visuals/SimilarityCardVisual";

type ClassificationMissionProps = {
  onComplete: (result: LevelResult) => void;
};

type CardResponse = {
  cardId: string;
  prompt: string;
  selected: Classification;
  isCorrect: boolean;
  trap: boolean;
};

type FeedbackState = {
  title: string;
  tone: FeedbackTone;
  body: string;
  isCorrect: boolean;
};

const choices: Classification[] = ["similar", "not-similar", "need-more-data"];

export function ClassificationMission({ onComplete }: ClassificationMissionProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Classification | null>(null);
  const [responses, setResponses] = useState<CardResponse[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [done, setDone] = useState(false);

  const currentCard = classificationCards[index];
  const progress = useMemo(() => {
    return Math.round((responses.length / classificationCards.length) * 100);
  }, [responses.length]);

  const correctCount = responses.filter((response) => response.isCorrect).length;
  const levelScore = clampScore((correctCount / classificationCards.length) * LEVEL_TOTAL);
  const perfect = done && correctCount === classificationCards.length;

  const submitChoice = useCallback(() => {
    if (!currentCard || !selected || feedback || done) {
      return;
    }

    const isCorrect = selected === currentCard.answer;
    const trap = !isCorrect && selected === currentCard.trapChoice;
    const response: CardResponse = {
      cardId: currentCard.id,
      prompt: currentCard.title,
      selected,
      isCorrect,
      trap
    };

    setResponses((current) => [...current, response]);
    setFeedback({
      title: isCorrect ? "Evidence accepted" : trap ? "Trap detected" : "Verdict rejected",
      tone: isCorrect ? "success" : trap ? "warning" : "danger",
      body: isCorrect
        ? "Correct. Your classification has been recorded."
        : "Not correct. Hint: use equal corresponding angles and proportional corresponding sides, not just appearance.",
      isCorrect
    });
  }, [currentCard, done, feedback, selected]);

  useMissionHotkeys({
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

  function completeLevel() {
    onComplete({
      levelId: 1,
      title: "Similar or Imposter",
      score: levelScore,
      total: LEVEL_TOTAL,
      correct: perfect,
      summary: `${correctCount} of ${classificationCards.length} cards classified correctly.`,
      answers: {
        kind: "classification",
        correctCount,
        totalCards: classificationCards.length,
        responses
      },
      completedAt: new Date().toISOString()
    });
  }

  if (done) {
    return (
      <div className="glass-panel grid flex-1 gap-5 rounded-xl p-4 sm:p-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-cyan-300/25 bg-cyan-300/8 p-3 sm:p-5">
          <SimilarityCardVisual visual="quads" />
        </div>
        <div className="flex flex-col justify-center space-y-5">
          <div className="inline-flex w-fit rounded-lg border border-emerald-300/35 bg-emerald-300/12 px-4 py-2 text-sm font-bold uppercase text-emerald-100">
            Classification debrief
          </div>
          <h2 className="text-3xl font-black sm:text-4xl">Similarity rule unlocked</h2>
          <p className="text-lg leading-8 text-slate-200 sm:text-xl sm:leading-9">
            Similar figures have the same shape, not necessarily the same size. For polygons, corresponding angles must be equal and corresponding sides must be proportional.
          </p>
          <div className="rounded-xl border border-slate-600/35 bg-slate-950/50 p-4 text-lg text-slate-300">
            Correct cards: {correctCount} / {classificationCards.length}
            <span className="ml-3 font-mono text-cyan-100">{levelScore}/100</span>
          </div>
          <SmartButton
            icon={<Check className="h-6 w-6" />}
            onClick={completeLevel}
            variant={perfect ? "success" : "primary"}
          >
            Save Level 1
          </SmartButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid flex-1 gap-4 xl:grid-cols-[0.94fr_1.06fr]">
      <section className="glass-panel rounded-xl p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase text-cyan-200">
              Evidence card {index + 1} / {classificationCards.length}
            </p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">{currentCard.title}</h2>
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

      <section className="glass-panel flex flex-col rounded-xl p-4 sm:p-5">
        <div className="mb-5 rounded-xl border border-slate-600/35 bg-slate-950/50 p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/12 text-amber-100">
              <ShieldQuestion className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-slate-400">Clue</p>
              <p className="mt-1 text-lg leading-8 text-slate-100 sm:text-xl">{currentCard.clue}</p>
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-3">
          {choices.map((choice) => (
            <button
              key={choice}
              className={cn(
                "min-h-16 rounded-xl border p-4 text-left text-xl font-black transition sm:min-h-20 sm:text-2xl",
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
        <p className="font-mono text-cyan-100">
          Card status: {feedback?.isCorrect ? "correct" : "incorrect"}
        </p>
      </FeedbackModal>
    </div>
  );
}

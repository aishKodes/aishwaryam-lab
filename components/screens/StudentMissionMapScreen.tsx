"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock, Map, Play, RefreshCcw, Send, Trophy } from "lucide-react";
import { missions } from "@/data/missions";
import type { LevelId, LevelResult, StudentProfile } from "@/types/game";
import { TOTAL_POSSIBLE } from "@/lib/scoring";
import { SmartButton } from "@/components/ui/SmartButton";

type StudentMissionMapScreenProps = {
  profile: StudentProfile;
  results: Partial<Record<LevelId, LevelResult>>;
  score: number;
  isSubmitting: boolean;
  submitError: string | null;
  onStartLevel: (id: LevelId) => void;
  onSubmitFinal: () => void;
  onReset: () => void;
};

export function StudentMissionMapScreen({
  profile,
  results,
  score,
  isSubmitting,
  submitError,
  onStartLevel,
  onSubmitFinal,
  onReset
}: StudentMissionMapScreenProps) {
  const completedCount = missions.filter((mission) => results[mission.id]).length;
  const allComplete = completedCount === missions.length;

  return (
    <section className="flex flex-1 flex-col gap-4 py-3">
      <div className="glass-panel rounded-xl p-5 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold uppercase text-cyan-100">
              <Map className="h-4 w-4" />
              Individual mission map
            </div>
            <h1 className="text-4xl font-black sm:text-5xl">Triangle Detective Route</h1>
            <p className="mt-3 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Complete each station in order. Your final marks are private and visible only to your teacher after PIN verification.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
            <div className="rounded-xl border border-slate-600/35 bg-slate-950/50 p-4">
              <p className="text-sm font-bold uppercase text-slate-400">Student</p>
              <p className="mt-1 text-2xl font-black text-cyan-100">{profile.studentName}</p>
              <p className="font-mono text-sm text-slate-300">Roll: {profile.rollNumber}</p>
            </div>
            <div className="rounded-xl border border-cyan-300/25 bg-cyan-300/8 p-4">
              <p className="text-sm font-bold uppercase text-cyan-200">Score</p>
              <p className="mt-1 font-mono text-4xl font-black text-white">
                {score}<span className="text-xl text-slate-400">/{TOTAL_POSSIBLE}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-5">
        {missions.map((mission, index) => {
          const result = results[mission.id];
          const isComplete = Boolean(result);
          const isUnlocked = index === 0 || Boolean(results[missions[index - 1].id]);

          return (
            <motion.article
              key={mission.id}
              className="glass-panel flex min-h-[280px] flex-col rounded-xl p-4 sm:p-5"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/10 font-mono text-2xl font-black text-cyan-100">
                  {mission.id}
                </div>
                <div className="rounded-lg border border-slate-500/30 bg-slate-950/55 px-3 py-2 text-sm font-bold text-slate-300">
                  {isComplete ? (
                    <span className="flex items-center gap-2 text-emerald-200">
                      <CheckCircle2 className="h-4 w-4" /> {result?.score}/100
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-cyan-100">Unlocked</span>
                  ) : (
                    <span className="flex items-center gap-2 text-slate-500">
                      <Lock className="h-4 w-4" /> Locked
                    </span>
                  )}
                </div>
              </div>
              <p className="mb-2 text-sm font-bold uppercase text-cyan-200">{mission.badge}</p>
              <h2 className="text-2xl font-black text-white">{mission.title}</h2>
              <p className="mt-2 text-base font-semibold text-slate-300">{mission.subtitle}</p>
              <p className="mt-4 flex-1 text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
                {mission.briefing}
              </p>
              <SmartButton
                className="mt-5 w-full"
                variant={isComplete ? "secondary" : "primary"}
                disabled={!isUnlocked}
                icon={isUnlocked ? <Play className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                onClick={() => onStartLevel(mission.id)}
              >
                {isComplete ? "Review" : "Start"}
              </SmartButton>
            </motion.article>
          );
        })}
      </div>

      <div className="glass-panel flex flex-col gap-4 rounded-xl p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-white">Mission progress: {completedCount} / 5</p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full bg-cyan-300"
              initial={false}
              animate={{ width: `${(completedCount / 5) * 100}%` }}
            />
          </div>
          {submitError ? (
            <p className="mt-3 rounded-lg border border-rose-300/30 bg-rose-300/10 px-3 py-2 text-sm font-semibold text-rose-100">
              {submitError}
            </p>
          ) : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[430px]">
          <SmartButton
            variant="secondary"
            icon={<RefreshCcw className="h-6 w-6" />}
            onClick={onReset}
          >
            New Student
          </SmartButton>
          <SmartButton
            variant={allComplete ? "success" : "secondary"}
            disabled={!allComplete || isSubmitting}
            icon={allComplete ? <Send className="h-6 w-6" /> : <Trophy className="h-6 w-6" />}
            onClick={onSubmitFinal}
          >
            {isSubmitting ? "Submitting..." : "Submit Result"}
          </SmartButton>
        </div>
      </div>
    </section>
  );
}

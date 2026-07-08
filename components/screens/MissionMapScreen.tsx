"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock, Map, Play, Trophy } from "lucide-react";
import { missions } from "@/data/missions";
import type { LevelId, Team } from "@/types/game";
import { SmartButton } from "@/components/ui/SmartButton";

type MissionMapScreenProps = {
  teams: Team[];
  completedLevels: LevelId[];
  onStartLevel: (id: LevelId) => void;
  onFinal: () => void;
};

export function MissionMapScreen({
  teams,
  completedLevels,
  onStartLevel,
  onFinal
}: MissionMapScreenProps) {
  const completedCount = completedLevels.length;
  const topTeam = [...teams].sort((a, b) => b.score - a.score)[0];

  return (
    <section className="flex flex-1 flex-col gap-5 py-3">
      <div className="glass-panel rounded-xl p-5 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold uppercase text-cyan-100">
              <Map className="h-4 w-4" />
              Mission map
            </div>
            <h1 className="text-4xl font-black sm:text-5xl">Triangle Detective Route</h1>
            <p className="mt-3 max-w-4xl text-lg leading-8 text-slate-300">
              Complete five linked investigations. Each station sharpens one NCERT Triangles idea before the final indirect measurement case.
            </p>
          </div>
          <div className="rounded-xl border border-slate-600/35 bg-slate-950/50 p-4">
            <p className="text-sm font-bold uppercase text-slate-400">Current lead</p>
            <p className="mt-1 text-2xl font-black text-cyan-100">{topTeam?.name ?? "No team"}</p>
            <p className="font-mono text-lg text-slate-300">{topTeam?.score ?? 0} pts</p>
          </div>
        </div>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-5">
        {missions.map((mission, index) => {
          const isComplete = completedLevels.includes(mission.id);
          const isUnlocked = index === 0 || completedLevels.includes(missions[index - 1].id);

          return (
            <motion.article
              key={mission.id}
              className="glass-panel flex min-h-[310px] flex-col rounded-xl p-5"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/10 font-mono text-2xl font-black text-cyan-100">
                  {mission.id}
                </div>
                <div className="rounded-lg border border-slate-500/30 bg-slate-950/55 px-3 py-2 text-sm font-bold text-slate-300">
                  {isComplete ? (
                    <span className="flex items-center gap-2 text-emerald-200">
                      <CheckCircle2 className="h-4 w-4" /> Secured
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
              <p className="mt-4 flex-1 text-base leading-7 text-slate-400">{mission.briefing}</p>
              <SmartButton
                className="mt-5 w-full"
                variant={isComplete ? "secondary" : "primary"}
                disabled={!isUnlocked}
                icon={isUnlocked ? <Play className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                onClick={() => onStartLevel(mission.id)}
              >
                {isComplete ? "Replay" : "Start"}
              </SmartButton>
            </motion.article>
          );
        })}
      </div>

      <div className="glass-panel flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold text-white">Mission progress: {completedCount} / 5</p>
          <div className="mt-2 h-3 w-full min-w-[260px] overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full bg-cyan-300"
              initial={false}
              animate={{ width: `${(completedCount / 5) * 100}%` }}
            />
          </div>
        </div>
        <SmartButton
          variant={completedCount === 5 ? "success" : "secondary"}
          disabled={completedCount < 5}
          icon={<Trophy className="h-6 w-6" />}
          onClick={onFinal}
        >
          Final Winner
        </SmartButton>
      </div>
    </section>
  );
}

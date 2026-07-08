"use client";

import { motion } from "framer-motion";
import { BarChart3, ChevronRight } from "lucide-react";
import type { LevelId, Team } from "@/types/game";
import { formatDelta } from "@/lib/scoring";
import { SmartButton } from "@/components/ui/SmartButton";

type LeaderboardScreenProps = {
  teams: Team[];
  levelId: LevelId;
  levelDeltas: Record<string, number>;
  allComplete: boolean;
  onContinue: () => void;
  onFinal: () => void;
};

export function LeaderboardScreen({
  teams,
  levelId,
  levelDeltas,
  allComplete,
  onContinue,
  onFinal
}: LeaderboardScreenProps) {
  const rankedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <section className="flex flex-1 items-center justify-center py-6">
      <motion.div
        className="glass-panel w-full max-w-5xl rounded-xl p-5 sm:p-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold uppercase text-cyan-100">
              <BarChart3 className="h-4 w-4" />
              Level {levelId} leaderboard
            </div>
            <h1 className="text-4xl font-black sm:text-5xl">Scoreboard checkpoint</h1>
          </div>
          <SmartButton
            icon={<ChevronRight className="h-6 w-6" />}
            onClick={allComplete ? onFinal : onContinue}
            variant={allComplete ? "success" : "primary"}
          >
            {allComplete ? "Final Winner" : "Mission Map"}
          </SmartButton>
        </div>

        <div className="space-y-3">
          {rankedTeams.map((team, index) => {
            const delta = levelDeltas[team.id] ?? 0;

            return (
              <motion.div
                key={team.id}
                className="grid items-center gap-4 rounded-xl border border-slate-600/35 bg-slate-950/50 p-4 sm:grid-cols-[72px_1fr_auto_auto]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 font-mono text-2xl font-black text-cyan-100">
                  #{index + 1}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{team.name}</h2>
                  <p className="text-sm font-semibold text-slate-400">Level gain: {formatDelta(delta)} pts</p>
                </div>
                <div className="font-mono text-3xl font-black text-cyan-100">{team.score}</div>
                <div className="text-lg font-bold text-slate-400">pts</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

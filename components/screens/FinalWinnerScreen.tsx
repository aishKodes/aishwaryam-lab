"use client";

import { motion } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";
import type { Team } from "@/types/game";
import { SmartButton } from "@/components/ui/SmartButton";

type FinalWinnerScreenProps = {
  teams: Team[];
  onReset: () => void;
};

export function FinalWinnerScreen({ teams, onReset }: FinalWinnerScreenProps) {
  const rankedTeams = [...teams].sort((a, b) => b.score - a.score);
  const highScore = rankedTeams[0]?.score ?? 0;
  const winners = rankedTeams.filter((team) => team.score === highScore);
  const winnerText = winners.map((team) => team.name).join(" & ");

  return (
    <section className="flex flex-1 items-center justify-center py-6">
      <motion.div
        className="glass-panel w-full max-w-6xl rounded-xl p-5 text-center sm:p-9"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-xl border border-amber-300/45 bg-amber-300/12 text-amber-100 shadow-glow">
          <Trophy className="h-12 w-12" />
        </div>
        <p className="text-sm font-bold uppercase text-cyan-200">Final mission report</p>
        <h1 className="mt-3 text-5xl font-black sm:text-7xl">{winnerText || "Winning Team"}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-xl leading-9 text-slate-300">
          Triangle detective command confirms the strongest similarity evidence score.
        </p>

        <div className="mx-auto mt-8 grid max-w-4xl gap-3">
          {rankedTeams.map((team, index) => (
            <div
              key={team.id}
              className="grid items-center gap-4 rounded-xl border border-slate-600/35 bg-slate-950/50 p-4 text-left sm:grid-cols-[72px_1fr_auto]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 font-mono text-2xl font-black text-cyan-100">
                #{index + 1}
              </div>
              <div className="text-2xl font-black">{team.name}</div>
              <div className="font-mono text-3xl font-black text-cyan-100">{team.score} pts</div>
            </div>
          ))}
        </div>

        <SmartButton className="mt-8" variant="secondary" icon={<RotateCcw className="h-6 w-6" />} onClick={onReset}>
          Reset Game
        </SmartButton>
      </motion.div>
    </section>
  );
}

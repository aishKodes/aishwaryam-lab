"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Rocket } from "lucide-react";
import type { Team } from "@/types/game";
import { SmartButton } from "@/components/ui/SmartButton";

type TeamSetupScreenProps = {
  teams: Team[];
  onBack: () => void;
  onLaunch: (teams: Team[]) => void;
};

export function TeamSetupScreen({ teams, onBack, onLaunch }: TeamSetupScreenProps) {
  const initialNames =
    teams.length > 0 ? teams.map((team) => team.name) : ["Team 1", "Team 2"];
  const [teamCount, setTeamCount] = useState(() => Math.min(6, Math.max(2, initialNames.length)));
  const [names, setNames] = useState<string[]>(() => {
    const nextNames = [...initialNames];
    while (nextNames.length < 6) {
      nextNames.push(`Team ${nextNames.length + 1}`);
    }
    return nextNames;
  });

  const activeNames = Array.from({ length: teamCount }, (_, index) => {
    return names[index]?.trim() || `Team ${index + 1}`;
  });

  function updateName(index: number, value: string) {
    setNames((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  }

  function launchMission() {
    const nextTeams = activeNames.map((name, index) => ({
      id: `team-${index + 1}`,
      name,
      score: 0
    }));
    onLaunch(nextTeams);
  }

  return (
    <section className="flex flex-1 items-center justify-center py-6">
      <motion.div
        className="glass-panel w-full max-w-5xl rounded-xl p-5 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-cyan-200">Team setup</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">Assemble the detective teams</h1>
          </div>
          <SmartButton variant="ghost" size="md" icon={<ArrowLeft className="h-5 w-5" />} onClick={onBack}>
            Back
          </SmartButton>
        </div>

        <div className="mb-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-xl border border-slate-600/35 bg-slate-950/45 p-5">
            <p className="text-lg font-semibold text-slate-200">Number of teams</p>
            <div className="mt-5 flex items-center justify-between rounded-xl border border-cyan-300/25 bg-cyan-300/8 p-3">
              <SmartButton
                aria-label="Decrease teams"
                variant="secondary"
                size="md"
                icon={<Minus className="h-5 w-5" />}
                disabled={teamCount <= 2}
                onClick={() => setTeamCount((count) => Math.max(2, count - 1))}
              />
              <div className="px-6 text-center">
                <div className="font-mono text-6xl font-black text-cyan-100">{teamCount}</div>
                <div className="text-sm font-semibold text-slate-400">2 to 6 teams</div>
              </div>
              <SmartButton
                aria-label="Increase teams"
                variant="secondary"
                size="md"
                icon={<Plus className="h-5 w-5" />}
                disabled={teamCount >= 6}
                onClick={() => setTeamCount((count) => Math.min(6, count + 1))}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {activeNames.map((name, index) => (
              <label
                key={index}
                className="rounded-xl border border-slate-600/35 bg-slate-950/45 p-4"
              >
                <span className="mb-2 block text-sm font-bold uppercase text-cyan-200">
                  Team {index + 1}
                </span>
                <input
                  className="min-h-14 w-full rounded-lg border border-slate-500/40 bg-slate-950/70 px-4 text-xl font-bold text-white placeholder:text-slate-500"
                  value={names[index] ?? name}
                  maxLength={24}
                  onChange={(event) => updateName(index, event.target.value)}
                />
              </label>
            ))}
          </div>
        </div>

        <SmartButton className="w-full" icon={<Rocket className="h-6 w-6" />} onClick={launchMission}>
          Launch Mission Map
        </SmartButton>
      </motion.div>
    </section>
  );
}

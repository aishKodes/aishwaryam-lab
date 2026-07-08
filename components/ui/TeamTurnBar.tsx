"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Keyboard, Users } from "lucide-react";
import type { ScoreEvent, Team } from "@/types/game";
import { formatDelta } from "@/lib/scoring";
import { SmartButton } from "@/components/ui/SmartButton";

type TeamTurnBarProps = {
  teams: Team[];
  currentTeamIndex: number;
  onNextTeam: () => void;
  scoreEvent?: ScoreEvent | null;
};

export function TeamTurnBar({
  teams,
  currentTeamIndex,
  onNextTeam,
  scoreEvent
}: TeamTurnBarProps) {
  const currentTeam = teams[currentTeamIndex] ?? teams[0];

  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/12 text-cyan-100">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-cyan-200/85">Current team</p>
            <div className="flex flex-wrap items-end gap-3">
              <h2 className="text-2xl font-bold sm:text-3xl">{currentTeam?.name ?? "Team"}</h2>
              <div className="relative rounded-lg border border-slate-500/30 bg-slate-950/50 px-3 py-1 font-mono text-xl text-cyan-100">
                {currentTeam?.score ?? 0} pts
                <AnimatePresence mode="popLayout">
                  {scoreEvent?.teamId === currentTeam?.id ? (
                    <motion.span
                      key={scoreEvent.id}
                      className="absolute -right-4 -top-7 rounded-lg border border-cyan-200/40 bg-cyan-200 px-3 py-1 text-sm font-bold text-slate-950 shadow-glow"
                      initial={{ y: 14, opacity: 0, scale: 0.8 }}
                      animate={{ y: -6, opacity: 1, scale: 1 }}
                      exit={{ y: -24, opacity: 0, scale: 0.9 }}
                    >
                      {formatDelta(scoreEvent.delta)}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="lab-chip flex min-h-12 items-center gap-2 rounded-lg px-4 text-sm">
            <Keyboard className="h-5 w-5" />
            <span>N: next team | R: reveal | Enter: submit</span>
          </div>
          <SmartButton
            variant="secondary"
            size="md"
            icon={<ChevronRight className="h-5 w-5" />}
            onClick={onNextTeam}
          >
            Next Team
          </SmartButton>
        </div>
      </div>
    </div>
  );
}

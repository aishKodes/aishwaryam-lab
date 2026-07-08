"use client";

import { ArrowLeft, Map } from "lucide-react";
import { missions } from "@/data/missions";
import type { LevelId, ScoreEvent, Team } from "@/types/game";
import { SmartButton } from "@/components/ui/SmartButton";
import { TeamTurnBar } from "@/components/ui/TeamTurnBar";
import { ClassificationMission } from "@/components/missions/ClassificationMission";
import { NumericMissionPanel } from "@/components/missions/NumericMissionPanel";
import { CourtroomMission } from "@/components/missions/CourtroomMission";

type LevelScreenProps = {
  levelId: LevelId;
  teams: Team[];
  currentTeamIndex: number;
  scoreEvent: ScoreEvent | null;
  onAwardScore: (delta: number, label: string) => void;
  onNextTeam: () => void;
  onComplete: (perfect: boolean) => void;
  onBackToMap: () => void;
};

export function LevelScreen({
  levelId,
  teams,
  currentTeamIndex,
  scoreEvent,
  onAwardScore,
  onNextTeam,
  onComplete,
  onBackToMap
}: LevelScreenProps) {
  const mission = missions.find((item) => item.id === levelId) ?? missions[0];

  return (
    <section className="flex flex-1 flex-col gap-4 py-3">
      <div className="glass-panel rounded-xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold uppercase text-cyan-100">
              <Map className="h-4 w-4" />
              Mission {mission.id}: {mission.badge}
            </div>
            <h1 className="text-3xl font-black sm:text-5xl">{mission.title}</h1>
            <p className="mt-2 max-w-5xl text-lg leading-8 text-slate-300">{mission.briefing}</p>
          </div>
          <SmartButton
            variant="ghost"
            size="md"
            icon={<ArrowLeft className="h-5 w-5" />}
            onClick={onBackToMap}
          >
            Map
          </SmartButton>
        </div>
      </div>

      <TeamTurnBar
        teams={teams}
        currentTeamIndex={currentTeamIndex}
        onNextTeam={onNextTeam}
        scoreEvent={scoreEvent}
      />

      {levelId === 1 ? (
        <ClassificationMission
          onAwardScore={onAwardScore}
          onNextTeam={onNextTeam}
          onComplete={onComplete}
        />
      ) : null}
      {levelId === 2 || levelId === 3 || levelId === 5 ? (
        <NumericMissionPanel
          levelId={levelId}
          onAwardScore={onAwardScore}
          onNextTeam={onNextTeam}
          onComplete={onComplete}
        />
      ) : null}
      {levelId === 4 ? (
        <CourtroomMission
          onAwardScore={onAwardScore}
          onNextTeam={onNextTeam}
          onComplete={onComplete}
        />
      ) : null}
    </section>
  );
}

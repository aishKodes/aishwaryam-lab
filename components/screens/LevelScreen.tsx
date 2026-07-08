"use client";

import { ArrowLeft, Map, UserRound } from "lucide-react";
import { missions } from "@/data/missions";
import type { LevelId, LevelResult, StudentProfile } from "@/types/game";
import { TOTAL_POSSIBLE } from "@/lib/scoring";
import { SmartButton } from "@/components/ui/SmartButton";
import { ClassificationMission } from "@/components/missions/ClassificationMission";
import { NumericMissionPanel } from "@/components/missions/NumericMissionPanel";
import { CourtroomMission } from "@/components/missions/CourtroomMission";

type LevelScreenProps = {
  levelId: LevelId;
  profile: StudentProfile;
  score: number;
  onComplete: (result: LevelResult) => void;
  onBackToMap: () => void;
};

export function LevelScreen({
  levelId,
  profile,
  score,
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
            <p className="mt-2 max-w-5xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {mission.briefing}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
            <div className="rounded-xl border border-slate-600/35 bg-slate-950/50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-100">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-black text-white">{profile.studentName}</p>
                  <p className="font-mono text-xs text-slate-400">Roll: {profile.rollNumber}</p>
                </div>
              </div>
            </div>
            <SmartButton
              variant="ghost"
              size="md"
              icon={<ArrowLeft className="h-5 w-5" />}
              onClick={onBackToMap}
            >
              Map {score}/{TOTAL_POSSIBLE}
            </SmartButton>
          </div>
        </div>
      </div>

      {levelId === 1 ? <ClassificationMission onComplete={onComplete} /> : null}
      {levelId === 2 || levelId === 3 || levelId === 5 ? (
        <NumericMissionPanel levelId={levelId} onComplete={onComplete} />
      ) : null}
      {levelId === 4 ? <CourtroomMission onComplete={onComplete} /> : null}
    </section>
  );
}

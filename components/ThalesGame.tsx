"use client";

import { useEffect, useMemo, useState } from "react";
import type { GamePhase, LevelId, ScoreEvent, Team } from "@/types/game";
import { LabShell } from "@/components/ui/LabShell";
import { ConfettiOverlay } from "@/components/ui/ConfettiOverlay";
import { StartScreen } from "@/components/screens/StartScreen";
import { TeamSetupScreen } from "@/components/screens/TeamSetupScreen";
import { MissionMapScreen } from "@/components/screens/MissionMapScreen";
import { LevelScreen } from "@/components/screens/LevelScreen";
import { LeaderboardScreen } from "@/components/screens/LeaderboardScreen";
import { FinalWinnerScreen } from "@/components/screens/FinalWinnerScreen";

const STORAGE_KEY = "project-thales-state-v1";

type StoredGameState = {
  teams: Team[];
  completedLevels: LevelId[];
  currentTeamIndex: number;
};

const defaultTeams: Team[] = [
  { id: "team-1", name: "Team 1", score: 0 },
  { id: "team-2", name: "Team 2", score: 0 }
];

export function ThalesGame() {
  const [phase, setPhase] = useState<GamePhase>("start");
  const [teams, setTeams] = useState<Team[]>(defaultTeams);
  const [completedLevels, setCompletedLevels] = useState<LevelId[]>([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentLevelId, setCurrentLevelId] = useState<LevelId>(1);
  const [scoreEvent, setScoreEvent] = useState<ScoreEvent | null>(null);
  const [levelDeltas, setLevelDeltas] = useState<Record<string, number>>({});
  const [hydrated, setHydrated] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredGameState;
        if (Array.isArray(parsed.teams) && parsed.teams.length >= 2) {
          setTeams(parsed.teams);
          setCompletedLevels(parsed.completedLevels ?? []);
          setCurrentTeamIndex(parsed.currentTeamIndex ?? 0);
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const safeTeamIndex = Math.min(Math.max(currentTeamIndex, 0), Math.max(teams.length - 1, 0));
    const state: StoredGameState = {
      teams,
      completedLevels,
      currentTeamIndex: safeTeamIndex
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [completedLevels, currentTeamIndex, hydrated, teams]);

  const hasSavedGame = useMemo(() => {
    return teams.some((team) => team.score !== 0) || completedLevels.length > 0;
  }, [completedLevels.length, teams]);

  function startNewMission() {
    setScoreEvent(null);
    setCompletedLevels([]);
    setCurrentTeamIndex(0);
    setPhase("setup");
  }

  function launchTeams(nextTeams: Team[]) {
    setTeams(nextTeams);
    setCompletedLevels([]);
    setCurrentTeamIndex(0);
    setScoreEvent(null);
    setLevelDeltas(createEmptyDeltas(nextTeams));
    setPhase("map");
  }

  function continueSavedMission() {
    setPhase(completedLevels.length === 5 ? "final" : "map");
  }

  function startLevel(levelId: LevelId) {
    setCurrentLevelId(levelId);
    setLevelDeltas(createEmptyDeltas(teams));
    setScoreEvent(null);
    setPhase("level");
  }

  function awardScore(delta: number, label: string) {
    const currentTeam = teams[currentTeamIndex] ?? teams[0];
    if (!currentTeam) {
      return;
    }

    const event: ScoreEvent = {
      id: Date.now(),
      teamId: currentTeam.id,
      teamName: currentTeam.name,
      delta,
      label
    };

    setTeams((currentTeams) =>
      currentTeams.map((team) =>
        team.id === currentTeam.id ? { ...team, score: team.score + delta } : team
      )
    );
    setLevelDeltas((current) => ({
      ...current,
      [currentTeam.id]: (current[currentTeam.id] ?? 0) + delta
    }));
    setScoreEvent(event);
  }

  function nextTeam() {
    setCurrentTeamIndex((index) => {
      if (teams.length === 0) {
        return 0;
      }

      return (index + 1) % teams.length;
    });
  }

  function completeLevel(perfect: boolean) {
    setCompletedLevels((current) => {
      if (current.includes(currentLevelId)) {
        return current;
      }

      return [...current, currentLevelId].sort((a, b) => a - b) as LevelId[];
    });

    if (perfect) {
      setConfettiActive(true);
      window.setTimeout(() => setConfettiActive(false), 3000);
    }

    setPhase("leaderboard");
  }

  function resetGame() {
    window.localStorage.removeItem(STORAGE_KEY);
    setTeams(defaultTeams);
    setCompletedLevels([]);
    setCurrentTeamIndex(0);
    setCurrentLevelId(1);
    setScoreEvent(null);
    setLevelDeltas({});
    setPhase("start");
  }

  const allComplete = completedLevels.length === 5;

  return (
    <LabShell>
      <ConfettiOverlay active={confettiActive} />
      {phase === "start" ? (
        <StartScreen
          hasSavedGame={hydrated && hasSavedGame}
          onStartNew={startNewMission}
          onContinue={continueSavedMission}
        />
      ) : null}
      {phase === "setup" ? (
        <TeamSetupScreen
          teams={teams}
          onBack={() => setPhase("start")}
          onLaunch={launchTeams}
        />
      ) : null}
      {phase === "map" ? (
        <MissionMapScreen
          teams={teams}
          completedLevels={completedLevels}
          onStartLevel={startLevel}
          onFinal={() => setPhase("final")}
        />
      ) : null}
      {phase === "level" ? (
        <LevelScreen
          levelId={currentLevelId}
          teams={teams}
          currentTeamIndex={Math.min(currentTeamIndex, Math.max(teams.length - 1, 0))}
          scoreEvent={scoreEvent}
          onAwardScore={awardScore}
          onNextTeam={nextTeam}
          onComplete={completeLevel}
          onBackToMap={() => setPhase("map")}
        />
      ) : null}
      {phase === "leaderboard" ? (
        <LeaderboardScreen
          teams={teams}
          levelId={currentLevelId}
          levelDeltas={levelDeltas}
          allComplete={allComplete}
          onContinue={() => setPhase("map")}
          onFinal={() => setPhase("final")}
        />
      ) : null}
      {phase === "final" ? <FinalWinnerScreen teams={teams} onReset={resetGame} /> : null}
    </LabShell>
  );
}

function createEmptyDeltas(teams: Team[]) {
  return teams.reduce<Record<string, number>>((accumulator, team) => {
    accumulator[team.id] = 0;
    return accumulator;
  }, {});
}

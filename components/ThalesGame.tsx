"use client";

import { useEffect, useMemo, useState } from "react";
import { missions } from "@/data/missions";
import type { GamePhase, LevelId, LevelResult, StudentProfile } from "@/types/game";
import { TOTAL_POSSIBLE } from "@/lib/scoring";
import { LabShell } from "@/components/ui/LabShell";
import { ConfettiOverlay } from "@/components/ui/ConfettiOverlay";
import { StudentLandingScreen } from "@/components/screens/StudentLandingScreen";
import { StudentMissionMapScreen } from "@/components/screens/StudentMissionMapScreen";
import { LevelScreen } from "@/components/screens/LevelScreen";
import { SubmittedScreen } from "@/components/screens/SubmittedScreen";

const STORAGE_KEY = "project-thales-student-state-v1";

type StoredGameState = {
  profile: StudentProfile;
  results: Partial<Record<LevelId, LevelResult>>;
  startedAt: string;
  submitted: boolean;
};

const emptyProfile: StudentProfile = {
  studentName: "",
  rollNumber: ""
};

export function ThalesGame() {
  const [phase, setPhase] = useState<GamePhase>("landing");
  const [profile, setProfile] = useState<StudentProfile>(emptyProfile);
  const [results, setResults] = useState<Partial<Record<LevelId, LevelResult>>>({});
  const [startedAt, setStartedAt] = useState("");
  const [currentLevelId, setCurrentLevelId] = useState<LevelId>(1);
  const [hydrated, setHydrated] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredGameState;
        if (parsed.profile?.studentName && parsed.profile?.rollNumber) {
          setProfile(parsed.profile);
          setResults(parsed.results ?? {});
          setStartedAt(parsed.startedAt || new Date().toISOString());
          setPhase(parsed.submitted ? "submitted" : "landing");
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || !profile.studentName || !profile.rollNumber || !startedAt) {
      return;
    }

    const state: StoredGameState = {
      profile,
      results,
      startedAt,
      submitted: phase === "submitted"
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, phase, profile, results, startedAt]);

  const score = useMemo(() => {
    return Object.values(results).reduce((total, result) => total + (result?.score ?? 0), 0);
  }, [results]);

  const hasProgress = useMemo(() => {
    return Boolean(profile.studentName && profile.rollNumber && startedAt);
  }, [profile.rollNumber, profile.studentName, startedAt]);

  function startMission(nextProfile: StudentProfile) {
    setProfile(nextProfile);
    setResults({});
    setStartedAt(new Date().toISOString());
    setCurrentLevelId(1);
    setSubmitError(null);
    setPhase("map");
  }

  function resumeMission() {
    if (!profile.studentName || !profile.rollNumber) {
      return;
    }

    setSubmitError(null);
    setPhase("map");
  }

  function startLevel(levelId: LevelId) {
    setCurrentLevelId(levelId);
    setSubmitError(null);
    setPhase("level");
  }

  function completeLevel(result: LevelResult) {
    setResults((current) => ({
      ...current,
      [result.levelId]: result
    }));

    if (result.correct) {
      setConfettiActive(true);
      window.setTimeout(() => setConfettiActive(false), 2800);
    }

    setPhase("map");
  }

  async function submitFinalResult() {
    const apiBase = process.env.NEXT_PUBLIC_RESULTS_API_BASE?.replace(/\/+$/, "");
    const orderedResults = missions
      .map((mission) => results[mission.id])
      .filter((result): result is LevelResult => Boolean(result));

    if (orderedResults.length !== missions.length) {
      setSubmitError("Complete all five missions before submitting.");
      return;
    }

    if (!apiBase) {
      setSubmitError("Missing NEXT_PUBLIC_RESULTS_API_BASE. Set it in Vercel before final submission.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${apiBase}/submit.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          student_name: profile.studentName,
          roll_number: profile.rollNumber,
          score,
          total_possible: TOTAL_POSSIBLE,
          answers: {
            levels: orderedResults,
            score,
            totalPossible: TOTAL_POSSIBLE
          },
          started_at: startedAt
        })
      });

      if (!response.ok) {
        let message = "Could not submit result. Please try again.";
        try {
          const data = (await response.json()) as { error?: string };
          if (data.error) {
            message = data.error;
          }
        } catch {
          // Keep the generic message when the server does not return JSON.
        }
        throw new Error(message);
      }

      setPhase("submitted");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not submit result. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetGame() {
    window.localStorage.removeItem(STORAGE_KEY);
    setProfile(emptyProfile);
    setResults({});
    setStartedAt("");
    setCurrentLevelId(1);
    setSubmitError(null);
    setIsSubmitting(false);
    setPhase("landing");
  }

  return (
    <LabShell>
      <ConfettiOverlay active={confettiActive} />
      {phase === "landing" ? (
        <StudentLandingScreen
          initialProfile={profile}
          hasProgress={hydrated && hasProgress}
          onStart={startMission}
          onResume={resumeMission}
        />
      ) : null}
      {phase === "map" ? (
        <StudentMissionMapScreen
          profile={profile}
          results={results}
          score={score}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onStartLevel={startLevel}
          onSubmitFinal={submitFinalResult}
          onReset={resetGame}
        />
      ) : null}
      {phase === "level" ? (
        <LevelScreen
          levelId={currentLevelId}
          profile={profile}
          score={score}
          onComplete={completeLevel}
          onBackToMap={() => setPhase("map")}
        />
      ) : null}
      {phase === "submitted" ? (
        <SubmittedScreen profile={profile} score={score} onReset={resetGame} />
      ) : null}
    </LabShell>
  );
}

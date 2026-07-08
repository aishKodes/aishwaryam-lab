export type GamePhase = "start" | "setup" | "map" | "level" | "leaderboard" | "final";

export type LevelId = 1 | 2 | 3 | 4 | 5;

export type Classification = "similar" | "not-similar" | "need-more-data";

export type Criterion = "AA" | "SSS" | "SAS" | "BPT" | "not-enough";

export type Team = {
  id: string;
  name: string;
  score: number;
};

export type ScoreEvent = {
  id: number;
  teamId: string;
  teamName: string;
  delta: number;
  label: string;
};

export type FeedbackTone = "success" | "warning" | "danger" | "info";

export type GamePhase = "landing" | "map" | "level" | "submitted";

export type LevelId = 1 | 2 | 3 | 4 | 5;

export type Classification = "similar" | "not-similar" | "need-more-data";

export type Criterion = "AA" | "SSS" | "SAS" | "BPT" | "not-enough";

export type StudentProfile = {
  studentName: string;
  rollNumber: string;
};

export type LevelResult = {
  levelId: LevelId;
  title: string;
  score: number;
  total: number;
  correct: boolean;
  summary: string;
  answers: unknown;
  completedAt: string;
};

export type FeedbackTone = "success" | "warning" | "danger" | "info";

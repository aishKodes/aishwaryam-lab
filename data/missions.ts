import type { Classification, Criterion, LevelId } from "@/types/game";

export type MissionMeta = {
  id: LevelId;
  title: string;
  subtitle: string;
  briefing: string;
  badge: string;
};

export type ClassificationCard = {
  id: string;
  title: string;
  clue: string;
  visual: "circles" | "squares" | "equilateral" | "square-rectangle" | "square-rhombus" | "monument" | "quads";
  answer: Classification;
  trapChoice?: Classification;
  explanation: string;
};

export type NumericMission = {
  id: Extract<LevelId, 2 | 3 | 5>;
  inputLabel: string;
  inputSuffix: string;
  problem: string;
  correctAnswer: number;
  correctTheorem: Criterion;
  correctCorrespondence: string;
  theoremOptions: Array<{ id: Criterion; label: string }>;
  correspondenceOptions: Array<{ id: string; label: string }>;
  trapAnswers: number[];
};

export type CourtCase = {
  id: string;
  title: string;
  triangleA: string[];
  triangleB: string[];
  answer: Criterion;
  trapChoice?: Criterion;
  explanation: string;
};

export const missions: MissionMeta[] = [
  {
    id: 1,
    title: "Similar or Imposter",
    subtitle: "Classify the evidence cards",
    briefing:
      "Detect which figures keep the same shape, which fail similarity, and which need measurements before a verdict.",
    badge: "Shape Lab"
  },
  {
    id: 2,
    title: "Shadow Machine",
    subtitle: "Measure a tower from its shadow",
    briefing:
      "Use simultaneous shadows to build similar right triangles and calculate a hidden height.",
    badge: "AA Scanner"
  },
  {
    id: 3,
    title: "Thales Laser Gate",
    subtitle: "Unlock the parallel segment",
    briefing:
      "Set the missing side split so the inner segment becomes parallel to the base.",
    badge: "BPT Gate"
  },
  {
    id: 4,
    title: "Similarity Courtroom",
    subtitle: "Choose the legal criterion",
    briefing:
      "Review triangle evidence and rule whether AA, SSS, SAS, or not enough data proves similarity.",
    badge: "Criterion Bench"
  },
  {
    id: 5,
    title: "Boss Mission",
    subtitle: "Measure the Unmeasurable",
    briefing:
      "Solve the final indirect measurement case with a student, a monument, and one shared sun angle.",
    badge: "Final Survey"
  }
];

export const classificationLabels: Record<Classification, string> = {
  similar: "Similar",
  "not-similar": "Not Similar",
  "need-more-data": "Need More Data"
};

export const criterionLabels: Record<Criterion, string> = {
  AA: "AA / AAA",
  SSS: "SSS",
  SAS: "SAS",
  BPT: "Basic Proportionality Theorem",
  "not-enough": "Not Enough Data"
};

export const classificationCards: ClassificationCard[] = [
  {
    id: "circles",
    title: "Two circles, different sizes",
    clue: "Both figures are circles.",
    visual: "circles",
    answer: "similar",
    explanation:
      "All circles are similar because one circle can be scaled to match another without changing shape."
  },
  {
    id: "squares",
    title: "Two squares, different sizes",
    clue: "Four equal sides and four right angles in both figures.",
    visual: "squares",
    answer: "similar",
    explanation:
      "All squares are similar: corresponding angles are equal and side ratios are constant."
  },
  {
    id: "equilateral",
    title: "Two equilateral triangles",
    clue: "Every angle is 60 degrees in both triangles.",
    visual: "equilateral",
    answer: "similar",
    explanation:
      "All equilateral triangles are similar by AA because their angles match."
  },
  {
    id: "square-rectangle",
    title: "A square and a rectangle",
    clue: "Both have right angles, but the side ratios differ.",
    visual: "square-rectangle",
    answer: "not-similar",
    trapChoice: "similar",
    explanation:
      "Equal angles are not enough for quadrilaterals. The square has side ratio 1:1, while the rectangle does not."
  },
  {
    id: "square-rhombus",
    title: "A square and a rhombus",
    clue: "Both have equal side lengths, but the angles differ.",
    visual: "square-rhombus",
    answer: "not-similar",
    trapChoice: "similar",
    explanation:
      "Equal side lengths alone do not prove similarity. The corresponding angles must also be equal."
  },
  {
    id: "monument",
    title: "Same monument photo, scaled",
    clue: "The second image is a proportional enlargement of the first.",
    visual: "monument",
    answer: "similar",
    explanation:
      "A scaled copy keeps all angles equal and all corresponding lengths in the same ratio."
  },
  {
    id: "quads",
    title: "Two random quadrilaterals",
    clue: "They look close, but no angle or side data is provided.",
    visual: "quads",
    answer: "need-more-data",
    trapChoice: "similar",
    explanation:
      "A visual match is not proof. For polygons, corresponding angles must be equal and corresponding sides proportional."
  }
];

const theoremOptions: NumericMission["theoremOptions"] = [
  { id: "AA", label: "Similar triangles by AA" },
  { id: "SSS", label: "Similar triangles by SSS" },
  { id: "SAS", label: "Similar triangles by SAS" },
  { id: "BPT", label: "Basic Proportionality Theorem" }
];

export const numericMissions: Record<2 | 3 | 5, NumericMission> = {
  2: {
    id: 2,
    inputLabel: "Tower height",
    inputSuffix: "m",
    problem:
      "A vertical pole of height 6 m casts a shadow 4 m long. At the same time, a tower casts a shadow 28 m long. Find the tower height.",
    correctAnswer: 42,
    correctTheorem: "AA",
    correctCorrespondence: "height-shadow",
    theoremOptions,
    correspondenceOptions: [
      {
        id: "height-shadow",
        label: "Pole height <-> tower height; pole shadow <-> tower shadow"
      },
      {
        id: "height-shadow-crossed",
        label: "Pole height <-> tower shadow; tower height <-> pole shadow"
      },
      {
        id: "shadow-height",
        label: "Both shadows correspond to both heights"
      }
    ],
    trapAnswers: [18.67, 0.86, 24]
  },
  3: {
    id: 3,
    inputLabel: "EC length",
    inputSuffix: "units",
    problem:
      "In triangle ABC, D lies on AB and E lies on AC. Given AD = 3, DB = 2, AE = 6. Find EC so DE is parallel to BC.",
    correctAnswer: 4,
    correctTheorem: "BPT",
    correctCorrespondence: "split-sides",
    theoremOptions,
    correspondenceOptions: [
      {
        id: "split-sides",
        label: "AD / DB = AE / EC"
      },
      {
        id: "whole-sides",
        label: "AD / AB = EC / AC"
      },
      {
        id: "crossed-sides",
        label: "AD / EC = DB / AE"
      }
    ],
    trapAnswers: [9, 12, 1]
  },
  5: {
    id: 5,
    inputLabel: "Monument height",
    inputSuffix: "m",
    problem:
      "A student of height 1.5 m casts a shadow 2 m long. A monument casts a shadow 18 m long at the same time. Find the monument height.",
    correctAnswer: 13.5,
    correctTheorem: "AA",
    correctCorrespondence: "student-monument",
    theoremOptions,
    correspondenceOptions: [
      {
        id: "student-monument",
        label: "Student height <-> monument height; student shadow <-> monument shadow"
      },
      {
        id: "student-shadow-crossed",
        label: "Student height <-> monument shadow; monument height <-> student shadow"
      },
      {
        id: "base-height",
        label: "All bases correspond to all heights"
      }
    ],
    trapAnswers: [24, 12, 0.17]
  }
};

export const courtCases: CourtCase[] = [
  {
    id: "case-a",
    title: "Case A: Triple angle match",
    triangleA: ["Angle A = 60 degrees", "Angle B = 80 degrees", "Angle C = 40 degrees"],
    triangleB: ["Angle P = 60 degrees", "Angle Q = 80 degrees", "Angle R = 40 degrees"],
    answer: "AA",
    explanation:
      "Two equal angle pairs already prove triangle similarity, so three matching angles certainly give AA / AAA similarity."
  },
  {
    id: "case-b",
    title: "Case B: Side ratio evidence",
    triangleA: ["AB = 3", "BC = 6", "CA = 8"],
    triangleB: ["PQ = 4.5", "QR = 9", "RP = 12"],
    answer: "SSS",
    explanation:
      "The side ratios are 3:4.5, 6:9, and 8:12, all equal to 2:3. This proves SSS similarity."
  },
  {
    id: "case-c",
    title: "Case C: Included angle locked",
    triangleA: ["Two including sides: 2 and 4", "Included angle = 50 degrees"],
    triangleB: ["Two including sides: 3 and 6", "Included angle = 50 degrees"],
    answer: "SAS",
    explanation:
      "The included angles are equal and the including sides are proportional, so the triangles are similar by SAS."
  },
  {
    id: "case-d",
    title: "Case D: Suspiciously thin file",
    triangleA: ["One angle equals one angle in the other triangle", "One side pair is proportional"],
    triangleB: ["No second angle pair", "No second proportional side pair"],
    answer: "not-enough",
    trapChoice: "SAS",
    explanation:
      "One angle and one side pair do not prove triangle similarity. More angle or side information is required."
  }
];

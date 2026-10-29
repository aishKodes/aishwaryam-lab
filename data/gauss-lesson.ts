export const GAUSS_PATH = "/math/class10/ap/gauss-sum";

export const gaussStages = [
  {
    title: "The mystery",
    short: "Wonder",
    minutes: 4,
    question: "How could someone add one hundred numbers in a few moments?",
    notes: [
      "Tell the traditional young-Gauss anecdote; details vary between retellings.",
      "Ask for predictions, not an immediate algorithm. Keep 5050 hidden.",
      "Board: 1 + 2 + ... + 100 = ?",
      "Support: try 1 to 10 first. Extension: which two terms belong together?",
    ],
  },
  {
    title: "The card experiment",
    short: "Pair",
    minutes: 5,
    question: "Can every pair have the same total?",
    notes: [
      "Give students physical sticky cards numbered 1 to 10; invite pairs of students to arrange them.",
      "Mirror their proposed pairs digitally, including unequal pairs. Ask what they notice.",
      "Expected: pair opposite ends; five pairs, each totaling 11.",
      "Board: 5 × 11 = 55. Extension: predict what changes for 100 cards.",
    ],
  },
  {
    title: "Cracking the hundred",
    short: "Discover",
    minutes: 5,
    question: "What stays the same as we move inward?",
    notes: [
      "Contrast 50 physical pairs with 100 columns in two copies of the sum.",
      "For odd N, leave the central card unpaired. Never call N/2 a whole-number physical pair count.",
      "Expected for N=100: 50 × 101 = 5050.",
      "Board: 2S = N(N+1). Support: use N=9. Extension: N=101.",
    ],
  },
  {
    title: "The formula lab",
    short: "Generalise",
    minutes: 7,
    question: "Will the pairing idea work for any arithmetic progression?",
    notes: [
      "Ask students to predict the last term before reversing the second row.",
      "Advance one derivation step at a time. Each column is a+l; there are n columns, but two copies of S.",
      "Misconceptions: nd instead of (n−1)d; forgetting to divide the doubled sum by 2.",
      "Board: l=a+(n−1)d; 2S=n(a+l); S=n/2[2a+(n−1)d]. Try d=0, d<0 and n=1.",
    ],
  },
  {
    title: "A little every day",
    short: "Apply",
    minutes: 6,
    question: "How does a small daily increase add up?",
    notes: [
      "Read the savings context aloud; let students identify a, d and n before calculating.",
      "Expected: a=10, d=5, n=7, l=40, S=175 rupees.",
      "Clarify that the seventh deposit is 40, not the seven-day total.",
      "Board: S₇=7/2[20+6×5]=175. Extension: 3,7,11,... for eight terms gives 136.",
    ],
  },
  {
    title: "The quick challenge",
    short: "Check",
    minutes: 5,
    question: "Can you use the pattern and spot a mistake?",
    notes: [
      "Give quiet thinking time before accepting a classroom response. This is a shared class check, not personal analytics.",
      "Expected: 210; 40; replace nd with (n−1)d.",
      "If needed, ask students to list the five terms or count the jumps from the first term.",
      "Board: n terms have n−1 jumps. Allow a retry after discussing each explanation.",
    ],
  },
  {
    title: "Take the idea with you",
    short: "Reflect",
    minutes: 3,
    question: "Why does the formula work, beyond memorising it?",
    notes: [
      "Ask one student to explain equal column sums and another to explain the factor 1/2.",
      "Exit ticket: nine equal deposits of 5 total 45; a=5, d=0, n=9.",
      "Return to the physical cards as evidence for the abstract formula.",
      "Collect one-sentence explanations. Revisit the card stage if students cannot justify dividing by two.",
    ],
  },
] as const;

export const assessmentQuestions = [
  {
    prompt: "Find the sum of the first 20 natural numbers.",
    answer: 210,
    hint: "Pair the first and last number. How many pairs?",
    explanation: "10 pairs of 21 give 210. Equivalently, 20 × 21 ÷ 2 = 210.",
  },
  {
    prompt: "Find the sum: 2 + 5 + 8 + 11 + 14.",
    answer: 40,
    hint: "Count the terms, then identify the first and last.",
    explanation: "There are 5 terms. S = 5 × (2 + 14) ÷ 2 = 40.",
  },
] as const;

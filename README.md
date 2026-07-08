# Project Thales: Triangle Detective Mission

A premium interactive classroom smartboard game for Class 10 NCERT Mathematics, focused on the Triangles chapter.

## Features

- Next.js App Router with TypeScript
- Tailwind CSS premium dark science-lab interface
- Framer Motion transitions, hover/tap states, score animation, and confetti
- Original SVG diagrams for similarity, shadow measurement, Thales theorem, and triangle criteria
- Team setup for 2 to 6 teams
- localStorage persistence for team names, scores, completed levels, and current team
- Teacher reveal button on every level
- Next team button for classroom turns
- Keyboard shortcuts:
  - `N`: next team
  - `R`: teacher reveal
  - `Enter`: submit or finish a mission

## Levels

1. Similar or Imposter
2. Shadow Machine
3. Thales Laser Gate
4. Similarity Courtroom
5. Boss Mission - Measure the Unmeasurable

## Scoring

- Correct answer: +100
- Correct theorem / criterion: +50
- Correct triangle correspondence: +50
- Trap mistake: -20
- Wrong answer: 0

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown by Next.js, usually:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm run start
```

## Deploy

The app has no backend and can be deployed to any Next.js host.

For Vercel:

```bash
npm install
npm run build
```

Then import the repository in Vercel and deploy with the default Next.js settings.

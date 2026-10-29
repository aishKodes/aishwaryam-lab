# Project Thales: Triangle Detective Mission

A premium individual smartphone activity for Class 10 NCERT Mathematics, focused on the Triangles chapter.

## The Gauss Lab

A separate, teacher-led 35-minute Class X AP discovery lesson is available at
`/math/class10/ap/gauss-sum` (shortcut: `/gauss-sum`). The existing Thales student
game and `/teacher` dashboard are unchanged.

The lesson includes seven interactive stages, physical number-card pairing,
teacher-paced derivation, light/dark presentation modes, classroom assessment,
offline saving and a six-sheet A4 TLM kit. No login, student data or backend is
used by the Gauss Lab. Teacher reveals exist only in this presentation module,
not in the Thales student game.

See [Gauss Lab classroom and deployment guide](docs/gauss-lab.md).

## Architecture

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, Framer Motion
- Hosting: Vercel
- Backend API: Hostinger PHP files in `hostinger-thales-api/`
- Database: Hostinger MySQL
- Frontend environment variable: `NEXT_PUBLIC_RESULTS_API_BASE`

Example:

```text
NEXT_PUBLIC_RESULTS_API_BASE=https://pixtra.site/thales-api
```

## Student Flow

1. Student opens the Vercel game link on their own device.
2. Student enters only:
   - Full Name
   - Roll Number
3. Student completes all five missions.
4. Student submits the final result.
5. The app posts to `${NEXT_PUBLIC_RESULTS_API_BASE}/submit.php`.
6. Student sees submitted success and only their own score.

No contact number is collected. No class-wide marks are shown to students.

## Teacher Flow

Open:

```text
/teacher
```

After entering the teacher PIN, the dashboard:

- Fetches results from `teacher-results.php`
- Shows roll number, student name, score, total possible, and submitted time
- Supports search by name or roll number
- Supports refresh
- Exports CSV through `export.php`
- Expands rows to show level-wise answer JSON

Teacher data is not available from the frontend without a successful PIN-protected PHP request.

## Game Content

1. Similar or Imposter
2. Shadow Machine
3. Thales Laser Gate
4. Similarity Courtroom
5. Boss Mission - Measure the Unmeasurable

The activity covers similar figures, all circles/squares/equilateral triangles being similar, similar polygon conditions, Basic Proportionality Theorem / Thales theorem, converse ideas, AA/AAA, SSS, SAS, and shadow-based indirect measurement.

## Scoring

Total possible: 500 marks

- Each level is worth 100 marks.
- Level 1 is prorated across 7 classification cards.
- Level 4 is prorated across 4 similarity cases.
- Numeric levels split marks across answer, theorem/criterion, and correspondence.
- Level-wise answer details are stored as JSON in MySQL.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

For local API testing, create `.env.local`:

```text
NEXT_PUBLIC_RESULTS_API_BASE=https://pixtra.site/thales-api
```

## Production Build

```bash
npm run lint
npm run build
```

## Deploy Frontend To Vercel

1. Import the repo in Vercel.
2. Add `NEXT_PUBLIC_RESULTS_API_BASE` in Vercel environment variables.
3. Deploy with default Next.js settings.

## Deploy Hostinger API

See [hostinger-thales-api/README.md](/Users/aishwaryam/aishwaryam-lab/hostinger-thales-api/README.md) for:

- MySQL schema
- `config.php` setup
- Hostinger upload location
- CORS allowed origins
- submit testing
- teacher dashboard usage

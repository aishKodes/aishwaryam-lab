# The Gauss Lab

Class X NCERT Mathematics: sum of the first n terms of an arithmetic progression.
Teacher: Aishwaryam Singh Tomar, 23SD11002. Duration: 35 minutes.

## Routes

- `/math/class10/ap/gauss-sum`: interactive lesson.
- `/gauss-sum`: server redirect to the canonical lesson route.
- `/math/class10/ap/gauss-sum/print`: six-sheet A4 classroom kit.
- `/` and `/teacher`: existing Thales activities, preserved.

## Classroom preparation

1. Open the lesson before class and check projection, text size and soundless timers.
2. Choose dark or light mode. Presentation mode requests browser fullscreen;
   a compact layout is still used if a browser refuses fullscreen.
3. Print the A4 kit at 100% scale. Pages 1–5 are classroom materials; page 6 is
   the teacher handout and answer reference. Keep the handout separate.
4. Cut the ten number cards and bring reusable adhesive. Students should
   manipulate the physical cards while the teacher mirrors their proposals.
5. Review Teacher Notes, then close them before projecting. Entering Presentation
   mode also closes them. Notes are not a private second-screen presenter view.

## Seven-stage lesson

| Stage | Minutes | Student activity |
| --- | --- | --- |
| Wonder | 4 | Predict the sum from 1 to 100; hear a qualified traditional Gauss anecdote. |
| Pair | 5 | Form pairs using real sticky cards and the digital card bank. Try, undo and revise. |
| Discover | 5 | Scale to 100; distinguish physical pairs from columns in two copies. Explore odd N. |
| Generalise | 7 | Derive the formula in five teacher-controlled steps. Vary a, d and n. |
| Apply | 6 | Identify AP values in a savings context and check a predicted total. |
| Check | 5 | Answer three formative questions and discuss misconceptions. |
| Reflect | 3 | Explain the proof in words; complete a zero-difference exit ticket. |

Timers never change stages automatically. Each stage retains its own paused
timer when revisited. Activities retain their state during navigation; a fresh
lesson resets them. Assessment is a shared classroom check, not individual
student analytics. No personal information is collected or submitted.

## Controls

- Previous/next buttons or left/right arrows and P/N (outside inputs and buttons).
- Space: start or pause the current stage timer, outside interactive controls.
- F: request or exit fullscreen. Escape exits native fullscreen and closes notes.
- Tab: move between controls. Enter/Space: activate a focused card or button.
- Card activity: select one card, then a partner. Unequal pair totals are allowed
  for exploration, but the equal-pairs conclusion requires all five totals to be 11.
- Formula lab: the first term ranges from -50 to 50, d from -10 to 10, and n from
  1 to 100. Large sequences show first/last terms with an explicitly marked gap.
  Every term is still included in the calculation.

Answers stay hidden until the relevant teacher reveal or classroom attempt.
There are no automatic derivation steps. A wrong numerical prediction receives
a hint without the expected number; a correct attempt receives the working.
The original Thales student game has no answer-reveal controls.

## Offline use

All lesson interactions run locally, with locally bundled KaTeX/fonts and no CDN
or external API. An already loaded lesson continues to work without a connection.

For an offline reload, open Teacher Notes and choose **Save lesson offline** while
online. Wait for the explicit success message. This needs a production build on
HTTPS (or localhost), Service Worker and Cache Storage support. Private browsing
or school policies may disable storage; failures are reported without claiming
success. Bookmark the canonical URL, not the redirect alias.

The opt-in service worker is scoped only to `/math/class10/ap/gauss-sum`; it does
not control the homepage, Thales game, teacher dashboard, or PHP API. It caches
only lesson/print documents and same-origin immutable Next.js assets. It does
not cache personal data or API responses. Re-save after a deployment to refresh
the offline copy. Browser storage can be evicted, so test offline before class.

## Run and verify

Use Node.js 22.6 or newer (Node 22 LTS recommended) and npm.

```bash
npm ci
npm run dev -- --port 3100
```

Open `http://localhost:3100/math/class10/ap/gauss-sum`.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The end-to-end suite starts a production server on port 3100, tests desktop and
mobile viewports, saves screenshots and an A4 PDF in `test-results/`, checks
answer gating, keyboard activity, all stages, arithmetic controls, printing,
offline reload and preservation of existing routes. It does not need the PHP API.

To test a deployed site, run:

```bash
PLAYWRIGHT_BASE_URL=https://aishwaryam-lab.vercel.app npm run test:e2e
```

The offline network-isolation test is local-only. Other browser checks run
against the supplied deployment URL.

## Structure

- `lib/ap.ts`: pure, validated AP calculations, paired models and display indices.
- `data/gauss-lesson.ts`: stage timings, prompts, notes and assessment data.
- `components/gauss/`: presentation shell, interactive stages and KaTeX renderer.
- `app/math/class10/ap/gauss-sum/`: routes, scoped styles and print kit.
- `public/math/class10/ap/gauss-sum/sw.js`: opt-in, lesson-scoped offline cache.
- `tests/`: arithmetic unit tests and browser acceptance tests.

## Deployment

The existing GitHub repository is `aishKodes/aishwaryam-lab`. Push to its configured
production branch (`main`) to trigger the existing Vercel integration. No new
environment variable or backend is needed for this module. The Thales API still
uses its existing `NEXT_PUBLIC_RESULTS_API_BASE` environment variable.

Verify Vercel's deployment result for the exact commit, then open the canonical
production lesson URL and run the deployed browser tests. A successful push is
not, by itself, proof that deployment succeeded.

The compatible dependency updates retain Next.js 15 and React 19. The PostCSS
override selects the patched 8.x release for Next's nested dependency; do not
remove it without rechecking `npm audit` and the production build.

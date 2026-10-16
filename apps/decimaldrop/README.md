# Decimal Drop

A Fortnite-inspired Battle Lab for fifth-grade math and science. React, TypeScript, Vite, Tailwind CSS, local SVG artwork, and Lucide icons. No accounts, backend, tracking, paid API, or external assets at runtime. This is an unofficial fan-inspired learning app, not affiliated with Epic Games or Go Math!/HMH.

## Choose a subject and dropzone

- **Math → Decimals / Tilted Totals:** original 348-question bank plus 132 new Fortnite mission variants (480 seeded math questions, with additional deterministic generation).
- **Science → Mixtures & Chemical Reactions / Reaction Royale:** 80 authored questions covering every section of the supplied Grade 5 review sheet: mixtures, solutions, new substances, gas, temperature, new solids, new smells, color, physical-change counterexamples, and evidence-based explanations.
- **Science → Properties of Matter / Loot Lab:** 100 reviewed questions adapted from James’s TVA quiz, covering vocabulary, magnetism, electrical and thermal conductivity, solubility, measurement, mass/weight, observable properties, states, and investigation.

Science practice follows the TVA interaction: choose one of four shuffled answers, then see the correct answer and explanation immediately. Practice tests still conceal correctness until the final debrief. The scratchpad is available for thinking through an explanation; the app does not pretend to automatically grade free-text science reasoning. Study cards under **Mission intel** summarize each unit before a quiz.

The first three standard quizzes are diagnostic **for each unit independently**. Each science quiz samples all ten configured skills. Readiness and parent analytics are scoped to the equipped unit; a math score never increases science readiness. XP and badges are shared. Switching units parks unfinished missions, including drafts and scratch work, and restores them when that unit is equipped again.

### Existing progress and content variety

Original version-1 decimal saves remain supported. Old sessions without a unit are treated as decimals. Original question definitions and IDs are preserved so saved answers continue to validate. No data reset is required. TVA app history was not stored in a compatible mastery format and is not imported; its content is adapted, while the new properties unit starts with new evidence.

The science bank contains 180 authored/adapted prompts, not infinite number-swapped variants. Selection prefers unseen prompts and underrepresented question formats. Once a skill’s bank is exhausted, old questions can return as spaced review, but the same prompt will not repeat within a mission. Mastery still requires success across sessions and available formats, and should be interpreted as practice evidence rather than a standardized test result.

Science source files: `src/engine/mixtures-bank.ts`, `matter-bank.json`, `science.ts`, and `units.ts`. The supplied review sheet is the scope source for Reaction Royale; TVA provides the prior unit’s scope. Scientific distinctions were cross-checked against [ACS fifth-grade reaction evidence](https://www.acs.org/education/resources/k-8/inquiryinaction/fifth-grade/chapter-3/different-substances-react-differently.html) and the [Grade 5 NGSS overview](https://www.nextgenscience.org/topic-arrangement/5structure-and-properties-matter). These references support the science; they do not certify readiness for James’s classroom test.

The Fortnite theme uses locally drawn island, Battle Bus, loot-llama, pickaxe, and shield-prop artwork. It is an unofficial fan-inspired learning app. Science questions use real materials; fictional props only provide the mission setting. There are no speed penalties or shrinking-storm timers.

## Run locally

Use Node.js 22.12+ (Node 24 recommended) and pnpm 10+:

```sh
pnpm install
pnpm dev
```

Open **http://127.0.0.1:5173**. Use the same browser and address each time: progress belongs to that browser origin. If Vite picks another port, the old origin's data will not be visible there.

```sh
pnpm test        # deterministic engine tests, including 29,000 generated problems
pnpm build       # TypeScript check and production bundle
pnpm preview     # preview the production bundle
```

For browser workflow checks, first keep `pnpm dev` running in another terminal:

```sh
pnpm exec playwright install chromium
pnpm test:e2e
```

The browser tests verify a complete diagnostic quiz, hints and retries, scratchpad refresh recovery, parent targeting, practice-test answer concealment, early stopping, export/import, and mobile overflow. Screenshots are written to `.qa/`.

## For your first week

Start with **Standard Quiz**. The first **three completed standard quizzes** use a balanced diagnostic plan. The first 12 challenges cover all seven skill groups, and three well-distributed quizzes sample every one of the 29 configured subskills. After that, standard quizzes prioritize weak areas while reserving every third slot for coverage or review. A skill cannot take more than two slots in a standard quiz. Quick Practice can focus entirely on one or two skills.

- **Quick Practice:** 6 questions, hints, retries, selected or suggested skills.
- **Standard Quiz:** 12 questions, diagnostic first, then adaptive.
- **Practice Test:** 20 questions, representative group coverage, fixed before answering, no hints or correctness feedback until the debrief. No single 20-question test can cover every one of 29 subskills.

There are no time limits. Hints, scratch work, each submitted attempt, and time spent are saved. **Save & take a break** resumes the same mission later. **Finish this mission early** retains only answered questions; unanswered questions do not count against the student. Early standard sessions do not consume one of the three diagnostic missions.

The Parent Dashboard shows readiness, independent first-attempt accuracy with sample sizes, evidence coverage, recent results, skill details, possible error patterns, and one-click focused practice. A few good answers never establish chapter readiness.

## Curriculum: provisional and unverified

The family chose the provisional scope. Chapter numbering varies by Go Math! edition. **The app does not claim these are official lesson titles or that CUSD has confirmed this scope.** Check the chapter's actual contents before relying on readiness.

Edit `src/engine/curriculum.ts` to change descriptive skill labels, coaching recommendations, chapter metadata, and assessment thresholds. Set `curriculum.verified` only once confirmed; scope status notices update automatically. The notices deliberately default to “unverified.” To narrow scope, remove taxonomy entries; the bank and dashboard derive from the remaining skills. If adding a new skill ID, add a matching generator and coverage rotation entry in `questions.ts` / `session.ts` and run the tests. Do not change existing IDs after collecting progress; exports validate question definitions against the installed version.

The 29 decimal subskills cover place value, equivalent decimals, alignment, estimation, reasonableness, decimal addition/subtraction through thousandths, regrouping, borrowing across zeros, whole-number operations, mental strategies, money, measurement, multi-step stories, relevant information, choosing operations, correcting errors, missing numbers, and explaining a strategy.

## Question correctness and generation

`src/engine/questions.ts` exports a **348-question original decimal bank** (12 per decimal subskill), plus 132 additional math mission variants and deterministic parameterized generators for fresh questions. About 86% require numeric responses; reasoning and operation-selection questions use multiple choice. Questions include ID, skill, difficulty, answer equivalents, worked solution, hint, candidate misconception patterns, estimated completion time, and a machine-checkable arithmetic proof.

All arithmetic uses **integer thousandths**. No computed decimal answer relies on binary floating-point addition/subtraction. Input equivalence accepts `4.5`, `4.50`, `4.500`, and additional trailing zeros, but rejects nonzero digits beyond thousandths and malformed input. Required regression cases include `10 − 3.875 = 6.125`, `15.003 − 6.728 = 8.275`, and `0.1 + 0.2 = 0.3`.

Generation validates each proof before returning a question. Tests exercise 1,000 seeds for every skill, bank uniqueness, choice uniqueness, metadata, answer equivalence, and solution-result consistency. The UI selects unseen question IDs and avoids the most recent two formats for a skill. This is a parameterized bank: some computational practice intentionally reuses a mathematical structure with new operands. It is not 348 human-authored lessons. Seeds advance without a preset bank limit; an explicit safety ceiling prevents runaway selection. Extremely long use eventually produces larger whole numbers; revise templates if extending the app beyond this test-prep use case.

Difficulty is 1–5 in the schema; this chapter currently uses levels 1–4, rather than adding advanced level-5 arithmetic. Repeated success raises the desired level, repeated misses lower it, and the selector uses the nearest available level **within the same skill**. A single miss does not lower the desired difficulty. Skills with one appropriate difficulty keep that level.

## Assessment rules

Heuristics are configurable in `assessmentConfig`, not a standardized or scientifically calibrated assessment. Raw responses are the source of truth; mastery is derived from all saved sessions when needed, so it cannot drift from its underlying evidence.

- **Not Assessed:** fewer than 3 recorded responses. Evidence counts remain visible.
- **Needs Practice:** at least 3 independent responses, with overall and recent success below 50%.
- **Developing:** some evidence, but remaining criteria are not met.
- **Proficient:** at least 3 independent responses, at least 80% first-attempt accuracy overall and recently, independent success in 2 sessions and 2 formats.
- **Mastered:** at least 6 independent responses, at least 90% accuracy overall and recently, success in 3 sessions and up to 3 available formats, and demonstration at the hardest available level for that skill, up to level 4.

“Recent” means up to the last 6 independent responses. A hint used before the first submission makes that response supported practice. If a student answers incorrectly on their own and then asks for a hint, the independent first error is retained. A retry cannot erase a first-attempt error. Time is context only; it never affects mastery or rewards. Numerical answer patterns are marked **possible**, not definitive diagnoses. Unmatched errors remain unclassified. A skill not practiced in 14 days gets a refresh flag.

**Ready** requires all configured subskills to be proficient/mastered, each with at least 3 independent responses and current practice. **Nearly Ready** requires at least 80% evidence coverage and 70% proficiency. **Not Yet Assessed** means zero answered questions; other incomplete evidence is conservatively **Needs Work**, with coverage shown. Three diagnostic quizzes give a preliminary map; 40–60 responses can improve that map but do not guarantee readiness. With 29 subskills, full evidence takes more than 60 responses. The coverage requirement intentionally takes precedence over a high overall score.

## Progress, backups and privacy

Data is stored in localStorage under `decimal-drop-progress-v1`. It includes sessions, generated questions, responses, attempts, time, hints, scratch work, XP, sound preference, and active drafts. Mastery, achievements and parent analytics are recomputed from this persisted evidence. Paused work survives refresh and browser restart; there is no cloud sync.

Use **Export** in the footer regularly, particularly before clearing browser data, changing ports, using private browsing, or updating question templates. **Import** validates a version-1 JSON file and restores it, replacing the current profile. Malformed or incompatible imports leave current progress intact. There is one student profile per browser origin.

Each save retains the previous valid snapshot in `decimal-drop-progress-v1-backup`. If the current save is corrupt, the loader attempts that backup and displays a warning. If no readable backup exists, it preserves the damaged main data under `decimal-drop-progress-v1-damaged` before starting fresh. Storage errors produce a visible warning and an export option. LocalStorage has a browser-dependent quota; the app never silently deletes history. Export if the browser reports storage is full. Import limit: 10 MB / 2,000 sessions.

## Theme and motivation

Edit `src/theme.ts` and CSS variables in `src/styles.css`. The island illustration is a self-contained `public/island.svg`. Sounds are optional, muted by default, and synthesized in the browser. Reduced-motion preferences are respected.

XP rewards answered challenges (10), independent first-try success (+10), correcting an answer after retry (+5), and full missions (+50). No speed or streak bonuses. Badges celebrate a first mission, coverage, recovery, returning, and sustained mastery. The explorer portrait automatically gains Pathfinder lime colors at 500 XP (level 3) and Strategist cyan colors at 1,000 XP (level 5).

## Architecture

- `src/engine/curriculum.ts`: editable taxonomy, modes, assessment configuration
- `src/engine/decimal.ts`: exact decimal input and equivalence
- `src/engine/questions.ts`: validated bank and deterministic generators
- `src/engine/session.ts`: diagnostic/adaptive selection, attempts, sessions, rewards
- `src/engine/assessment.ts`: conservative mastery, readiness, recommendations
- `src/engine/storage.ts`: versioned persistence, import validation and recovery
- `src/components/Quiz.tsx`: focused student flow and debrief
- `src/components/Dashboard.tsx`: parent skill matrix and analysis
- `src/App.tsx`: lobby, routing, rewards, theme and data controls
- `tests/workflows.spec.ts`: browser checks

Development requires no API keys or generated-image service.

## Website deployment

This app now lives in `website/apps/decimaldrop`. Run `pnpm build:pages` to regenerate the
tracked static site at `website/decimaldrop`, with all assets prefixed by `/decimaldrop/`.
Commit source and build output together; merging to the website's `master` branch publishes it.
The existing GitHub Pages custom domain and all other games use the same deployment as before.
The old local app and the live site have different browser origins: export local progress and
import it on https://thecarlislekids.com/decimaldrop/ to transfer saved work.

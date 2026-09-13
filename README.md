# החיים בישראל — Israeli Life Simulator

Web-based Israeli life simulator: create a character, live year by year through
branching decisions, and watch a scoring system that's part of the actual game
state (not just a UI number) shape your character's life story.

**Live:** https://dekelpk.github.io/israelife/ (deployed via GitHub Actions on
every push, see `.github/workflows/deploy-pages.yml`) — installable to a
phone's home screen as a standalone app (manifest + icons in `public/`).

**Add to home screen:**
- iOS (Safari): Share button → "Add to Home Screen"
- Android (Chrome): ⋮ menu → "Install app" / "Add to Home Screen"

## Stack

React + TypeScript + Vite, Tailwind CSS for styling, Zustand (with the
`persist` middleware) for state + localStorage save/continue.

## Running locally

```bash
npm install
npm run dev
```

`npm run build` type-checks and builds for production. `npm run lint` runs oxlint.

## Architecture

The codebase is split so new content (careers, cities, events, traits...) can
be added under `src/data` without touching engine or UI code.

```
src/
  types/        Core domain types: GameState, Character, StatBlock, Choice,
                GameEvent, EffectPayload, ScoreState, etc.
  engine/        Pure(ish) functions that mutate GameState:
    scoring.ts     applyEffect() — the one place stat/XP/hidden-stat/flag/
                    money deltas land on state and feed the life score.
    turn.ts        advanceYear() — one year of passive drift (economy,
                    career ticks, family aging, energy/stress) + picks the
                    next event (a due scheduled event first, else a
                    weighted random pick from the pool).
    events.ts      Event eligibility + weighted selection + scheduled
                    ("due") event lookup — this is what lets a choice made
                    at 22 pay off (or bite back) at 28: choices can call
                    `scheduleEvent: { eventId, inYears }`.
    applyChoice.ts Resolves a chosen Choice against the current event.
    career.ts, economy.ts, relationships.ts, family.ts, time.ts
                   Domain-specific tick/helper logic.
    lifeSummary.ts Builds the end-of-game summary + funny "awards" from
                   the accumulated GameState.
  data/
    events/        All content, split by category (onboarding, career,
                    finance, romance, family, israel, random) and
                    aggregated in `index.ts`. Adding a new event is just
                    adding an object to one of these arrays.
    traits.ts, cities.ts, education.ts, careers.ts, names.ts
  store/
    gameStore.ts   Zustand store wiring UI actions to the engine, and
                    persisting GameState to localStorage.
  components/      Character creation, dashboard, event card, result
                    panel, stats bar, life summary — all Hebrew/RTL.
```

### The scoring system

Every choice carries an `EffectPayload`: stat deltas (visible), optional
`hidden` stat deltas (applied immediately but not shown in the result
popup — they surface only in the life summary or a later event), XP, a
direct cash (`money`) delta, `flags` for gating future content, and an
optional `scheduleEvent` to queue a follow-up years later. `applyEffect()`
folds all of this into `GameState.score` (`xp`, `level`, `totalPoints`,
and a full `history` log) — the score is state, not a view computed after
the fact, so it survives save/continue and drives the end-game summary.

### MVP scope

Character creation → first-job/army/studies branching intro → yearly time
loop with random + scheduled events → career ladder with promotions/raises
→ money/economy simulation → basic dating → relationship progression →
marriage → children → localStorage save/continue/new-game → life summary
screen with awards.

import type { Choice, GameEvent, GameState, ScoreLogEntry } from '../types'
import { applyEffect } from './scoring'
import type { Rng } from './random'

export function applyChoice(state: GameState, event: GameEvent, choice: Choice, rng: Rng): GameState {
  const { state: afterEffects } = applyEffect(state, `${event.title} — ${choice.text}`, choice.effects, choice.hidden)

  let next = afterEffects
  const customPartial = choice.custom?.(next, rng)
  if (customPartial) next = { ...next, ...customPartial }

  if (next.lastResult) {
    const withOutcome: ScoreLogEntry = { ...next.lastResult, outcome: choice.outcome }
    next = {
      ...next,
      lastResult: withOutcome,
      score: { ...next.score, history: [...next.score.history.slice(0, -1), withOutcome] },
    }
  }

  return {
    ...next,
    firedEventIds: next.firedEventIds.includes(event.id) ? next.firedEventIds : [...next.firedEventIds, event.id],
    currentEvent: null,
  }
}

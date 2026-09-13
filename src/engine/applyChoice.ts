import type { Choice, GameEvent, GameState } from '../types'
import { applyEffect } from './scoring'
import type { Rng } from './random'

export function applyChoice(state: GameState, event: GameEvent, choice: Choice, rng: Rng): GameState {
  const { state: afterEffects } = applyEffect(state, `${event.title} — ${choice.text}`, choice.effects, choice.hidden)

  let next = afterEffects
  const customPartial = choice.custom?.(next, rng)
  if (customPartial) next = { ...next, ...customPartial }

  return {
    ...next,
    firedEventIds: next.firedEventIds.includes(event.id) ? next.firedEventIds : [...next.firedEventIds, event.id],
    currentEvent: null,
  }
}

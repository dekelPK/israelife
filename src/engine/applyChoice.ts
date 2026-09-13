import type { Choice, GameEvent, GameState, ScoreLogEntry } from '../types'
import { applyEffect, mergeEffects } from './scoring'
import { weightedPick, type Rng } from './random'

export function applyChoice(
  state: GameState,
  event: GameEvent,
  choice: Choice,
  rng: Rng,
  inputValue?: string,
): GameState {
  let outcome = choice.outcome
  let effects = choice.effects
  let variantCustom: Choice['custom']

  if (choice.chance && choice.chance.length > 0) {
    const variant = weightedPick(
      choice.chance.map((v) => ({ item: v, weight: v.weight })),
      rng,
    )
    if (variant) {
      outcome = `${outcome} ${variant.outcome}`
      effects = mergeEffects(choice.effects, variant.effects)
      variantCustom = variant.custom
    }
  }

  const { state: afterEffects } = applyEffect(state, `${event.title} — ${choice.text}`, effects, choice.hidden)

  let next = afterEffects
  const customPartial = choice.custom?.(next, rng, inputValue)
  if (customPartial) next = { ...next, ...customPartial }
  const variantCustomPartial = variantCustom?.(next, rng, inputValue)
  if (variantCustomPartial) next = { ...next, ...variantCustomPartial }

  if (next.lastResult) {
    const withOutcome: ScoreLogEntry = { ...next.lastResult, outcome }
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

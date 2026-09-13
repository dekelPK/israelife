import type { GameEvent, GameState } from '../types'
import { weightedPick, type Rng } from './random'

export function isEligible(state: GameState, event: GameEvent): boolean {
  if (event.once && state.firedEventIds.includes(event.id)) return false
  if (event.minAge !== undefined && state.character.age < event.minAge) return false
  if (event.maxAge !== undefined && state.character.age > event.maxAge) return false
  if (event.condition && !event.condition(state)) return false
  return true
}

function weightOf(state: GameState, event: GameEvent): number {
  if (typeof event.weight === 'function') return event.weight(state)
  return event.weight ?? 1
}

export function pickRandomEvent(state: GameState, pool: GameEvent[], rng: Rng): GameEvent | null {
  const eligible = pool.filter((e) => isEligible(state, e))
  if (eligible.length === 0) return null
  return weightedPick(
    eligible.map((item) => ({ item, weight: weightOf(state, item) })),
    rng,
  )
}

// Scheduled follow-ups (decision chains) always take priority over the
// random pool for the year they're due, so a choice made at 22 reliably
// pays off - or comes back to bite - at 28.
export function takeDueScheduledEvent(
  state: GameState,
  pool: GameEvent[],
): { event: GameEvent; remainingSchedule: typeof state.scheduledEvents } | null {
  const dueIndex = state.scheduledEvents.findIndex((s) => s.triggerYear <= state.year)
  if (dueIndex === -1) return null
  const due = state.scheduledEvents[dueIndex]
  const event = pool.find((e) => e.id === due.eventId)
  const remainingSchedule = state.scheduledEvents.filter((_, i) => i !== dueIndex)
  if (!event) return { event: undefined as unknown as GameEvent, remainingSchedule }
  return { event, remainingSchedule }
}

export function resolveChoices(state: GameState, event: GameEvent) {
  return typeof event.choices === 'function' ? event.choices(state) : event.choices
}

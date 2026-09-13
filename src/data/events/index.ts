import { onboardingEvents } from './onboarding'
import { careerEvents } from './career'
import { financeEvents } from './finance'
import { romanceEvents } from './romance'
import { familyEvents } from './family'
import { israelEvents } from './israel'
import { randomEvents } from './random'
import type { GameEvent } from '../../types'

export const ALL_EVENTS: GameEvent[] = [
  ...onboardingEvents,
  ...careerEvents,
  ...financeEvents,
  ...romanceEvents,
  ...familyEvents,
  ...israelEvents,
  ...randomEvents,
]

export function getEventById(id: string): GameEvent | undefined {
  return ALL_EVENTS.find((e) => e.id === id)
}

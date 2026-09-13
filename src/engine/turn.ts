import { ALL_EVENTS } from '../data/events'
import type { GameState } from '../types'
import { applyEffect } from './scoring'
import { computeYearlyFinance } from './economy'
import { yearlyCareerTick } from './career'
import { ageChildren } from './family'
import { relationshipHealthDrift } from './relationships'
import { lifeStageForAge, MAX_AGE } from './time'
import { pickRandomEvent, takeDueScheduledEvent } from './events'
import { defaultRng, type Rng } from './random'

// A full year: passive stat/economy/career/family drift bundled into one
// score-log entry, followed by picking the next event (a due scheduled
// follow-up takes priority over the random pool).
export function advanceYear(state: GameState, rng: Rng = defaultRng): GameState {
  const nextAge = state.character.age + 1
  const nextYear = state.year + 1

  const finance = computeYearlyFinance(state)
  const careerTick = yearlyCareerTick(state, rng)
  const children = ageChildren(state)
  const relationshipDrift = relationshipHealthDrift(state, rng)

  const energyRegen = 8 - Math.round(state.hiddenStats.stress / 15)
  const stressDecay = -4

  let stateWithProgress: GameState = {
    ...state,
    character: { ...state.character, age: nextAge },
    year: nextYear,
    lifeStage: lifeStageForAge(nextAge),
    career: careerTick.career,
    family: { ...state.family, children },
    finance: { ...state.finance, savings: finance.savings, monthlyExpenses: finance.monthlyExpenses },
    relationship: state.relationship.partner
      ? {
          ...state.relationship,
          relationshipScore: Math.max(0, Math.min(100, state.relationship.relationshipScore + relationshipDrift)),
        }
      : state.relationship,
  }

  const passiveLabel = `שנה חדשה — גיל ${nextAge}`
  const { state: afterPassive } = applyEffect(stateWithProgress, passiveLabel, {
    stats: {
      money: finance.moneyStatDelta,
      energy: energyRegen,
      relationship: state.relationship.partner ? Math.round(relationshipDrift / 2) : 0,
      career: careerTick.promoted ? 6 : careerTick.raised ? 2 : 0,
    },
    hiddenStats: { stress: stressDecay },
    xp: careerTick.promoted ? 15 : 0,
  })
  stateWithProgress = afterPassive

  if (nextAge >= MAX_AGE) {
    return { ...stateWithProgress, gameOver: true, currentEvent: null }
  }

  const due = takeDueScheduledEvent(stateWithProgress, ALL_EVENTS)
  if (due?.event) {
    return {
      ...stateWithProgress,
      scheduledEvents: due.remainingSchedule,
      currentEvent: { eventId: due.event.id },
      turnCount: stateWithProgress.turnCount + 1,
    }
  }
  if (due && !due.event) {
    stateWithProgress = { ...stateWithProgress, scheduledEvents: due.remainingSchedule }
  }

  const picked = pickRandomEvent(stateWithProgress, ALL_EVENTS, rng)
  return {
    ...stateWithProgress,
    currentEvent: picked ? { eventId: picked.id } : null,
    turnCount: stateWithProgress.turnCount + 1,
  }
}

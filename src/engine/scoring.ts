import type {
  EffectPayload,
  GameState,
  HiddenStatBlock,
  ScoreLogEntry,
  StatBlock,
  StatDelta,
} from '../types'
import { HIDDEN_STAT_KEYS, STAT_KEYS } from '../types'

export const XP_PER_LEVEL = 120

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function createBaseStats(): StatBlock {
  return {
    money: 50,
    happiness: 60,
    career: 20,
    education: 10,
    housing: 30,
    family: 50,
    friends: 55,
    relationship: 30,
    energy: 80,
    skills: 20,
    reputation: 40,
  }
}

export function createBaseHiddenStats(): HiddenStatBlock {
  return { luck: 50, stress: 20, ambitionDrift: 0 }
}

function applyStatDeltas(stats: StatBlock, deltas?: Partial<Record<string, number>>): { next: StatBlock; log: StatDelta[] } {
  const next = { ...stats }
  const log: StatDelta[] = []
  if (deltas) {
    for (const key of STAT_KEYS) {
      const amount = deltas[key]
      if (typeof amount === 'number' && amount !== 0) {
        next[key] = clampStat(next[key] + amount)
        log.push({ stat: key, amount })
      }
    }
  }
  return { next, log }
}

function applyHiddenDeltas(hidden: HiddenStatBlock, deltas?: Partial<Record<string, number>>): HiddenStatBlock {
  const next = { ...hidden }
  if (deltas) {
    for (const key of HIDDEN_STAT_KEYS) {
      const amount = deltas[key]
      if (typeof amount === 'number' && amount !== 0) {
        next[key] = Math.max(0, Math.min(100, next[key] + amount))
      }
    }
  }
  return next
}

// Weighs a resolved decision into the headline "life score". Visible stat
// movement counts most, hidden movement a bit less (it wasn't chosen
// knowingly), and XP is a flat career-sim-style bonus per decision.
function computePoints(visible: StatDelta[], hiddenVisible: StatDelta[], xp: number): number {
  const visibleSum = visible.reduce((s, d) => s + d.amount, 0)
  const hiddenSum = hiddenVisible.reduce((s, d) => s + d.amount, 0)
  return Math.round(visibleSum * 10 + hiddenSum * 5 + xp * 2)
}

export interface ApplyEffectResult {
  state: GameState
  log: ScoreLogEntry
}

// Applies a single decision's (or scheduled consequence's) effect payload to
// the game state. `hidden` effects are folded into the same stats/flags but
// tracked separately in the log so the UI can choose whether to reveal them
// immediately or only in the end-of-life summary.
export function applyEffect(
  state: GameState,
  label: string,
  effect: EffectPayload,
  hidden?: EffectPayload,
): ApplyEffectResult {
  const { next: statsAfterVisible, log: visibleStatLog } = applyStatDeltas(state.stats, effect.stats)
  const { next: statsAfterHidden, log: hiddenStatLog } = applyStatDeltas(statsAfterVisible, hidden?.stats)

  const hiddenStatsAfterVisible = applyHiddenDeltas(state.hiddenStats, effect.hiddenStats)
  const hiddenStatsFinal = applyHiddenDeltas(hiddenStatsAfterVisible, hidden?.hiddenStats)

  const xpGain = (effect.xp ?? 0) + (hidden?.xp ?? 0)
  const nextXp = state.score.xp + xpGain
  const nextLevel = Math.floor(nextXp / XP_PER_LEVEL) + 1

  const moneyDelta = (effect.money ?? 0) + (hidden?.money ?? 0)
  const nextSavings = state.finance.savings + moneyDelta

  const nextFlags = { ...state.flags, ...(effect.flags ?? {}), ...(hidden?.flags ?? {}) }

  const relationshipScoreDelta = (effect.relationshipScore ?? 0) + (hidden?.relationshipScore ?? 0)
  const nextRelationship = state.relationship.partner
    ? {
        ...state.relationship,
        relationshipScore: Math.max(0, Math.min(100, state.relationship.relationshipScore + relationshipScoreDelta)),
      }
    : state.relationship

  const scheduledEvents = [...state.scheduledEvents]
  for (const toSchedule of [effect.scheduleEvent, hidden?.scheduleEvent]) {
    if (toSchedule) {
      scheduledEvents.push({ eventId: toSchedule.eventId, triggerYear: state.year + toSchedule.inYears })
    }
  }

  const pointsGain = computePoints(visibleStatLog, hiddenStatLog, xpGain)

  const logEntry: ScoreLogEntry = {
    year: state.year,
    age: state.character.age,
    label,
    visibleEffects: visibleStatLog,
    hiddenEffects: hiddenStatLog,
    xpGain,
    pointsGain,
  }

  const nextState: GameState = {
    ...state,
    stats: statsAfterHidden,
    hiddenStats: hiddenStatsFinal,
    finance: { ...state.finance, savings: nextSavings },
    relationship: nextRelationship,
    flags: nextFlags,
    scheduledEvents,
    score: {
      ...state.score,
      xp: nextXp,
      level: nextLevel,
      totalPoints: state.score.totalPoints + pointsGain,
      history: [...state.score.history, logEntry],
    },
    lastResult: logEntry,
  }

  return { state: nextState, log: logEntry }
}

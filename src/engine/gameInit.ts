import type { Character, GameState } from '../types'
import { createBaseHiddenStats, createBaseStats } from './scoring'
import { lifeStageForAge } from './time'
import { UNEMPLOYED_CAREER } from './career'

export function createInitialState(character: Character): GameState {
  const year = new Date().getFullYear() - (character.age - 18)

  return {
    character,
    education: { path: 'none', status: 'inProgress', degreeLevel: 0 },
    career: UNEMPLOYED_CAREER,
    relationship: { status: 'single', partner: null, relationshipScore: 0, history: [] },
    family: { children: [], wantsChildren: null },
    finance: { savings: character.familyWealth === 'wealthy' ? 40000 : character.familyWealth === 'middle' ? 8000 : 500, debt: 0, monthlyExpenses: 0, ownsHome: false, mortgage: 0 },
    stats: createBaseStats(),
    hiddenStats: createBaseHiddenStats(),
    score: { xp: 0, level: 1, totalPoints: 0, history: [] },
    flags: {},
    scheduledEvents: [],
    firedEventIds: [],
    year,
    lifeStage: lifeStageForAge(character.age),
    // The very first event is always the origin-path choice - everything
    // that follows branches from there, so it bypasses the weighted pool.
    currentEvent: { eventId: 'origin_path' },
    lastResult: null,
    gameOver: false,
    turnCount: 0,
  }
}

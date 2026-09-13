import { CITIES } from '../data/cities'
import { CAREER_TRACKS, getTrack } from '../data/careers'
import type { CareerState, GameState } from '../types'
import { chance, type Rng } from './random'

function jobMarketMultiplier(cityId: string): number {
  return CITIES.find((c) => c.id === cityId)?.jobMarket ?? 1
}

export function salaryFor(trackId: string, level: number, cityId: string): number {
  const track = getTrack(trackId)
  const jobLevel = track?.levels.find((l) => l.level === level) ?? track?.levels[0]
  if (!jobLevel) return 5000
  return Math.round(jobLevel.baseSalary * jobMarketMultiplier(cityId))
}

export function startJob(state: GameState, trackId: string, level = 1): CareerState {
  const track = getTrack(trackId)
  const jobLevel = track?.levels.find((l) => l.level === level) ?? track?.levels[0]
  return {
    trackId,
    jobId: `${trackId}-${level}`,
    title: jobLevel?.title ?? 'עובד/ת',
    level,
    salary: salaryFor(trackId, level, state.character.city),
    yearsInRole: 0,
    unemployed: false,
  }
}

export const UNEMPLOYED_CAREER: CareerState = {
  trackId: null,
  jobId: null,
  title: 'ללא תעסוקה',
  level: 0,
  salary: 0,
  yearsInRole: 0,
  unemployed: true,
}

export interface CareerTickResult {
  career: CareerState
  promoted: boolean
  raised: boolean
}

export function yearlyCareerTick(state: GameState, rng: Rng): CareerTickResult {
  const { career } = state
  if (career.unemployed || !career.trackId) {
    return { career, promoted: false, raised: false }
  }

  const track = getTrack(career.trackId)
  const yearsInRole = career.yearsInRole + 1
  const maxLevel = track?.levels.length ?? 1

  let promotionOdds = 0.08 + yearsInRole * 0.05
  promotionOdds += (state.stats.career - 50) / 400
  promotionOdds += (state.stats.skills - 50) / 400
  if (state.character.traits.includes('ambitious')) promotionOdds += 0.08
  if (state.character.traits.includes('lazy')) promotionOdds -= 0.06
  if (state.education.degreeLevel >= 1) promotionOdds += 0.03
  promotionOdds = Math.max(0.01, Math.min(0.6, promotionOdds))

  if (career.level < maxLevel && chance(promotionOdds, rng)) {
    const nextLevel = career.level + 1
    const jobLevel = track?.levels.find((l) => l.level === nextLevel)
    return {
      career: {
        ...career,
        level: nextLevel,
        title: jobLevel?.title ?? career.title,
        salary: salaryFor(career.trackId, nextLevel, state.character.city),
        yearsInRole: 0,
      },
      promoted: true,
      raised: false,
    }
  }

  if (chance(0.35, rng)) {
    const raiseFactor = 1 + (0.02 + Math.random() * 0.04)
    return {
      career: { ...career, salary: Math.round(career.salary * raiseFactor), yearsInRole },
      promoted: false,
      raised: true,
    }
  }

  return { career: { ...career, yearsInRole }, promoted: false, raised: false }
}

export { CAREER_TRACKS }

import type { LifeStage } from '../types'

export function lifeStageForAge(age: number): LifeStage {
  if (age < 22) return 'youngAdult'
  if (age < 30) return 'earlyCareer'
  if (age < 40) return 'careerAndFamily'
  if (age < 50) return 'establishment'
  if (age < 65) return 'midlifeShift'
  return 'retirement'
}

export const LIFE_STAGE_LABELS: Record<LifeStage, string> = {
  youngAdult: 'תחילת החיים הבוגרים',
  earlyCareer: 'תחילת קריירה',
  careerAndFamily: 'קריירה ומשפחה',
  establishment: 'התבססות',
  midlifeShift: 'שינויי אמצע החיים',
  retirement: 'פרישה',
}

export const MAX_AGE = 90

import { EDUCATION_FIELDS } from '../data/education'
import type { GameState, ScoreLogEntry } from '../types'

export interface LifeAward {
  icon: string
  label: string
}

export interface LifeSummary {
  finalAge: number
  careerTitle: string
  educationLabel: string
  netWorth: number
  marriages: number
  children: number
  happiness: number
  lifeScore: number
  level: number
  bigDecision: ScoreLogEntry | null
  awards: LifeAward[]
}

function biggestDecision(history: ScoreLogEntry[]): ScoreLogEntry | null {
  const decisions = history.filter((h) => !h.label.startsWith('שנה חדשה'))
  if (decisions.length === 0) return null
  return decisions.reduce((best, cur) => (Math.abs(cur.pointsGain) > Math.abs(best.pointsGain) ? cur : best))
}

function computeAwards(state: GameState): LifeAward[] {
  const awards: LifeAward[] = []
  if (state.stats.career >= 80) awards.push({ icon: '🏆', label: 'הקרייריסט/ית' })
  if (state.finance.savings >= 1_000_000) awards.push({ icon: '💸', label: 'מיליונר/ית' })
  if (state.relationship.history.length + (state.relationship.status === 'married' ? 1 : 0) >= 2)
    awards.push({ icon: '❤️', label: 'רומנטיקן/ית' })
  if (state.finance.ownsHome) awards.push({ icon: '🏠', label: 'בעל/ת הדירה' })
  if (state.family.children.length >= 2) awards.push({ icon: '👨‍👩‍👧', label: 'איש/ת המשפחה' })
  if (state.character.traits.includes('adventurous') && state.flags.ranStartup)
    awards.push({ icon: '✈️', label: 'הנודד/ת' })
  if (state.stats.happiness < 30 || state.finance.savings < -50000)
    awards.push({ icon: '😂', label: '"איך לעזאזל הגעת למצב הזה?"' })
  if (state.score.totalPoints < 0) awards.push({ icon: '🤡', label: 'מלך/מלכת ההחלטות הגרועות' })
  if (awards.length === 0) awards.push({ icon: '🙂', label: 'חיים מאוזנים בהחלט' })
  return awards
}

export function generateLifeSummary(state: GameState): LifeSummary {
  return {
    finalAge: state.character.age,
    careerTitle: state.career.unemployed ? 'ללא תעסוקה' : state.career.title,
    educationLabel:
      state.education.status === 'graduated'
        ? `בוגר/ת ${EDUCATION_FIELDS.find((f) => f.id === state.education.field)?.label ?? ''}`
        : state.education.status === 'droppedOut'
          ? 'נשר/ה מלימודים'
          : 'ללא השכלה על-תיכונית',
    netWorth: Math.round(state.finance.savings),
    marriages: state.relationship.history.filter((h) => h.endedAs === 'divorced').length + (state.relationship.status === 'married' ? 1 : 0),
    children: state.family.children.length,
    happiness: state.stats.happiness,
    lifeScore: state.score.totalPoints,
    level: state.score.level,
    bigDecision: biggestDecision(state.score.history),
    awards: computeAwards(state),
  }
}

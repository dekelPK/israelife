import type { TraitId } from '../types'

export interface TraitDef {
  id: TraitId
  label: string
  icon: string
  description: string
}

export const TRAITS: TraitDef[] = [
  { id: 'ambitious', label: 'שאפתן/ית', icon: '🚀', description: 'מתקדם/ת מהר יותר בקריירה, אבל נשרף/ת קל יותר' },
  { id: 'lazy', label: 'עצלן/ית', icon: '🛋️', description: 'צריך/ה פחות אנרגיה, אבל מתקדם/ת לאט יותר' },
  { id: 'social', label: 'חברותי/ת', icon: '🎉', description: 'קל לך למצוא חברים ובני/בנות זוג' },
  { id: 'introvert', label: 'מופנם/ת', icon: '📚', description: 'פחות אירועים חברתיים, יותר זמן ואנרגיה לעצמך' },
  { id: 'charismatic', label: 'כריזמטי/ת', icon: '✨', description: 'בונוס למוניטין ולקידום בעבודה' },
  { id: 'smart', label: 'חכם/ה', icon: '🧠', description: 'בונוס להצלחה בלימודים' },
  { id: 'funny', label: 'מצחיק/ה', icon: '😂', description: 'בונוס לאושר ולזוגיות' },
  { id: 'adventurous', label: 'הרפתקן/ית', icon: '🧭', description: 'פותח אפשרויות נדירות, אבל גם סיכונים' },
  { id: 'frugal', label: 'חסכן/ית', icon: '🪙', description: 'מוציא/ה פחות כסף מדי חודש' },
  { id: 'spender', label: 'בזבזן/ית', icon: '💸', description: 'אושר גבוה יותר מקניות, אבל חסכונות נמוכים' },
  { id: 'romantic', label: 'רומנטי/ת', icon: '💘', description: 'זוגיות מתקדמת מהר יותר' },
  { id: 'cynical', label: 'ציני/ת', icon: '🙄', description: 'פחות נפגע/ת מאכזבות, קשה יותר להתאהב' },
]

export const MAX_TRAITS = 3

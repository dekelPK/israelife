export type EducationPathId = 'university' | 'college' | 'vocational' | 'courses' | 'none'

export interface EducationPathDef {
  id: EducationPathId
  label: string
  durationYears: number
  yearlyCost: number
  degreeLevel: number
  description: string
}

export const EDUCATION_PATHS: EducationPathDef[] = [
  { id: 'university', label: 'אוניברסיטה', durationYears: 3, yearlyCost: 11000, degreeLevel: 1, description: 'תואר אקדמי, פותח דלתות לקריירות מתקדמות' },
  { id: 'college', label: 'מכללה', durationYears: 3, yearlyCost: 9000, degreeLevel: 1, description: 'תואר עם דגש מעשי' },
  { id: 'vocational', label: 'לימודים מקצועיים', durationYears: 1, yearlyCost: 6000, degreeLevel: 0, description: 'הסמכה מהירה למקצוע מעשי' },
  { id: 'courses', label: 'קורסים', durationYears: 0, yearlyCost: 3000, degreeLevel: 0, description: 'רכישת כישור ממוקד וקצר' },
  { id: 'none', label: 'לא ללמוד', durationYears: 0, yearlyCost: 0, degreeLevel: 0, description: 'לצאת ישר לשוק העבודה' },
]

export const EDUCATION_FIELDS = [
  { id: 'computerScience', label: 'מדעי המחשב' },
  { id: 'engineering', label: 'הנדסה' },
  { id: 'medicine', label: 'רפואה' },
  { id: 'law', label: 'משפטים' },
  { id: 'psychology', label: 'פסיכולוגיה' },
  { id: 'design', label: 'עיצוב' },
  { id: 'management', label: 'ניהול' },
  { id: 'education', label: 'חינוך' },
  { id: 'technical', label: 'מקצועות טכניים' },
]

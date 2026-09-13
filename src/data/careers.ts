export interface JobLevel {
  level: number
  title: string
  baseSalary: number
}

export interface CareerTrackDef {
  id: string
  label: string
  icon: string
  // fields that grant an entry bonus / higher starting level - not a hard gate,
  // so the game never forces one "correct" path.
  preferredFields?: string[]
  levels: JobLevel[]
}

export const CAREER_TRACKS: CareerTrackDef[] = [
  {
    id: 'service',
    label: 'שירות ומסעדנות',
    icon: '🍽️',
    levels: [
      { level: 1, title: 'מלצר/ית', baseSalary: 5300 },
      { level: 2, title: 'נציג/ת שירות', baseSalary: 6200 },
      { level: 3, title: 'מנהל/ת משמרת', baseSalary: 7800 },
      { level: 4, title: 'מנהל/ת סניף', baseSalary: 10500 },
      { level: 5, title: 'מנהל/ת אזור בכיר/ה', baseSalary: 15000 },
    ],
  },
  {
    id: 'tech',
    label: 'הייטק',
    icon: '💻',
    preferredFields: ['computerScience', 'engineering'],
    levels: [
      { level: 1, title: 'מפתח/ת ג׳וניור', baseSalary: 14000 },
      { level: 2, title: 'מפתח/ת', baseSalary: 19000 },
      { level: 3, title: 'מפתח/ת Senior', baseSalary: 27000 },
      { level: 4, title: 'Tech Lead', baseSalary: 34000 },
      { level: 5, title: 'מנהל/ת פיתוח', baseSalary: 42000 },
      { level: 6, title: 'VP / CTO', baseSalary: 60000 },
    ],
  },
  {
    id: 'office',
    label: 'ניהול ומנהלה',
    icon: '🏢',
    preferredFields: ['management', 'law', 'education', 'psychology', 'design'],
    levels: [
      { level: 1, title: 'עובד/ת זוטר/ה', baseSalary: 7500 },
      { level: 2, title: 'רכז/ת', baseSalary: 9500 },
      { level: 3, title: 'ראש/ת צוות', baseSalary: 13000 },
      { level: 4, title: 'מנהל/ת מחלקה', baseSalary: 19000 },
      { level: 5, title: 'סמנכ"ל/ית', baseSalary: 30000 },
    ],
  },
  {
    id: 'medicine',
    label: 'רפואה',
    icon: '🩺',
    preferredFields: ['medicine'],
    levels: [
      { level: 1, title: 'מתמחה/ת', baseSalary: 16000 },
      { level: 2, title: 'רופא/ה', baseSalary: 24000 },
      { level: 3, title: 'רופא/ה בכיר/ה', baseSalary: 34000 },
      { level: 4, title: 'מנהל/ת מחלקה', baseSalary: 45000 },
    ],
  },
  {
    id: 'entrepreneur',
    label: 'יזמות',
    icon: '🚀',
    levels: [
      { level: 1, title: 'יזם/ית עצמאי/ת', baseSalary: 4000 },
      { level: 2, title: 'מייסד/ת סטארטאפ', baseSalary: 8000 },
      { level: 3, title: 'מנכ"ל/ית לאחר גיוס', baseSalary: 22000 },
      { level: 4, title: 'מנכ"ל/ית לאחר אקזיט', baseSalary: 50000 },
    ],
  },
]

export function getTrack(trackId: string | null): CareerTrackDef | undefined {
  return CAREER_TRACKS.find((t) => t.id === trackId)
}

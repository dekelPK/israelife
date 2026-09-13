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
  {
    id: 'music',
    label: 'מוזיקה',
    icon: '🎤',
    preferredFields: ['design'],
    levels: [
      { level: 1, title: 'זמר/ת בפאבים', baseSalary: 2500 },
      { level: 2, title: 'אמן/ית עם פאנבייס', baseSalary: 6000 },
      { level: 3, title: 'כוכב/ת רדיו', baseSalary: 15000 },
      { level: 4, title: 'כוכב/ת ארצי/ת', baseSalary: 35000 },
      { level: 5, title: 'אייקון ישראלי', baseSalary: 80000 },
    ],
  },
  {
    id: 'theater',
    label: 'תיאטרון ומשחק',
    icon: '🎭',
    preferredFields: ['design'],
    levels: [
      { level: 1, title: 'שחקן/ית מתחיל/ה', baseSalary: 3500 },
      { level: 2, title: 'שחקן/ית תיאטרון', baseSalary: 7500 },
      { level: 3, title: 'שחקן/ית קולנוע וטלוויזיה', baseSalary: 16000 },
      { level: 4, title: 'כוכב/ת ישראלי/ת', baseSalary: 40000 },
    ],
  },
  {
    id: 'influencer',
    label: 'רשתות חברתיות',
    icon: '📱',
    levels: [
      { level: 1, title: 'יוצר/ת תוכן מתחיל/ה', baseSalary: 1500 },
      { level: 2, title: 'משפיען/ית', baseSalary: 5000 },
      { level: 3, title: 'משפיען/ית מוביל/ה', baseSalary: 18000 },
      { level: 4, title: 'סלב דיגיטלי', baseSalary: 45000 },
    ],
  },
  {
    id: 'fitness',
    label: 'כושר וספורט',
    icon: '🏋️',
    levels: [
      { level: 1, title: 'מדריך/ת כושר', baseSalary: 6500 },
      { level: 2, title: 'מאמן/ת אישי/ת מבוקש/ת', baseSalary: 11000 },
      { level: 3, title: 'יועץ/ת כושר לקבוצות ספורט', baseSalary: 19000 },
      { level: 4, title: 'פרשן/ית ספורט בטלוויזיה', baseSalary: 32000 },
    ],
  },
  {
    id: 'visualArt',
    label: 'אמנות פלסטית',
    icon: '🎨',
    preferredFields: ['design'],
    levels: [
      { level: 1, title: 'אמן/ית מתחיל/ה', baseSalary: 3000 },
      { level: 2, title: 'צייר/ת מוכר/ת', baseSalary: 8000 },
      { level: 3, title: 'אוצר/ת גלריה', baseSalary: 16000 },
      { level: 4, title: 'אמן/ית בעל/ת שם עולמי', baseSalary: 55000 },
    ],
  },
  {
    id: 'nature',
    label: 'טבע וסביבה',
    icon: '🌿',
    levels: [
      { level: 1, title: 'מדריך/ת טיולים', baseSalary: 5500 },
      { level: 2, title: 'מדריך/ת בשמורת טבע', baseSalary: 8500 },
      { level: 3, title: 'מנהל/ת שמורה', baseSalary: 15000 },
      { level: 4, title: 'חוקר/ת סביבה בכיר/ה', baseSalary: 26000 },
    ],
  },
  {
    id: 'culinary',
    label: 'בישול ומסעדנות',
    icon: '👨‍🍳',
    levels: [
      { level: 1, title: 'טבח/ית זוטר/ה', baseSalary: 6000 },
      { level: 2, title: 'שף/ית', baseSalary: 12000 },
      { level: 3, title: 'שף/ית בכיר/ה במסעדה יוקרתית', baseSalary: 22000 },
      { level: 4, title: 'בעל/ת מסעדה משלו/ה', baseSalary: 40000 },
    ],
  },
  {
    id: 'gaming',
    label: 'גיימינג וספורט אלקטרוני',
    icon: '🎮',
    levels: [
      { level: 1, title: 'גיימר/ית תחרותי/ת', baseSalary: 2000 },
      { level: 2, title: 'שחקן/ית מקצועי/ת בקבוצת eSports', baseSalary: 9000 },
      { level: 3, title: 'סטרימר/ית מוביל/ה', baseSalary: 20000 },
      { level: 4, title: 'מפתח/ת משחקים עצמאי/ת מצליח/ה', baseSalary: 38000 },
    ],
  },
  {
    id: 'writing',
    label: 'כתיבה ועיתונות',
    icon: '✍️',
    preferredFields: ['education'],
    levels: [
      { level: 1, title: 'כותב/ת בלוג', baseSalary: 3500 },
      { level: 2, title: 'עיתונאי/ת פרילנס', baseSalary: 8000 },
      { level: 3, title: 'סופר/ת מתפרסם/ת', baseSalary: 14000 },
      { level: 4, title: 'סופר/ת רב-מכר', baseSalary: 45000 },
    ],
  },
  {
    id: 'tourism',
    label: 'תיירות',
    icon: '✈️',
    levels: [
      { level: 1, title: 'מדריך/ת טיולים מתחיל/ה', baseSalary: 5500 },
      { level: 2, title: 'מדריך/ת טיולים מבוקש/ת', baseSalary: 9500 },
      { level: 3, title: 'מנהל/ת סוכנות נסיעות', baseSalary: 18000 },
      { level: 4, title: 'יזם/ית תיירות בינלאומי/ת', baseSalary: 34000 },
    ],
  },
]

export function getTrack(trackId: string | null): CareerTrackDef | undefined {
  return CAREER_TRACKS.find((t) => t.id === trackId)
}

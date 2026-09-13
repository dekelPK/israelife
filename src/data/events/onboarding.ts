import { EDUCATION_FIELDS, EDUCATION_PATHS } from '../../data/education'
import { startJob } from '../../engine/career'
import type { Choice, GameEvent } from '../../types'

export const onboardingEvents: GameEvent[] = [
  {
    id: 'origin_path',
    category: 'career',
    icon: '🧭',
    title: 'תחילת הדרך',
    once: true,
    minAge: 18,
    maxAge: 26,
    getText: () => 'סיימת תיכון וכל העתיד פתוח לפניך. מה הצעד הראשון שלך אחרי התיכון?',
    choices: [
      {
        id: 'army',
        text: '🎖️ להתגייס לצבא',
        effects: {
          stats: { skills: 10, reputation: 8, friends: 5, energy: -10 },
          xp: 30,
          flags: { servedArmy: true },
          scheduleEvent: { eventId: 'officer_track', inYears: 0 },
        },
        hidden: { hiddenStats: { stress: 8 } },
        custom: (state) => ({ character: { ...state.character, age: state.character.age + 3 } }),
      },
      {
        id: 'studies',
        text: '🎓 ללכת ללמוד',
        effects: {
          xp: 15,
          flags: { choseStudiesFirst: true },
          scheduleEvent: { eventId: 'choose_study_path', inYears: 0 },
        },
      },
      {
        id: 'work',
        text: '💼 לצאת ישר לעבודה',
        effects: {
          stats: { career: 5, money: 5 },
          xp: 15,
          flags: { startedWorkingEarly: true },
        },
        custom: (state) => ({ career: startJob(state, 'service', 1) }),
      },
    ],
  },
  {
    id: 'officer_track',
    category: 'career',
    icon: '⭐',
    title: 'מסלול פיקודי',
    once: true,
    getText: () => 'המפקדים שלך רואים בך פוטנציאל. מציעים לך להמשיך למסלול פיקוד או קורס מקצועי בצבא.',
    choices: [
      {
        id: 'command',
        text: 'לצאת לקורס קצינים',
        effects: {
          stats: { skills: 12, reputation: 12, energy: -15 },
          xp: 35,
          flags: { wasOfficer: true },
        },
        custom: (state) => ({ character: { ...state.character, age: state.character.age + 1 } }),
      },
      {
        id: 'technical',
        text: 'לעבור ליחידה טכנולוגית',
        effects: {
          stats: { skills: 15, education: 5 },
          xp: 25,
          flags: { hadTechUnit: true },
        },
      },
      {
        id: 'regular',
        text: 'להישאר בתפקיד הנוכחי עד השחרור',
        effects: { stats: { happiness: 5, friends: 5 }, xp: 15 },
      },
    ],
  },
  {
    id: 'choose_study_path',
    category: 'education',
    icon: '🎓',
    title: 'איזה מסלול לימודים?',
    once: true,
    getText: () => 'איפה תרצה/י ללמוד?',
    choices: EDUCATION_PATHS.filter((p) => p.id !== 'none').map(
      (path): Choice => ({
        id: path.id,
        text: `${path.label} — ${path.description}`,
        effects: {
          money: -path.yearlyCost,
          flags: { studyPath: path.id },
          scheduleEvent: { eventId: 'choose_field', inYears: 0 },
        },
      }),
    ),
  },
  {
    id: 'choose_field',
    category: 'education',
    icon: '📘',
    title: 'תחום לימודים',
    once: true,
    getText: () => 'באיזה תחום תרצה/י להתמקד?',
    choices: EDUCATION_FIELDS.map(
      (field): Choice => ({
        id: field.id,
        text: field.label,
        effects: {
          stats: { education: 10 },
          xp: 20,
          flags: { studyField: field.id },
        },
        custom: (state) => {
          const path = EDUCATION_PATHS.find((p) => p.id === state.flags.studyPath) ?? EDUCATION_PATHS[0]
          return {
            education: {
              path: path.id,
              field: field.id,
              status: 'inProgress',
              degreeLevel: 0,
            },
            scheduledEvents: [
              ...state.scheduledEvents,
              { eventId: 'study_temptation', triggerYear: state.year + Math.max(1, Math.floor(path.durationYears / 2)) },
              { eventId: 'graduation', triggerYear: state.year + Math.max(1, path.durationYears) },
            ],
          }
        },
      }),
    ),
  },
  {
    id: 'study_temptation',
    category: 'education',
    icon: '🎉',
    title: 'מסיבה בקמפוס',
    condition: (state) => state.education.status === 'inProgress',
    getText: () => 'יש מסיבת ענק הערב לפני שבוע מבחנים. כולם הולכים.',
    choices: [
      {
        id: 'study',
        text: 'להישאר וללמוד',
        effects: { stats: { education: 8, energy: -5 }, xp: 15 },
      },
      {
        id: 'party',
        text: 'לצאת לבלות',
        effects: { stats: { happiness: 10, friends: 8, energy: -10 }, xp: 10 },
        hidden: { stats: { education: -5 } },
      },
    ],
  },
  {
    id: 'graduation',
    category: 'education',
    icon: '🎓',
    title: 'סיום לימודים',
    condition: (state) => state.education.status === 'inProgress',
    getText: (state) => `הגיע הרגע — סיימת את לימודי ה${state.education.field ?? ''}.`,
    choices: [
      {
        id: 'excel',
        text: 'הצלחת לסיים בהצטיינות',
        effects: { stats: { education: 20, skills: 10, reputation: 8 }, xp: 60 },
        custom: (state) => ({ education: { ...state.education, status: 'graduated', degreeLevel: 1 } }),
      },
      {
        id: 'pass',
        text: 'סיימת בול בזמן, לא יותר לא פחות',
        effects: { stats: { education: 12 }, xp: 40 },
        custom: (state) => ({ education: { ...state.education, status: 'graduated', degreeLevel: 1 } }),
      },
      {
        id: 'dropout',
        text: 'להיות כנה/ה עם עצמך — זה לא בשבילך, לפרוש עכשיו',
        effects: { stats: { education: -5, happiness: 5 }, xp: 10 },
        custom: (state) => ({ education: { ...state.education, status: 'droppedOut' } }),
      },
    ],
  },
]

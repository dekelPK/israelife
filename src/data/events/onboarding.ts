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
        outcome: 'שלוש שנים של אימונים, חברויות שיישארו לכל החיים, ולפעמים גם רגעים מפחידים. יצאת עם כישורים ותעודת שחרור ביד.',
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
        outcome:
          'החלטת להשקיע קודם בהשכלה במקום להתגייס. יש כאלה שמבינים לגמרי, ויש כאלה - כולל קרובי משפחה - שלא מפסיקים לשאול "ולמה בעצם לא?"',
        effects: {
          stats: { reputation: -18 },
          xp: 15,
          flags: { choseStudiesFirst: true },
          scheduleEvent: { eventId: 'choose_study_path', inYears: 0 },
        },
      },
      {
        id: 'work',
        text: '💼 לצאת ישר לעבודה',
        outcome:
          'ויתרת על עוד כמה שנים בספסל הלימודים - ועל הצבא - ויצאת ישר לשוק העבודה. פחות תארים ופחות "איפה שירתת", יותר ניסיון מעשי.',
        effects: {
          stats: { career: 5, money: 5, reputation: -18 },
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
        outcome: 'קורס הקצינים היה מפרך, אבל יצאת ממנו עם דרגות על הכתף וביטחון עצמי שלא היה לך קודם.',
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
        outcome: 'למדת מקצוע אמיתי בין המחשבים, ניסיון שכבר עכשיו נראה שווה יותר מכל קורס אזרחי.',
        effects: {
          stats: { skills: 15, education: 5 },
          xp: 25,
          flags: { hadTechUnit: true },
        },
      },
      {
        id: 'regular',
        text: 'להישאר בתפקיד הנוכחי עד השחרור',
        outcome: 'ויתרת על הקידום ופשוט ספרת ימים עד השחרור, עם החברים שכבר הכרת.',
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
    maxAge: 45,
    weight: 0.6,
    condition: (state) => state.education.status !== 'inProgress',
    getText: (state) =>
      state.flags.servedArmy
        ? 'אחרי הצבא, את/ה מרגיש/ה שזה הזמן ללמוד משהו. איפה תרצה/י ללמוד?'
        : 'עולה בך הרצון ללמוד משהו חדש ברצינות. איפה תרצה/י ללמוד?',
    choices: EDUCATION_PATHS.filter((p) => p.id !== 'none').map(
      (path): Choice => ({
        id: path.id,
        text: `${path.label} — ${path.description}`,
        outcome: `נרשמת ל${path.label}. עכשיו צריך לבחור תחום.`,
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
        outcome: `בחרת להתמקד ב${field.label}. השנים הקרובות יעברו בין הרצאות, מטלות ותרגילי בית.`,
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
        outcome: 'ויתרת על הבילוי והישארת מול הספרים. מרגיש/ה משעמם, אבל בטוח/ה יותר לקראת המבחן.',
        effects: { stats: { education: 8, energy: -5 }, xp: 15 },
      },
      {
        id: 'party',
        text: 'לצאת לבלות',
        outcome: 'המסיבה הייתה בלתי נשכחת. רק בבוקר, עם הראש הכבד, תזכיר/י לעצמך שיש מבחן השבוע.',
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
    getText: (state) => {
      const fieldLabel = EDUCATION_FIELDS.find((f) => f.id === state.education.field)?.label ?? ''
      return `הגיע הרגע — סיימת את לימודי ה${fieldLabel}.`
    },
    choices: [
      {
        id: 'excel',
        text: 'הצלחת לסיים בהצטיינות',
        outcome: 'הריצה האחרונה השתלמה — סיימת עם תעודה מהודרת ותחושה שכל הלילות ההם היו שווים את זה.',
        effects: { stats: { education: 20, skills: 10, reputation: 8 }, xp: 60 },
        custom: (state) => ({ education: { ...state.education, status: 'graduated', degreeLevel: 1 } }),
      },
      {
        id: 'pass',
        text: 'סיימת בול בזמן, לא יותר לא פחות',
        outcome: 'לא הצטיינות, אבל תעודה ביד וחוויה שלמה. עכשיו אפשר סוף סוף לצאת לעבוד.',
        effects: { stats: { education: 12 }, xp: 40 },
        custom: (state) => ({ education: { ...state.education, status: 'graduated', degreeLevel: 1 } }),
      },
      {
        id: 'dropout',
        text: 'להיות כנה/ה עם עצמך — זה לא בשבילך, לפרוש עכשיו',
        outcome: 'זה לא היה קל להודות בזה, אבל הרגשת הקלה ברגע שהחלטת לפרוש ולחפש כיוון אחר.',
        effects: { stats: { education: -5, happiness: 5 }, xp: 10 },
        custom: (state) => ({ education: { ...state.education, status: 'droppedOut' } }),
      },
    ],
  },
]

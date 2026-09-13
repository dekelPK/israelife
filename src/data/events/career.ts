import { CAREER_TRACKS, salaryFor, startJob } from '../../engine/career'
import type { Choice, GameEvent } from '../../types'

export const careerEvents: GameEvent[] = [
  {
    id: 'first_job_search',
    category: 'career',
    icon: '💼',
    title: 'לצאת לשוק העבודה',
    minAge: 19,
    weight: 4,
    condition: (state) => state.career.unemployed && state.education.status !== 'inProgress',
    getText: (state) =>
      state.flags.hadFirstJob
        ? 'אחרי תקופה ללא עבודה, הגיע הזמן למצוא משהו חדש.'
        : state.education.degreeLevel >= 1
          ? 'סיימת את הלימודים, הגיע הזמן למצוא עבודה ראשונה בתחום.'
          : 'הגיע הזמן למצוא עבודה ראשונה.',
    choices: (state) => {
      const preferredTrack = CAREER_TRACKS.find((t) => t.preferredFields?.includes(state.education.field ?? ''))
      const options: Choice[] = [
        {
          id: 'service',
          text: '🍽️ עבודה בשירות/מסעדנות',
          effects: { stats: { career: 5, money: 3 }, xp: 20, flags: { hadFirstJob: true } },
          custom: (s) => ({ career: startJob(s, 'service', 1) }),
        },
        {
          id: 'office',
          text: '🏢 עבודה במנהלה/ניהול',
          effects: { stats: { career: 6, money: 4 }, xp: 20, flags: { hadFirstJob: true } },
          custom: (s) => ({ career: startJob(s, 'office', 1) }),
        },
      ]
      if (preferredTrack && preferredTrack.id !== 'service' && preferredTrack.id !== 'office') {
        options.push({
          id: preferredTrack.id,
          text: `${preferredTrack.icon} עבודה בתחום ${preferredTrack.label}`,
          effects: { stats: { career: 10, money: 6, education: 3 }, xp: 30, flags: { hadFirstJob: true } },
          custom: (s) => ({ career: startJob(s, preferredTrack.id, 1) }),
        })
      }
      return options
    },
  },
  {
    id: 'competitor_offer',
    category: 'career',
    icon: '📨',
    title: 'הצעת עבודה מחברה מתחרה',
    condition: (state) => !state.career.unemployed && state.career.yearsInRole >= 1,
    weight: (state) => (state.stats.career > 55 ? 3 : 1),
    getText: () => 'קיבלת הצעת עבודה מחברה מתחרה עם שכר גבוה יותר.',
    choices: [
      {
        id: 'stay',
        text: 'להישאר במקום הנוכחי',
        effects: { stats: { happiness: 3, reputation: 2 }, xp: 10 },
      },
      {
        id: 'negotiate',
        text: 'להשתמש בהצעה כדי לדרוש העלאה',
        effects: { stats: { money: 4, career: 2 }, xp: 15 },
        hidden: { hiddenStats: { stress: 5 } },
        custom: (state) => ({ career: { ...state.career, salary: Math.round(state.career.salary * 1.12) } }),
      },
      {
        id: 'switch',
        text: 'לעבור לחברה החדשה',
        effects: { stats: { money: 8, career: 4, happiness: -3, friends: -4 }, xp: 25 },
        custom: (state) => ({
          career: { ...state.career, salary: Math.round(state.career.salary * 1.2), yearsInRole: 0 },
        }),
      },
    ],
  },
  {
    id: 'startup_idea',
    category: 'career',
    icon: '🚀',
    title: 'רעיון לסטארטאפ',
    once: true,
    minAge: 23,
    maxAge: 38,
    condition: (state) => !state.career.unemployed,
    weight: (state) => (state.character.traits.includes('adventurous') || state.character.traits.includes('ambitious') ? 2 : 0.7),
    getText: () => 'יש לך רעיון שאתה/את בטוח/ה שיכול לשנות עולם. זה הרגע להקים סטארטאפ, או שזה סיכון גדול מדי?',
    choices: [
      {
        id: 'stay_safe',
        text: 'להישאר בעבודה הבטוחה',
        effects: { stats: { happiness: 2 }, xp: 10 },
      },
      {
        id: 'jump',
        text: 'לעזוב הכל ולהקים את הסטארטאפ',
        effects: {
          stats: { career: 5, happiness: 8, money: -10, energy: -10 },
          xp: 50,
          flags: { ranStartup: true, startupStartAge: 0 },
          scheduleEvent: { eventId: 'startup_outcome', inYears: 3 },
        },
        hidden: { hiddenStats: { stress: 15 } },
        custom: (state) => ({
          career: startJob(state, 'entrepreneur', 1),
          flags: { ...state.flags, startupStartAge: state.character.age },
        }),
      },
    ],
  },
  {
    id: 'startup_outcome',
    category: 'career',
    icon: '📈',
    title: 'שלוש שנים אחר כך...',
    condition: (state) => state.flags.ranStartup === true,
    getText: (state) =>
      `לפני שלוש שנים, בגיל ${state.flags.startupStartAge}, עזבת הכל כדי להקים סטארטאפ. הגיע רגע האמת.`,
    choices: [
      {
        id: 'exit',
        text: 'לגייס השקעה ולנסות להמשיך לצמוח',
        effects: { stats: { career: 20, money: 15, reputation: 15, energy: -10 }, xp: 60 },
        custom: (state) => ({ career: startJob(state, 'entrepreneur', 3) }),
      },
      {
        id: 'shutdown',
        text: 'לסגור את החברה ולחזור לשוק העבודה',
        effects: { stats: { career: -10, happiness: -8, money: -5 }, xp: 20 },
        custom: (state) => ({ career: { ...state.career, unemployed: true, trackId: null, jobId: null, title: 'ללא תעסוקה', salary: 0 } }),
      },
    ],
  },
  {
    id: 'layoffs',
    category: 'career',
    icon: '📉',
    title: 'פיטורים בחברה',
    condition: (state) => !state.career.unemployed && state.career.trackId !== 'entrepreneur',
    weight: 0.6,
    getText: () => 'החברה שבה את/ה עובד/ת נקלעה לקשיים כלכליים ומבצעת פיטורים.',
    choices: [
      {
        id: 'accept',
        text: 'לקבל את הפיטורים ולחפש הלאה',
        effects: { stats: { happiness: -10, career: -8, money: -5 }, xp: 15 },
        custom: () => ({ career: { unemployed: true, trackId: null, jobId: null, title: 'ללא תעסוקה', level: 0, salary: 0, yearsInRole: 0 } }),
      },
      {
        id: 'fight',
        text: 'להילחם על המקום שלך ולהציע רעיונות לחיסכון',
        effects: { stats: { career: 5, reputation: 8, energy: -10 }, xp: 25 },
        hidden: { hiddenStats: { luck: 5 } },
      },
    ],
  },
  {
    id: 'ask_for_raise',
    category: 'career',
    icon: '🗣️',
    title: 'לבקש העלאה?',
    condition: (state) => !state.career.unemployed && state.career.yearsInRole >= 2,
    weight: 1.2,
    getText: () => 'עברו שנתיים בתפקיד ואת/ה מרגיש/ה שמגיע לך יותר.',
    choices: [
      {
        id: 'ask',
        text: 'לבקש פגישה עם המנהל/ת ולדרוש העלאה',
        effects: { stats: { money: 6, career: 2 }, xp: 20 },
        custom: (state) => ({ career: { ...state.career, salary: Math.round(state.career.salary * 1.08) } }),
      },
      {
        id: 'wait',
        text: 'לחכות לזמן מתאים יותר',
        effects: { stats: { happiness: 1 }, xp: 5 },
      },
    ],
  },
]

export { salaryFor }

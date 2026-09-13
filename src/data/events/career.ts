import { CAREER_TRACKS, salaryFor, startJob } from '../../engine/career'
import type { Choice, GameEvent } from '../../types'

export const careerEvents: GameEvent[] = [
  {
    id: 'first_job_search',
    category: 'career',
    icon: '💼',
    title: 'לצאת לשוק העבודה',
    minAge: 19,
    maxAge: 67,
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
          outcome: 'התחלת לעבוד בשירות. זו לא הקריירה שחלמת עליה, אבל זו התחלה, ויש בה גם לא מעט אנשים מעניינים.',
          effects: { stats: { career: 5, money: 3 }, xp: 20, flags: { hadFirstJob: true } },
          custom: (s) => ({ career: startJob(s, 'service', 1) }),
        },
        {
          id: 'office',
          text: '🏢 עבודה במנהלה/ניהול',
          outcome: 'מצאת עבודה משרדית סבירה. לא מרגשת במיוחד, אבל יציבה ונותנת נקודת פתיחה.',
          effects: { stats: { career: 6, money: 4 }, xp: 20, flags: { hadFirstJob: true } },
          custom: (s) => ({ career: startJob(s, 'office', 1) }),
        },
      ]
      if (preferredTrack && preferredTrack.id !== 'service' && preferredTrack.id !== 'office') {
        options.push({
          id: preferredTrack.id,
          text: `${preferredTrack.icon} עבודה בתחום ${preferredTrack.label}`,
          outcome: `כל הלימודים השתלמו — מצאת משרה ראשונה ממש בתחום ${preferredTrack.label}.`,
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
    maxAge: 67,
    condition: (state) => !state.career.unemployed && state.career.yearsInRole >= 1,
    weight: (state) => (state.stats.career > 55 ? 3 : 1),
    getText: () => 'קיבלת הצעת עבודה מחברה מתחרה עם שכר גבוה יותר.',
    choices: [
      {
        id: 'stay',
        text: 'להישאר במקום הנוכחי',
        outcome: 'סירבת להצעה. יש בזה משהו נעים — אתה/את יודע/ת בדיוק למה נאמנ/ה.',
        effects: { stats: { happiness: 3, reputation: 2 }, xp: 10 },
      },
      {
        id: 'negotiate',
        text: 'להשתמש בהצעה כדי לדרוש העלאה',
        outcome: 'הצגת את ההצעה למנהל/ת שלך כקלף מיקוח. זה עבד — קיבלת העלאה, אבל האווירה במשרד הפכה קצת מתוחה.',
        effects: { stats: { money: 4, career: 2 }, xp: 15 },
        hidden: { hiddenStats: { stress: 5 } },
        custom: (state) => ({ career: { ...state.career, salary: Math.round(state.career.salary * 1.12) } }),
      },
      {
        id: 'switch',
        text: 'לעבור לחברה החדשה',
        outcome: 'עזבת למקום החדש. השכר עלה משמעותית, אבל התגעגעת לחברים מהעבודה הקודמת.',
        effects: { stats: { money: 8, career: 4, happiness: -3, friends: -4 }, xp: 25 },
        custom: (state) => ({
          career: { ...state.career, salary: Math.round(state.career.salary * 1.2), yearsInRole: 0 },
        }),
        chance: [
          { weight: 0.6, outcome: 'המקום החדש הסתדר בדיוק כמו שקיוויתם.' },
          {
            weight: 0.4,
            outcome: 'אחרי כמה חודשים הבנת שהמצגת של המקום הזה בראיון הייתה הרבה יותר יפה מהמציאות.',
            effects: { stats: { happiness: -6, career: -3 } },
          },
        ],
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
        outcome: 'החלטת לא לקחת את הסיכון. הרעיון עדיין מציק לך מדי פעם, אבל השקט הכלכלי שווה את זה.',
        effects: { stats: { happiness: 2 }, xp: 10 },
      },
      {
        id: 'jump',
        text: 'לעזוב הכל ולהקים את הסטארטאפ',
        outcome: 'עזבת הכל וקפצת למים העמוקים. הימים ארוכים, הלחץ אמיתי, אבל בפעם הראשונה מזמן אתה/את בונה/ת משהו שלך.',
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
        outcome: 'הסטארטאפ שרד ואפילו גייס השקעה. עוד לא אקזיט, אבל את/ה סוף סוף מנכ"ל/ית של חברה אמיתית.',
        effects: { stats: { career: 20, money: 15, reputation: 15, energy: -10 }, xp: 60 },
        custom: (state) => ({ career: startJob(state, 'entrepreneur', 3) }),
      },
      {
        id: 'shutdown',
        text: 'לסגור את החברה ולחזור לשוק העבודה',
        outcome: 'הכסף נגמר לפני החלום. סגרת את החברה בכאב לב, אבל יוצא/ת מזה עם ניסיון שאף קורס לא היה יכול לתת.',
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
    maxAge: 67,
    condition: (state) => !state.career.unemployed && state.career.trackId !== 'entrepreneur',
    weight: 0.6,
    getText: () => 'החברה שבה את/ה עובד/ת נקלעה לקשיים כלכליים ומבצעת פיטורים.',
    choices: [
      {
        id: 'accept',
        text: 'לקבל את הפיטורים ולחפש הלאה',
        outcome: 'קיבלת מכתב פיטורים. זה מכה קשה, אבל את/ה כבר מתחיל/ה לשלוח קורות חיים.',
        effects: { stats: { happiness: -10, career: -8, money: -5 }, xp: 15 },
        custom: () => ({ career: { unemployed: true, trackId: null, jobId: null, title: 'ללא תעסוקה', level: 0, salary: 0, yearsInRole: 0 } }),
      },
      {
        id: 'fight',
        text: 'להילחם על המקום שלך ולהציע רעיונות לחיסכון',
        outcome: 'נלחמת על המקום שלך והצעת פתרונות. זה עבד — נשארת, אבל השבועות האלה לקחו ממך המון אנרגיה.',
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
    maxAge: 65,
    condition: (state) => !state.career.unemployed && state.career.yearsInRole >= 2,
    weight: 1.2,
    getText: () => 'עברו שנתיים בתפקיד ואת/ה מרגיש/ה שמגיע לך יותר.',
    choices: [
      {
        id: 'ask',
        text: 'לבקש פגישה עם המנהל/ת ולדרוש העלאה',
        outcome: 'נכנסת לפגישה עם בטחון, הצגת את התרומה שלך — ויצאת עם תלוש משכורת שמח יותר.',
        effects: { stats: { money: 6, career: 2 }, xp: 20 },
        custom: (state) => ({ career: { ...state.career, salary: Math.round(state.career.salary * 1.08) } }),
      },
      {
        id: 'wait',
        text: 'לחכות לזמן מתאים יותר',
        outcome: 'החלטת לא לדחוף עכשיו. השיחה עוד תבוא, פשוט לא היום.',
        effects: { stats: { happiness: 1 }, xp: 5 },
      },
    ],
  },
  {
    id: 'mentor_offer',
    category: 'career',
    icon: '🧑‍🏫',
    title: 'הצעה לחניכה',
    maxAge: 65,
    condition: (state) => !state.career.unemployed && state.stats.career >= 40,
    weight: 0.8,
    getText: () => 'עובד/ת חדש/ה במקום העבודה ביקש/ה שתהיה/י המנטור/ית שלה. זה זמן, אבל גם הזדמנות.',
    choices: [
      {
        id: 'mentor',
        text: 'להסכים ולהשקיע בחניכה',
        outcome: 'הפכת למנטור/ית טוב/ה, ולא רק החניכה שלך למדה משהו — גם אתה/את הבנת דברים חדשים על עצמך.',
        effects: { stats: { reputation: 6, skills: 4, happiness: 3, energy: -5 }, xp: 25 },
      },
      {
        id: 'decline',
        text: 'להתמקד בעבודה שלך ולסרב',
        outcome: 'סירבת בנימוס. יש לך מספיק על הראש כרגע, וזה בסדר גמור.',
        effects: { stats: { energy: 2 }, xp: 5 },
      },
    ],
  },
  {
    id: 'remote_work_offer',
    category: 'career',
    icon: '🏡',
    title: 'אפשרות לעבודה היברידית',
    once: true,
    maxAge: 65,
    condition: (state) => !state.career.unemployed && state.career.trackId !== 'service',
    weight: 0.7,
    getText: () => 'החברה מאפשרת לעובדים לעבור למודל עבודה היברידי — חלק מהבית, חלק מהמשרד.',
    choices: [
      {
        id: 'hybrid',
        text: 'לעבור למודל היברידי',
        outcome: 'המעבר לעבודה היברידית שינה את חיי היומיום שלך — פחות זמן בפקקים, יותר זמן לעצמך.',
        effects: { stats: { happiness: 6, energy: 5, money: 2 }, xp: 15 },
      },
      {
        id: 'office',
        text: 'להישאר במשרד באופן קבוע',
        outcome: 'העדפת להישאר במשרד — האינטראקציה עם הצוות חשובה לך יותר מהנוחות.',
        effects: { stats: { friends: 3, career: 2 }, xp: 10 },
      },
    ],
  },
  {
    id: 'career_switch',
    category: 'career',
    icon: '🔄',
    title: 'לשנות כיוון מקצועי?',
    maxAge: 60,
    condition: (state) => !state.career.unemployed && state.career.yearsInRole >= 3,
    weight: 0.5,
    getText: () => 'את/ה מרגיש/ה שהגיע הזמן לנסות משהו אחר לגמרי במקצוע. אף פעם לא מאוחר מדי להתחיל מחדש.',
    choices: (state) => {
      const others = CAREER_TRACKS.filter((t) => t.id !== state.career.trackId)
      const offset = state.year % others.length
      const picks = [others[offset], others[(offset + 1) % others.length], others[(offset + 2) % others.length]]
      const options: Choice[] = picks
        .filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i)
        .map((track) => ({
          id: `switch_${track.id}`,
          text: `${track.icon} לעבור לתחום ${track.label}`,
          outcome: `עזבת הכל והתחלת מהתחלה בתחום ${track.label}. מפחיד, אבל גם מרענן להיות שוב ג׳וניור.`,
          effects: { stats: { career: -5, happiness: 5, energy: -8 }, xp: 25 },
          custom: (s) => ({ career: startJob(s, track.id, 1) }),
        }))
      options.push({
        id: 'stay',
        text: 'להישאר במקום הנוכחי',
        outcome: 'המחשבה חלפה, אבל החלטת שהיציבה שיש לך כרגע שווה יותר מההרפתקה.',
        effects: { stats: { happiness: 1 }, xp: 10 },
      })
      return options
    },
  },
  {
    id: 'tech_layoff_wave',
    category: 'career',
    icon: '📉',
    title: 'גל פיטורים בהייטק',
    condition: (state) => state.career.trackId === 'tech',
    weight: 0.6,
    maxAge: 67,
    getText: () => 'גל פיטורים גדול עובר על כל תעשיית ההייטק, וגם החברה שלך מכריזה על צמצומים.',
    choices: [
      {
        id: 'hope',
        text: 'לקוות שהסבב הזה יעבור אותך',
        outcome: 'ישבת בחרדה שקטה בזמן שהודעות פיטורים יצאו למחלקות שונות.',
        effects: { stats: { happiness: -6, energy: -5 }, xp: 15 },
        chance: [
          { weight: 0.6, outcome: 'שמך לא היה ברשימה. הקלה גדולה, גם אם מהולה באשמת הניצולים.' },
          {
            weight: 0.4,
            outcome: 'הפעם זה היה שמך. פיטורים בזום, חמש דקות, ותודה על התרומה.',
            effects: { stats: { career: -10, money: -3 } },
            custom: () => ({
              career: { unemployed: true, trackId: null, jobId: null, title: 'ללא תעסוקה', level: 0, salary: 0, yearsInRole: 0 },
            }),
          },
        ],
      },
      {
        id: 'network',
        text: 'להתחיל כבר עכשיו לחפש ברשת אבטחה',
        outcome: 'עדכנת קורות חיים ופנית לכמה מכרים בתעשייה, ליתר ביטחון.',
        effects: { stats: { career: 2, energy: -5 }, xp: 20 },
      },
    ],
  },
  {
    id: 'medical_emergency_shift',
    category: 'career',
    icon: '🚑',
    title: 'משמרת חירום קשה',
    condition: (state) => state.career.trackId === 'medicine',
    weight: 0.8,
    getText: () => 'משמרת לילה בחדר מיון הופכת למרוץ נגד הזמן. חייל את החלטות שיכולות להציל או לא להציל חיים.',
    choices: [
      {
        id: 'push_through',
        text: 'לתת את כל מה שיש, גם על חשבון עצמך',
        outcome: 'יצאת מהמשמרת אחרי 16 שעות, רועד/ת מעייפות אבל בטוח/ה שעשית כל מה שיכולת.',
        effects: { stats: { career: 6, reputation: 5, energy: -20, happiness: -3 }, xp: 30 },
        hidden: { hiddenStats: { stress: 15 } },
      },
      {
        id: 'delegate',
        text: 'להעביר חלק מהמקרים לצוות ולשמור על עצמך',
        outcome: 'חילקת את העומס בין הצוות. פחות גיבורי/ת-על, יותר בר-קיימא לטווח הארוך.',
        effects: { stats: { career: 2, energy: -8 }, xp: 20 },
      },
    ],
  },
  {
    id: 'difficult_customer',
    category: 'career',
    icon: '😤',
    title: 'לקוח קשה במיוחד',
    condition: (state) => state.career.trackId === 'service',
    weight: 0.8,
    getText: () => 'לקוח מתלונן בקול רם על כל דבר אפשרי, והתור מאחוריו מתחיל להתעצבן.',
    choices: [
      {
        id: 'stay_calm',
        text: 'להישאר רגוע/ה ומקצועי/ת',
        outcome: 'שמרת על חיוך מנומס עד שהוא הלך, בעוד שבפנים רצית לצרוח.',
        effects: { stats: { energy: -8, career: 3 }, xp: 15 },
      },
      {
        id: 'stand_up',
        text: 'לעמוד על שלך ולא לוותר',
        outcome: 'אמרת בנימוס אבל בתקיפות שזה מספיק.',
        effects: { stats: { happiness: 3 }, xp: 15 },
        chance: [
          { weight: 0.6, outcome: 'הלקוח נרגע והתנצל בסוף. אפילו השאיר טיפ.', effects: { stats: { money: 2 } } },
          {
            weight: 0.4,
            outcome: 'הלקוח התלונן למנהל/ת עליך, וקיבלת נזיפה למרות שהיית בסדר גמור.',
            effects: { stats: { career: -5, happiness: -5 } },
          },
        ],
      },
    ],
  },
  {
    id: 'office_reorg',
    category: 'career',
    icon: '🗂️',
    title: 'ריאורגון בחברה',
    condition: (state) => state.career.trackId === 'office',
    weight: 0.6,
    getText: () => 'הנהלת החברה מכריזה על מבנה ארגוני חדש. תפקידים מתחלפים, מנהלים מתחלפים, ואף אחד לא ממש יודע מה קורה.',
    choices: [
      {
        id: 'embrace',
        text: 'לאמץ את השינוי ולהתנדב לתפקיד חדש',
        outcome: 'קפצת קדימה כשכולם היססו. זה סיכון, אבל גם הזדמנות בולטת.',
        effects: { stats: { career: 8, energy: -8 }, xp: 25 },
      },
      {
        id: 'wait_and_see',
        text: 'לחכות ולראות איך הדברים מתיישבים',
        outcome: 'שמרת על ראש נמוך עד שהאבק שקע. גישה בטוחה, אם לא הכי נועזת.',
        effects: { stats: { happiness: 1 }, xp: 10 },
      },
    ],
  },
]

export { salaryFor }

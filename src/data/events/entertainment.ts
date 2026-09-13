import { startJob } from '../../engine/career'
import type { GameEvent } from '../../types'

export const entertainmentEvents: GameEvent[] = [
  {
    id: 'creative_calling',
    category: 'career',
    icon: '🎤',
    title: 'הקריאה של האמנות',
    once: true,
    minAge: 18,
    maxAge: 30,
    condition: (state) => state.career.unemployed,
    weight: (state) => {
      let w = 0.8
      if (state.character.interests.includes('מוזיקה') || state.character.interests.includes('אמנות')) w += 1.4
      if (state.character.traits.includes('charismatic') || state.character.traits.includes('funny')) w += 0.8
      return w
    },
    getText: () => 'תמיד היה לך חלום להופיע על במה או מול מצלמה. זה הרגע להחליט אם לרדוף אחריו, או ללכת על משהו בטוח יותר.',
    choices: [
      {
        id: 'music',
        text: '🎤 לנסות את מזלך במוזיקה',
        outcome: 'הופעת בפעם הראשונה בפאב קטן בתל אביב. שלושה אנשים מחאו כפיים - אבל זו התחלה.',
        effects: { stats: { happiness: 8, career: 3 }, xp: 25, flags: { hadFirstJob: true } },
        custom: (state) => ({ career: startJob(state, 'music', 1) }),
      },
      {
        id: 'theater',
        text: '🎭 ללכת לאודישנים לתיאטרון',
        outcome: 'עברת אודישן ראשון וקיבלת תפקיד קטן בהצגה. הבמה מרגישה כמו בית.',
        effects: { stats: { happiness: 8, career: 3, skills: 3 }, xp: 25, flags: { hadFirstJob: true } },
        custom: (state) => ({ career: startJob(state, 'theater', 1) }),
      },
      {
        id: 'influencer',
        text: '📱 להתחיל ליצור תוכן ברשתות',
        outcome: 'העלית את הסרטון הראשון שלך. הוא לא התפוצץ, אבל קיבלת כמה תגובות מעודדות.',
        effects: { stats: { happiness: 5, career: 2 }, xp: 20, flags: { hadFirstJob: true } },
        custom: (state) => ({ career: startJob(state, 'influencer', 1) }),
      },
      {
        id: 'safe',
        text: 'להשאיר את זה כחלום ולבחור משהו בטוח',
        outcome: 'החלטת שזה הזמן להיות מציאותי/ת. אולי בעתיד יהיה זמן לחלום הזה.',
        effects: { stats: { happiness: -1 }, xp: 10 },
      },
    ],
  },
  {
    id: 'viral_hit',
    category: 'career',
    icon: '🔥',
    title: 'התוכן שלך מתפוצץ',
    condition: (state) => state.career.trackId === 'influencer',
    weight: 1,
    getText: () => 'אחד הפוסטים שלך התפוצץ לגמרי - מיליוני צפיות תוך יום.',
    choices: [
      {
        id: 'capitalize',
        text: 'לרכוב על הגל - שיתופי פעולה ופרסומות',
        outcome: 'הטלפון לא הפסיק לצלצל עם הצעות. הפכת פתאום למישהו שמותגים רוצים לעבוד איתו/ה.',
        effects: { stats: { money: 10, career: 8, reputation: 6, energy: -8 }, xp: 30 },
        custom: (state) => ({ career: { ...state.career, salary: Math.round(state.career.salary * 1.5) } }),
      },
      {
        id: 'stay_grounded',
        text: 'להישאר עם הרגליים על הקרקע',
        outcome: 'נהנית מהרגע בלי לתת לו לשנות אותך יותר מדי. זה בריא, גם אם פחות משתלם כלכלית.',
        effects: { stats: { happiness: 5, friends: 3 }, xp: 15 },
      },
    ],
  },
  {
    id: 'bad_review',
    category: 'career',
    icon: '📰',
    title: 'ביקורת קטלנית',
    condition: (state) => state.career.trackId === 'theater' || state.career.trackId === 'music',
    weight: 0.8,
    getText: () => 'מבקר/ת ידוע/ה פרסם/ה ביקורת קשה במיוחד על ההופעה/הופעה האחרונה שלך.',
    choices: [
      {
        id: 'shake_off',
        text: 'להתעלם ולהמשיך ליצור',
        outcome: 'קראת את זה פעם אחת ובחרת לא לתת לזה לשבור אותך. יש עוד המון עבודה לעשות.',
        effects: { stats: { happiness: -3, career: 2 }, xp: 20 },
      },
      {
        id: 'spiral',
        text: 'לקרוא את זה שוב ושוב',
        outcome: 'המילים נתקעו לך בראש הרבה יותר זמן ממה שהיה צריך.',
        effects: { stats: { happiness: -8, energy: -5 }, xp: 10 },
        hidden: { hiddenStats: { stress: 10 } },
      },
    ],
  },
  {
    id: 'record_deal',
    category: 'career',
    icon: '💿',
    title: 'הצעת חוזה מחברת תקליטים',
    once: true,
    condition: (state) => state.career.trackId === 'music' && state.career.level >= 2,
    weight: 1.2,
    getText: () => 'חברת תקליטים גדולה מציעה לך חוזה הקלטות. האותיות הקטנות פחות נוחות ממה שציפית.',
    choices: [
      {
        id: 'sign',
        text: 'לחתום ולהתקדם מהר',
        outcome: 'חתמת על החוזה. הקריירה שלך המריאה, גם אם ויתרת על חלק מהשליטה היצירתית.',
        effects: { stats: { career: 15, money: 10, reputation: 8, happiness: -3 }, xp: 40 },
        custom: (state) => ({ career: { ...state.career, level: Math.min(state.career.level + 1, 5) } }),
      },
      {
        id: 'independent',
        text: 'להישאר עצמאי/ת',
        outcome: 'ויתרת על הכסף הגדול כדי לשמור על השליטה על היצירה שלך.',
        effects: { stats: { happiness: 6, reputation: 3 }, xp: 20 },
      },
    ],
  },
]

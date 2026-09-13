import type { GameEvent } from '../../types'

export const randomEvents: GameEvent[] = [
  {
    id: 'found_wallet',
    category: 'random',
    icon: '👛',
    title: 'מצאת ארנק ברחוב',
    weight: 0.4,
    getText: () => 'מצאת ארנק ברחוב עם סכום כסף לא קטן בפנים ותעודת זהות.',
    choices: [
      {
        id: 'return',
        text: 'להחזיר לבעלים',
        outcome: 'איתרת את הבעלים והחזרת את הארנק כמו שהוא. ההודיה בעיניים שלו/ה הייתה שווה יותר מהכסף.',
        effects: { stats: { reputation: 8, happiness: 5 }, xp: 20 },
      },
      {
        id: 'keep',
        text: 'להשאיר את הכסף לעצמך',
        outcome: 'שמת את הכסף בכיס ולא חשבת פעמיים. משהו קטן בפנים בכל זאת לא הרגיש נכון.',
        effects: { stats: { money: 4 }, money: 800, xp: 10 },
        hidden: { hiddenStats: { luck: -8 } },
      },
    ],
  },
  {
    id: 'lottery_ticket',
    category: 'random',
    icon: '🎟️',
    title: 'כרטיס פיס',
    weight: 0.3,
    getText: () => 'קנית כרטיס פיס בקיוסק בדרך הביתה, סתם בשביל הכיף.',
    choices: [
      {
        id: 'check',
        text: 'לבדוק את התוצאות',
        outcome: 'גירדת את הכרטיס בהתרגשות קטנה. ברוב הפעמים זה סתם כיף של רגע — אבל אף פעם אי אפשר לדעת.',
        effects: { xp: 5 },
        custom: (state, rng) => {
          const won = rng() < 0.05
          return won
            ? { finance: { ...state.finance, savings: state.finance.savings + 25000 } }
            : {}
        },
      },
    ],
  },
  {
    id: 'health_scare',
    category: 'random',
    icon: '🏥',
    title: 'בדיקה רפואית לא שגרתית',
    weight: 0.5,
    condition: (state) => state.stats.energy < 40,
    getText: () => 'הרופא/ה ביקש/ה ממך לחזור לבדיקות נוספות אחרי תוצאות לא ברורות.',
    choices: [
      {
        id: 'checkup',
        text: 'לעשות סדר בבריאות ולנוח יותר',
        outcome: 'הבדיקות יצאו תקינות, אבל השיחה עם הרופא/ה הייתה תזכורת טובה להאט קצת.',
        effects: { stats: { energy: 15, happiness: -3, money: -3 }, xp: 20 },
      },
      {
        id: 'ignore',
        text: 'להתעלם ולהמשיך בקצב הרגיל',
        outcome: 'דחית את זה לפעם אחרת. הגוף ימשיך לשלוח תזכורות, בטוב או ברע.',
        effects: { stats: { energy: -10 }, xp: 5 },
        hidden: { hiddenStats: { stress: 10 } },
      },
    ],
  },
  {
    id: 'old_friend_reconnect',
    category: 'random',
    icon: '👋',
    title: 'חבר/ה ותיק/ה יצר/ה קשר',
    weight: 0.35,
    getText: () => 'חבר/ה ותיק/ה מהתיכון שלא דיברת איתו/ה שנים כתב/ה לך פתאום.',
    choices: [
      {
        id: 'meet',
        text: 'לקבוע להיפגש',
        outcome: 'נפגשתם לקפה שהתארך לשלוש שעות. מסתבר שדברים לא השתנו כל כך.',
        effects: { stats: { friends: 8, happiness: 5 }, xp: 15 },
      },
      {
        id: 'chat',
        text: 'רק לשוחח קצת בהודעות',
        outcome: 'החלפתם כמה הודעות נחמדות ותו לא. לפעמים זה מספיק.',
        effects: { stats: { friends: 3 }, xp: 5 },
      },
    ],
  },
  {
    id: 'friend_needs_loan',
    category: 'random',
    icon: '🤝',
    title: 'חבר/ה מבקש/ת הלוואה',
    weight: 0.5,
    condition: (state) => state.finance.savings > 5000,
    getText: () => 'חבר/ה קרוב/ה נקלע/ה לקשיים כלכליים ומבקש/ת ממך הלוואה.',
    choices: [
      {
        id: 'lend',
        text: 'להלוות לו/ה כסף',
        outcome: 'העברת את הכסף בלי היסוס גדול. מקווה שהוא/היא יחזיר/תחזיר, אבל בעיקר שמח/ה שיכולת לעזור.',
        effects: { stats: { friends: 10, money: -2 }, money: -2500, xp: 20 },
        hidden: { hiddenStats: { luck: -3 } },
      },
      {
        id: 'refuse',
        text: 'לסרב בנימוס',
        outcome: 'סירבת בעדינות ככל שיכולת. זה לא היה נעים, אבל שמרת על הגבולות הכלכליים שלך.',
        effects: { stats: { friends: -6, money: 1 }, xp: 10 },
      },
    ],
  },
  {
    id: 'viral_moment',
    category: 'random',
    icon: '📱',
    title: 'רגע ויראלי',
    weight: 0.3,
    getText: () => 'משהו שפרסמת ברשתות החברתיות הפך פתאום לויראלי, בלי שום סיבה ברורה.',
    choices: [
      {
        id: 'enjoy',
        text: 'ליהנות מרגע התהילה',
        outcome: 'ההודעות לא הפסיקו לזרום כמה ימים. מצחיק, מעט מתיש, ובעיקר חוויה שתספר עליה עוד שנים.',
        effects: { stats: { happiness: 6, reputation: 5, friends: 4 }, xp: 15 },
      },
      {
        id: 'ignore',
        text: 'להתעלם ולהמשיך הלאה',
        outcome: 'כיבית את ההתראות ונתת לרעש לחלוף מעצמו.',
        effects: { stats: { energy: 2 }, xp: 5 },
      },
    ],
  },
  {
    id: 'weather_extreme',
    category: 'random',
    icon: '🌧️',
    title: 'סופה חורפית',
    weight: 0.4,
    getText: () => 'סופת חורף חזקה במיוחד השביתה את האזור שלך ליום שלם.',
    choices: [
      {
        id: 'cozy',
        text: 'להישאר בבית עם תה חם וסרט',
        outcome: 'ניצלת את היום הכפוי לנוח באמת. לפעמים הטבע פשוט מכריח אותנו לעצור.',
        effects: { stats: { happiness: 5, energy: 8 }, xp: 5 },
      },
      {
        id: 'push_through',
        text: 'לנסות להגיע לעבודה בכל זאת',
        outcome: 'הגעת רטוב/ה ומאוחר, אבל ההתמדה שלך לא עברה בלי לב לב מהמנהל/ת.',
        effects: { stats: { career: 3, energy: -8, happiness: -3 }, xp: 10 },
      },
    ],
  },
]

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
        effects: { stats: { reputation: 8, happiness: 5 }, xp: 20 },
      },
      {
        id: 'keep',
        text: 'להשאיר את הכסף לעצמך',
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
    weight: 0.5,
    getText: () => 'קנית כרטיס פיס בקיוסק בדרך הביתה, סתם בשביל הכיף.',
    choices: [
      {
        id: 'check',
        text: 'לבדוק את התוצאות',
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
        effects: { stats: { energy: 15, happiness: -3, money: -3 }, xp: 20 },
      },
      {
        id: 'ignore',
        text: 'להתעלם ולהמשיך בקצב הרגיל',
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
    weight: 0.6,
    getText: () => 'חבר/ה ותיק/ה מהתיכון שלא דיברת איתו/ה שנים כתב/ה לך פתאום.',
    choices: [
      {
        id: 'meet',
        text: 'לקבוע להיפגש',
        effects: { stats: { friends: 8, happiness: 5 }, xp: 15 },
      },
      {
        id: 'chat',
        text: 'רק לשוחח קצת בהודעות',
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
        effects: { stats: { friends: 10, money: -3 }, money: -5000, xp: 20 },
        hidden: { hiddenStats: { luck: -3 } },
      },
      {
        id: 'refuse',
        text: 'לסרב בנימוס',
        effects: { stats: { friends: -6, money: 1 }, xp: 10 },
      },
    ],
  },
]

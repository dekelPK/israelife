import type { GameEvent } from '../../types'

export const financeEvents: GameEvent[] = [
  {
    id: 'apartment_upgrade',
    category: 'finance',
    icon: '🏠',
    title: 'דירה יקרה יותר באזור טוב',
    condition: (state) => !state.finance.ownsHome && state.stats.housing < 90,
    weight: 0.9,
    getText: () => 'מצאת דירה להשכרה באזור מבוקש - יפה, קרובה למרכז, אבל משמעותית יקרה יותר ממה שאת/ה משלם/ת היום.',
    choices: [
      {
        id: 'move',
        text: 'לעבור לדירה היקרה',
        effects: {
          stats: { money: -8, happiness: 6, relationship: 2, housing: 8, career: 1 },
          xp: 20,
        },
      },
      {
        id: 'stay',
        text: 'להישאר במקום הנוכחי ולחסוך',
        effects: { stats: { money: 3, housing: -1 }, xp: 10 },
      },
    ],
  },
  {
    id: 'buy_apartment',
    category: 'finance',
    icon: '🔑',
    title: 'הזדמנות לקנות דירה',
    once: true,
    minAge: 26,
    condition: (state) => !state.finance.ownsHome && state.finance.savings > 150000,
    getText: () => 'נפתחה בפניך אפשרות לקחת משכנתא ולקנות דירה משלך.',
    choices: [
      {
        id: 'buy',
        text: 'לקחת משכנתא ולקנות',
        effects: {
          stats: { housing: 20, happiness: 8, money: -10 },
          money: -150000,
          xp: 50,
        },
        custom: (state) => ({ finance: { ...state.finance, ownsHome: true, mortgage: 4200 } }),
      },
      {
        id: 'rent',
        text: 'להמשיך לשכור ולהשקיע את הכסף אחרת',
        effects: { stats: { money: 5 }, xp: 15 },
      },
    ],
  },
  {
    id: 'car_breakdown',
    category: 'finance',
    icon: '🚗',
    title: 'תקלה ברכב',
    condition: (state) => state.finance.savings > -20000,
    weight: 0.8,
    getText: () => 'הרכב התקלקל בדיוק החודש שבו ההוצאות כבר גבוהות מהרגיל.',
    choices: [
      {
        id: 'fix',
        text: 'לתקן את הרכב',
        effects: { stats: { money: -5, energy: 3 }, money: -4500, xp: 10 },
      },
      {
        id: 'public_transport',
        text: 'למכור את הרכב ולעבור לתחבורה ציבורית',
        effects: { stats: { money: 3, energy: -5, happiness: -2 }, money: 8000, xp: 15 },
      },
    ],
  },
  {
    id: 'inheritance',
    category: 'finance',
    icon: '💰',
    title: 'ירושה לא צפויה',
    once: true,
    minAge: 24,
    weight: 0.3,
    getText: () => 'קרוב משפחה רחוק הותיר לך ירושה לא צפויה.',
    choices: [
      {
        id: 'save',
        text: 'לחסוך את הכל',
        effects: { stats: { money: 10 }, money: 60000, xp: 15 },
      },
      {
        id: 'invest',
        text: 'להשקיע בשוק ההון',
        effects: { stats: { money: 5 }, money: 40000, xp: 20 },
        hidden: { hiddenStats: { luck: -5 } },
      },
      {
        id: 'spend',
        text: 'לפנק את עצמך ואת האנשים שאת/ה אוהב/ת',
        effects: { stats: { happiness: 12, relationship: 5, friends: 5 }, money: 10000, xp: 20 },
      },
    ],
  },
]

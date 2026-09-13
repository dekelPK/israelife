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
        outcome: 'עברת לדירה החדשה. הבוקר עם קפה במרפסת שווה כל שקל נוסף — לפחות ככה זה מרגיש כרגע.',
        effects: {
          stats: { money: -8, happiness: 6, relationship: 2, housing: 8, career: 1 },
          xp: 20,
        },
      },
      {
        id: 'stay',
        text: 'להישאר במקום הנוכחי ולחסוך',
        outcome: 'ויתרת על השדרוג ונשארת במקום הישן והמוכר. פחות מרשים, אבל תזרים המזומנים שלך מודה לך.',
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
        outcome: 'חתמת על המשכנתא ואת/ה סוף סוף בעל/ת דירה. המפתחות בכיס מרגישים כבדים יותר ממה שציפית — בטוב.',
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
        outcome: 'החלטת לא להתחייב עדיין למשכנתא ולהשאיר את האפשרויות פתוחות.',
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
        outcome: 'שילמת למוסך סכום לא קטן, אבל הרכב חזר לדרכים ואת/ה חוסך/ת את הכאב ראש של לחפש חלופה.',
        effects: { stats: { money: -4, energy: 3 }, money: -2800, xp: 10 },
      },
      {
        id: 'public_transport',
        text: 'למכור את הרכב ולעבור לתחבורה ציבורית',
        outcome: 'מכרת את הרכב ועברת לאוטובוסים ורכבות. פחות נוח, אבל החשבון בבנק דווקא שמח.',
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
        outcome: 'הפקדת את כל הסכום לחיסכון. לא הכי מרגש, אבל רשת הביטחון שלך משמעותית יותר עבה עכשיו.',
        effects: { stats: { money: 10 }, money: 60000, xp: 15 },
      },
      {
        id: 'invest',
        text: 'להשקיע בשוק ההון',
        outcome: 'העברת את הכסף לתיק השקעות ועכשיו נשאר רק לעקוב אחרי הגרפים.',
        effects: { xp: 20 },
        hidden: { hiddenStats: { luck: -5 } },
        chance: [
          {
            weight: 0.55,
            outcome: 'השוק היה נדיב איתך - התיק צמח יפה מעבר לציפיות.',
            effects: { stats: { money: 8 }, money: 55000 },
          },
          {
            weight: 0.45,
            outcome: 'השוק ירד בדיוק כשנכנסת אליו, וחלק לא קטן מהירושה פשוט התאדה.',
            effects: { stats: { money: -2 }, money: 12000 },
          },
        ],
      },
      {
        id: 'spend',
        text: 'לפנק את עצמך ואת האנשים שאת/ה אוהב/ת',
        outcome: 'יצאת לחופשה, קנית מתנות, פינקת את הקרובים אליך. הכסף נעלם מהר, אבל הזיכרונות נשארים.',
        effects: { stats: { happiness: 12, relationship: 5, friends: 5 }, money: 10000, xp: 20 },
      },
    ],
  },
  {
    id: 'side_hustle',
    category: 'finance',
    icon: '🛠️',
    title: 'הזדמנות לפרויקט צדדי',
    condition: (state) => !state.career.unemployed,
    weight: 0.6,
    getText: () => 'מכיר/ה פנה אליך עם הזדמנות לעבודה צדדית בשעות הפנויות שלך, תמורת תשלום נאה.',
    choices: [
      {
        id: 'take',
        text: 'לקחת את הפרויקט',
        outcome: 'הלילות התקצרו אבל הכיס התמלא. שווה את זה — הפעם.',
        effects: { stats: { money: 6, energy: -10, skills: 3 }, money: 6000, xp: 20 },
      },
      {
        id: 'skip',
        text: 'לוותר ולשמור על הזמן הפנוי',
        outcome: 'ויתרת על הכסף הנוסף ושמרת על הערבים שלך. לפעמים מנוחה שווה יותר מתלוש נוסף.',
        effects: { stats: { happiness: 3, energy: 3 }, xp: 10 },
      },
    ],
  },
]

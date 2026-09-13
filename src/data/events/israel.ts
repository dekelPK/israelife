import type { GameEvent } from '../../types'

export const israelEvents: GameEvent[] = [
  {
    id: 'reserve_duty',
    category: 'israel',
    icon: '🎖️',
    title: 'צו מילואים',
    condition: (state) => state.flags.servedArmy === true && state.character.age < 45,
    weight: 0.9,
    getText: () => 'קיבלת צו 8 למילואים. זה מגיע בדיוק בתקופה עמוסה בעבודה.',
    choices: [
      {
        id: 'go',
        text: 'להתייצב',
        outcome: 'ארזת תיק ויצאת. קשה להיות רחוק/ה, אבל יש תחושת שליחות שקשה להסביר למי שלא חווה את זה.',
        effects: { stats: { reputation: 5, career: -3, energy: -15, relationship: -3, family: -3 }, xp: 30 },
        hidden: { hiddenStats: { stress: 10 } },
      },
      {
        id: 'postpone',
        text: 'לנסות לדחות בשל אילוצים בעבודה',
        outcome: 'הצלחת לדחות בעזרת אישור מהמעסיק. הרגשת קצת לא בנוח עם זה, אבל היו לך סיבות טובות.',
        effects: { stats: { career: 2, reputation: -3 }, xp: 10 },
      },
    ],
  },
  {
    id: 'security_situation',
    category: 'israel',
    icon: '🕯️',
    title: 'תקופה ביטחונית מורכבת',
    sensitive: true,
    weight: 0.4,
    getText: () =>
      'המצב הביטחוני באזור מתוח, יש אזעקות והחיים היומיומיים מושפעים. כמו רבים סביבך, את/ה מנסה להמשיך לתפקד ולתמוך במי שקרוב אליך.',
    choices: [
      {
        id: 'community',
        text: 'להתגייס להתנדבות ולעזרה בקהילה',
        outcome: 'בילית שעות בהתנדבות — אריזת חבילות, תמיכה בשכנים. זה לא פתר הכל, אבל נתן תחושת משמעות בתקופה קשה.',
        effects: { stats: { reputation: 8, friends: 5, happiness: -5, energy: -10 }, xp: 30 },
      },
      {
        id: 'focus_family',
        text: 'להתמקד בשמירה על המשפחה והשגרה',
        outcome: 'שמרת על שגרה יציבה ככל האפשר למען מי שקרוב אליך. זו הייתה הבחירה הנכונה בשבילך כרגע.',
        effects: { stats: { family: 8, happiness: -3, energy: -5 }, xp: 20 },
      },
      {
        id: 'push_through',
        text: 'לנסות להמשיך כמה שיותר בשגרה ובעבודה',
        outcome: 'המשכת לעבוד כאילו הכל רגיל, גם כשזה לא היה קל בכלל.',
        effects: { stats: { career: 3, happiness: -8, energy: -10 }, xp: 15 },
        hidden: { hiddenStats: { stress: 12 } },
      },
    ],
  },
  {
    id: 'holiday_dinner',
    category: 'israel',
    icon: '🍽️',
    title: 'ארוחת חג משפחתית',
    weight: 0.5,
    getText: () => 'כל המשפחה מתכנסת לארוחת חג. הדוד הפוליטי כבר מתחיל לדבר על המצב במדינה.',
    choices: [
      {
        id: 'engage',
        text: 'להיכנס לוויכוח הפוליטי',
        outcome: 'נכנסת לוויכוח בכל הכוח. אף אחד לא שכנע אף אחד, אבל היה מעניין (ורועש).',
        effects: { stats: { happiness: -3, friends: 2 }, xp: 10 },
      },
      {
        id: 'deflect',
        text: 'להסיט את השיחה לנושא ניטרלי',
        outcome: 'הצלחת להסיט את השיחה לפני שהיא התלקחה. ארוחת החג נמשכה בשלום.',
        effects: { stats: { happiness: 4, family: 3 }, xp: 15 },
      },
      {
        id: 'leave_early',
        text: 'להמציא תירוץ ולעזוב מוקדם',
        outcome: 'המצאת תירוץ משכנע למחצה ועזבת מוקדם. השקט בדרך הביתה היה מבורך.',
        effects: { stats: { happiness: 2, family: -3 }, xp: 5 },
      },
    ],
  },
  {
    id: 'independence_day',
    category: 'israel',
    icon: '🇮🇱',
    title: 'יום העצמאות',
    weight: 0.4,
    getText: () => 'יום העצמאות בפתח - ברביקיו, דגלים על הרכבים וריח עשן בכל השכונה.',
    choices: [
      {
        id: 'bbq',
        text: 'לארגן מנגל גדול עם חברים',
        outcome: 'המנגל הפך למסורת שכונתית קטנה. עשן, נקניקיות ומוזיקה עד השעות הקטנות.',
        effects: { stats: { happiness: 8, friends: 6, money: -2 }, xp: 15 },
      },
      {
        id: 'chill',
        text: 'לנוח בבית ביום שקט',
        outcome: 'ויתרת על ההמולה ונהנית מיום שקט. לפעמים זה בדיוק מה שצריך.',
        effects: { stats: { happiness: 4, energy: 8 }, xp: 5 },
      },
    ],
  },
  {
    id: 'housing_prices_news',
    category: 'israel',
    icon: '📰',
    title: 'מחירי הדיור עולים שוב',
    weight: 0.5,
    condition: (state) => !state.finance.ownsHome,
    getText: () => 'הכתבה בחדשות ברורה: מחירי הדיור עלו שוב, ורוב בני הגיל שלך מתייאשים מלקנות דירה.',
    choices: [
      {
        id: 'save_harder',
        text: 'להדק את החגורה ולחסוך עוד יותר',
        outcome: 'קיצצת בהוצאות הלא-הכרחיות. זה לא כיף, אבל החיסכון גדל בהתמדה.',
        effects: { stats: { money: 4, happiness: -3 }, xp: 15 },
      },
      {
        id: 'give_up',
        text: 'להשלים עם זה שתמיד תהיה/י בשכירות',
        outcome: 'החלטת להפסיק להילחם בזה ופשוט לחיות את הרגע. יש בזה גם שחרור מסוים.',
        effects: { stats: { happiness: -2, housing: -2 }, xp: 5 },
      },
    ],
  },
  {
    id: 'traffic_jam',
    category: 'israel',
    icon: '🚗',
    title: 'פקק בכביש 1',
    weight: 0.3,
    getText: () => 'תקוע/ה בפקק ענק בדרך הביתה, כבר שעה שלמה לא זזת.',
    choices: [
      {
        id: 'podcast',
        text: 'להעביר את הזמן עם פודקאסט טוב',
        outcome: 'הפודקאסט הפך את הפקק לפחות מעצבן. אפילו למדת משהו חדש.',
        effects: { stats: { happiness: 2, skills: 1 }, xp: 5 },
      },
      {
        id: 'road_rage',
        text: 'להתעצבן על כל נהג בדרך',
        outcome: 'הגעת הביתה עצבני/ת ותשוש/ה. הפעם הבאה אולי כדאי לנסות את הפודקאסט.',
        effects: { stats: { happiness: -4, energy: -5 }, xp: 5 },
      },
    ],
  },
  {
    id: 'passover_cleaning',
    category: 'israel',
    icon: '🧹',
    title: 'ניקיון פסח',
    weight: 0.3,
    getText: () => 'פסח בעוד שבועיים, וכל הבית זקוק לניקיון יסודי לפני החג.',
    choices: [
      {
        id: 'deep_clean',
        text: 'לצאת למבצע ניקיון רציני',
        outcome: 'הבית נוצץ, הגב כואב, אבל יש סיפוק אמיתי בלראות הכל מסודר לקראת החג.',
        effects: { stats: { happiness: 4, energy: -10, family: 4 }, xp: 15 },
      },
      {
        id: 'hire_help',
        text: 'לשלם למישהו שיעזור',
        outcome: 'שכרת עזרה מקצועית וחסכת לעצמך את כאב הגב. שווה כל שקל.',
        effects: { stats: { happiness: 5, money: -3, energy: 3 }, money: -600, xp: 10 },
      },
    ],
  },
  {
    id: 'reunion_army_friends',
    category: 'israel',
    icon: '🪖',
    title: 'מפגש של הגדוד',
    condition: (state) => state.flags.servedArmy === true,
    weight: 0.3,
    getText: () => 'חברים מהצבא מארגנים מפגש שנתי. עבר כבר קצת זמן מאז שראית אותם.',
    choices: [
      {
        id: 'go',
        text: 'להגיע למפגש',
        outcome: 'הצחוקים חזרו מיד, כאילו לא עברו שנים. יצאת מהערב עם תחושה חמה.',
        effects: { stats: { friends: 8, happiness: 6 }, xp: 15 },
      },
      {
        id: 'skip',
        text: 'לדלג הפעם',
        outcome: 'החלטת לוותר הפעם. תמיד יש עוד מפגש.',
        effects: { stats: { happiness: -1 }, xp: 5 },
      },
    ],
  },
]

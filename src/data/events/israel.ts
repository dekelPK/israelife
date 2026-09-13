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
        effects: { stats: { reputation: 5, career: -3, energy: -15, relationship: -3, family: -3 }, xp: 30 },
        hidden: { hiddenStats: { stress: 10 } },
      },
      {
        id: 'postpone',
        text: 'לנסות לדחות בשל אילוצים בעבודה',
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
        effects: { stats: { reputation: 8, friends: 5, happiness: -5, energy: -10 }, xp: 30 },
      },
      {
        id: 'focus_family',
        text: 'להתמקד בשמירה על המשפחה והשגרה',
        effects: { stats: { family: 8, happiness: -3, energy: -5 }, xp: 20 },
      },
      {
        id: 'push_through',
        text: 'לנסות להמשיך כמה שיותר בשגרה ובעבודה',
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
    weight: 1,
    getText: () => 'כל המשפחה מתכנסת לארוחת חג. הדוד הפוליטי כבר מתחיל לדבר על המצב במדינה.',
    choices: [
      {
        id: 'engage',
        text: 'להיכנס לוויכוח הפוליטי',
        effects: { stats: { happiness: -3, friends: 2 }, xp: 10 },
      },
      {
        id: 'deflect',
        text: 'להסיט את השיחה לנושא ניטרלי',
        effects: { stats: { happiness: 4, family: 3 }, xp: 15 },
      },
      {
        id: 'leave_early',
        text: 'להמציא תירוץ ולעזוב מוקדם',
        effects: { stats: { happiness: 2, family: -3 }, xp: 5 },
      },
    ],
  },
  {
    id: 'independence_day',
    category: 'israel',
    icon: '🇮🇱',
    title: 'יום העצמאות',
    weight: 0.8,
    getText: () => 'יום העצמאות בפתח - ברביקיו, דגלים על הרכבים וריח עשן בכל השכונה.',
    choices: [
      {
        id: 'bbq',
        text: 'לארגן מנגל גדול עם חברים',
        effects: { stats: { happiness: 8, friends: 6, money: -2 }, xp: 15 },
      },
      {
        id: 'chill',
        text: 'לנוח בבית ביום שקט',
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
        effects: { stats: { money: 4, happiness: -3 }, xp: 15 },
      },
      {
        id: 'give_up',
        text: 'להשלים עם זה שתמיד תהיה/י בשכירות',
        effects: { stats: { happiness: -2, housing: -2 }, xp: 5 },
      },
    ],
  },
  {
    id: 'traffic_jam',
    category: 'israel',
    icon: '🚗',
    title: 'פקק בכביש 1',
    weight: 0.6,
    getText: () => 'תקוע/ה בפקק ענק בדרך הביתה, כבר שעה שלמה לא זזת.',
    choices: [
      {
        id: 'podcast',
        text: 'להעביר את הזמן עם פודקאסט טוב',
        effects: { stats: { happiness: 2, skills: 1 }, xp: 5 },
      },
      {
        id: 'road_rage',
        text: 'להתעצבן על כל נהג בדרך',
        effects: { stats: { happiness: -4, energy: -5 }, xp: 5 },
      },
    ],
  },
]

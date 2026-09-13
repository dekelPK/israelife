import { randomNpcName } from '../../data/names'
import type { GameEvent } from '../../types'

export const familyEvents: GameEvent[] = [
  {
    id: 'children_decision',
    category: 'family',
    icon: '👶',
    title: 'להביא ילדים?',
    once: true,
    minAge: 24,
    maxAge: 48,
    weight: 3.5,
    condition: (state) =>
      (state.relationship.status === 'married' ||
        (state.relationship.status === 'dating' && state.relationship.relationshipScore >= 70)) &&
      state.family.wantsChildren === null,
    getText: (state) =>
      state.relationship.status === 'married'
        ? 'את/ה ובן/בת הזוג מדברים על העתיד. האם זה הזמן להביא ילדים?'
        : 'הזוגיות יציבה ורצינית, ושניכם מדברים על העתיד. האם זה הזמן להביא ילדים?',
    choices: [
      {
        id: 'yes',
        text: 'כן, רוצים ילדים',
        outcome: 'החלטתם יחד שזה הזמן. יש התרגשות באוויר, ומעט חרדה בריאה.',
        effects: { stats: { family: 10, happiness: 5 }, xp: 20, flags: { wantsChildren: true } },
        custom: (state) => ({
          family: { ...state.family, wantsChildren: true },
        }),
      },
      {
        id: 'no',
        text: 'לא, מעדיפים בלי ילדים כרגע',
        outcome: 'החלטתם שזה לא בשבילכם כרגע, ואולי בכלל לא. הבחירה הזו נותנת לכם חופש שלא לכולם יש.',
        effects: { stats: { money: 4, relationship: 3 }, xp: 15 },
        custom: (state) => ({ family: { ...state.family, wantsChildren: false } }),
      },
    ],
  },
  {
    id: 'child_birth',
    category: 'family',
    icon: '🍼',
    title: 'לידה',
    maxAge: 50,
    condition: (state) => state.family.wantsChildren === true && state.family.children.length < 3,
    weight: 2.5,
    getText: () => 'מזל טוב! נולד/ה לך ילד/ה.',
    choices: [
      {
        id: 'celebrate',
        text: 'לחגוג ולהתארגן לשלב החדש',
        outcome: 'הבית מלא בבכי, בקבוקים ובוקרים בלי שינה — ובכל זאת, אף פעם לא הרגשת מאושר/ת יותר.',
        effects: { stats: { family: 15, happiness: 10, energy: -15, money: -5 }, xp: 50 },
        custom: (state, rng) => {
          const name = randomNpcName(rng)
          return {
            family: {
              ...state.family,
              children: [
                ...state.family.children,
                { id: `child-${Date.now()}`, name, birthYear: state.year, stage: 'infant' },
              ],
            },
            scheduledEvents: [
              ...state.scheduledEvents,
              { eventId: 'child_school_starts', triggerYear: state.year + 6 },
              { eventId: 'child_army_age', triggerYear: state.year + 18 },
            ],
          }
        },
      },
    ],
  },
  {
    id: 'another_child',
    category: 'family',
    icon: '🤰',
    title: 'ילד/ה נוסף/ת?',
    maxAge: 48,
    condition: (state) => state.family.wantsChildren === true && state.family.children.length >= 1 && state.family.children.length < 3,
    weight: 0.8,
    getText: () => 'המשפחה גדלה יפה. יש מחשבות על עוד ילד/ה?',
    choices: [
      {
        id: 'another',
        text: 'כן, עוד ילד/ה',
        outcome: 'החלטתם להגדיל את המשפחה שוב. הבית עומד להיות עוד יותר רועש, ועוד יותר שמח.',
        effects: { stats: { family: 8, happiness: 4, energy: -5, money: -3 }, xp: 20 },
      },
      {
        id: 'enough',
        text: 'לא, המשפחה שלמה כרגע',
        outcome: 'הרגשתם ששלמים ככה. יש שקט בהחלטה הזו.',
        effects: { stats: { happiness: 2, money: 3 }, xp: 10 },
        custom: (state) => ({ family: { ...state.family, wantsChildren: false } }),
      },
    ],
  },
  {
    id: 'child_school_starts',
    category: 'family',
    icon: '🎒',
    title: 'יום ראשון בבית ספר',
    condition: (state) => state.family.children.length > 0,
    getText: (state) => `${state.family.children[0]?.name} מתחיל/ה כיתה א׳ השנה. הזמן עובר מהר.`,
    choices: [
      {
        id: 'involved',
        text: 'להיות מעורב/ת בכל פעילות בית הספר',
        outcome: 'הפכת להורה שמככב בכל אירוע כיתתי. הילד/ה מתגאה בך, גם אם זה בא על חשבון שעות עבודה.',
        effects: { stats: { family: 8, energy: -5, career: -2 }, xp: 20 },
      },
      {
        id: 'balance',
        text: 'לשמור על איזון בין עבודה למשפחה',
        outcome: 'מצאת את האיזון העדין בין קריירה למשפחה. לא מושלם, אבל בר-קיימא.',
        effects: { stats: { family: 4, career: 2 }, xp: 15 },
      },
    ],
  },
  {
    id: 'child_army_age',
    category: 'family',
    icon: '🎖️',
    title: 'הילד/ה מתגייס/ת',
    condition: (state) => state.family.children.length > 0,
    getText: (state) =>
      `${state.family.children[0]?.name}, שנולד/ה כשהיית/ה בת/בן ${state.character.age - 18}, מתגייס/ת לצה"ל היום. הזמן טס.`,
    choices: [
      {
        id: 'proud',
        text: 'להתמלא בגאווה ודאגה כאחד',
        outcome: 'עמדת בטקס עם עיניים דומעות. איפה השנים עברו?',
        effects: { stats: { family: 10, happiness: 3 }, xp: 30 },
        hidden: { hiddenStats: { stress: 10 } },
      },
      {
        id: 'worried',
        text: 'להתקשות עם הפרידה',
        outcome: 'הבית פתאום ריק יותר. את/ה בודק/ת את הטלפון כל כמה שעות, גם אם יודע/ת שזה מוגזם.',
        effects: { stats: { family: 5, happiness: -5, energy: -5 }, xp: 20 },
      },
    ],
  },
  {
    id: 'child_birthday',
    category: 'family',
    icon: '🎂',
    title: 'יום הולדת לילד/ה',
    condition: (state) => state.family.children.some((c) => c.stage !== 'adult'),
    weight: 1,
    getText: (state) => {
      const child = state.family.children.find((c) => c.stage !== 'adult')
      return `${child?.name} חוגג/ת יום הולדת השנה. כל החברים לגן/לכיתה כבר שאלו אם יש מסיבה.`
    },
    choices: [
      {
        id: 'big_party',
        text: 'לארגן מסיבה גדולה',
        outcome: 'הבית התמלא בילדים צורחים, בלונים וקצפת בכל מקום. הילד/ה לא הפסיק/ה לחייך כל היום.',
        effects: { stats: { family: 8, happiness: 6, energy: -8 }, money: -900, xp: 15 },
      },
      {
        id: 'small_family',
        text: 'חגיגה קטנה ואינטימית במשפחה',
        outcome: 'עוגה, שירה קצת מזויפת, וחיבוק ארוך. בדיוק כמו שצריך.',
        effects: { stats: { family: 6, happiness: 4 }, money: -150, xp: 10 },
      },
    ],
  },
  {
    id: 'parenting_disagreement',
    category: 'family',
    icon: '👨‍👩‍👧',
    title: 'חילוקי דעות על גידול הילדים',
    condition: (state) => state.family.children.length > 0 && !!state.relationship.partner,
    weight: 0.8,
    getText: () => 'לך ולבן/בת הזוג יש גישות שונות לגמרי לגבי איך לגדל את הילדים - וזה עולה לוויכוח.',
    choices: [
      {
        id: 'compromise',
        text: 'לשבת ולמצוא פשרה משותפת',
        outcome: 'לקח זמן, אבל הגעתם לשיטה שמשלבת קצת משניכם. הילדים לא שמו לב לכלום.',
        effects: { stats: { family: 6, relationship: 5 }, relationshipScore: 4, xp: 20 },
      },
      {
        id: 'insist',
        text: 'להתעקש שהדרך שלך היא הנכונה',
        outcome: 'עמדת על שלך. ניצחת בוויכוח, אבל בבית הייתה אווירה קרירה כמה ימים אחר כך.',
        effects: { stats: { family: -3, relationship: -6 }, relationshipScore: -6, xp: 10 },
      },
    ],
  },
  {
    id: 'teen_rebellion',
    category: 'family',
    icon: '🙄',
    title: 'גיל ההתבגרות מגיע הביתה',
    condition: (state) =>
      state.family.children.some((c) => {
        const age = state.year - c.birthYear
        return age >= 13 && age <= 17
      }),
    weight: 1,
    getText: (state) => {
      const teen = state.family.children.find((c) => {
        const age = state.year - c.birthYear
        return age >= 13 && age <= 17
      })
      return `${teen?.name} נכנס/ת לגיל ההתבגרות בכל התפארת שלו - דלת סגורה, אוזניות, ו"את/ה לא מבין/ה אותי".`
    },
    choices: [
      {
        id: 'patient',
        text: 'להישאר סבלני/ת ולתת מרחב',
        outcome: 'נתת לו/ה את המרחב שביקש/ה, ותוך כמה חודשים הדלת נפתחה שוב מעצמה.',
        effects: { stats: { family: 6, happiness: 2, energy: -5 }, xp: 20 },
      },
      {
        id: 'strict',
        text: 'להציב גבולות נוקשים',
        outcome: 'הצבת חוקים ברורים. זה יצר עוד כמה קרבות בדרך, אבל בסוף האבק שקע.',
        effects: { stats: { family: 2, happiness: -3, energy: -5 }, xp: 20 },
        hidden: { hiddenStats: { stress: 8 } },
      },
    ],
  },
  {
    id: 'child_achievement',
    category: 'family',
    icon: '🏅',
    title: 'הישג של הילד/ה',
    condition: (state) => state.family.children.some((c) => c.stage === 'school'),
    weight: 0.7,
    getText: (state) => {
      const child = state.family.children.find((c) => c.stage === 'school')
      return `${child?.name} זכה/תה במקום ראשון בתחרות בית ספרית - מדעים, ספורט או אמנות, תלוי במי שואלים.`
    },
    choices: [
      {
        id: 'celebrate',
        text: 'לחגוג את זה בגדול',
        outcome: 'תלית את התעודה על המקרר וספרת לכל מי שהסכים להקשיב. הילד/ה פרח/ה מגאווה.',
        effects: { stats: { family: 8, happiness: 6 }, money: -200, xp: 15 },
      },
      {
        id: 'modest',
        text: 'לשבח בחום אבל בלי הגזמות',
        outcome: 'אמרת כמה מילים חמות ועברתם הלאה. הילד/ה הבין/ה שההישג נראה, גם בלי מהומה.',
        effects: { stats: { family: 4, happiness: 3 }, xp: 10 },
      },
    ],
  },
]

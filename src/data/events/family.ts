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
]

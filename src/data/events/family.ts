import { randomNpcName } from '../../data/names'
import type { GameEvent } from '../../types'

export const familyEvents: GameEvent[] = [
  {
    id: 'children_decision',
    category: 'family',
    icon: '👶',
    title: 'להביא ילדים?',
    once: true,
    minAge: 25,
    maxAge: 45,
    condition: (state) => state.relationship.status === 'married' && state.family.wantsChildren === null,
    getText: () => 'את/ה ובן/בת הזוג מדברים על העתיד. האם זה הזמן להביא ילדים?',
    choices: [
      {
        id: 'yes',
        text: 'כן, רוצים ילדים',
        effects: { stats: { family: 10, happiness: 5 }, xp: 20, flags: { wantsChildren: true } },
        custom: (state) => ({
          family: { ...state.family, wantsChildren: true },
        }),
      },
      {
        id: 'no',
        text: 'לא, מעדיפים בלי ילדים כרגע',
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
    weight: 1.5,
    getText: () => 'מזל טוב! נולד/ה לך ילד/ה.',
    choices: [
      {
        id: 'celebrate',
        text: 'לחגוג ולהתארגן לשלב החדש',
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
        effects: { stats: { family: 8, energy: -5, career: -2 }, xp: 20 },
      },
      {
        id: 'balance',
        text: 'לשמור על איזון בין עבודה למשפחה',
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
        effects: { stats: { family: 10, happiness: 3 }, xp: 30 },
        hidden: { hiddenStats: { stress: 10 } },
      },
      {
        id: 'worried',
        text: 'להתקשות עם הפרידה',
        effects: { stats: { family: 5, happiness: -5, energy: -5 }, xp: 20 },
      },
    ],
  },
]

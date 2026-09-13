import { generatePartner } from '../../engine/relationships'
import type { GameEvent } from '../../types'

export const romanceEvents: GameEvent[] = [
  {
    id: 'meet_someone',
    category: 'romance',
    icon: '💘',
    title: 'הכרות חדשה',
    condition: (state) => state.relationship.status === 'single',
    weight: (state) => (state.character.traits.includes('social') ? 2 : 1),
    getText: (state) => {
      const app = ['בטינדר', 'דרך חברים משותפים', 'באירוע עבודה', 'בבר השכונתי'][
        Math.floor(state.year % 4)
      ]
      return `הכרת מישהו/י מעניין/ת ${app}.`
    },
    choices: [
      {
        id: 'date',
        text: 'לצאת לדייט',
        effects: { stats: { happiness: 5, relationship: 5 }, xp: 15 },
        custom: (state, rng) => {
          const partner = generatePartner(state, rng)
          return {
            relationship: {
              ...state.relationship,
              status: 'dating',
              partner,
              relationshipScore: 55,
            },
          }
        },
      },
      {
        id: 'skip',
        text: 'לא כרגע, יש הרבה על הראש',
        effects: { stats: { happiness: -1 }, xp: 5 },
      },
    ],
  },
  {
    id: 'partner_wants_to_talk',
    category: 'romance',
    icon: '❤️',
    title: 'בן/בת הזוג רוצה לדבר',
    condition: (state) => !!state.relationship.partner,
    getText: (state) =>
      `אחרי יום עבודה קשה, ${state.relationship.partner?.name} רוצה לדבר איתך, אבל את/ה עייף/ה.`,
    choices: [
      {
        id: 'talk',
        text: 'לדבר איתו/ה עכשיו',
        effects: { stats: { relationship: 6, energy: -5 }, xp: 15 },
      },
      {
        id: 'no_energy',
        text: 'להגיד שאין לך כוח כרגע',
        effects: { stats: { energy: 3, relationship: -4 }, xp: 5 },
      },
      {
        id: 'leave',
        text: 'לצאת מהבית להתאוורר',
        effects: { stats: { happiness: 2, relationship: -6, energy: 2 }, xp: 5 },
      },
      {
        id: 'tomorrow',
        text: 'להציע לדבר מחר ברוגע',
        effects: { stats: { relationship: 1, energy: 1 }, xp: 10 },
      },
    ],
  },
  {
    id: 'move_in_together',
    category: 'romance',
    icon: '🏡',
    title: 'לעבור לגור ביחד?',
    once: true,
    condition: (state) => state.relationship.status === 'dating' && state.relationship.relationshipScore >= 65,
    getText: (state) => `הזוגיות עם ${state.relationship.partner?.name} מתקדמת יפה. אולי הזמן לעבור לגור ביחד?`,
    choices: [
      {
        id: 'move_in',
        text: 'לעבור לגור ביחד',
        effects: { stats: { relationship: 10, happiness: 6, housing: 3, money: -3 }, xp: 30 },
        custom: (state) => ({ relationship: { ...state.relationship, relationshipScore: Math.min(100, state.relationship.relationshipScore + 10) } }),
      },
      {
        id: 'not_yet',
        text: 'עוד קצת מוקדם',
        effects: { stats: { relationship: -2 }, xp: 10 },
      },
    ],
  },
  {
    id: 'proposal',
    category: 'romance',
    icon: '💍',
    title: 'הצעת נישואין',
    once: true,
    condition: (state) => state.relationship.status === 'dating' && state.relationship.relationshipScore >= 80,
    getText: (state) => `אתה/את בטוח/ה ש${state.relationship.partner?.name} הוא/היא בן/בת הזוג לחיים. זה הרגע להציע נישואין.`,
    choices: [
      {
        id: 'propose',
        text: 'להציע נישואין',
        effects: {
          stats: { relationship: 15, happiness: 15, family: 5, money: -6 },
          xp: 60,
          flags: { married: true },
        },
        custom: (state) => ({ relationship: { ...state.relationship, status: 'married' } }),
      },
      {
        id: 'wait',
        text: 'לא בטוח/ה שזה הזמן',
        effects: { stats: { relationship: -8, happiness: -3 }, xp: 10 },
      },
    ],
  },
  {
    id: 'relationship_crisis',
    category: 'romance',
    icon: '💔',
    title: 'משבר בזוגיות',
    condition: (state) => !!state.relationship.partner && state.relationship.relationshipScore < 30,
    weight: 1.5,
    getText: (state) => `הזוגיות עם ${state.relationship.partner?.name} נמצאת בנקודה קשה.`,
    choices: [
      {
        id: 'work_on_it',
        text: 'להשקיע ולנסות לתקן',
        effects: { stats: { relationship: 15, energy: -10 }, xp: 25 },
      },
      {
        id: 'breakup',
        text: 'להיפרד',
        effects: { stats: { happiness: -10, relationship: -100 }, xp: 20, scheduleEvent: { eventId: 'ex_texts_after_years', inYears: 3 } },
        custom: (state) => ({
          relationship: {
            status: 'single',
            partner: null,
            relationshipScore: 0,
            history: [
              ...state.relationship.history,
              { partnerName: state.relationship.partner?.name ?? 'האקס', endedAs: state.relationship.status === 'married' ? 'divorced' : 'brokeUp' },
            ],
          },
        }),
      },
    ],
  },
  {
    id: 'ex_texts_after_years',
    category: 'romance',
    icon: '📱',
    title: 'הודעה מהעבר',
    getText: (state) => {
      const lastEx = state.relationship.history[state.relationship.history.length - 1]
      return `${lastEx?.partnerName ?? 'האקס שלך'} שלח/ה לך הודעה אחרי שנים של שתיקה. "היי, חשבתי עליך לאחרונה..."`
    },
    choices: [
      {
        id: 'reply',
        text: 'לענות ולפתוח שיחה',
        effects: { stats: { happiness: 3 }, xp: 15 },
        hidden: { hiddenStats: { stress: 3 } },
      },
      {
        id: 'ignore',
        text: 'להתעלם ולהמשיך הלאה',
        effects: { stats: { happiness: 1 }, xp: 10 },
      },
    ],
  },
]

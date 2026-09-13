import { generatePartner } from '../../engine/relationships'
import type { GameEvent } from '../../types'

export const romanceEvents: GameEvent[] = [
  {
    id: 'meet_someone',
    category: 'romance',
    icon: '💘',
    title: 'הכרות חדשה',
    condition: (state) => state.relationship.status === 'single',
    // High weight: starting a relationship gates a large share of later
    // content (family, marriage), so it shouldn't get lost in a big pool.
    weight: (state) => (state.character.traits.includes('social') ? 4 : 2.5),
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
        outcome: 'הדייט עבר טוב מהציפיות. יש כאן משהו ששווה להמשיך לבדוק.',
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
        outcome: 'החלטת שזה לא הזמן הנכון. אולי בפעם הבאה.',
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
        outcome: 'התאמצת ופנית זמן לשיחה. זה בדיוק מה שהיה צריך — הקשר ביניכם התחזק.',
        effects: { stats: { relationship: 6, energy: -5 }, relationshipScore: 8, xp: 15 },
      },
      {
        id: 'no_energy',
        text: 'להגיד שאין לך כוח כרגע',
        outcome: 'ביקשת רגע לנשום. הוא/היא הבינ/ה, אבל אפשר לחוש קצת ריחוק בערב הזה.',
        effects: { stats: { energy: 3, relationship: -4 }, relationshipScore: -6, xp: 5 },
      },
      {
        id: 'leave',
        text: 'לצאת מהבית להתאוורר',
        outcome: 'יצאת להליכה לבד. ההליכה עשתה לך טוב, אבל בבית נשארה תחושת אכזבה.',
        effects: { stats: { happiness: 2, relationship: -6, energy: 2 }, relationshipScore: -10, xp: 5 },
      },
      {
        id: 'tomorrow',
        text: 'להציע לדבר מחר ברוגע',
        outcome: 'קבעתם לדבר בשקט מחר. לא פתרון מושלם, אבל דחייה קטנה ואחראית.',
        effects: { stats: { relationship: 1, energy: 1 }, relationshipScore: 2, xp: 10 },
      },
    ],
  },
  {
    id: 'move_in_together',
    category: 'romance',
    icon: '🏡',
    title: 'לעבור לגור ביחד?',
    once: true,
    weight: 2.5,
    condition: (state) => state.relationship.status === 'dating' && state.relationship.relationshipScore >= 60,
    getText: (state) => `הזוגיות עם ${state.relationship.partner?.name} מתקדמת יפה. אולי הזמן לעבור לגור ביחד?`,
    choices: [
      {
        id: 'move_in',
        text: 'לעבור לגור ביחד',
        outcome: 'עברתם לגור ביחד. יש התרגלות — למי ממלא את המדיח, למי בוחר את הסדרה — אבל בסך הכול זה מרגיש נכון.',
        effects: { stats: { relationship: 10, happiness: 6, housing: 3, money: -3 }, relationshipScore: 8, xp: 30 },
      },
      {
        id: 'not_yet',
        text: 'עוד קצת מוקדם',
        outcome: 'החלטתם לחכות עוד קצת. אין למה למהר.',
        effects: { stats: { relationship: -2 }, relationshipScore: -3, xp: 10 },
      },
    ],
  },
  {
    id: 'proposal',
    category: 'romance',
    icon: '💍',
    title: 'הצעת נישואין',
    once: true,
    weight: 2.5,
    condition: (state) => state.relationship.status === 'dating' && state.relationship.relationshipScore >= 75,
    getText: (state) => `אתה/את בטוח/ה ש${state.relationship.partner?.name} הוא/היא בן/בת הזוג לחיים. זה הרגע להציע נישואין.`,
    choices: [
      {
        id: 'propose',
        text: 'להציע נישואין',
        outcome: 'כרעת ברך והוצאת טבעת. בן/בת הזוג שלך בכה/תה מהתרגשות ואמר/ה כן. יש חתונה בדרך.',
        effects: {
          stats: { relationship: 15, happiness: 15, family: 5, money: -6 },
          relationshipScore: 10,
          xp: 60,
          flags: { married: true },
        },
        custom: (state) => ({ relationship: { ...state.relationship, status: 'married' } }),
      },
      {
        id: 'wait',
        text: 'לא בטוח/ה שזה הזמן',
        outcome: 'הרגע חמק. אולי בהמשך, אבל כרגע העדפת לא להתחייב.',
        effects: { stats: { relationship: -8, happiness: -3 }, relationshipScore: -10, xp: 10 },
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
        outcome: 'ישבתם לדבר בכנות, בלי לוותר בקלות. זה היה קשה, אבל הקשר יצא מזה חזק יותר.',
        effects: { stats: { relationship: 15, energy: -10 }, relationshipScore: 22, xp: 25 },
      },
      {
        id: 'breakup',
        text: 'להיפרד',
        outcome: 'החלטתם להיפרד. כואב, אבל גם משחרר — זה פשוט כבר לא היה מתאים.',
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
        outcome: 'ענית, ולרגע קצר חזרתם לימים ההם. השיחה נגמרה בחיוך קטן ובלי שום דבר מעבר לזה.',
        effects: { stats: { happiness: 3 }, xp: 15 },
        hidden: { hiddenStats: { stress: 3 } },
      },
      {
        id: 'ignore',
        text: 'להתעלם ולהמשיך הלאה',
        outcome: 'בחרת לא לענות. העבר נשאר בעבר, וזה בסדר גמור.',
        effects: { stats: { happiness: 1 }, xp: 10 },
      },
    ],
  },
  {
    id: 'meet_the_parents',
    category: 'romance',
    icon: '🍲',
    title: 'ארוחה עם ההורים שלו/ה',
    once: true,
    condition: (state) => state.relationship.status === 'dating' && state.relationship.relationshipScore >= 55,
    getText: (state) => `${state.relationship.partner?.name} מזמין/ה אותך לארוחת שישי ראשונה עם המשפחה שלו/ה.`,
    choices: [
      {
        id: 'charm',
        text: 'להתאמץ ולעשות רושם טוב',
        outcome: 'הבאת עוגה, שאלת שאלות מנומסות והצלחת לגרום לאמא שלו/ה לחייך. עברת בהצלחה.',
        effects: { stats: { relationship: 6, happiness: 3 }, relationshipScore: 6, xp: 15 },
      },
      {
        id: 'awkward',
        text: 'להיות עצמך, גם אם זה קצת מביך',
        outcome: 'הערב היה קצת מביך, אבל היית אמיתי/ת. בן/בת הזוג שלך דווקא אהב/ה את זה.',
        effects: { stats: { relationship: 3, happiness: 4 }, relationshipScore: 3, xp: 10 },
      },
    ],
  },
]

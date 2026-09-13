import { startJob } from '../../engine/career'
import type { Choice, GameEvent } from '../../types'

// Music/theater/influencer are handled by 'creative_calling' in
// entertainment.ts - kept out of this map so the two events don't offer
// the same path twice.
const INTEREST_CAREER_MAP: Record<string, { trackId: string; text: string; outcome: string }> = {
  ספורט: {
    trackId: 'fitness',
    text: '🏋️ להפוך את הספורט למקצוע - מאמן/ת כושר',
    outcome: 'התחלת ללמד אחרים איך להתאמן. הגוף שלך תמיד היה כלי העבודה הכי טוב שלך.',
  },
  אמנות: {
    trackId: 'visualArt',
    text: '🎨 לצייר ולמכור את היצירות שלך',
    outcome: 'התחלת למכור ציורים ראשונים בשוק פשפשים קטן. זו רק ההתחלה.',
  },
  טכנולוגיה: {
    trackId: 'tech',
    text: '💻 ללמד את עצמך לתכנת ולהתחיל לקודד',
    outcome: 'למדת לתכנת מיוטיוב ומקורסים אונליין, וכתבת את התוכנית הראשונה שלך.',
  },
  טבע: {
    trackId: 'nature',
    text: '🌿 לעבוד כמדריך/ת בטבע',
    outcome: 'התחלת להוביל קבוצות בשבילים שאת/ה מכיר/ה בעל פה. האוויר הפתוח מרגיש כמו משרד.',
  },
  בישול: {
    trackId: 'culinary',
    text: '👨‍🍳 להיכנס למטבח מקצועי',
    outcome: 'קיבלת משרה ראשונה כטבח/ית זוטר/ה. הידיים נכוות, אבל האוכל שאת/ה מבשל/ת משתפר בכל יום.',
  },
  משחקים: {
    trackId: 'gaming',
    text: '🎮 לנסות להתפרנס מגיימינג',
    outcome: 'התחלת לשדר את המשחקים שלך באינטרנט. עוד לא עשיר/ה, אבל כבר יש קהל קבוע.',
  },
  קריאה: {
    trackId: 'writing',
    text: '✍️ להתחיל לכתוב ברצינות',
    outcome: 'פתחת בלוג וכתבת את הפוסט הראשון שלך. מסתבר שיש לך עוד הרבה מה לומר.',
  },
  טיולים: {
    trackId: 'tourism',
    text: '✈️ להפוך את התשוקה לטיולים למקצוע',
    outcome: 'התחלת להדריך קבוצות תיירים. כל יום עבודה שלך נראה כמו החופשה של מישהו אחר.',
  },
  יזמות: {
    trackId: 'entrepreneur',
    text: '🚀 לפתוח עסק עצמאי קטן',
    outcome: 'פתחת את העסק הראשון שלך - קטן בינתיים, אבל כולו שלך.',
  },
}

export const passionEvents: GameEvent[] = [
  {
    id: 'passion_project',
    category: 'career',
    icon: '✨',
    title: 'ללכת על התחום שאת/ה הכי אוהב/ת',
    once: true,
    minAge: 18,
    maxAge: 32,
    condition: (state) => state.career.unemployed && state.character.interests.some((i) => i in INTEREST_CAREER_MAP),
    weight: 1.8,
    getText: () => 'יש לך כמה תחומי עניין שתמיד משכו אותך. אולי הגיע הזמן להפוך אחד מהם למקצוע?',
    choices: (state) => {
      const options: Choice[] = state.character.interests
        .map((i) => INTEREST_CAREER_MAP[i])
        .filter((opt): opt is (typeof INTEREST_CAREER_MAP)[string] => !!opt)
        .map((opt) => ({
          id: opt.trackId,
          text: opt.text,
          outcome: opt.outcome,
          effects: { stats: { happiness: 6, career: 3 }, xp: 20, flags: { hadFirstJob: true } },
          custom: (s) => ({ career: startJob(s, opt.trackId, 1) }),
        }))
      options.push({
        id: 'skip',
        text: 'להישאר פתוח/ה ולראות מה השוק מציע',
        outcome: 'החלטת לא להתחייב לתחום עניין ספציפי כרגע ולהישאר גמיש/ה.',
        effects: { xp: 10 },
      })
      return options
    },
  },
]

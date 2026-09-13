import type { Gender } from '../types'

type Pair = { masc: string; fem: string }

// The source text is written with neutral "X/Y" dual forms throughout (the
// standard Hebrew convention when gender is unknown). This is a curated,
// deliberately conservative dictionary of the common, high-frequency,
// unambiguous ones - anything not listed here passes through unchanged,
// which is the safe default: neutral dual-form Hebrew is still correct,
// readable text, just not tailored to a specific gender.
const PLAYER_FORMS: Record<string, Pair> = {
  'את/ה': { masc: 'אתה', fem: 'את' },
  'אתה/את': { masc: 'אתה', fem: 'את' },
  'מרגיש/ה': { masc: 'מרגיש', fem: 'מרגישה' },
  'בטוח/ה': { masc: 'בטוח', fem: 'בטוחה' },
  'תרצה/י': { masc: 'תרצה', fem: 'תרצי' },
  'יודע/ת': { masc: 'יודע', fem: 'יודעת' },
  'עובד/ת': { masc: 'עובד', fem: 'עובדת' },
  'מתחיל/ה': { masc: 'מתחיל', fem: 'מתחילה' },
  'אוהב/ת': { masc: 'אוהב', fem: 'אוהבת' },
  'עייף/ה': { masc: 'עייף', fem: 'עייפה' },
  'חושב/ת': { masc: 'חושב', fem: 'חושבת' },
  'חייב/ת': { masc: 'חייב', fem: 'חייבת' },
  'בודק/ת': { masc: 'בודק', fem: 'בודקת' },
  'רגוע/ה': { masc: 'רגוע', fem: 'רגועה' },
  'תזכיר/י': { masc: 'תזכיר', fem: 'תזכירי' },
  'תבחר/י': { masc: 'תבחר', fem: 'תבחרי' },
  'תהיה/י': { masc: 'תהיה', fem: 'תהיי' },
  'שתהיה/י': { masc: 'שתהיה', fem: 'שתהיי' },
  'מציאותי/ת': { masc: 'מציאותי', fem: 'מציאותית' },
  'רלוונטי/ת': { masc: 'רלוונטי', fem: 'רלוונטית' },
  'עצמאי/ת': { masc: 'עצמאי', fem: 'עצמאית' },
  'עצבני/ת': { masc: 'עצבני', fem: 'עצבנית' },
  'אמיתי/ת': { masc: 'אמיתי', fem: 'אמיתית' },
  'גמיש/ה': { masc: 'גמיש', fem: 'גמישה' },
  'חדש/ה': { masc: 'חדש', fem: 'חדשה' },
  'מבין/ה': { masc: 'מבין', fem: 'מבינה' },
  'מוכן/ה': { masc: 'מוכן', fem: 'מוכנה' },
}

// Third-person forms - only substituted for events where the referent is
// known with confidence to be the player's partner (see
// PARTNER_CONTEXT_EVENT_IDS below). The same tokens elsewhere (an old
// friend, a wallet's owner, a critic) refer to people whose gender the
// game never tracks, so leaving those neutral is correct, not a bug.
const PARTNER_FORMS: Record<string, Pair> = {
  'הוא/היא': { masc: 'הוא', fem: 'היא' },
  'שלו/ה': { masc: 'שלו', fem: 'שלה' },
  'איתו/ה': { masc: 'איתו', fem: 'איתה' },
  'לו/ה': { masc: 'לו', fem: 'לה' },
  'בן/בת הזוג': { masc: 'בן הזוג', fem: 'בת הזוג' },
  'ולדעתו/ה': { masc: 'ולדעתו', fem: 'ולדעתה' },
  'מזמין/ה': { masc: 'מזמין', fem: 'מזמינה' },
  'אהב/ה': { masc: 'אהב', fem: 'אהבה' },
  'בכה/תה': { masc: 'בכה', fem: 'בכתה' },
  'ואמר/ה': { masc: 'ואמר', fem: 'ואמרה' },
}

export const PARTNER_CONTEXT_EVENT_IDS = new Set([
  'partner_wants_to_talk',
  'move_in_together',
  'proposal',
  'relationship_crisis',
  'meet_the_parents',
  'children_decision',
  'parenting_disagreement',
])

function applyForms(text: string, gender: 'male' | 'female', forms: Record<string, Pair>): string {
  let result = text
  for (const [token, pair] of Object.entries(forms)) {
    if (!result.includes(token)) continue
    result = result.split(token).join(gender === 'male' ? pair.masc : pair.fem)
  }
  return result
}

export function genderizeText(text: string, playerGender: Gender, partnerGender?: 'male' | 'female'): string {
  let result = text
  if (playerGender === 'male' || playerGender === 'female') {
    result = applyForms(result, playerGender, PLAYER_FORMS)
  }
  if (partnerGender) {
    result = applyForms(result, partnerGender, PARTNER_FORMS)
  }
  return result
}

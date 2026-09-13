// Core domain types for the life-simulator game engine.
// Kept data-agnostic so new content (events, careers, cities...) can be
// added under src/data without touching this file.

export type StatKey =
  | 'money'
  | 'happiness'
  | 'career'
  | 'education'
  | 'housing'
  | 'family'
  | 'friends'
  | 'relationship'
  | 'energy'
  | 'skills'
  | 'reputation'

export const STAT_KEYS: StatKey[] = [
  'money',
  'happiness',
  'career',
  'education',
  'housing',
  'family',
  'friends',
  'relationship',
  'energy',
  'skills',
  'reputation',
]

export const STAT_META: Record<StatKey, { label: string; icon: string }> = {
  money: { label: 'כסף', icon: '💰' },
  happiness: { label: 'אושר', icon: '😊' },
  career: { label: 'קריירה', icon: '💼' },
  education: { label: 'השכלה', icon: '🎓' },
  housing: { label: 'מגורים', icon: '🏠' },
  family: { label: 'משפחה', icon: '👨‍👩‍👧' },
  friends: { label: 'חברים', icon: '👥' },
  relationship: { label: 'זוגיות', icon: '❤️' },
  energy: { label: 'אנרגיה', icon: '⚡' },
  skills: { label: 'כישורים', icon: '🧠' },
  reputation: { label: 'מוניטין', icon: '⭐' },
}

// Hidden stats influence eligibility/odds of future events but are never
// shown directly on the dashboard - they surface only via narrative hints.
export type HiddenStatKey = 'luck' | 'stress' | 'ambitionDrift'

export const HIDDEN_STAT_KEYS: HiddenStatKey[] = ['luck', 'stress', 'ambitionDrift']

export type StatBlock = Record<StatKey, number>
export type HiddenStatBlock = Record<HiddenStatKey, number>

export type TraitId =
  | 'ambitious'
  | 'lazy'
  | 'social'
  | 'introvert'
  | 'charismatic'
  | 'smart'
  | 'funny'
  | 'adventurous'
  | 'frugal'
  | 'spender'
  | 'romantic'
  | 'cynical'

export type RomanticPreference = 'men' | 'women' | 'everyone'
export type Gender = 'male' | 'female' | 'other'

export type FamilyWealth = 'poor' | 'middle' | 'wealthy'

export type LifeStage =
  | 'youngAdult' // 18-22
  | 'earlyCareer' // 22-30
  | 'careerAndFamily' // 30-40
  | 'establishment' // 40-50
  | 'midlifeShift' // 50-65
  | 'retirement' // 65+

export interface Character {
  name: string
  age: number
  gender: Gender
  romanticPreference: RomanticPreference
  city: string
  familyWealth: FamilyWealth
  traits: TraitId[]
  interests: string[]
}

export interface EducationRecord {
  path: 'university' | 'college' | 'vocational' | 'courses' | 'none'
  field?: string
  status: 'notStarted' | 'inProgress' | 'graduated' | 'droppedOut' | 'failed'
  degreeLevel: number // 0 = none, 1 = BA/tech diploma, 2 = MA, 3 = PhD
}

export interface CareerState {
  trackId: string | null
  jobId: string | null
  title: string
  level: number
  salary: number
  yearsInRole: number
  unemployed: boolean
}

export interface PartnerNPC {
  id: string
  name: string
  personalityTraits: TraitId[]
  occupation: string
  financialStatus: FamilyWealth
  compatibility: number // 0-100, static "fit" with the player
}

export interface RelationshipState {
  status: 'single' | 'dating' | 'married' | 'divorced' | 'widowed'
  partner: PartnerNPC | null
  relationshipScore: number // 0-100 health of current relationship
  history: { partnerName: string; endedAs: 'brokeUp' | 'divorced' | 'widowed' }[]
}

export interface Child {
  id: string
  name: string
  birthYear: number
  stage: 'infant' | 'kindergarten' | 'school' | 'army' | 'adult'
}

export interface FamilyState {
  children: Child[]
  wantsChildren: boolean | null
}

export interface FinanceState {
  savings: number
  debt: number
  monthlyExpenses: number
  ownsHome: boolean
  mortgage: number
}

// ---- Scoring system -------------------------------------------------

export interface StatDelta {
  stat: StatKey
  amount: number
}

export interface ScoreLogEntry {
  year: number
  age: number
  label: string
  outcome?: string
  visibleEffects: StatDelta[]
  hiddenEffects: StatDelta[]
  xpGain: number
  pointsGain: number
}

export interface ScoreState {
  xp: number
  level: number
  totalPoints: number // headline "life score", both stat- and xp-derived
  history: ScoreLogEntry[]
}

// ---- Effects & choices ------------------------------------------------

// An effect payload attachable to any choice or scheduled consequence.
export interface EffectPayload {
  stats?: Partial<Record<StatKey, number>>
  hiddenStats?: Partial<Record<HiddenStatKey, number>>
  xp?: number
  money?: number // direct cash delta, separate from the "money" stat scale
  // Nudges the internal courtship gate (relationship.relationshipScore) that
  // decides eligibility for move-in/marriage/crisis events - distinct from
  // the visible "relationship" stat, so a choice can carry both.
  relationshipScore?: number
  flags?: Record<string, boolean | number | string>
  scheduleEvent?: { eventId: string; inYears: number }
}

export interface Choice {
  id: string
  text: string
  // One or two sentences of what actually happened - shown in the result
  // panel so a decision reads as a story beat, not just a row of stat chips.
  outcome: string
  effects: EffectPayload
  // Effects that are not surfaced in the immediate result popup - they still
  // land on the state, and their existence is only revealed in the life
  // summary or via a later, seemingly unrelated event.
  hidden?: EffectPayload
  requires?: (state: GameState) => boolean
  // Weighted random follow-on branches evaluated right after the base
  // `effects` are picked, before anything is applied - so the same choice
  // can play out differently each time. `outcome` is appended onto the
  // choice's own outcome sentence ("you did X. <variant outcome>"), and
  // `effects` (optional) are merged into the base effects before they land.
  // This is how "not every decision turns out the way you hoped" works:
  // e.g. keeping a found wallet usually goes unnoticed, but sometimes the
  // owner recognizes you later.
  chance?: {
    weight: number
    outcome: string
    effects?: EffectPayload
    custom?: (state: GameState, rng: () => number) => Partial<GameState>
  }[]
  // Escape hatch for mutations the generic stat/xp/flag system can't express
  // (starting a job, beginning to date someone, having a child...). Returns a
  // partial GameState that gets merged on top of the state after the generic
  // effects above have already been applied.
  custom?: (state: GameState, rng: () => number) => Partial<GameState>
}

export interface GameEvent {
  id: string
  category: 'career' | 'romance' | 'family' | 'israel' | 'random' | 'finance' | 'education' | 'leisure'
  title: string
  icon: string
  getText: (state: GameState) => string
  choices: Choice[] | ((state: GameState) => Choice[])
  // Eligibility gate beyond category/life-stage weighting.
  condition?: (state: GameState) => boolean
  minAge?: number
  maxAge?: number
  weight?: number | ((state: GameState) => number)
  once?: boolean
  sensitive?: boolean // security/war-related content - handled respectfully, never comedic
}

export interface ScheduledEvent {
  eventId: string
  triggerYear: number
}

export interface GameState {
  character: Character
  education: EducationRecord
  career: CareerState
  relationship: RelationshipState
  family: FamilyState
  finance: FinanceState
  stats: StatBlock
  hiddenStats: HiddenStatBlock
  score: ScoreState
  flags: Record<string, boolean | number | string>
  scheduledEvents: ScheduledEvent[]
  firedEventIds: string[]
  year: number
  lifeStage: LifeStage
  currentEvent: { eventId: string; resolvedChoiceId?: string } | null
  lastResult: ScoreLogEntry | null
  gameOver: boolean
  turnCount: number
}

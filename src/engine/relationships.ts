import { randomNpcName } from '../data/names'
import { CAREER_TRACKS } from '../data/careers'
import { TRAITS } from '../data/traits'
import type { FamilyWealth, GameState, PartnerNPC, TraitId } from '../types'
import { pick, randomInt, type Rng } from './random'

let npcCounter = 0

export function generatePartner(state: GameState, rng: Rng): PartnerNPC {
  npcCounter += 1
  const traitPool: TraitId[] = TRAITS.map((t) => t.id)
  const traits = [pick(traitPool, rng), pick(traitPool, rng)].filter(
    (v, i, arr) => arr.indexOf(v) === i,
  )
  const track = pick(CAREER_TRACKS, rng)
  const wealthOptions: FamilyWealth[] = ['poor', 'middle', 'wealthy']

  let compatibility = randomInt(30, 90, rng)
  const sharedTraits = traits.filter((t) => state.character.traits.includes(t))
  compatibility += sharedTraits.length * 8
  if (state.character.traits.includes('romantic') && traits.includes('romantic')) compatibility += 10

  return {
    id: `npc-${Date.now()}-${npcCounter}`,
    name: randomNpcName(rng),
    personalityTraits: traits,
    occupation: pick(track.levels, rng).title,
    financialStatus: pick(wealthOptions, rng),
    compatibility: Math.max(5, Math.min(99, compatibility)),
  }
}

export function relationshipHealthDrift(state: GameState, rng: Rng): number {
  if (!state.relationship.partner) return 0
  // Compatibility is the dominant signal so a good match reliably climbs
  // toward marriage over a few years and a bad one reliably decays - noise
  // adds texture without drowning out the player's original choice of partner.
  const base = (state.relationship.partner.compatibility - 50) / 8
  const energyPenalty = state.stats.energy < 30 ? -2 : 0
  const noise = randomInt(-2, 2, rng)
  return Math.round(base + energyPenalty + noise)
}

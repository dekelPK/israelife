// Thin wrapper around Math.random so the rest of the engine depends on an
// injectable RNG interface rather than the global - keeps event selection
// and NPC generation testable/replaceable later (e.g. seeded runs).

export type Rng = () => number

export const defaultRng: Rng = () => Math.random()

export function pick<T>(arr: T[], rng: Rng = defaultRng): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function chance(probability: number, rng: Rng = defaultRng): boolean {
  return rng() < probability
}

export function weightedPick<T>(items: { item: T; weight: number }[], rng: Rng = defaultRng): T | null {
  const total = items.reduce((sum, i) => sum + Math.max(0, i.weight), 0)
  if (total <= 0) return null
  let roll = rng() * total
  for (const entry of items) {
    roll -= Math.max(0, entry.weight)
    if (roll <= 0) return entry.item
  }
  return items[items.length - 1]?.item ?? null
}

export function randomInt(min: number, max: number, rng: Rng = defaultRng): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

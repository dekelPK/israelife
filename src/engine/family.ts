import type { Child, GameState } from '../types'

export function stageForChildAge(age: number): Child['stage'] {
  if (age < 3) return 'infant'
  if (age < 6) return 'kindergarten'
  if (age < 18) return 'school'
  if (age < 21) return 'army'
  return 'adult'
}

export function ageChildren(state: GameState): Child[] {
  return state.family.children.map((child) => {
    const age = state.year + 1 - child.birthYear
    return { ...child, stage: stageForChildAge(age) }
  })
}

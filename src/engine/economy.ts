import { findCity } from '../data/cities'
import type { GameState } from '../types'

function cityMultiplier(cityValue: string): number {
  return findCity(cityValue)?.costOfLiving ?? 1
}

export interface YearlyFinanceResult {
  savings: number
  monthlyExpenses: number
  moneyStatDelta: number
  netAnnual: number
}

// One year of income vs. cost-of-living. Kept separate from the "money"
// gameplay stat: this moves the real ₪ balance (finance.savings) used for
// the end-game life summary, and only nudges the money stat to reflect
// whether the character's economic reality is improving or crumbling.
export function computeYearlyFinance(state: GameState): YearlyFinanceResult {
  const mult = cityMultiplier(state.character.city)
  const traits = state.character.traits
  let baseMonthly = 3200 * mult
  baseMonthly += state.family.children.filter((c) => c.stage !== 'adult').length * 1100 * mult
  if (state.finance.ownsHome) baseMonthly += state.finance.mortgage
  else baseMonthly += 1900 * mult * (0.6 + state.stats.housing / 200)

  if (traits.includes('frugal')) baseMonthly *= 0.85
  if (traits.includes('spender')) baseMonthly *= 1.2

  const annualIncome = state.career.salary * 12
  const annualExpenses = baseMonthly * 12
  const debtInterest = state.finance.debt * 0.06
  const netAnnual = annualIncome - annualExpenses - debtInterest

  const nextSavings = state.finance.savings + netAnnual

  let moneyStatDelta = 0
  if (netAnnual > 30000) moneyStatDelta = 3
  else if (netAnnual > 0) moneyStatDelta = 1
  else if (netAnnual > -20000) moneyStatDelta = -2
  else moneyStatDelta = -4
  if (nextSavings < 0) moneyStatDelta -= 2

  return { savings: nextSavings, monthlyExpenses: Math.round(baseMonthly), moneyStatDelta, netAnnual }
}

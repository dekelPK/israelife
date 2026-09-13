import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, GameState } from '../types'
import { createInitialState } from '../engine/gameInit'
import { advanceYear } from '../engine/turn'
import { applyChoice } from '../engine/applyChoice'
import { resolveChoices } from '../engine/events'
import { getEventById } from '../data/events'
import { defaultRng } from '../engine/random'

export type Screen = 'start' | 'creation' | 'playing' | 'summary'

interface GameStoreState {
  game: GameState | null
  screen: Screen
  startCreation: () => void
  continueGame: () => void
  newGame: (character: Character) => void
  chooseOption: (choiceId: string, inputValue?: string) => void
  continueToNextYear: () => void
  endGameNow: () => void
  backToStart: () => void
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      game: null,
      screen: 'start',

      startCreation: () => set({ screen: 'creation' }),

      continueGame: () => {
        const { game } = get()
        if (game) set({ screen: game.gameOver ? 'summary' : 'playing' })
      },

      newGame: (character) => {
        const game = createInitialState(character)
        set({ game, screen: 'playing' })
      },

      chooseOption: (choiceId, inputValue) => {
        const { game } = get()
        if (!game || !game.currentEvent) return
        const event = getEventById(game.currentEvent.eventId)
        if (!event) return
        const choices = resolveChoices(game, event)
        const choice = choices.find((c) => c.id === choiceId)
        if (!choice) return
        const next = applyChoice(game, event, choice, defaultRng, inputValue)
        set({ game: next, screen: next.gameOver ? 'summary' : 'playing' })
      },

      continueToNextYear: () => {
        const { game } = get()
        if (!game) return
        const next = advanceYear(game, defaultRng)
        set({ game: next, screen: next.gameOver ? 'summary' : 'playing' })
      },

      endGameNow: () => {
        const { game } = get()
        if (!game) return
        set({ game: { ...game, gameOver: true, currentEvent: null }, screen: 'summary' })
      },

      backToStart: () => set({ game: null, screen: 'start' }),
    }),
    { name: 'israelife-save' },
  ),
)

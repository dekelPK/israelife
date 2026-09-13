import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { getEventById } from '../data/events'
import { resolveChoices } from '../engine/events'
import { genderizeText, PARTNER_CONTEXT_EVENT_IDS } from '../engine/genderize'
import type { GameState } from '../types'

const CATEGORY_STYLE: Record<string, string> = {
  career: 'from-sky-500/20 to-sky-500/5 border-sky-500/40',
  romance: 'from-pink-500/20 to-pink-500/5 border-pink-500/40',
  family: 'from-amber-500/20 to-amber-500/5 border-amber-500/40',
  israel: 'from-blue-500/20 to-blue-500/5 border-blue-500/40',
  random: 'from-violet-500/20 to-violet-500/5 border-violet-500/40',
  finance: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/40',
  education: 'from-teal-500/20 to-teal-500/5 border-teal-500/40',
  leisure: 'from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-500/40',
}

export function EventCard({ game }: { game: GameState }) {
  const chooseOption = useGameStore((s) => s.chooseOption)
  const [inputs, setInputs] = useState<Record<string, string>>({})

  if (!game.currentEvent) return null
  const event = getEventById(game.currentEvent.eventId)
  if (!event) return null
  const choices = resolveChoices(game, event)
  const style = CATEGORY_STYLE[event.category] ?? CATEGORY_STYLE.random
  const partnerGender = PARTNER_CONTEXT_EVENT_IDS.has(event.id) ? game.relationship.partner?.gender : undefined
  const text = genderizeText(event.getText(game), game.character.gender, partnerGender)

  return (
    <div className={`rounded-2xl border bg-gradient-to-b ${style} p-6 space-y-4 shadow-xl`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{event.icon}</span>
        <h2 className="text-xl font-bold">{event.title}</h2>
      </div>
      <p className="text-slate-200 leading-relaxed">{text}</p>
      <div className="flex flex-col gap-2 pt-2">
        {choices.map((choice) => {
          if (!choice.promptInput) {
            return (
              <button
                key={choice.id}
                onClick={() => chooseOption(choice.id)}
                className="text-right px-4 py-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-700 hover:border-slate-500 transition font-medium"
              >
                {choice.text}
              </button>
            )
          }
          const value = inputs[choice.id] ?? ''
          return (
            <div key={choice.id} className="rounded-xl bg-slate-950/60 border border-slate-700 p-3 space-y-2">
              <label className="text-xs text-slate-400 block">{choice.promptInput.label}</label>
              <input
                value={value}
                maxLength={choice.promptInput.maxLength ?? 30}
                placeholder={choice.promptInput.placeholder}
                onChange={(e) => setInputs((prev) => ({ ...prev, [choice.id]: e.target.value }))}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-sky-500"
              />
              <button
                onClick={() => chooseOption(choice.id, value.trim())}
                disabled={!value.trim()}
                className="w-full text-center px-4 py-2 rounded-lg bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 hover:bg-emerald-400 text-slate-950 font-semibold transition"
              >
                {choice.text}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

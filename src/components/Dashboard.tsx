import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { StatsBar } from './StatsBar'
import { EventCard } from './EventCard'
import { ResultPanel } from './ResultPanel'
import { findCity } from '../data/cities'
import { LIFE_STAGE_LABELS } from '../engine/time'

const RELATIONSHIP_LABEL: Record<string, string> = {
  single: 'רווק/ה',
  dating: 'בזוגיות',
  married: 'נשוי/אה',
  divorced: 'גרוש/ה',
  widowed: 'אלמן/ה',
}

export function Dashboard() {
  const game = useGameStore((s) => s.game)
  const endGameNow = useGameStore((s) => s.endGameNow)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [game?.currentEvent?.eventId, game?.lastResult])

  if (!game) return null

  const city = findCity(game.character.city)?.label ?? game.character.city

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-10 shadow-lg shadow-black/20">
        <div className="max-w-3xl mx-auto px-4 py-5 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h1 className="font-black text-2xl sm:text-3xl">
              {game.character.name} <span className="text-slate-400 font-bold text-xl">· גיל {game.character.age}</span>
            </h1>
            <p className="text-sm text-slate-400">
              {LIFE_STAGE_LABELS[game.lifeStage]} · {city} · שנה {game.year}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-slate-800 text-sm font-semibold">💼 {game.career.title}</span>
            <span className="px-3 py-1.5 rounded-full bg-slate-800 text-sm font-semibold">
              ❤️ {RELATIONSHIP_LABEL[game.relationship.status]}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-sm font-bold">
              💰 ₪{Math.round(game.finance.savings).toLocaleString('he-IL')}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-sm font-bold">
              ⭐ Lv.{game.score.level}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-xl py-3">
            <div className="text-xs text-slate-500">משכורת חודשית</div>
            <div className="font-bold">₪{game.career.salary.toLocaleString('he-IL')}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl py-3">
            <div className="text-xs text-slate-500">ניקוד חיים</div>
            <div className="font-bold">{game.score.totalPoints}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl py-3">
            <div className="text-xs text-slate-500">ילדים</div>
            <div className="font-bold">{game.family.children.length}</div>
          </div>
        </div>

        <StatsBar stats={game.stats} />

        {game.currentEvent ? (
          <EventCard game={game} />
        ) : game.lastResult ? (
          <ResultPanel result={game.lastResult} />
        ) : null}

        <div className="text-center pt-4">
          <button onClick={endGameNow} className="text-xs text-slate-500 hover:text-slate-300 underline">
            לסיים את המשחק ולצפות בסיכום החיים
          </button>
        </div>
      </main>
    </div>
  )
}

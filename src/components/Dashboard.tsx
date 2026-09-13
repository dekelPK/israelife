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
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-lg">
              {game.character.name} · גיל {game.character.age}
            </h1>
            <p className="text-xs text-slate-400">
              {LIFE_STAGE_LABELS[game.lifeStage]} · {city} · שנה {game.year}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>💼 {game.career.title}</span>
            <span>❤️ {RELATIONSHIP_LABEL[game.relationship.status]}</span>
            <span className="text-amber-400 font-bold">⭐ Lv.{game.score.level}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-xl py-3">
            <div className="text-xs text-slate-500">חסכונות</div>
            <div className="font-bold">₪{Math.round(game.finance.savings).toLocaleString('he-IL')}</div>
          </div>
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

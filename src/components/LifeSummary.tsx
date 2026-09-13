import { useGameStore } from '../store/gameStore'
import { generateLifeSummary } from '../engine/lifeSummary'
import { findCity } from '../data/cities'

export function LifeSummary() {
  const game = useGameStore((s) => s.game)
  const backToStart = useGameStore((s) => s.backToStart)
  const startCreation = useGameStore((s) => s.startCreation)
  if (!game) return null

  const summary = generateLifeSummary(game)
  const city = findCity(game.character.city)?.label ?? game.character.city

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 px-4"
      style={{
        paddingTop: 'calc(2.5rem + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl">📖</div>
          <h1 className="text-3xl font-black">סיפור החיים של {game.character.name}</h1>
          <p className="text-slate-400">גיל {summary.finalAge} · {city}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <Row label="קריירה" value={summary.careerTitle} />
          <Row label="השכלה" value={summary.educationLabel} />
          <Row label="הון" value={`₪${summary.netWorth.toLocaleString('he-IL')}`} />
          <Row label="נישואים" value={String(summary.marriages)} />
          <Row label="ילדים" value={String(summary.children)} />
          <Row label="אושר" value={`${summary.happiness}/100`} />
          <Row label="ניקוד חיים כולל" value={`${summary.lifeScore} (רמה ${summary.level})`} />
        </div>

        {summary.bigDecision && (
          <div className="bg-gradient-to-l from-amber-500/15 to-transparent border border-amber-500/30 rounded-2xl p-6">
            <h2 className="font-bold text-amber-300 mb-1">ההחלטה ששינתה את חייך</h2>
            <p className="text-slate-200 font-semibold">
              בגיל {summary.bigDecision.age}: {summary.bigDecision.label}
            </p>
            {summary.bigDecision.outcome && (
              <p className="text-slate-300 mt-1">{summary.bigDecision.outcome}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <h2 className="font-bold text-slate-300">🏅 תארי כבוד</h2>
          <div className="grid grid-cols-2 gap-2">
            {summary.awards.map((a) => (
              <div key={a.label} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="text-2xl">{a.icon}</span>
                <span className="text-sm font-semibold">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={startCreation}
            className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition"
          >
            🔄 להתחיל חיים חדשים
          </button>
          <button
            onClick={backToStart}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold transition"
          >
            🏠 למסך הפתיחה
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

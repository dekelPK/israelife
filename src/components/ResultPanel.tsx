import { useGameStore } from '../store/gameStore'
import { STAT_META } from '../types'
import type { ScoreLogEntry } from '../types'

function DeltaChip({ stat, amount }: { stat: keyof typeof STAT_META; amount: number }) {
  const meta = STAT_META[stat]
  const positive = amount > 0
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold ${
        positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
      }`}
    >
      {meta.icon} {meta.label} {positive ? '+' : ''}
      {amount}
    </span>
  )
}

export function ResultPanel({ result }: { result: ScoreLogEntry }) {
  const continueToNextYear = useGameStore((s) => s.continueToNextYear)

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-200">📊 תוצאת ההחלטה</h2>
        <span className="text-xs text-slate-500">{result.label}</span>
      </div>

      {result.visibleEffects.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {result.visibleEffects.map((d, i) => (
            <DeltaChip key={i} stat={d.stat} amount={d.amount} />
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm">ההחלטה הזו לא שינתה מדדים גלויים... הפעם.</p>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-slate-800">
        <span className="text-amber-400 font-bold">✨ +{result.xpGain} XP</span>
        <span className={`font-bold ${result.pointsGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {result.pointsGain >= 0 ? '+' : ''}
          {result.pointsGain} נק׳ ניקוד חיים
        </span>
      </div>

      <button
        onClick={continueToNextYear}
        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition"
      >
        ⏭️ להמשיך לשנה הבאה
      </button>
    </div>
  )
}

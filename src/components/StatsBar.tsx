import { STAT_KEYS, STAT_META, type StatBlock } from '../types'

function barColor(value: number): string {
  if (value >= 70) return 'bg-emerald-500'
  if (value >= 40) return 'bg-amber-500'
  return 'bg-rose-500'
}

export function StatsBar({ stats }: { stats: StatBlock }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {STAT_KEYS.map((key) => {
        const meta = STAT_META[key]
        const value = stats[key]
        return (
          <div key={key} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>
                {meta.icon} {meta.label}
              </span>
              <span className="font-mono">{value}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className={`h-full ${barColor(value)} transition-all`} style={{ width: `${value}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

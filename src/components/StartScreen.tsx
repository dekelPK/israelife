import { useGameStore } from '../store/gameStore'

export function StartScreen() {
  const game = useGameStore((s) => s.game)
  const startCreation = useGameStore((s) => s.startCreation)
  const continueGame = useGameStore((s) => s.continueGame)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 text-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="space-y-3">
        <div className="text-6xl">🇮🇱</div>
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-l from-sky-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
          החיים בישראל
        </h1>
        <p className="text-slate-400 max-w-md mx-auto">
          סימולטור חיים ישראלי — בנה/י דמות, קבל/י החלטות, וגלה/י איזה סיפור חיים ייחודי מחכה לך הפעם.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-64">
        {game && (
          <button
            onClick={continueGame}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20"
          >
            ▶️ המשך משחק ({game.character.name}, גיל {game.character.age})
          </button>
        )}
        <button
          onClick={startCreation}
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold transition"
        >
          🎮 {game ? 'התחל משחק חדש' : 'משחק חדש'}
        </button>
      </div>
    </div>
  )
}

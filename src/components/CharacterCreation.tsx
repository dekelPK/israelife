import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { CITIES } from '../data/cities'
import { TRAITS, MAX_TRAITS } from '../data/traits'
import type { Character, FamilyWealth, Gender, RomanticPreference, TraitId } from '../types'

const GENDERS: { id: Gender; label: string }[] = [
  { id: 'male', label: 'גבר' },
  { id: 'female', label: 'אישה' },
  { id: 'other', label: 'אחר' },
]

const PREFERENCES: { id: RomanticPreference; label: string }[] = [
  { id: 'men', label: 'גברים' },
  { id: 'women', label: 'נשים' },
  { id: 'everyone', label: 'כולם' },
]

const WEALTH: { id: FamilyWealth; label: string; desc: string }[] = [
  { id: 'poor', label: 'מצומצם', desc: 'המשפחה מתקשה כלכלית' },
  { id: 'middle', label: 'בינוני', desc: 'משפחה ממוצעת' },
  { id: 'wealthy', label: 'אמיד', desc: 'המשפחה מבוססת כלכלית' },
]

const INTERESTS = ['ספורט', 'מוזיקה', 'טכנולוגיה', 'אמנות', 'טבע', 'בישול', 'משחקים', 'קריאה', 'טיולים', 'יזמות']

export function CharacterCreation() {
  const newGame = useGameStore((s) => s.newGame)
  const [name, setName] = useState('')
  const [age, setAge] = useState(18)
  const [gender, setGender] = useState<Gender>('male')
  const [pref, setPref] = useState<RomanticPreference>('everyone')
  const [city, setCity] = useState(CITIES[0].label)
  const [wealth, setWealth] = useState<FamilyWealth>('middle')
  const [traits, setTraits] = useState<TraitId[]>([])
  const [interests, setInterests] = useState<string[]>([])

  const toggleTrait = (id: TraitId) => {
    setTraits((prev) => {
      if (prev.includes(id)) return prev.filter((t) => t !== id)
      if (prev.length >= MAX_TRAITS) return prev
      return [...prev, id]
    })
  }

  const toggleInterest = (label: string) => {
    setInterests((prev) => (prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]))
  }

  const canSubmit = name.trim().length > 0 && traits.length > 0 && city.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    const character: Character = {
      name: name.trim(),
      age,
      gender,
      romanticPreference: pref,
      city: city.trim(),
      familyWealth: wealth,
      traits,
      interests,
    }
    newGame(character)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-black text-center">✨ יצירת דמות</h1>

        <section className="space-y-2">
          <label className="text-sm text-slate-400">שם</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="איך קוראים לדמות שלך?"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 outline-none focus:border-emerald-500"
          />
        </section>

        <section className="space-y-2">
          <label className="text-sm text-slate-400">גיל התחלתי: {age}</label>
          <input
            type="range"
            min={18}
            max={25}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </section>

        <section className="space-y-2">
          <label className="text-sm text-slate-400">מגדר</label>
          <div className="flex gap-2 flex-wrap">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                onClick={() => setGender(g.id)}
                className={`px-4 py-2 rounded-lg border ${gender === g.id ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold' : 'border-slate-700 hover:border-slate-500'}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <label className="text-sm text-slate-400">העדפה רומנטית</label>
          <div className="flex gap-2 flex-wrap">
            {PREFERENCES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPref(p.id)}
                className={`px-4 py-2 rounded-lg border ${pref === p.id ? 'bg-pink-500 text-slate-950 border-pink-500 font-bold' : 'border-slate-700 hover:border-slate-500'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <label className="text-sm text-slate-400" htmlFor="city-input">
            עיר מגורים
          </label>
          <input
            id="city-input"
            list="city-options"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="הקלד/י עיר, או בחר/י מהרשימה"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 outline-none focus:border-sky-500 text-slate-100"
          />
          <datalist id="city-options">
            {CITIES.map((c) => (
              <option key={c.id} value={c.label} />
            ))}
          </datalist>
          {CITIES.find((c) => c.label === city) && (
            <p className="text-xs text-slate-500">{CITIES.find((c) => c.label === city)?.vibe}</p>
          )}
        </section>

        <section className="space-y-2">
          <label className="text-sm text-slate-400">מצב כלכלי של המשפחה</label>
          <div className="flex gap-2 flex-wrap">
            {WEALTH.map((w) => (
              <button
                key={w.id}
                onClick={() => setWealth(w.id)}
                className={`px-4 py-2 rounded-lg border ${wealth === w.id ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold' : 'border-slate-700 hover:border-slate-500'}`}
                title={w.desc}
              >
                {w.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <label className="text-sm text-slate-400">
            תכונות אופי (עד {MAX_TRAITS}) — {traits.length}/{MAX_TRAITS}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TRAITS.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTrait(t.id)}
                title={t.description}
                className={`px-3 py-2 rounded-lg border text-sm text-right ${traits.includes(t.id) ? 'bg-violet-500 text-slate-950 border-violet-500 font-bold' : 'border-slate-700 hover:border-slate-500'}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <label className="text-sm text-slate-400">תחומי עניין</label>
          <div className="flex gap-2 flex-wrap">
            {INTERESTS.map((i) => (
              <button
                key={i}
                onClick={() => toggleInterest(i)}
                className={`px-3 py-1.5 rounded-full border text-sm ${interests.includes(i) ? 'bg-teal-500 text-slate-950 border-teal-500 font-bold' : 'border-slate-700 hover:border-slate-500'}`}
              >
                {i}
              </button>
            ))}
          </div>
        </section>

        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 hover:bg-emerald-400 text-slate-950 font-bold transition text-lg"
        >
          🚀 להתחיל בחיים!
        </button>
      </div>
    </div>
  )
}

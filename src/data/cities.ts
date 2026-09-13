export interface CityDef {
  id: string
  label: string
  costOfLiving: number // multiplier on expenses
  jobMarket: number // multiplier on salary/opportunity
  vibe: string
}

export const CITIES: CityDef[] = [
  { id: 'telaviv', label: 'תל אביב', costOfLiving: 1.5, jobMarket: 1.3, vibe: 'קצב חיים מהיר, הייטק ובועה' },
  { id: 'jerusalem', label: 'ירושלים', costOfLiving: 1.1, jobMarket: 1.0, vibe: 'עירוב עולמות, קהילות מגוונות' },
  { id: 'haifa', label: 'חיפה', costOfLiving: 0.9, jobMarket: 0.95, vibe: 'שקטה, נוף לים, טכניון בפינה' },
  { id: 'beersheva', label: 'באר שבע', costOfLiving: 0.75, jobMarket: 0.85, vibe: 'זולה, סטודנטים והייטק צומח' },
  { id: 'rishon', label: 'ראשון לציון', costOfLiving: 1.0, jobMarket: 1.0, vibe: 'עירונית ומשפחתית' },
  { id: 'kibbutz', label: 'יישוב קהילתי בצפון', costOfLiving: 0.7, jobMarket: 0.7, vibe: 'שקט, טבע, פחות הזדמנויות' },
]

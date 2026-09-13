export interface CityDef {
  id: string
  label: string
  costOfLiving: number // multiplier on expenses
  jobMarket: number // multiplier on salary/opportunity
  vibe: string
}

// character.city is free text (the city input allows typing any city, not
// just picking from the list), so lookups match by label first - id stays
// only for backward compatibility with saves from before free-text entry.
export function findCity(cityValue: string): CityDef | undefined {
  return CITIES.find((c) => c.label === cityValue || c.id === cityValue)
}

export const CITIES: CityDef[] = [
  { id: 'telaviv', label: 'תל אביב', costOfLiving: 1.5, jobMarket: 1.3, vibe: 'קצב חיים מהיר, הייטק ובועה' },
  { id: 'jerusalem', label: 'ירושלים', costOfLiving: 1.1, jobMarket: 1.0, vibe: 'עירוב עולמות, קהילות מגוונות' },
  { id: 'haifa', label: 'חיפה', costOfLiving: 0.9, jobMarket: 0.95, vibe: 'שקטה, נוף לים, טכניון בפינה' },
  { id: 'beersheva', label: 'באר שבע', costOfLiving: 0.75, jobMarket: 0.85, vibe: 'זולה, סטודנטים והייטק צומח' },
  { id: 'rishon', label: 'ראשון לציון', costOfLiving: 1.0, jobMarket: 1.0, vibe: 'עירונית ומשפחתית' },
  { id: 'petahtikva', label: 'פתח תקווה', costOfLiving: 0.95, jobMarket: 1.0, vibe: 'מרכזית, קרובה לכל מקום' },
  { id: 'ashdod', label: 'אשדוד', costOfLiving: 0.85, jobMarket: 0.9, vibe: 'עיר נמל, חופים ושכונות צעירות' },
  { id: 'netanya', label: 'נתניה', costOfLiving: 0.9, jobMarket: 0.9, vibe: 'חוף ים ואווירה רגועה' },
  { id: 'beitshemesh', label: 'בית שמש', costOfLiving: 0.8, jobMarket: 0.8, vibe: 'משפחתית, גדלה מהר' },
  { id: 'holon', label: 'חולון', costOfLiving: 1.0, jobMarket: 1.0, vibe: 'קרובה לתל אביב, שקטה יותר' },
  { id: 'batyam', label: 'בת ים', costOfLiving: 0.9, jobMarket: 0.95, vibe: 'חוף ים, מחירים נגישים יחסית' },
  { id: 'ramatgan', label: 'רמת גן', costOfLiving: 1.3, jobMarket: 1.2, vibe: 'ננסי-סיטי, קרובה למרכז העסקים' },
  { id: 'givatayim', label: 'גבעתיים', costOfLiving: 1.35, jobMarket: 1.15, vibe: 'ירוקה ומבוססת' },
  { id: 'raanana', label: 'רעננה', costOfLiving: 1.2, jobMarket: 1.1, vibe: 'הייטק, גינון מושלם, אנגלית ברקע' },
  { id: 'kfarsaba', label: 'כפר סבא', costOfLiving: 1.1, jobMarket: 1.05, vibe: 'משפחתית עם המון הייטקיסטים' },
  { id: 'herzliya', label: 'הרצליה', costOfLiving: 1.4, jobMarket: 1.25, vibe: 'יוקרתית, הייטק וים' },
  { id: 'rehovot', label: 'רחובות', costOfLiving: 0.95, jobMarket: 1.0, vibe: 'מדעית, ויצמן בשכונה' },
  { id: 'modiin', label: 'מודיעין', costOfLiving: 1.05, jobMarket: 0.95, vibe: 'עיר חדשה, מתוכננת ומשפחתית' },
  { id: 'ashkelon', label: 'אשקלון', costOfLiving: 0.75, jobMarket: 0.8, vibe: 'חוף דרומי, מחירים נוחים' },
  { id: 'eilat', label: 'אילת', costOfLiving: 0.95, jobMarket: 0.8, vibe: 'עיר תיירות, פטורה ממע"מ' },
  { id: 'tiberias', label: 'טבריה', costOfLiving: 0.7, jobMarket: 0.65, vibe: 'כנרת בחלון, קצב חיים איטי' },
  { id: 'nahariya', label: 'נהריה', costOfLiving: 0.8, jobMarket: 0.75, vibe: 'עיר חוף שקטה בצפון' },
  { id: 'karmiel', label: 'כרמיאל', costOfLiving: 0.75, jobMarket: 0.75, vibe: 'עיר ירוקה בגליל' },
  { id: 'beitshean', label: 'בית שאן', costOfLiving: 0.65, jobMarket: 0.6, vibe: 'עמק בית שאן, כפרית ושלווה' },
  { id: 'kiryatshmona', label: 'קריית שמונה', costOfLiving: 0.65, jobMarket: 0.6, vibe: 'צפון רחוק, קרובה לגבול' },
  { id: 'kibbutz', label: 'יישוב קהילתי בצפון', costOfLiving: 0.7, jobMarket: 0.7, vibe: 'שקט, טבע, פחות הזדמנויות' },
  { id: 'moshav', label: 'מושב במרכז הארץ', costOfLiving: 0.85, jobMarket: 0.85, vibe: 'חיי כפר קרובים לעיר' },
]

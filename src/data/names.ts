export const NPC_FIRST_NAMES = [
  'נועה', 'איתי', 'מאיה', 'עומר', 'שירה', 'יובל', 'רועי', 'תמר',
  'דניאל', 'אביגיל', 'עידן', 'ליאור', 'הילה', 'גיא', 'רותם', 'טל',
  'אור', 'נטע', 'אלון', 'קרן',
]

export const MALE_NAMES = [
  'איתי', 'עומר', 'יובל', 'רועי', 'דניאל', 'עידן', 'גיא', 'אלון',
  'איתן', 'תומר', 'נדב', 'עמית', 'יונתן', 'ניר', 'אורי', 'דור',
]

export const FEMALE_NAMES = [
  'נועה', 'מאיה', 'שירה', 'תמר', 'אביגיל', 'הילה', 'רותם', 'נטע',
  'קרן', 'יעל', 'שני', 'ליה', 'רוני', 'אור', 'טל', 'עדן',
]

export function randomNpcName(rng: () => number): string {
  return NPC_FIRST_NAMES[Math.floor(rng() * NPC_FIRST_NAMES.length)]
}

export function randomNameByGender(gender: 'male' | 'female', rng: () => number): string {
  const pool = gender === 'male' ? MALE_NAMES : FEMALE_NAMES
  return pool[Math.floor(rng() * pool.length)]
}

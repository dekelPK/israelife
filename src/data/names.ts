export const NPC_FIRST_NAMES = [
  'נועה', 'איתי', 'מאיה', 'עומר', 'שירה', 'יובל', 'רועי', 'תמר',
  'דניאל', 'אביגיל', 'עידן', 'ליאור', 'הילה', 'גיא', 'רותם', 'טל',
  'אור', 'נטע', 'אלון', 'קרן',
]

export function randomNpcName(rng: () => number): string {
  return NPC_FIRST_NAMES[Math.floor(rng() * NPC_FIRST_NAMES.length)]
}

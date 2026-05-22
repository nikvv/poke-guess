export const DIFFICULTY_LABELS = { easy: 'NOVICE', medium: 'TRAINER', hard: 'MASTER' }

export const GENERATIONS = {
  easy: { label: 'Gen I–III', start: 1, end: 386 },
  medium: { label: 'Gen I–V', start: 1, end: 649 },
  hard: { label: 'Gen I–IX', start: 1, end: 1025 },
}

const GEN_RANGES = [
  { gen: 'Gen I',   start: 1,   end: 151  },
  { gen: 'Gen II',  start: 152, end: 251  },
  { gen: 'Gen III', start: 252, end: 386  },
  { gen: 'Gen IV',  start: 387, end: 493  },
  { gen: 'Gen V',   start: 494, end: 649  },
  { gen: 'Gen VI',  start: 650, end: 721  },
  { gen: 'Gen VII', start: 722, end: 809  },
  { gen: 'Gen VIII',start: 810, end: 905  },
  { gen: 'Gen IX',  start: 906, end: 1025 },
]

export function getGenForId(id) {
  return GEN_RANGES.find((r) => id >= r.start && id <= r.end)?.gen || 'Unknown'
}

export function getPokemonRange(mode) {
  return GENERATIONS[mode] || GENERATIONS.easy
}

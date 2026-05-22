import { getOrFetch } from '../data/pokemonCache'
import { getPokemonRange } from '../utils/generations'

const RECENT_SIZE = 20 // won't repeat same Pokemon within last N rounds
const recentIds = []

export function resetRecentIds() {
  recentIds.length = 0
}

function randomIdInRange(start, end) {
  return start + Math.floor(Math.random() * (end - start + 1))
}

function pickRandomIds(count, exclude, start, end) {
  const ids = new Set(exclude)
  const result = []
  let attempts = 0
  while (result.length < count && attempts < 200) {
    const id = randomIdInRange(start, end)
    if (!ids.has(id)) {
      ids.add(id)
      result.push(id)
    }
    attempts++
  }
  return result
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickCorrectId(start, end) {
  const rangeSize = end - start + 1
  // Only apply recent exclusion if pool is large enough to avoid infinite loop
  const exclude = rangeSize > RECENT_SIZE * 2 ? new Set(recentIds) : new Set()
  let attempts = 0
  while (attempts < 200) {
    const id = randomIdInRange(start, end)
    if (!exclude.has(id)) return id
    attempts++
  }
  return randomIdInRange(start, end)
}

export async function buildRound(difficulty) {
  const { start, end } = getPokemonRange(difficulty)

  const correctId = pickCorrectId(start, end)
  recentIds.push(correctId)
  if (recentIds.length > RECENT_SIZE) recentIds.shift()

  const wrongIds = pickRandomIds(3, [correctId], start, end)

  const [pokemon, ...wrongPokemon] = await Promise.all([
    getOrFetch(correctId),
    ...wrongIds.map((id) => getOrFetch(id)),
  ])

  const options = shuffle([
    { name: pokemon.name, id: pokemon.id },
    ...wrongPokemon.map((p) => ({ name: p.name, id: p.id })),
  ])

  return { pokemon, options }
}

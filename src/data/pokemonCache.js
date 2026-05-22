import { POKEMON_DATA } from './pokemonData'

const LS_KEY = 'pokemon-data-cache'

// Runtime map: id → {id, name, types}
// Seeded from bundle + localStorage on init
const cache = new Map()

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function persistToStorage() {
  try {
    const obj = {}
    cache.forEach((p) => { obj[p.id] = p })
    localStorage.setItem(LS_KEY, JSON.stringify(obj))
  } catch {
    // localStorage full or unavailable — continue without persisting
  }
}

// Init: bundle first, then localStorage fills gaps
POKEMON_DATA.forEach((p) => cache.set(p.id, p))
const stored = loadFromStorage()
Object.values(stored).forEach((p) => {
  if (!cache.has(p.id)) cache.set(p.id, p)
})

export function getPokemon(id) {
  return cache.get(id) ?? null
}

export async function fetchAndCache(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  if (!res.ok) throw new Error(`PokeAPI ${res.status} for id ${id}`)
  const data = await res.json()
  const pokemon = { id: data.id, name: data.name, types: data.types.map((t) => t.type.name) }
  cache.set(pokemon.id, pokemon)
  persistToStorage()
  return pokemon
}

export async function getOrFetch(id) {
  const hit = getPokemon(id)
  if (hit) return hit
  return fetchAndCache(id)
}

export function cacheSize() {
  return cache.size
}

// Dev helper — paste in DevTools console to get copy-ready pokemonData.js content
if (typeof window !== 'undefined') {
  window.__exportPokemonData = () => {
    const all = Array.from(cache.values()).sort((a, b) => a.id - b.id)
    const output = [
      '// Auto-generated — do not edit manually.',
      '// Regenerate: node scripts/generatePokemonData.mjs',
      '',
      `export const POKEMON_DATA = ${JSON.stringify(all)}`,
      '',
    ].join('\n')
    console.log(output)
    console.log(`\n✓ ${all.length} Pokemon — copy the block above into src/data/pokemonData.js`)
    return all.length
  }
}

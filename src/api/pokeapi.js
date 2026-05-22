const BASE = 'https://pokeapi.co/api/v2'

export async function fetchPokemonList(limit = 1025) {
  const res = await fetch(`${BASE}/pokemon?limit=${limit}`)
  return res.json()
}

export async function fetchPokemon(id) {
  const res = await fetch(`${BASE}/pokemon/${id}`)
  return res.json()
}

export function getSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export function getFallbackSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

const API_BASE = '/api/scores'
const TIMEOUT_MS = 5000
const CACHE_TTL_MS = 300000

const pending = new Map()
const cache = new Map()

export async function fetchScores(difficulty) {
  const cached = cache.get(difficulty)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.scores
  }

  const key = `fetch:${difficulty}`
  if (pending.has(key)) return pending.get(key)

  const promise = doFetch(difficulty)
  pending.set(key, promise)
  promise.finally(() => pending.delete(key))
  return promise
}

async function doFetch(difficulty) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${API_BASE}?difficulty=${difficulty}`, { signal: controller.signal })
    if (!res.ok) return null
    const data = await res.json()
    cache.set(difficulty, { scores: data.scores, at: Date.now() })
    return data.scores
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

export async function submitScore(name, score, difficulty) {
  if (score <= 0) return false
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score, difficulty }),
      signal: controller.signal,
    })
    if (res.ok) cache.delete(difficulty)
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

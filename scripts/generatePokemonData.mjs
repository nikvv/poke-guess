/**
 * Resumable Pokemon data fetcher.
 * Checks existing data first; only fetches missing Pokemon.
 * Concurrency-limited batching (5 simultaneous) with per-batch progress saves.
 *
 * Run: node scripts/generatePokemonData.mjs [--force]
 * Output: src/data/pokemonData.js
 */
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUTPUT = path.join(ROOT, 'src/data/pokemonData.js')
const PROGRESS = path.join(ROOT, 'src/data/.pokemon_progress.json')
const BASE = 'https://pokeapi.co/api/v2'
const TOTAL = 1025
const CONCURRENCY = 5

const force = process.argv.includes('--force')

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function fetchJSON(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      const req = https.get(url, { headers: { 'User-Agent': 'poke-guess/1.0' } }, (res) => {
        let data = ''
        res.on('data', (c) => { data += c })
        res.on('end', () => {
          if (res.statusCode === 429 || res.statusCode >= 500) {
            if (n > 0) { sleep(2000).then(() => attempt(n - 1)) } else { reject(new Error(`${res.statusCode}: ${url}`)) }
            return
          }
          try { resolve(JSON.parse(data)) } catch { reject(new Error(`Parse: ${url}`)) }
        })
      })
      req.on('error', () => {
        if (n > 0) { sleep(1500).then(() => attempt(n - 1)) } else { reject(new Error(`Network: ${url}`)) }
      })
      req.setTimeout(15000, () => { req.destroy(new Error(`Timeout: ${url}`)) })
    }
    attempt(retries)
  })
}

function loadJSON(filepath) {
  try { return JSON.parse(fs.readFileSync(filepath, 'utf8')) } catch { return null }
}

function saveJSON(filepath, data) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true })
  fs.writeFileSync(filepath, JSON.stringify(data))
}

function loadExistingMap() {
  if (force) return {}

  const progress = loadJSON(PROGRESS)
  if (progress) return progress

  const fallback = loadJSON(OUTPUT.replace('.js', '.json'))
  if (fallback) return Object.fromEntries(fallback.map((p) => [p.id, p]))

  try {
    const raw = fs.readFileSync(OUTPUT, 'utf8')
    const match = raw.match(/export const POKEMON_DATA = (\[[\s\S]*\])/)
    if (match) {
      const arr = JSON.parse(match[1])
      return Object.fromEntries(arr.map((p) => [p.id, p]))
    }
  } catch {}
  return {}
}

function writeOutput(map) {
  const all = Array.from({ length: TOTAL }, (_, i) => map[i + 1]).filter(Boolean)
  saveJSON(OUTPUT.replace('.js', '.json'), all)
  const js = [
    '// Auto-generated — do not edit manually.',
    '// Regenerate: node scripts/generatePokemonData.mjs',
    '',
    `export const POKEMON_DATA = ${JSON.stringify(all)}`,
    '',
  ].join('\n')
  fs.writeFileSync(OUTPUT, js)
}

function formatDuration(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return m > 0 ? `${m}m${s % 60}s` : `${s}s`
}

async function fetchWithConcurrency(ids, existing, onProgress) {
  const queue = [...ids]
  const failures = []
  let attempted = 0

  async function worker() {
    while (queue.length > 0) {
      const id = queue.shift()
      try {
        const d = await fetchJSON(`${BASE}/pokemon/${id}`)
        existing[id] = { id: d.id, name: d.name, types: d.types.map((t) => t.type.name) }
      } catch (e) {
        failures.push(id)
      }
      attempted++
      onProgress(attempted)
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, () => worker())
  await Promise.all(workers)
  return failures
}

async function main() {
  if (force) process.stderr.write('--force: re-fetching all Pokemon.\n')
  const started = Date.now()

  const existing = loadExistingMap()
  const have = Object.keys(existing).length

  if (have >= TOTAL) {
    process.stderr.write(`All ${TOTAL} Pokemon already fetched. Nothing to do.\n`)
    return
  }

  let lastSavedCount = have
  let nextSaveAt = have + 100

  function report(attempted, finished) {
    const count = Object.keys(existing).length
    const pct = ((count / TOTAL) * 100).toFixed(1)
    const elapsed = formatDuration(Date.now() - started)
    const rate = (((count - have) / ((Date.now() - started) / 1000)).toFixed(1))
    process.stderr.write(`  ${count}/${TOTAL} (${pct}%) — ${elapsed}, ${rate}/s\n`)
  }

  let pendingSave = null
  function scheduleSave(attempted) {
    const count = Object.keys(existing).length
    if (count - lastSavedCount >= 100 && !pendingSave) {
      lastSavedCount = count
      pendingSave = true
      saveJSON(PROGRESS, existing)
      report(attempted)
      pendingSave = false
    }
  }

  const missing = Array.from({ length: TOTAL }, (_, i) => i + 1)
    .filter((id) => !existing[id])

  if (missing.length === 0) {
    process.stderr.write(`Already complete. Writing output...\n`)
    writeOutput(existing)
    return
  }

  process.stderr.write(`Have ${have}/${TOTAL}, need ${missing.length} more (${CONCURRENCY} concurrent).\n\n`)

  const onProgress = (attempted) => {
    scheduleSave(attempted)
  }

  const failures = await fetchWithConcurrency(missing, existing, onProgress)

  saveJSON(PROGRESS, existing)
  report()

  process.stderr.write(`\nWriting output...\n`)
  writeOutput(existing)

  if (failures.length > 0) {
    process.stderr.write(`\nFailed ${failures.length} Pokemon: #${failures.sort((a,b) => a-b).join(', #')}\n`)
    process.stderr.write(`Re-run to retry these.\n`)
  }

  const final = Object.keys(existing).length
  process.stderr.write(`Done. ${final}/${TOTAL} in ${formatDuration(Date.now() - started)}.\n`)

  if (final >= TOTAL) {
    fs.rmSync(PROGRESS, { force: true })
    process.stderr.write(`Cleaned up progress file.\n`)
  }
}

main().catch((err) => {
  process.stderr.write(`FATAL: ${err.message}\n`)
  process.exit(1)
})

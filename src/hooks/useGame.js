import { useEffect, useRef } from 'react'
import useGameStore from '../store/gameStore'
import { buildRound } from '../api/queries'
import { getSpriteUrl } from '../api/pokeapi'

export function useGame() {
  const { difficulty, phase, paused, score, streak, highScore, hintsRevealed, pokemon, options, lastScoreChange, lastSpeedBonus, timeLeft, timerFrozen, hintCooldownUntil } = useGameStore()
  const loading = useRef(false)
  const prefetched = useRef(null)
  const prefetching = useRef(false)

  // Prefetch next round while player is reading result
  useEffect(() => {
    if (phase !== 'correct' && phase !== 'wrong') return
    if (prefetched.current || prefetching.current) return
    prefetching.current = true
    buildRound(difficulty)
      .then((data) => {
        prefetched.current = data
        const img = new Image()
        img.onerror = () => { prefetched.current = null }
        img.src = getSpriteUrl(data.pokemon.id)
      })
      .catch(() => {})
      .finally(() => { prefetching.current = false })
  }, [phase, difficulty])

  // Session timer — persistent interval, tickTimer guards on phase + imageReady
  useEffect(() => {
    const id = setInterval(() => {
      useGameStore.getState().tickTimer()
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Load round on 'loading' phase
  useEffect(() => {
    if (phase !== 'loading' || loading.current) return
    loading.current = true

    if (prefetched.current) {
      const data = prefetched.current
      prefetched.current = null
      loading.current = false
      useGameStore.getState().setRound(data.pokemon, data.options)
      return
    }

    buildRound(difficulty)
      .then((data) => {
        useGameStore.getState().setRound(data.pokemon, data.options)
      })
      .catch((e) => {
        console.error('buildRound failed:', e)
        useGameStore.getState().setLoadError('Failed to load Pokemon')
      })
      .finally(() => {
        loading.current = false
      })
  }, [phase, difficulty])

  return { difficulty, phase, paused, score, streak, highScore, hintsRevealed, pokemon, options, lastScoreChange, lastSpeedBonus, timeLeft, timerFrozen, hintCooldownUntil }
}

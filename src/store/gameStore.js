import { create } from 'zustand'
import { resetRecentIds } from '../api/queries'
import { fetchScores, submitScore } from '../api/scores'

const TIMER_DURATION = 60
const HINT_FREEZE_MS = 3000
const HINT_COOLDOWN_MS = 6000
const BLUR_BASE_COST = 60
const BLUR_COST_STEP = 20
const SPEED_BONUS_MAX = 20
const SPEED_BONUS_WINDOW_MS = 5000
const MAX_SCORES = 1000
const SCORES_KEY = (d) => `pokemon-scores-${d}`

function loadScores(difficulty) {
  try {
    return JSON.parse(localStorage.getItem(SCORES_KEY(difficulty))) || []
  } catch {
    return []
  }
}

function saveScores(difficulty, scores) {
  try {
    localStorage.setItem(SCORES_KEY(difficulty), JSON.stringify(scores))
  } catch {}
}

function topScore(scores) {
  return scores[0]?.score || 0
}

function calcSpeedBonus(elapsed) {
  if (elapsed >= SPEED_BONUS_WINDOW_MS) return 0
  return Math.max(0, Math.round(SPEED_BONUS_MAX * (1 - elapsed / SPEED_BONUS_WINDOW_MS)))
}

const useGameStore = create((set, get) => ({
  difficulty: 'easy',
  score: 0,
  streak: 0,
  highScore: topScore(loadScores('easy')),
  scores: loadScores('easy'),
  pokemon: null,
  options: [],
  chosenAnswer: null,
  hintsRevealed: [],
  phase: 'difficulty',
  paused: false,
  lastScoreChange: null,
  lastSpeedBonus: null,
  timeLeft: 0,
  hintFreezeUntil: 0,
  hintCooldownUntil: 0,
  timerFrozen: false,
  blurUseCount: 0,
  imageReady: false,
  loadError: null,
  roundStartTime: 0,
  correctCount: 0,
  totalRounds: 0,
  bestStreak: 0,

  setDifficulty: (d) => {
    const scores = loadScores(d)
    set({ difficulty: d, scores, highScore: topScore(scores) })
    fetchScores(d).then((apiScores) => {
      if (apiScores) {
        saveScores(d, apiScores)
        set({ scores: apiScores, highScore: topScore(apiScores) })
      }
    })
  },

  startGame: () => {
    resetRecentIds()
    set({
      score: 0,
      streak: 0,
      hintsRevealed: [],
      chosenAnswer: null,
      lastScoreChange: null,
      lastSpeedBonus: null,
      phase: 'loading',
      timeLeft: TIMER_DURATION,
      hintCooldownUntil: 0,
      hintFreezeUntil: 0,
      timerFrozen: false,
      blurUseCount: 0,
      imageReady: false,
      roundStartTime: 0,
      correctCount: 0,
      totalRounds: 0,
      bestStreak: 0,
    })
  },

  setRound: (pokemon, options) =>
    set({ pokemon, options, hintsRevealed: [], chosenAnswer: null, lastScoreChange: null, lastSpeedBonus: null, hintFreezeUntil: 0, timerFrozen: false, imageReady: false, phase: 'guessing' }),

  setImageReady: (v) => set({ imageReady: v, ...(v ? { roundStartTime: Date.now() } : {}) }),

  setLoadError: (msg) => set({ loadError: msg }),

  clearLoadError: () => set({ loadError: null, phase: 'loading' }),

  tickTimer: () => {
    const { phase, timeLeft, hintFreezeUntil, imageReady, paused } = get()
    if (phase !== 'guessing' || !imageReady || paused) return
    if (Date.now() < hintFreezeUntil) {
      set({ timerFrozen: true })
      return
    }
    if (timeLeft <= 1) {
      set({ timerFrozen: false, timeLeft: 0, phase: 'gameover' })
    } else {
      set({ timerFrozen: false, timeLeft: timeLeft - 1 })
    }
  },

  getBlurCost: () => {
    const { blurUseCount } = get()
    return BLUR_BASE_COST + blurUseCount * BLUR_COST_STEP
  },

  buyHint: (hintType) => {
    const { score, hintsRevealed, hintCooldownUntil, blurUseCount } = get()
    if (hintType !== 'blur') return false
    if (hintsRevealed.includes('blur')) return false
    if (Date.now() < hintCooldownUntil) return false
    const cost = BLUR_BASE_COST + blurUseCount * BLUR_COST_STEP
    if (score < cost) return false
    const now = Date.now()
    set({
      score: score - cost,
      hintsRevealed: [...hintsRevealed, 'blur'],
      hintFreezeUntil: now + HINT_FREEZE_MS,
      hintCooldownUntil: now + HINT_COOLDOWN_MS,
      blurUseCount: blurUseCount + 1,
    })
    return true
  },

  submitAnswer: (name) => {
    const { pokemon, score, streak, highScore, roundStartTime, correctCount, totalRounds, bestStreak } = get()
    const correct = pokemon && pokemon.name === name
    const elapsed = Date.now() - roundStartTime

    if (correct) {
      const multiplier = 1 + streak * 0.1
      const points = Math.round(100 * multiplier)
      const speedBonus = calcSpeedBonus(elapsed)
      const newScore = score + points + speedBonus
      const newStreak = streak + 1
      set({
        score: newScore,
        streak: newStreak,
        highScore: Math.max(highScore, newScore),
        chosenAnswer: name,
        lastScoreChange: points + speedBonus,
        lastSpeedBonus: speedBonus > 0 ? speedBonus : null,
        phase: 'correct',
        correctCount: correctCount + 1,
        totalRounds: totalRounds + 1,
        bestStreak: Math.max(bestStreak, newStreak),
      })
    } else {
      set({
        streak: 0,
        chosenAnswer: name,
        lastScoreChange: 0,
        lastSpeedBonus: null,
        phase: 'wrong',
        totalRounds: totalRounds + 1,
      })
    }
    return correct
  },

  // Called from GameOver with player's chosen name
  submitHighScore: (name) => {
    const { score, difficulty } = get()
    if (score === 0) return
    const trimmed = (name.trim() || 'PLAYER').toUpperCase().slice(0, 12)

    submitScore(trimmed, score, difficulty).then((ok) => {
      if (!ok) {
        const existing = loadScores(difficulty)
        const entry = { name: trimmed, score, date: Date.now() }
        const updated = [...existing, entry].sort((a, b) => b.score - a.score).slice(0, MAX_SCORES)
        saveScores(difficulty, updated)
        set({ scores: updated })
      } else {
        fetchScores(difficulty).then((apiScores) => {
          if (apiScores) {
            saveScores(difficulty, apiScores)
            set({ scores: apiScores, highScore: topScore(apiScores) })
          }
        })
      }
    })

    const existing = loadScores(difficulty)
    const entry = { name: trimmed, score, date: Date.now() }
    const updated = [...existing, entry].sort((a, b) => b.score - a.score).slice(0, MAX_SCORES)
    saveScores(difficulty, updated)
    set({ scores: updated })
  },

  playAgain: () => {
    resetRecentIds()
    const { difficulty } = get()
    const scores = loadScores(difficulty)
    set({
      score: 0,
      streak: 0,
      hintsRevealed: [],
      chosenAnswer: null,
      lastScoreChange: null,
      lastSpeedBonus: null,
      phase: 'loading',
      timeLeft: TIMER_DURATION,
      highScore: topScore(scores),
      scores,
      hintCooldownUntil: 0,
      hintFreezeUntil: 0,
      timerFrozen: false,
      imageReady: false,
      roundStartTime: 0,
      correctCount: 0,
      totalRounds: 0,
      bestStreak: 0,
    })
  },

  goToMenu: () => {
    const { difficulty } = get()
    const scores = loadScores(difficulty)
    set({ phase: 'difficulty', score: 0, streak: 0, highScore: topScore(scores), scores })
  },

  pauseGame: () => set({ paused: true }),

  resumeGame: () => set({ paused: false }),

  endGame: () => set({ phase: 'gameover', paused: false, timeLeft: 0 }),

  nextRound: () => set({ phase: 'loading', chosenAnswer: null, lastScoreChange: null, lastSpeedBonus: null }),
}))

export default useGameStore

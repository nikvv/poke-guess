import { useState, useEffect, useRef } from 'react'
import useGameStore from '../store/gameStore'
import { DIFFICULTY_LABELS } from '../utils/generations'

const RANK_COLORS = ['text-brand-yellow', 'text-text-white', 'text-text-muted']
const RANK_MEDALS = ['#1', '#2', '#3']

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function GameOver() {
  const { score, scores, difficulty, correctCount, totalRounds, bestStreak, submitHighScore, playAgain, goToMenu } = useGameStore()

  const rank = scores.filter((s) => s.score > score).length + 1
  const isTopThree = rank <= 3 && score > 0
  const canSave = score > 0
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (score === 0) { setDisplayScore(0); return }
    const duration = 1500
    const start = performance.now()
    let frame
    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      setDisplayScore(Math.round(score * (progress * progress * (3 - 2 * progress))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [score])

  useEffect(() => {
    if (canSave && !saved && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 1500)
      return () => clearTimeout(timer)
    }
  }, [canSave, saved])

  const handleSave = () => {
    submitHighScore(name)
    setSaved(true)
  }

  const saveIfNeeded = () => {
    if (canSave && !saved) submitHighScore(name)
  }

  const handlePlayAgain = () => { saveIfNeeded(); playAgain() }
  const handleGoToMenu = () => { saveIfNeeded(); goToMenu() }

  const top3 = scores.slice(0, 3)

  return (
    <main
      role="main"
      aria-label="Game over screen"
      className="flex flex-col items-center gap-6 animate-scan-in w-full max-w-xs"
    >
      <div className="text-center">
        <h1
          className="font-pixel text-brand-red animate-blink text-pixel-xl"
          style={{ letterSpacing: '0.1em', lineHeight: 1.4 }}
        >
          GAME
          <br />
          OVER
        </h1>
      </div>

      <div className="text-center animate-count-up">
        <p className="font-pixel text-text-muted uppercase text-pixel-xs tracking-widest">
          FINAL SCORE
        </p>
        <p
          className="font-display text-brand-yellow leading-none mt-1 text-display-3xl"
          aria-label={`Final score: ${score}`}
        >
          {displayScore}
        </p>
      </div>

      {totalRounds > 0 && (
        <div className="flex gap-6 justify-center animate-fade-in">
          <div className="text-center">
            <p className="font-pixel text-pixel-xs text-text-muted uppercase tracking-widest mb-1">Correct</p>
            <p className="font-display text-display-lg text-text-white leading-none">
              {correctCount}<span className="font-mono text-mono-lg text-text-muted">/{totalRounds}</span>
            </p>
          </div>
          <div className="text-center">
            <p className="font-pixel text-pixel-xs text-text-muted uppercase tracking-widest mb-1">Accuracy</p>
            <p className="font-display text-display-lg text-text-white leading-none">
              {Math.round((correctCount / totalRounds) * 100)}%
            </p>
          </div>
          <div className="text-center">
            <p className="font-pixel text-pixel-xs text-text-muted uppercase tracking-widest mb-1">Best Streak</p>
            <p className="font-display text-display-lg text-brand-yellow leading-none">{bestStreak}</p>
          </div>
        </div>
      )}

      {canSave && (
        <div className="w-full animate-fade-in">
          {!saved ? (
            <div className="flex flex-col gap-3">
              {isTopThree && (
                <div className="border-[2px] border-brand-yellow px-4 py-2 text-center animate-pop-in">
                  <p className="font-pixel text-brand-yellow text-pixel-xs">
                    ★ NEW {RANK_MEDALS[rank - 1]} PLACE ★
                  </p>
                </div>
              )}
              <div className="border-[3px] border-border bg-surface px-4 py-4">
                <label htmlFor="player-name" className="block font-pixel text-text-muted uppercase text-pixel-xs tracking-wider mb-3">
                  ENTER YOUR NAME
                </label>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    id="player-name"
                    type="text"
                    maxLength={12}
                    value={name}
                    onChange={(e) => setName(e.target.value.toLocaleUpperCase().replace(/[^\p{L}\p{N}]/gu, '').slice(0, 12))}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
                    placeholder="PLAYER"
                    className="flex-1 font-mono text-text-white bg-surface-high border-[2px] border-border-bright px-3 py-3 focus:border-brand-yellow focus:outline-none uppercase tracking-widest text-mono-lg rounded-none placeholder:text-text-faint"
                    aria-label="Player name for high score (max 12 characters)"
                  />
                  <button
                    onClick={handleSave}
                    className="pixel-btn border-[3px] border-brand-red bg-brand-red text-text-white font-pixel px-4 py-3 text-pixel-xs tracking-widest hover:bg-brand-red/90 transition-colors shadow-pixel-red"
                  >
                    SAVE
                  </button>
                </div>
                <p className="keyboard-only font-mono text-text-muted text-mono-xs mt-2 text-center">
                  Press <kbd className="px-1 border border-text-muted/40">ENTER</kbd> to save
                </p>
              </div>
            </div>
          ) : (
            <div className="border-[3px] border-correct border-dashed px-4 py-3 text-center animate-pop-in">
              <p className="font-pixel text-correct text-pixel-xs tracking-widest">
                ★ SAVED AS <span className="text-text-white">{name || 'PLAYER'}</span> ★
              </p>
            </div>
          )}
        </div>
      )}

      {top3.length > 0 && (
        <div className="w-full flex flex-col gap-1 animate-fade-in">
          <p className="font-pixel text-text-muted uppercase text-center mb-2 text-pixel-xs tracking-widest">
            {DIFFICULTY_LABELS[difficulty]} &ndash; TOP SCORES
          </p>
          {top3.map((entry, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-2 border border-border ${i === 0 ? 'bg-brand-yellow/5' : ''}`}
            >
              <span className={`font-pixel w-6 text-pixel-xs ${RANK_COLORS[i]}`}>
                {RANK_MEDALS[i]}
              </span>
              <span className="font-mono text-text-white flex-1 px-2 tracking-widest text-mono-base">
                {entry.name}
              </span>
              <span className="font-display text-text-white text-display-base">
                {entry.score}
              </span>
              <span className="font-mono text-text-faint ml-3 text-mono-xs">
                {formatDate(entry.date)}
              </span>
            </div>
          ))}
        </div>
      )}

      {top3.length === 0 && (
        <p className="font-mono text-text-faint text-center text-mono-sm">
          BE THE FIRST CHAMPION
        </p>
      )}

      <div className="pokeball-divider w-full" aria-hidden="true" />

      <div className="w-full flex flex-col gap-3">
        <button
          onClick={handlePlayAgain}
          className="pixel-btn w-full border-[3px] border-brand-red bg-brand-red text-text-white py-4 font-pixel tracking-widest text-pixel-base hover:bg-brand-red/90 transition-colors shadow-pixel-red"
        >
          PLAY AGAIN
        </button>
        <button
          onClick={handleGoToMenu}
          className="pixel-btn w-full border-[3px] border-border text-text-muted py-3 font-pixel tracking-widest text-pixel-base hover:border-border-bright hover:text-text-white transition-colors shadow-pixel-dark"
        >
          MAIN MENU
        </button>
      </div>
    </main>
  )
}

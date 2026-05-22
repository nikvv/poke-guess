import { useState, useEffect, useCallback, useRef } from 'react'
import useGameStore from './store/gameStore'
import { useGame } from './hooks/useGame'
import { useSound } from './hooks/useSound'
import DifficultySelect from './components/DifficultySelect'
import Silhouette from './components/Silhouette'
import Options from './components/Options'
import HintBar from './components/HintBar'
import ScoreBoard from './components/ScoreBoard'
import ScorePopup from './components/ScorePopup'
import SpeedPopup from './components/SpeedPopup'
import ResultBanner from './components/ResultBanner'
import MuteButton from './components/MuteButton'
import PauseMenu from './components/PauseMenu'
import TimerBar from './components/TimerBar'
import GameOver from './components/GameOver'
import OnboardingOverlay from './components/OnboardingOverlay'
import { DIFFICULTY_LABELS } from './utils/generations'

export default function App() {
  const { difficulty, phase, paused, score, streak, highScore, hintsRevealed, pokemon, options, lastScoreChange, lastSpeedBonus, timeLeft, timerFrozen, hintCooldownUntil } = useGame()
  const { sfxMuted, toggleSFX, playEffect } = useSound()

  const [imageLoaded, setImageLoaded] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const prevPokemonId = useRef(null)
  const prevStreak = useRef(0)

  useEffect(() => {
    if (pokemon && pokemon.id !== prevPokemonId.current) {
      setImageLoaded(false)
      prevPokemonId.current = pokemon.id
    }
  }, [pokemon])

  useEffect(() => {
    if (streak > 0 && streak !== prevStreak.current && streak % 5 === 0) {
      playEffect('playStreak')
    }
    prevStreak.current = streak
  }, [streak, playEffect])

  const setDifficulty = useGameStore((s) => s.setDifficulty)
  const startGame = useGameStore((s) => s.startGame)

  const handleSelectDifficulty = useCallback((mode) => {
    setDifficulty(mode)
    playEffect('playSelect')
  }, [setDifficulty, playEffect])
  const buyHint = useGameStore((s) => s.buyHint)
  const submitAnswer = useGameStore((s) => s.submitAnswer)
  const nextRound = useGameStore((s) => s.nextRound)
  const setImageReady = useGameStore((s) => s.setImageReady)
  const pauseGame = useGameStore((s) => s.pauseGame)
  const resumeGame = useGameStore((s) => s.resumeGame)
  const endGame = useGameStore((s) => s.endGame)

  const handleSelect = useCallback((name) => {
    const correct = submitAnswer(name)
    playEffect(correct ? 'playCorrect' : 'playWrong')
  }, [submitAnswer, playEffect])

  const handleBuyHint = useCallback((hintType) => {
    const result = buyHint(hintType)
    if (result) playEffect('playHint')
  }, [buyHint, playEffect])

  const handleNext = useCallback(() => {
    nextRound()
    setImageLoaded(false)
  }, [nextRound])

  const handleStart = useCallback(() => {
    if (phase !== 'difficulty') return
    startGame()
    playEffect('playStart')
  }, [phase, startGame, playEffect])

  const handlePause = useCallback(() => {
    pauseGame()
  }, [pauseGame])

  const handleResume = useCallback(() => {
    resumeGame()
  }, [resumeGame])

  const handleEndGame = useCallback(() => {
    endGame()
  }, [endGame])

  useEffect(() => {
    if (!localStorage.getItem('onboarding-seen')) {
      setShowOnboarding(true)
    }
  }, [])

  const handleDismissOnboarding = useCallback(() => {
    localStorage.setItem('onboarding-seen', 'true')
    setShowOnboarding(false)
  }, [])

  const handleShowHelp = useCallback(() => {
    setShowOnboarding(true)
  }, [])

  const isPlaying = phase === 'loading' || phase === 'guessing' || phase === 'correct' || phase === 'wrong'
  const isGameOver = phase === 'gameover'
  const showControls = imageLoaded && phase !== 'loading'

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && isPlaying) {
        e.preventDefault()
        if (paused) handleResume()
        else handlePause()
        return
      }
      if (paused) return

      if (e.key === 's' || e.key === 'S') {
        toggleSFX()
        return
      }
      if (phase === 'guessing') {
        if (e.key >= '1' && e.key <= '4' && options[e.key - 1]) {
          handleSelect(options[e.key - 1].name)
        }
        if (e.key === 'b') handleBuyHint('blur')
      }
      if ((phase === 'correct' || phase === 'wrong') && e.key === ' ') {
        e.preventDefault()
        handleNext()
      }
      if (phase === 'difficulty' && e.key === 'Enter') {
        handleStart()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, paused, isPlaying, options, handleSelect, handleBuyHint, handleNext, handleStart, handlePause, handleResume, toggleSFX])

  return (
    <>
      <a href="#main-game" className="skip-link">Skip to game</a>

      <ScorePopup scoreChange={lastScoreChange} visible={phase === 'correct' && lastScoreChange != null} />
      <SpeedPopup speedBonus={lastSpeedBonus} visible={phase === 'correct' && lastSpeedBonus != null} />

      <div className="min-h-screen flex flex-col items-center px-4 py-4 sm:py-6 gap-3 sm:gap-4 max-w-lg mx-auto w-full">
        {isGameOver && <GameOver />}

        {phase === 'difficulty' && (
          <DifficultySelect
            current={difficulty}
            onSelect={handleSelectDifficulty}
            onStart={handleStart}
            sfxMuted={sfxMuted}
            onToggleSFX={toggleSFX}
            showOnboarding={showOnboarding}
            onDismissOnboarding={handleDismissOnboarding}
            onHelp={handleShowHelp}
          />
        )}

        {isPlaying && (
          <div
            id="main-game"
            className={`w-full max-w-md flex flex-col items-center gap-4 border-2 ${
              timeLeft <= 3 && timeLeft > 0 ? 'border-wrong/30 animate-pulse' : 'border-transparent'
            }`}
            role="main"
            aria-label="Pokemon guessing game"
          >
            <header className="w-full flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Mini pokeball */}
                <div aria-hidden="true" className="relative w-5 h-5 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-brand-red" style={{ clipPath: 'inset(0 0 50% 0)' }} />
                  <div className="absolute inset-0 rounded-full bg-text-white" style={{ clipPath: 'inset(50% 0 0 0)' }} />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-bg" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-bg border border-bg" />
                </div>
                <h1 className="font-pixel text-text-white text-pixel-xs tracking-wider" style={{ lineHeight: 1.6 }}>
                  WHO&rsquo;S THAT<br />
                  <span className="text-brand-red">POK&Eacute;MON?</span>
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-text-muted uppercase text-pixel-xs">
                  {DIFFICULTY_LABELS[difficulty]}
                </span>
                <MuteButton muted={sfxMuted} onToggle={toggleSFX} />
                <button
                  onClick={handlePause}
                  aria-label="Pause game"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5 border border-transparent text-text-muted hover:text-text-white hover:border-border transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </svg>
                </button>
              </div>
            </header>

            <div className="pokeball-divider w-full" aria-hidden="true" />

            <ScoreBoard score={score} streak={streak} highScore={highScore} />

            <TimerBar timeLeft={timeLeft} phase={phase} frozen={timerFrozen} />

            {(phase === 'correct' || phase === 'wrong') && (
              <ResultBanner
                phase={phase}
                pokemon={pokemon}
                scoreChange={lastScoreChange}
                onNext={handleNext}
              />
            )}

            <Silhouette
              pokemon={pokemon}
              phase={phase}
              hintsRevealed={hintsRevealed}
              onImageLoad={() => { setImageLoaded(true); setImageReady(true) }}
            />

            {showControls && (
              <>
                <div className="pokeball-divider w-full" aria-hidden="true" />

                <HintBar
                  pokemon={pokemon}
                  hintsRevealed={hintsRevealed}
                  score={score}
                  phase={phase}
                  onBuyHint={handleBuyHint}
                  hintCooldownUntil={hintCooldownUntil}
                />

                <Options
                  options={options}
                  phase={phase}
                  onSelect={handleSelect}
                />
              </>
            )}
          </div>
        )}
      </div>

      <footer className="pb-4 text-center">
        <a
          href="https://nickovalentino.pages.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-text-muted text-mono-sm tracking-widest hover:text-text-white transition-colors"
        >
          PokeGuess by Nicko Valentino
        </a>
      </footer>

      {paused && <PauseMenu onResume={handleResume} onEndGame={handleEndGame} onHelp={handleShowHelp} />}

      {showOnboarding && (
        <OnboardingOverlay onDismiss={handleDismissOnboarding} />
      )}
    </>
  )
}

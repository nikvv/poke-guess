import { useState, useCallback } from 'react'
import { getSpriteUrl, getFallbackSpriteUrl } from '../api/pokeapi'
import useGameStore from '../store/gameStore'

function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
      <span className="w-2 h-2 bg-brand-red rounded-full animate-blink" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-brand-yellow rounded-full animate-blink" style={{ animationDelay: '200ms' }} />
      <span className="w-2 h-2 bg-brand-red rounded-full animate-blink" style={{ animationDelay: '400ms' }} />
    </div>
  )
}

export default function Silhouette({ pokemon, phase, hintsRevealed, onImageLoad }) {
  const loadError = useGameStore((s) => s.loadError)
  const clearLoadError = useGameStore((s) => s.clearLoadError)
  const [loaded, setLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    setImgError(false)
    setLoaded(false)
    setRetryKey(k => k + 1)
  }, [])

  if (phase === 'loading') {
    if (loadError) {
      return (
        <div className="flex flex-col items-center gap-3">
          <div
            className="crt-panel w-64 h-64 md:w-72 md:h-72 flex flex-col items-center justify-center gap-3 px-6"
            role="alert"
          >
            <p className="font-pixel text-pixel-xs text-text-muted text-center uppercase leading-relaxed">
              Failed to load<br />Pokemon data
            </p>
            <p className="font-mono text-mono-xs text-text-faint text-center">
              Check your connection
            </p>
            <button
              onClick={clearLoadError}
              className="pixel-btn border-[3px] border-border text-text-muted font-pixel text-pixel-xs px-4 py-2 mt-1 hover:border-border-bright hover:text-text-white transition-colors shadow-pixel-dark"
            >
              RETRY
            </button>
          </div>
        </div>
      )
    }

    return (
      <div
        className="crt-panel scanlines w-64 h-64 md:w-72 md:h-72 flex flex-col items-center justify-center gap-4"
        role="status"
        aria-label="Loading next Pokemon"
      >
        <span className="font-pixel text-pixel-xs text-text-muted uppercase tracking-widest" aria-hidden="true">
          LOADING
        </span>
        <LoadingDots />
      </div>
    )
  }

  if (!pokemon) {
    return (
      <div
        className="crt-panel scanlines w-64 h-64 md:w-72 md:h-72 flex items-center justify-center"
        role="img"
        aria-label="Pokemon silhouette hidden"
      >
        <span className="font-pixel text-pixel-base text-text-muted animate-blink" aria-hidden="true">???</span>
      </div>
    )
  }

  const isRevealed = phase === 'correct' || phase === 'wrong'
  const isBlurred = hintsRevealed.includes('blur') && !isRevealed

  let filterStyle = {}
  if (!isRevealed && !isBlurred) {
    filterStyle = { filter: 'brightness(0)' }
  } else if (isBlurred) {
    filterStyle = { filter: 'brightness(0.4) blur(6px)' }
  }

  const ariaLabel = isRevealed
    ? `Pokemon revealed: ${pokemon.name}, number ${pokemon.id}`
    : isBlurred
      ? 'Pokemon outline visible, blurred'
      : 'Pokemon silhouette hidden'

  function handleLoad() {
    setLoaded(true)
    setImgError(false)
    if (onImageLoad) onImageLoad()
  }

  function handleError(e) {
    if (e.target.src === getFallbackSpriteUrl(pokemon.id)) {
      setImgError(true)
      return
    }
    e.target.src = getFallbackSpriteUrl(pokemon.id)
  }

  if (imgError) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div
          className="crt-panel w-64 h-64 md:w-72 md:h-72 flex flex-col items-center justify-center gap-3 px-6"
          role="alert"
        >
          <p className="font-pixel text-pixel-xs text-text-muted text-center uppercase leading-relaxed">
            Image failed<br />to load
          </p>
          <button
            onClick={handleRetry}
            className="pixel-btn border-[3px] border-border text-text-muted font-pixel text-pixel-xs px-4 py-2 hover:border-border-bright hover:text-text-white transition-colors shadow-pixel-dark"
          >
            RETRY
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="crt-panel scanlines relative p-4">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-0" aria-hidden="true">
            <span className="font-pixel text-pixel-base text-text-muted animate-blink">???</span>
          </div>
        )}
        <img
          key={`${pokemon.id}-${retryKey}`}
          src={getSpriteUrl(pokemon.id)}
          className={`w-56 h-56 md:w-64 md:h-64 object-contain pixelated transition-opacity duration-200 relative z-0 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            ...filterStyle,
            transition: isRevealed ? 'filter 0.5s ease-out' : undefined,
          }}
          alt=""
          role="img"
          aria-label={ariaLabel}
          onLoad={handleLoad}
          onError={handleError}
          draggable={false}
        />
      </div>

      {isRevealed && (
        <div
          className="border-[3px] border-border bg-surface px-5 py-2 animate-pop-in"
          role="status"
          aria-live="polite"
        >
          <p className="font-pixel text-center text-pixel-sm text-text-white tracking-wider">
            <span className="text-text-muted">#{String(pokemon.id).padStart(3, '0')}</span>
            {' '}
            {pokemon.name.toUpperCase()}
          </p>
        </div>
      )}
    </div>
  )
}

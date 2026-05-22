import { useEffect, useRef, useState } from 'react'

export default function ResultBar({ phase, pokemon, scoreChange, onNext }) {
  const isCorrect = phase === 'correct'
  const [countdown, setCountdown] = useState(100)
  const intervalRef = useRef(null)

  useEffect(() => {
    const start = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed   = Date.now() - start
      const remaining = Math.max(0, 100 - elapsed / 50)
      setCountdown(remaining)
      if (remaining <= 0) {
        clearInterval(intervalRef.current)
        onNext()
      }
    }, 50)
    return () => clearInterval(intervalRef.current)
  }, [onNext])

  const borderColor = isCorrect ? 'border-correct'  : 'border-wrong'
  const barClass    = isCorrect ? 'bg-correct'      : 'bg-wrong'
  const labelClass  = isCorrect ? 'text-correct'    : 'text-wrong'
  const btnBorder   = isCorrect ? 'border-correct'  : 'border-wrong'
  const btnShadow   = isCorrect ? 'shadow-pixel-correct' : 'shadow-pixel-wrong'

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed bottom-0 left-0 right-0 z-40 border-t-[3px] bg-surface ${borderColor}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto gap-3">
        <div className="min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <p className={`font-pixel text-pixel-sm uppercase ${labelClass}`}>
              {isCorrect ? 'CORRECT!' : 'WRONG!'}
            </p>
            <p className="font-mono text-mono-sm text-text-white/60 truncate">
              It was{' '}
              <span className="text-text-white font-bold uppercase">{pokemon?.name}</span>
            </p>
          </div>
          {isCorrect && scoreChange != null && (
            <p className="font-display text-display-base text-brand-yellow leading-none">
              +{scoreChange}
            </p>
          )}
        </div>

        <button
          onClick={onNext}
          aria-label="Proceed to next round"
          className={`
            pixel-btn flex-shrink-0 border-[3px] px-4 py-2 font-pixel text-pixel-xs
            text-text-white tracking-widest transition-colors min-h-[44px] min-w-[44px]
            ${btnBorder} bg-surface-high ${btnShadow}
            hover:bg-surface-high
          `}
        >
          NEXT
        </button>
      </div>

      <div
        className={`h-[3px] ${barClass}`}
        style={{ width: `${countdown}%`, transition: 'width 50ms linear' }}
        aria-hidden="true"
      />
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

export default function ResultBanner({ phase, pokemon, scoreChange, onNext }) {
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
  const bgClass     = isCorrect ? 'bg-correct/5'    : 'bg-wrong/5'
  const labelClass  = isCorrect ? 'text-correct'    : 'text-wrong'
  const barClass    = isCorrect ? 'bg-correct'      : 'bg-wrong'
  const btnShadow   = isCorrect ? 'shadow-pixel-correct' : 'shadow-pixel-wrong'
  const btnBorder   = isCorrect ? 'border-correct'  : 'border-wrong'

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`w-full max-w-md border-[3px] relative overflow-hidden animate-pop-in ${borderColor} ${bgClass}`}
    >
      <div
        className={`absolute bottom-0 left-0 h-1 transition-none ${barClass}`}
        style={{ width: `${countdown}%` }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between px-4 py-4 gap-3">
        <div className="min-w-0 flex flex-col gap-0.5">
          <p className={`font-pixel text-pixel-xl leading-relaxed ${labelClass}`}>
            {isCorrect ? 'CORRECT!' : 'WRONG!'}
          </p>
          <p className="font-mono text-mono-base text-text-muted truncate">
            It was{' '}
            <span className="text-text-white font-bold uppercase">{pokemon?.name}</span>
          </p>
          {isCorrect && scoreChange != null && (
            <p className="font-display text-display-lg text-brand-yellow leading-none mt-1">
              +{scoreChange}
            </p>
          )}
        </div>

        <button
          onClick={onNext}
          aria-label="Proceed to next round"
          className={`
            pixel-btn flex-shrink-0 border-[3px] px-5 py-3 font-pixel text-pixel-xs
            text-text-white tracking-widest transition-colors min-h-[44px]
            ${btnBorder} bg-surface ${btnShadow}
            hover:bg-surface-high
          `}
        >
          NEXT
        </button>
      </div>
    </div>
  )
}

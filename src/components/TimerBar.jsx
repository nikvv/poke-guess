const TIMER_DURATION = 60

const ACTIVE_PHASES = new Set(['guessing', 'correct', 'wrong'])

function getBarColor(ratio) {
  if (ratio > 0.5) return 'bg-correct'
  if (ratio > 0.25) return 'bg-brand-yellow'
  return 'bg-wrong'
}

function getTextColor(ratio) {
  if (ratio > 0.5) return 'text-correct'
  if (ratio > 0.25) return 'text-brand-yellow'
  return 'text-wrong'
}

export default function TimerBar({ timeLeft, phase, frozen }) {
  if (!ACTIVE_PHASES.has(phase)) return null

  const ratio = Math.max(0, timeLeft / TIMER_DURATION)
  const urgent = ratio <= 0.25
  const critical = timeLeft <= 5

  const barColor = frozen ? '' : getBarColor(ratio)
  const textColor = frozen ? '' : getTextColor(ratio)

  return (
    <div className="w-full max-w-md flex items-center gap-2" role="timer" aria-label={frozen ? `Timer frozen — ${timeLeft} seconds remaining` : `${timeLeft} seconds remaining`} aria-live="off">
      <span
        className={`font-display text-display-lg leading-none w-8 text-right flex-shrink-0 transition-colors duration-200 ${
          frozen
            ? 'animate-blink text-hint-cyan'
            : critical
              ? 'animate-pulse text-wrong font-bold'
              : `${textColor} ${urgent && phase === 'guessing' ? 'animate-pulse' : ''}`
        }`}
        aria-hidden="true"
      >
        {timeLeft}
      </span>

      <div className={`flex-1 h-2 bg-surface-high overflow-hidden border ${frozen ? 'border-hint-cyan/30' : critical ? 'border-wrong' : 'border-border'}`}>
        <div
          className={`h-full transition-all duration-900 ease-linear ${frozen ? 'bg-hint-cyan' : barColor}`}
          style={{ width: `${ratio * 100}%` }}
          aria-hidden="true"
        />
      </div>

      {frozen && (
        <span
          className="font-pixel animate-blink flex-shrink-0 text-pixel-xs tracking-wider text-hint-cyan"
          aria-hidden="true"
        >
          FROZEN
        </span>
      )}

      {critical && timeLeft > 0 && !frozen && (
        <span className="sr-only" role="alert" aria-live="assertive">
          {timeLeft} second{timeLeft !== 1 ? 's' : ''} remaining
        </span>
      )}
    </div>
  )
}

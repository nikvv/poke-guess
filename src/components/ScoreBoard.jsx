export default function ScoreBoard({ score, streak, highScore }) {
  const multiplier = 1 + streak * 0.1

  return (
    <div
      className="w-full max-w-md border-[3px] border-border bg-surface flex items-stretch font-mono"
      role="region"
      aria-label="Score statistics"
    >
      {/* Score */}
      <div className="flex-1 flex flex-col items-center justify-center py-2 px-1.5 sm:py-3 sm:px-2">
        <p className="font-pixel text-pixel-xs text-text-muted uppercase tracking-widest mb-1">Score</p>
        <p
          className="font-display text-display-xl sm:text-display-2xl text-text-white leading-none"
          aria-live="polite"
          aria-atomic="true"
        >
          {score}
        </p>
      </div>

      <div className="w-px bg-border self-stretch" aria-hidden="true" />

      {/* Streak */}
      <div className="flex-1 flex flex-col items-center justify-center py-2 px-1.5 sm:py-3 sm:px-2">
        <p className="font-pixel text-pixel-xs text-text-muted uppercase tracking-widest mb-1">Streak</p>
        <p
          className={`font-display text-display-xl sm:text-display-2xl leading-none ${streak > 0 ? 'text-brand-yellow' : 'text-text-white'}`}
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Streak: ${streak}${streak > 0 ? `, multiplier ${multiplier.toFixed(1)}x` : ''}`}
        >
          {streak}
        </p>
        {streak > 0 && (
          <span
            key={streak}
            className="font-display text-display-sm sm:text-display-base leading-none mt-0.5 animate-multi-bump text-streak-gold"
            aria-hidden="true"
          >
            ×{multiplier.toFixed(1)}
          </span>
        )}
      </div>

      <div className="w-px bg-border self-stretch" aria-hidden="true" />

      {/* Best */}
      <div className="flex-1 flex flex-col items-center justify-center py-2 px-1.5 sm:py-3 sm:px-2">
        <p className="font-pixel text-pixel-xs text-text-muted uppercase tracking-widest mb-1">Best</p>
        <p
          className="font-display text-display-lg sm:text-display-xl text-text-muted leading-none"
          aria-live="polite"
          aria-atomic="true"
        >
          {highScore}
        </p>
      </div>
    </div>
  )
}

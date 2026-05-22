import { useState, useEffect } from 'react'
import useGameStore from '../store/gameStore'

const HINT_COOLDOWN_MS = 6000
const BLUR_BASE_COST = 60
const BLUR_COST_STEP = 20

export default function HintBar({ pokemon, hintsRevealed, score, onBuyHint, phase, hintCooldownUntil }) {
  const blurUseCount = useGameStore((s) => s.blurUseCount)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!hintCooldownUntil || Date.now() >= hintCooldownUntil) return
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (t >= hintCooldownUntil) clearInterval(id)
    }, 300)
    return () => clearInterval(id)
  }, [hintCooldownUntil])

  if (!pokemon || phase !== 'guessing') return null

  const bought = hintsRevealed.includes('blur')
  const onCooldown = now < hintCooldownUntil
  const cooldownSecs = onCooldown ? Math.ceil((hintCooldownUntil - now) / 1000) : 0
  const cooldownProgress = onCooldown
    ? Math.max(0, (hintCooldownUntil - now) / HINT_COOLDOWN_MS)
    : 0

  const currentCost = BLUR_BASE_COST + blurUseCount * BLUR_COST_STEP
  const nextCost = currentCost + BLUR_COST_STEP
  const canAfford = score >= currentCost
  const isReady = !bought && !onCooldown && canAfford
  const disabled = bought || !canAfford || onCooldown

  return (
    <div className="w-full max-w-md flex justify-center" role="group" aria-label="Hint skills">
      <div className="flex sm:flex-col items-center gap-2">

        {/* Skill button */}
        <button
          onClick={() => onBuyHint('blur')}
          disabled={disabled}
          aria-label={`BLUR hint${bought ? ', used' : onCooldown ? `, cooldown ${cooldownSecs}s` : canAfford ? `, costs ${currentCost} points` : ', insufficient points'}`}
          className={`
            relative w-12 h-12 sm:w-16 sm:h-16 border-2 overflow-hidden
            flex items-center justify-center
            transition-colors duration-200
            ${bought
              ? 'border-border bg-surface-high cursor-default'
              : onCooldown
                ? 'border-hint-cyan/20 bg-surface cursor-not-allowed'
                : isReady
                  ? 'border-hint-cyan bg-surface cursor-pointer'
                  : 'border-border/40 bg-surface/40 cursor-not-allowed'
            }
          `}
          style={isReady ? { boxShadow: '0 0 10px var(--hint-cyan), inset 0 0 8px color-mix(in srgb, var(--hint-cyan) 7%, transparent)' } : undefined}
        >
          {/* Cooldown sweep overlay — drains top to bottom */}
          {onCooldown && (
            <div
              className="absolute inset-x-0 top-0 bg-black/75 pointer-events-none z-10"
              style={{ height: `${cooldownProgress * 100}%` }}
            />
          )}

          {/* Button content */}
          <div className="relative z-20 flex flex-col items-center justify-center gap-1">
            {bought ? (
              <span className="font-pixel text-pixel-xs text-text-muted uppercase leading-none">used</span>
            ) : onCooldown ? (
              <span className="font-display text-display-lg leading-none text-hint-cyan">
                {cooldownSecs}
              </span>
            ) : (
              <>
                <span
                  className={`font-pixel text-pixel-xs leading-none ${isReady ? 'text-hint-cyan' : 'text-hint-dim'}`}
                >
                  BLUR
                </span>
                <kbd
                  aria-hidden="true"
                  className="keyboard-only inline-flex items-center justify-center w-4 h-4 bg-text-white text-bg font-pixel text-[7px] border-b-2 border-r-2 border-border"
                >
                  B
                </kbd>
              </>
            )}
          </div>

          {/* Ready pulse ring */}
          {isReady && (
            <div
              className="absolute inset-0 border-2 animate-ping pointer-events-none border-hint-cyan/15"
            />
          )}
        </button>

        {/* Cost / next cost label */}
        {!bought && (
          <div className="flex sm:flex-col items-center gap-1 sm:gap-0.5 leading-none">
            <span
              className={`font-mono text-mono-sm ${isReady ? 'text-text-white' : 'text-text-white/60'}`}
            >
              −{currentCost}pt
            </span>
            {blurUseCount > 0 && (
              <span className="hidden sm:inline font-mono text-mono-xs text-text-muted/50">
                next −{nextCost}
              </span>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

import useGameStore from '../store/gameStore'

const NUM_KEYS = ['1', '2', '3', '4']

export default function Options({ options, phase, onSelect }) {
  if (!options.length) return null

  const revealedPokemon = useGameStore((s) => s.pokemon)
  const chosenAnswer = useGameStore((s) => s.chosenAnswer)
  const isGuessing = phase === 'guessing'
  const isDone = phase === 'correct' || phase === 'wrong'
  const isDisabled = !isGuessing && !isDone

  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt, idx) => {
          const isCorrect = isDone && opt.name === revealedPokemon?.name
          const isChosen  = chosenAnswer === opt.name && !isCorrect

          let borderColor = 'border-border hover:border-border-bright'
          let bgColor     = 'bg-surface'
          let shadow      = 'shadow-pixel-dark'
          let textColor   = 'text-text-white'

          if (isCorrect) {
            borderColor = 'border-correct'
            bgColor     = 'bg-correct/10'
            shadow      = 'shadow-pixel-correct'
            textColor   = 'text-correct'
          } else if (isDone && isChosen) {
            borderColor = 'border-wrong'
            bgColor     = 'bg-wrong/10'
            shadow      = 'shadow-pixel-wrong'
            textColor   = 'text-wrong'
          }

          return (
            <button
              key={opt.name}
              onClick={() => isGuessing && onSelect(opt.name)}
              disabled={!isGuessing}
              aria-label={`Option ${idx + 1}: ${opt.name}${isCorrect ? ', correct' : isDone && isChosen ? ', wrong' : ''}`}
              className={`
                pixel-btn relative border-[3px] px-4 py-3 pl-9 font-mono text-mono-sm uppercase tracking-wider
                text-left min-h-[52px] transition-colors truncate
                ${borderColor} ${bgColor} ${shadow} ${textColor}
                ${isGuessing ? 'cursor-pointer' : 'cursor-default'}
                ${isDisabled ? 'opacity-50' : ''}
                ${isDone && isChosen && !isCorrect ? 'animate-shake' : ''}
              `}
            >
              <span
                aria-hidden="true"
                className={`absolute top-1/2 -translate-y-1/2 left-2 w-5 h-5 flex items-center justify-center font-pixel text-pixel-xs border-[2px] ${
                  isCorrect
                    ? 'border-correct text-correct bg-correct/20'
                    : isDone && isChosen
                      ? 'border-wrong text-wrong bg-wrong/20'
                      : 'border-border-bright text-text-muted bg-surface-high'
                }`}
              >
                {NUM_KEYS[idx]}
              </span>
              {opt.name}
            </button>
          )
        })}
      </div>

      <p className="keyboard-only text-center font-mono text-mono-sm text-text-muted tracking-widest mt-1" aria-hidden="true">
        PRESS <kbd className="px-1 border border-text-muted/30">1</kbd>–<kbd className="px-1 border border-text-muted/30">4</kbd> TO CHOOSE
      </p>
    </div>
  )
}

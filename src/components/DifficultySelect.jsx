import useGameStore from '../store/gameStore'
import { getPokemonRange, DIFFICULTY_LABELS } from '../utils/generations'
import MuteButton from './MuteButton'

const MODES = ['easy', 'medium', 'hard']

const RANK_COLORS = ['text-brand-yellow', 'text-text-white', 'text-text-muted']
const RANK_MEDALS = ['#1', '#2', '#3']

const MODE_META = {
  easy:   { label: 'NOVICE',  sub: 'Kanto · Johto · Hoenn',    tag: 'GEN I–III' },
  medium: { label: 'TRAINER', sub: 'Up through Unova',          tag: 'GEN I–V'  },
  hard:   { label: 'MASTER',  sub: 'All known Pokémon',         tag: 'GEN I–IX' },
}

export default function DifficultySelect({ current, onSelect, onStart, sfxMuted, onToggleSFX, showOnboarding, onDismissOnboarding, onHelp }) {
  const scores = useGameStore((s) => s.scores)
  const top3 = scores.slice(0, 3)

  return (
    <main
      role="main"
      aria-label="Game mode selection"
      className="flex flex-col items-center gap-8 animate-fade-in w-full max-w-xs"
    >
      <div className="w-full flex justify-between items-center">
        <div />
        <div className="flex items-center gap-2">
          <button
            onClick={onHelp}
            aria-label="How to play"
            className="font-mono text-text-faint text-mono-xs underline hover:text-text-muted transition-colors"
          >
            HELP
          </button>
          <MuteButton muted={sfxMuted} onToggle={onToggleSFX} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <p className="font-pixel text-text-muted text-pixel-xs tracking-widest" aria-label="PokeGuess">
          POKEGUESS
        </p>

        {/* Pokeball graphic */}
      <div aria-hidden="true" className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-brand-red" style={{ clipPath: 'inset(0 0 50% 0)' }} />
        <div className="absolute inset-0 rounded-full bg-text-white" style={{ clipPath: 'inset(50% 0 0 0)' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[3px] bg-bg" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-text-white border-[3px] border-bg" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-bg" />
      </div>
      </div>

      <div className="text-center">
        <h1 className="font-pixel leading-relaxed text-center text-pixel-lg">
          <span className="text-brand-red block">WHO&rsquo;S THAT</span>
          <span className="text-text-white block mt-2">POK&Eacute;MON?</span>
        </h1>
      </div>

      <fieldset className="w-full border-none p-0 m-0">
        <legend className="sr-only">Select difficulty level</legend>
        <div className="flex flex-col gap-2 w-full">
          {MODES.map((mode) => {
            const { start, end } = getPokemonRange(mode)
            const meta = MODE_META[mode]
            const active = current === mode
            return (
              <button
                key={mode}
                onClick={() => onSelect(mode)}
                aria-pressed={active}
                aria-describedby={`diff-desc-${mode}`}
                className={`
                  pixel-btn w-full text-left border-[3px] px-4 py-3 transition-colors
                  ${active
                    ? 'border-brand-yellow bg-brand-yellow/10 shadow-pixel-yellow'
                    : 'border-border bg-surface hover:border-border-bright shadow-pixel-dark'
                  }
                `}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-pixel text-pixel-sm ${active ? 'text-brand-yellow' : 'text-text-white'}`}>
                    {active && <span aria-hidden="true" className="mr-2">▶</span>}
                    {meta.label}
                  </span>
                  <span className="font-mono text-mono-sm text-text-muted shrink-0">
                    #{start}–#{end}
                  </span>
                </div>
                <p id={`diff-desc-${mode}`} className="font-mono text-mono-sm text-text-muted mt-1.5">
                  {meta.sub}
                </p>
              </button>
            )
          })}
        </div>
      </fieldset>

      <button
        onClick={onStart}
        aria-label="Start game with selected difficulty"
        className="pixel-btn w-full border-[3px] border-brand-red bg-brand-red text-text-white py-4 font-pixel text-pixel-base tracking-widest hover:bg-brand-red/90 transition-colors shadow-pixel-red"
      >
        START GAME
      </button>

      <p className="keyboard-only font-mono text-mono-sm text-text-muted tracking-widest">
        PRESS <kbd className="px-1 border border-text-muted/40">ENTER</kbd> TO START
      </p>

      {/* Top 3 for selected difficulty */}
      {top3.length > 0 && (
        <div className="w-full flex flex-col gap-1 animate-fade-in">
          <p className="font-pixel text-text-muted uppercase text-center mb-2 text-pixel-xs tracking-widest">
            {DIFFICULTY_LABELS[current]} — TOP SCORES
          </p>
          {top3.map((entry, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-1.5 border border-border ${i === 0 ? 'bg-brand-yellow/5' : ''}`}
            >
              <span className={`font-pixel w-6 text-pixel-xs ${RANK_COLORS[i]}`}>
                {RANK_MEDALS[i]}
              </span>
              <span className="font-mono text-text-white flex-1 px-2 tracking-widest text-mono-sm">
                {entry.name}
              </span>
              <span className="font-display text-text-white text-display-sm">
                {entry.score}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

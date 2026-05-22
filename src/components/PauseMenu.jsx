export default function PauseMenu({ onResume, onEndGame, onHelp }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90">
      <div className="flex flex-col items-center gap-6 border-[3px] border-border bg-surface px-10 py-8 shadow-pixel-dark animate-fade-in">
        <p className="font-pixel text-text-white tracking-widest text-pixel-lg">
          PAUSED
        </p>

        <div className="flex flex-col gap-3 w-48">
          <button
            onClick={onResume}
            aria-label="Resume game"
            className="pixel-btn border-[3px] border-brand-yellow bg-brand-yellow/10 text-brand-yellow font-pixel py-3 text-pixel-sm tracking-widest hover:bg-brand-yellow/20 transition-colors shadow-pixel-yellow"
          >
            ▶ RESUME
          </button>
          {onHelp && (
            <button
              onClick={onHelp}
              aria-label="How to play"
              className="pixel-btn border-[3px] border-border text-text-muted font-pixel py-2 text-pixel-xs tracking-widest hover:border-border-bright hover:text-text-white transition-colors shadow-pixel-dark"
            >
              HOW TO PLAY
            </button>
          )}
          <button
            onClick={onEndGame}
            aria-label="End game and see score"
            className="pixel-btn border-[3px] border-brand-red bg-brand-red/10 text-brand-red font-pixel py-3 text-pixel-sm tracking-widest hover:bg-brand-red/20 transition-colors"
          >
            END GAME
          </button>
        </div>

        <p className="keyboard-only font-mono text-text-muted text-mono-xs">
          Press <kbd className="px-1 border border-text-muted/40">ESC</kbd> to resume
        </p>
      </div>
    </div>
  )
}

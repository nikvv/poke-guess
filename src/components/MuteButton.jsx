export default function MuteButton({ muted, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
      aria-pressed={muted}
      className={`
        min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5
        border border-transparent transition-all
        ${muted
          ? 'text-text-muted opacity-35 hover:opacity-60'
          : 'text-text-muted hover:text-text-white hover:border-border'
        }
      `}
    >
      {muted ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  )
}

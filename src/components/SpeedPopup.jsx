export default function SpeedPopup({ speedBonus, visible }) {
  if (!visible || !speedBonus) return null

  return (
    <div
      aria-hidden="true"
      className="fixed pointer-events-none z-20 animate-float-up right-4"
      style={{ top: '6.5rem' }}
    >
      <p
        className="font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-display-lg flex items-center gap-1 text-speed-glow"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="13,2 4,14 12,14 11,22 20,10 12,10" />
        </svg>
        +{speedBonus}
      </p>
    </div>
  )
}

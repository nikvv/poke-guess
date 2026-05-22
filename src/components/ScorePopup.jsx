export default function ScorePopup({ scoreChange, visible }) {
  if (!visible || !scoreChange) return null

  return (
    <div
      aria-hidden="true"
      className="fixed top-20 left-1/2 -translate-x-1/2 pointer-events-none z-20 animate-float-up"
    >
      <p className="font-display text-display-2xl text-brand-yellow drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)]">
        +{scoreChange}
      </p>
    </div>
  )
}

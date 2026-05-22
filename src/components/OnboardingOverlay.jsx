import { useState, useEffect } from 'react'

const STEPS = [
  {
    icon: '?',
    title: 'IDENTIFY THE SHAPE',
    body: 'A black silhouette appears on screen. Name the Pokemon from memory. The faster you answer, the more points you earn.',
  },
  {
    icon: '1-4',
    title: 'PICK A NAME',
    body: 'Choose from four options using the number keys (1-4) or tap your answer. Correct guesses add to your score and streak.',
  },
  {
    icon: 'B',
    title: 'USE HINTS',
    body: 'Stuck? Press B or tap the BLUR button to reveal a blurred outline. Each hint costs points that increase with use.',
  },
  {
    icon: '×2',
    title: 'BUILD STREAKS',
    body: 'Answer consecutively to multiply your score. Fast answers earn a speed bonus too. You have 60 seconds — every second counts.',
  },
]

export default function OnboardingOverlay({ onDismiss }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isFirst = step === 0
  const isLast = step === STEPS.length - 1

  const handleNext = () => {
    if (isLast) {
      onDismiss()
    } else {
      setStep(s => s + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirst) setStep(s => s - 1)
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onDismiss() }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNext() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, onDismiss])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95">
      <div className="flex flex-col items-center gap-6 border-[3px] border-border bg-surface px-8 py-10 shadow-pixel-dark animate-fade-in w-full max-w-sm">
        {/* Step indicator */}
        <p className="font-pixel text-text-muted text-pixel-xs tracking-widest">
          {step + 1}/{STEPS.length}
        </p>

        {/* Icon area */}
        <div
          className="w-16 h-16 rounded-full border-[3px] border-border bg-surface-high flex items-center justify-center"
          aria-hidden="true"
        >
          {step === 0 && (
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-[3px] border-text-muted" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-text-muted rotate-45" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-text-muted -rotate-45" />
            </div>
          )}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-1">
              <div className="w-3 h-3 bg-border" />
              <div className="w-3 h-3 bg-border" />
              <div className="w-3 h-3 bg-brand-yellow" />
              <div className="w-3 h-3 bg-border" />
            </div>
          )}
          {step === 2 && (
            <span className="font-display text-display-lg text-text-white font-bold">B</span>
          )}
          {step === 3 && (
            <span className="font-mono text-mono-base text-brand-yellow font-bold">×2</span>
          )}
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="font-pixel text-text-white text-pixel-sm tracking-widest leading-relaxed mb-3">
            {current.title}
          </h2>
          <p className="font-mono text-text-muted text-mono-sm leading-relaxed">
            {current.body}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between w-full gap-3">
          {!isFirst ? (
            <button
              onClick={handlePrev}
              className="pixel-btn border-[3px] border-border text-text-muted font-pixel text-pixel-xs px-4 py-3 hover:border-border-bright hover:text-text-white transition-colors shadow-pixel-dark"
            >
              BACK
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onDismiss}
            className="font-mono text-text-faint text-mono-xs underline hover:text-text-muted transition-colors"
          >
            SKIP
          </button>

          <button
            onClick={handleNext}
            className="pixel-btn border-[3px] border-brand-red bg-brand-red text-text-white font-pixel text-pixel-xs px-4 py-3 tracking-widest hover:bg-brand-red/90 transition-colors shadow-pixel-red"
          >
            {isLast ? 'PLAY' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  )
}

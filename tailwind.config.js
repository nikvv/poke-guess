import { COLORS, FONTS, FONT_SIZES, SHADOWS } from './src/styles/theme.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel:   [FONTS.pixel],
        display: [FONTS.display],
        mono:    [FONTS.mono],
      },
      colors: {
        // Backgrounds
        bg:             COLORS.bg,
        surface:        COLORS.surface,
        'surface-high': COLORS.surfaceHigh,

        // Brand
        'brand-red':    COLORS.red,
        'brand-yellow': COLORS.yellow,

        // Text
        'text-white':   COLORS.white,
        'text-muted':   COLORS.muted,
        'text-faint':   COLORS.faint,

        // State
        correct:        COLORS.correct,
        wrong:          COLORS.wrong,

        // Borders
        border:         COLORS.border,
        'border-bright':COLORS.borderBright,

        // Auxiliary
        'hint-cyan':    COLORS.hintCyan,
        'hint-dim':     COLORS.hintDim,
        'speed-glow':   COLORS.speedGlow,
        'streak-gold':  COLORS.streakGold,

        // Legacy aliases (for components not yet updated)
        'poke-red':       COLORS.red,
        'poke-white':     COLORS.white,
        'poke-dark':      COLORS.bg,
        'surface-dark':   COLORS.surface,
        'surface-darker': COLORS.bg,
        'border-subtle':  COLORS.border,
        'text-secondary': COLORS.muted,
      },
      fontSize: {
        'pixel-xs':    FONT_SIZES.pixelXs,
        'pixel-sm':    FONT_SIZES.pixelSm,
        'pixel-base':  FONT_SIZES.pixelBase,
        'pixel-lg':    FONT_SIZES.pixelLg,
        'pixel-xl':    FONT_SIZES.pixelXl,
        'pixel-2xl':   FONT_SIZES.pixel2xl,
        'display-sm':  FONT_SIZES.displaySm,
        'display-base':FONT_SIZES.displayBase,
        'display-lg':  FONT_SIZES.displayLg,
        'display-xl':  FONT_SIZES.displayXl,
        'display-2xl': FONT_SIZES.display2xl,
        'display-3xl': FONT_SIZES.display3xl,
        'mono-xs':     FONT_SIZES.monoXs,
        'mono-sm':     FONT_SIZES.monoSm,
        'mono-base':   FONT_SIZES.monoBase,
        'mono-lg':     FONT_SIZES.monoLg,
      },
      boxShadow: {
        'pixel-red':     SHADOWS.pixelRed,
        'pixel-yellow':  SHADOWS.pixelYellow,
        'pixel-dark':    SHADOWS.pixelDark,
        'pixel-correct': SHADOWS.pixelCorrect,
        'pixel-wrong':   SHADOWS.pixelWrong,
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-6px)' },
          '40%':      { transform: 'translateX(6px)' },
          '60%':      { transform: 'translateX(-4px)' },
          '80%':      { transform: 'translateX(4px)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%':   { transform: 'scale(0.85)', opacity: '0' },
          '80%':  { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatUp: {
          '0%':   { opacity: '1', transform: 'translate(-50%, 0) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -48px) scale(1.3)' },
        },
        floatUpPlain: {
          '0%':   { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(1.15)' },
        },
        multiBump: {
          '0%':   { transform: 'scale(1)' },
          '35%':  { transform: 'scale(1.45)' },
          '65%':  { transform: 'scale(0.92)' },
          '100%': { transform: 'scale(1)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        scanIn: {
          '0%':   { opacity: '0', transform: 'scaleY(0.05)', filter: 'brightness(4)' },
          '40%':  { opacity: '1', transform: 'scaleY(1.04)', filter: 'brightness(1.2)' },
          '100%': { opacity: '1', transform: 'scaleY(1)',    filter: 'brightness(1)' },
        },
        countUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shake:       'shake 0.45s ease-in-out',
        'fade-in':   'fadeIn 0.25s ease-out',
        'pop-in':    'popIn 0.3s ease-out',
        'slide-down':'slideDown 0.2s ease-out',
        'float-up':       'floatUp 0.9s ease-out forwards',
        'float-up-plain': 'floatUpPlain 0.8s ease-out forwards',
        'multi-bump':     'multiBump 0.35s ease-out',
        blink:       'blink 1s step-end infinite',
        'scan-in':   'scanIn 0.4s ease-out',
        'count-up':  'countUp 0.3s ease-out 0.2s both',
      },
    },
  },
  plugins: [],
}

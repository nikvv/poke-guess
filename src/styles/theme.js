// Design tokens — single source of truth for all visual constants
// Update these to retheme the entire app

export const COLORS = {
  // Backgrounds
  bg:           '#0C0C10',
  surface:      '#14141E',
  surfaceHigh:  '#1C1C2C',

  // Brand
  red:          '#CC0000',
  redDark:      '#7A0000',
  yellow:       '#F5C400',
  yellowDark:   '#8A6E00',

  // Text
  white:        '#E8E8E0',
  muted:        '#666677',
  faint:        '#38384E',

  // State
  correct:      '#22CC44',
  correctDark:  '#127A27',
  wrong:        '#EE2233',
  wrongDark:    '#8A1018',

  // Borders
  border:       '#2C2C3E',
  borderBright: '#3E3E58',

  // Auxiliary
  hintCyan:     '#7DD3FC',
  hintDim:      '#555566',
  speedGlow:    '#67E8F9',
  streakGold:   '#FBBF24',
}

export const FONTS = {
  pixel:   '"Press Start 2P", monospace',
  display: '"VT323", monospace',
  mono:    '"Space Mono", monospace',
}

export const FONT_SIZES = {
  pixelXs:   '10px',
  pixelSm:   '11px',
  pixelBase: '12px',
  pixelLg:   '14px',
  pixelXl:   '18px',
  pixel2xl:  '24px',

  displaySm:  '18px',
  displayBase:'20px',
  displayLg:  '24px',
  displayXl:  '36px',
  display2xl: '48px',
  display3xl: '72px',

  monoXs:   '10px',
  monoSm:   '11px',
  monoBase: '12px',
  monoLg:   '14px',
}

export const SHADOWS = {
  pixelRed:    `0 4px 0 0 ${COLORS.redDark}`,
  pixelYellow: `0 4px 0 0 ${COLORS.yellowDark}`,
  pixelDark:   `0 4px 0 0 #06060A`,
  pixelCorrect:`0 4px 0 0 ${COLORS.correctDark}`,
  pixelWrong:  `0 4px 0 0 ${COLORS.wrongDark}`,
}

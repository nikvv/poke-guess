// 8-bit sound effects using Web Audio API
// Uses AudioEngine singleton — ctx retrieved from engine, not passed in
import { getAudioContext } from './engine'

function playNote(ctx, { freq, type = 'square', startTime, duration, gain = 0.15 }) {
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, startTime)
  gainNode.gain.setValueAtTime(gain, startTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.01)
  osc.connect(gainNode)
  gainNode.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

async function sfx(notes) {
  const ctx = getAudioContext()
  if (!ctx) return
  if (ctx.state === 'suspended') await ctx.resume()
  const now = ctx.currentTime
  notes.forEach(({ freq, type, delay, duration, gain }) => {
    playNote(ctx, {
      freq,
      type: type || 'square',
      startTime: now + (delay || 0),
      duration: duration || 0.15,
      gain: gain || 0.12,
    })
  })
}

export function playCorrect() {
  sfx([
    { freq: 523.25, delay: 0, duration: 0.15, gain: 0.12 },
    { freq: 659.25, delay: 0.08, duration: 0.15, gain: 0.12 },
    { freq: 783.99, delay: 0.16, duration: 0.15, gain: 0.12 },
    { freq: 1046.5, delay: 0.24, duration: 0.2, gain: 0.12 },
    { freq: 1318.5, delay: 0.35, duration: 0.3, gain: 0.08, type: 'sine' },
  ])
}

export function playWrong() {
  sfx([
    { freq: 220, delay: 0, duration: 0.25, gain: 0.1, type: 'sawtooth' },
    { freq: 165, delay: 0.15, duration: 0.3, gain: 0.08, type: 'sawtooth' },
  ])
}

export function playHint() {
  sfx([
    { freq: 880, delay: 0, duration: 0.08, gain: 0.1 },
  ])
}

export function playStart() {
  sfx([
    { freq: 392, delay: 0, duration: 0.18, gain: 0.1 },
    { freq: 493.88, delay: 0.12, duration: 0.18, gain: 0.1 },
    { freq: 587.33, delay: 0.24, duration: 0.18, gain: 0.1 },
    { freq: 783.99, delay: 0.36, duration: 0.22, gain: 0.1 },
  ])
}

export function playSelect() {
  sfx([
    { freq: 660, delay: 0, duration: 0.06, gain: 0.08 },
    { freq: 880, delay: 0.04, duration: 0.06, gain: 0.08 },
  ])
}

export function playStreak() {
  sfx([
    { freq: 783.99, delay: 0, duration: 0.1, gain: 0.08 },
    { freq: 987.77, delay: 0.06, duration: 0.1, gain: 0.08 },
    { freq: 1174.66, delay: 0.12, duration: 0.1, gain: 0.08 },
    { freq: 1318.5, delay: 0.18, duration: 0.12, gain: 0.08 },
    { freq: 1567.98, delay: 0.24, duration: 0.15, gain: 0.08 },
  ])
}

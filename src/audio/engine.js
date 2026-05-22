// AudioEngine singleton — persists across React mounts, never closed
// Created on first user gesture to satisfy browser autoplay policy

let ctx = null

export function ensureAudioContext() {
  if (ctx && ctx.state !== 'closed') return ctx
  ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

export function getAudioContext() {
  if (!ctx || ctx.state === 'closed') return null
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

export function isAudioReady() {
  return ctx != null && ctx.state !== 'closed' && ctx.state !== 'suspended'
}

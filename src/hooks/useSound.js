import { useCallback, useState } from 'react'
import { ensureAudioContext } from '../audio/engine'
import * as effects from '../audio/effects'

const SFX_MUTE_KEY = 'pokemon-sfx-mute'

function loadPref(key) {
  try { return localStorage.getItem(key) === 'true' } catch { return false }
}

function savePref(key, value) {
  try { localStorage.setItem(key, String(value)) } catch {}
}

export function useSound() {
  const [sfxMuted, setSfxMuted] = useState(() => loadPref(SFX_MUTE_KEY))

  const toggleSFX = useCallback(() => {
    setSfxMuted((prev) => {
      const next = !prev
      savePref(SFX_MUTE_KEY, next)
      return next
    })
  }, [])

  const playEffect = useCallback((name) => {
    if (loadPref(SFX_MUTE_KEY)) return
    ensureAudioContext()
    if (effects[name]) effects[name]()
  }, [])

  return { sfxMuted, toggleSFX, playEffect }
}

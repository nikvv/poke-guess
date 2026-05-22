import React from 'react'
import ReactDOM from 'react-dom/client'
import { ensureAudioContext } from './audio/engine'
import App from './App'
import './index.css'

// Bootstrap audio on first user gesture (required by browser autoplay policy)
function bootstrapAudio() {
  ensureAudioContext()
  window.removeEventListener('pointerdown', bootstrapAudio)
  window.removeEventListener('keydown', bootstrapAudio)
}
window.addEventListener('pointerdown', bootstrapAudio)
window.addEventListener('keydown', bootstrapAudio)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

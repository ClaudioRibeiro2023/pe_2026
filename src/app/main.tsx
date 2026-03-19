import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { initSentry } from '@/shared/lib/sentry'
import { analytics } from '@/shared/lib/analytics'
import '../styles/index.css'

// Inicializar monitoramento
initSentry()
analytics.init()

// Service Worker only for web (production). In dev, ensure old SWs are removed to avoid cache/HMR issues.
const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined
if (!isElectron && 'serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    void navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => {
        void reg.unregister()
      })
    })
  } else {
    window.addEventListener('load', () => {
      void navigator.serviceWorker.register('/sw.js')
    })
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

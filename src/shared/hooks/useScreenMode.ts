import { useEffect, useState } from 'react'

export type ScreenMode = 'mobile' | 'tablet' | 'desktop'

/**
 * useScreenMode — detecta mobile (<768), tablet (768-1024) ou desktop (>=1024).
 * Começa com 'desktop' para consistência SSR/hidratação inicial.
 */
export function useScreenMode(): ScreenMode {
  const [mode, setMode] = useState<ScreenMode>('desktop')

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setMode(w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return mode
}

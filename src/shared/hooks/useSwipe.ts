import { useEffect, useRef } from 'react'

interface SwipeOptions {
  /** Se true, apenas swipes que começam nas bordas (30px) são registrados. Default true. */
  edgeOnly?: boolean
  /** Distância mínima em px para contar como swipe. Default 50. */
  threshold?: number
}

/**
 * useSwipe — detecta gestos horizontais em toda a tela.
 * Usado para abrir/fechar drawer lateral em mobile.
 */
export function useSwipe(
  onSwipeRight: () => void,
  onSwipeLeft: () => void,
  options: SwipeOptions = {}
) {
  const { edgeOnly = true, threshold = 50 } = options
  const start = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (edgeOnly && t.clientX > 30 && t.clientX < window.innerWidth - 30) {
        start.current = null
        return
      }
      start.current = { x: t.clientX, y: t.clientY }
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (!start.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - start.current.x
      const dy = t.clientY - start.current.y
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) onSwipeRight()
        else onSwipeLeft()
      }
      start.current = null
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [onSwipeRight, onSwipeLeft, edgeOnly, threshold])
}

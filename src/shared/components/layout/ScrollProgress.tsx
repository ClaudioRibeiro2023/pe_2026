import { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/cn'

interface ScrollProgressProps {
  /** Elemento cuja rolagem medir. Default: procura o `#main-content`. */
  target?: string
  className?: string
}

/**
 * ScrollProgress — barra fina no topo da tela que cresce conforme o scroll avança.
 * Ajuda o usuário a entender quanto conteúdo resta em páginas longas (Scoreboard, OKRs).
 * Fica acima do topbar com z-index alto para sempre visível.
 */
export function ScrollProgress({ target = '#main-content', className }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = document.querySelector(target) as HTMLElement | null
    if (!el) return

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const max = scrollHeight - clientHeight
      const pct = max > 0 ? (scrollTop / max) * 100 : 0
      setProgress(Math.max(0, Math.min(100, pct)))
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [target])

  // Não renderiza se não há scroll (evita bar estática em 0% no topo)
  if (progress <= 0.5) return null

  return (
    <div
      aria-hidden="true"
      className={cn(
        'fixed top-0 left-0 right-0 h-0.5 z-[100] pointer-events-none',
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 transition-[width] duration-150 ease-out shadow-[0_0_6px_rgba(0,180,216,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

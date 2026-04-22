import { useEffect, useRef, useState, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'

export interface PageTab {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  description?: string
  /** Rota extra que também ativa esta tab (ex.: rota raiz que redireciona para a tab) */
  aliasHref?: string
}

interface PageTabsProps {
  tabs: PageTab[]
  /**
   * Se true (padrão), aplica sticky logo abaixo da Topbar (52px).
   */
  sticky?: boolean
  className?: string
}

export function PageTabs({ tabs, sticky = true, className }: PageTabsProps) {
  const location = useLocation()
  const scrollerRef = useRef<HTMLElement>(null)
  const [overflow, setOverflow] = useState({ left: false, right: false })

  const checkOverflow = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setOverflow({
      left: scrollLeft > 4,
      right: scrollLeft + clientWidth < scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    checkOverflow()
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener('scroll', checkOverflow, { passive: true })
    const ro = new ResizeObserver(checkOverflow)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', checkOverflow)
      ro.disconnect()
    }
  }, [checkOverflow, tabs.length])

  // Auto-scroll para a tab ativa (especialmente útil em mobile)
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const active = el.querySelector<HTMLElement>('[aria-current="page"]')
    if (active) {
      const elRect = el.getBoundingClientRect()
      const aRect = active.getBoundingClientRect()
      if (aRect.left < elRect.left || aRect.right > elRect.right) {
        active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [location.pathname])

  return (
    <div
      className={cn(
        'relative bg-surface border-b border-border shadow-sm z-20',
        sticky && 'sticky top-[52px]',
        className
      )}
    >
      <div className="px-4 sm:px-6 relative">
        <nav
          ref={scrollerRef}
          className="flex gap-1 overflow-x-auto pb-px scrollbar-thin scrollbar-thumb-border scroll-smooth"
          role="tablist"
          aria-label="Sub-navegação"
        >
          {tabs.map((tab) => {
            const isActive =
              location.pathname === tab.href ||
              (tab.aliasHref !== undefined && location.pathname === tab.aliasHref)
            const Icon = tab.icon

            return (
              <NavLink
                key={tab.href}
                to={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg',
                  'transition-all duration-200 whitespace-nowrap border-b-2',
                  isActive
                    ? 'bg-background text-primary-600 dark:text-primary-400 border-primary-500'
                    : 'text-muted hover:text-foreground hover:bg-accent/50 border-transparent'
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-muted group-hover:text-foreground'
                    )}
                  />
                )}
                <span>{tab.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Overflow fades — indicam que há mais conteúdo para rolar */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-surface to-transparent transition-opacity duration-200',
            overflow.left ? 'opacity-100' : 'opacity-0'
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent transition-opacity duration-200',
            overflow.right ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>
    </div>
  )
}

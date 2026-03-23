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
   * Se true (padrão), aplica sticky com offset de 64px (h-16 da Topbar),
   * evitando sobreposição ao fazer scroll.
   */
  sticky?: boolean
  className?: string
}

export function PageTabs({ tabs, sticky = true, className }: PageTabsProps) {
  const location = useLocation()

  return (
    <div
      className={cn(
        'bg-surface border-b border-border shadow-sm z-20',
        sticky && 'sticky top-16',
        className
      )}
    >
      <div className="px-6">
        <nav className="flex gap-1 overflow-x-auto pb-px scrollbar-thin scrollbar-thumb-border">
          {tabs.map((tab) => {
            const isActive =
              location.pathname === tab.href ||
              (tab.aliasHref !== undefined && location.pathname === tab.aliasHref)
            const Icon = tab.icon

            return (
              <NavLink
                key={tab.href}
                to={tab.href}
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
      </div>
    </div>
  )
}

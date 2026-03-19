import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/ui/PageHeader'
import type { Crumb } from '@/shared/ui/Breadcrumbs'
import type { ReactNode } from 'react'

interface ViewTab {
  label: string
  href: string
}

interface PlanningViewsShellProps {
  title: string
  description: string
  breadcrumbs: Crumb[]
  tabs: ViewTab[]
  children: ReactNode
}

export function PlanningViewsShell({
  title,
  description,
  breadcrumbs,
  tabs,
  children,
}: PlanningViewsShellProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} />

      {/* View tabs */}
      <nav aria-label="Visualizações" className="flex gap-1 border-b border-border">
        {tabs.map((tab) => {
          const active = location.pathname === tab.href
          return (
            <button
              key={tab.href}
              onClick={() => navigate(tab.href)}
              className={[
                'px-4 py-2 text-sm font-medium transition-colors rounded-t-lg -mb-px',
                active
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-muted hover:text-foreground hover:bg-accent',
              ].join(' ')}
              aria-current={active ? 'page' : undefined}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>

      {children}
    </div>
  )
}

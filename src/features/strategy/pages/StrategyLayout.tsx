import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  Compass,
  Target,
  Gauge,
  GitBranch,
  AlertTriangle,
  Layers,
  FileText,
} from '@/shared/ui/icons'
import { ROUTES } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'

interface StrategyTab {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const strategyTabs: StrategyTab[] = [
  {
    label: 'Visão Geral',
    href: ROUTES.STRATEGY_OVERVIEW,
    icon: Compass,
    description: 'Dashboard executivo',
  },
  {
    label: 'Tese & Diretrizes',
    href: ROUTES.STRATEGY_THESIS,
    icon: FileText,
    description: 'Fundamentos estratégicos',
  },
  {
    label: 'Pilares',
    href: ROUTES.STRATEGY_PILLARS,
    icon: Layers,
    description: 'Estrutura P1–P5',
  },
  {
    label: 'OKRs',
    href: ROUTES.STRATEGY_OKRS,
    icon: Target,
    description: 'Objetivos e resultados',
  },
  {
    label: 'KPIs',
    href: ROUTES.STRATEGY_KPIS,
    icon: Gauge,
    description: 'Indicadores e metas',
  },
  {
    label: 'Cenários',
    href: ROUTES.STRATEGY_SCENARIOS,
    icon: GitBranch,
    description: 'Projeções 2026',
  },
  {
    label: 'Riscos',
    href: ROUTES.STRATEGY_RISKS,
    icon: AlertTriangle,
    description: 'Alertas críticos',
  },
]

export function StrategyLayout() {
  const location = useLocation()

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="bg-surface border-b border-border/60">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100">
              <Compass className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Estratégia</h1>
              <p className="text-sm text-muted">
                Planejamento Estratégico PE2026 — Visão executiva e desdobramento
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-20 bg-surface border-b border-border shadow-sm">
        <div className="px-6">
          <nav className="flex gap-1 overflow-x-auto pb-px scrollbar-thin scrollbar-thumb-border">
            {strategyTabs.map((tab) => {
              const isActive =
                location.pathname === tab.href ||
                (tab.href === ROUTES.STRATEGY_OVERVIEW && location.pathname === ROUTES.STRATEGY)
              const Icon = tab.icon

              return (
                <NavLink
                  key={tab.href}
                  to={tab.href}
                  className={cn(
                    'group flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap border-b-2',
                    isActive
                      ? 'bg-background text-primary-600 border-primary-500'
                      : 'text-muted hover:text-foreground hover:bg-accent/50 border-transparent'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-primary-600' : 'text-muted group-hover:text-foreground'
                    )}
                  />
                  <span>{tab.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  )
}

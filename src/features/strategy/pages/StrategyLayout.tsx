import { Outlet } from 'react-router-dom'
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
import { PageTabs, type PageTab } from '@/shared/ui/PageTabs'

const strategyTabs: PageTab[] = [
  {
    label: 'Visão Geral',
    href: ROUTES.STRATEGY_OVERVIEW,
    icon: Compass,
    aliasHref: ROUTES.STRATEGY,
  },
  {
    label: 'Tese & Diretrizes',
    href: ROUTES.STRATEGY_THESIS,
    icon: FileText,
  },
  {
    label: 'Pilares',
    href: ROUTES.STRATEGY_PILLARS,
    icon: Layers,
  },
  {
    label: 'OKRs',
    href: ROUTES.STRATEGY_OKRS,
    icon: Target,
  },
  {
    label: 'KPIs',
    href: ROUTES.STRATEGY_KPIS,
    icon: Gauge,
  },
  {
    label: 'Cenários',
    href: ROUTES.STRATEGY_SCENARIOS,
    icon: GitBranch,
  },
  {
    label: 'Riscos',
    href: ROUTES.STRATEGY_RISKS,
    icon: AlertTriangle,
  },
]

export function StrategyLayout() {
  return (
    <div className="min-h-full">
      <PageTabs tabs={strategyTabs} />

      {/* Content Area */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  )
}

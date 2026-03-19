import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { ROUTES } from '@/shared/config/routes'
import { Gauge, Lightbulb, PanelTop, LineChart, Activity, Database, FileText } from '@/shared/ui/icons'

const tabs = [
  { label: 'Scoreboard', href: ROUTES.ANALYTICS_SCOREBOARD, icon: Gauge },
  { label: 'Insights', href: ROUTES.ANALYTICS_INSIGHTS, icon: Lightbulb },
  { label: 'Dashboards', href: ROUTES.ANALYTICS_DASHBOARDS, icon: PanelTop },
  { label: 'Benchmark', href: ROUTES.ANALYTICS_BENCHMARK, icon: LineChart },
  { label: 'Forecasts', href: ROUTES.ANALYTICS_FORECASTS, icon: Activity },
  { label: 'Qualidade', href: ROUTES.ANALYTICS_DATA_HEALTH, icon: Database },
  { label: 'Relatórios', href: ROUTES.REPORTS, icon: FileText },
]

export function AnalyticsLayout() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inteligência & Analytics</h1>
        <p className="text-muted mt-1">Análises avançadas e insights estratégicos</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <NavLink
                key={tab.href}
                to={tab.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                    isActive
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-muted hover:text-foreground hover:border-border'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <Outlet />
    </div>
  )
}

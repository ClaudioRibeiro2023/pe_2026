import { AreaPlansDashboard } from '@/features/area-plans/pages/AreaPlansDashboard'
import { PageHeader } from '@/shared/ui/PageHeader'
import type { Crumb } from '@/shared/ui/Breadcrumbs'

const breadcrumbs: Crumb[] = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Planejamento', href: '/planning' },
  { label: 'Dashboard' },
]

export function PlanningDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard de Planos por Área"
        description="Visão executiva dos planos de ação por área"
        breadcrumbs={breadcrumbs}
      />
      <AreaPlansDashboard />
    </div>
  )
}

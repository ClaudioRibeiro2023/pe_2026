import { AreaPlansListPage } from '@/features/area-plans/pages/AreaPlansListPage'
import { PlanningViewsShell } from '@/features/planning/components/PlanningViewsShell'
import type { Crumb } from '@/shared/ui/Breadcrumbs'

const breadcrumbs: Crumb[] = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Planejamento', href: '/planning' },
  { label: 'Timeline' },
]

const viewTabs = [
  { label: 'Dashboard', href: '/planning/dashboard' },
  { label: 'Kanban', href: '/planning/kanban' },
  { label: 'Calendário', href: '/planning/calendar' },
  { label: 'Timeline', href: '/planning/timeline' },
]

export function PlanningTimelinePage() {
  return (
    <PlanningViewsShell
      title="Timeline — Planos de Ação"
      description="Visão temporal dos planos por área"
      breadcrumbs={breadcrumbs}
      tabs={viewTabs}
    >
      <AreaPlansListPage />
    </PlanningViewsShell>
  )
}

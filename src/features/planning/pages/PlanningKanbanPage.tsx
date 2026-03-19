import { AreaPlansListPage } from '@/features/area-plans/pages/AreaPlansListPage'
import { PlanningViewsShell } from '@/features/planning/components/PlanningViewsShell'
import type { Crumb } from '@/shared/ui/Breadcrumbs'

const breadcrumbs: Crumb[] = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Planejamento', href: '/planning' },
  { label: 'Kanban' },
]

const viewTabs = [
  { label: 'Dashboard', href: '/planning/dashboard' },
  { label: 'Kanban', href: '/planning/kanban' },
  { label: 'Calendário', href: '/planning/calendar' },
  { label: 'Timeline', href: '/planning/timeline' },
]

export function PlanningKanbanPage() {
  return (
    <PlanningViewsShell
      title="Kanban — Planos de Ação"
      description="Visão kanban dos planos por área"
      breadcrumbs={breadcrumbs}
      tabs={viewTabs}
    >
      <AreaPlansListPage />
    </PlanningViewsShell>
  )
}

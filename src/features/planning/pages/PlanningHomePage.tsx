import { AreaSelector } from '../components/AreaSelector'
import { PageHeader } from '@/shared/ui/PageHeader'
import type { Crumb } from '@/shared/ui/Breadcrumbs'

const breadcrumbs: Crumb[] = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Planejamento' },
]

export function PlanningHomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Planejamento"
        description="Gerencie planos de ação, metas e indicadores por área"
        breadcrumbs={breadcrumbs}
      />

      <AreaSelector />
    </div>
  )
}

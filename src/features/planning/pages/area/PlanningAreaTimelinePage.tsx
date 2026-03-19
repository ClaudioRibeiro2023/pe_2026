import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2 } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { useAreaBySlug } from '@/features/areas/hooks'
import { AreaPlansTimeline } from '@/features/area-plans/pages/AreaPlansTimeline'

export function PlanningAreaTimelinePage() {
  const { areaSlug } = useParams<{ areaSlug: string }>()
  const navigate = useNavigate()
  const { data: area, isLoading: areaLoading } = useAreaBySlug(areaSlug)

  if (areaLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!area) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Área não encontrada</h3>
        <p className="text-muted mb-4">A área "{areaSlug}" não foi encontrada.</p>
        <Button onClick={() => navigate('/planning/timeline')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Timeline
        </Button>
      </div>
    )
  }

  return <AreaPlansTimeline />
}

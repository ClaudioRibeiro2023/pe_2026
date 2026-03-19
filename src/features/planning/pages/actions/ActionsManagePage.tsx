import { useSearchParams } from 'react-router-dom'
import { AreaPlansListPage } from '@/features/area-plans/pages/AreaPlansListPage'

export function ActionsManagePage() {
  const [searchParams] = useSearchParams()
  const areaSlug = searchParams.get('areaSlug')
  const packId = searchParams.get('packId')
  
  // Passa filtros de área e pack para o componente (se disponíveis)
  return <AreaPlansListPage areaSlugFilter={areaSlug} packIdFilter={packId} />
}

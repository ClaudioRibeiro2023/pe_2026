import { useParams } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Columns3, 
  Calendar, 
  GanttChart, 
  FileText 
} from '@/shared/ui/icons'
import { PageTabs, type PageTab } from '@/shared/ui/PageTabs'

interface AreaSubnavProps {
  areaSlug?: string | null
}

export function AreaSubnav({ areaSlug: propAreaSlug }: AreaSubnavProps) {
  const { areaSlug: paramAreaSlug } = useParams<{ areaSlug: string }>()
  const areaSlug = propAreaSlug || paramAreaSlug

  if (!areaSlug) return null

  const tabs: PageTab[] = [
    { label: 'Dashboard', href: `/planning/${areaSlug}/dashboard`, icon: LayoutDashboard },
    { label: 'Kanban', href: `/planning/${areaSlug}/kanban`, icon: Columns3 },
    { label: 'Calendário', href: `/planning/${areaSlug}/calendar`, icon: Calendar },
    { label: 'Timeline', href: `/planning/${areaSlug}/timeline`, icon: GanttChart },
    { label: 'PE-2026', href: `/planning/${areaSlug}/pe-2026`, icon: FileText },
  ]

  return <PageTabs tabs={tabs} />
}

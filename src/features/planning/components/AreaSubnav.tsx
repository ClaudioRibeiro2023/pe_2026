import { NavLink, useParams } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Columns3, 
  Calendar, 
  GanttChart, 
  FileText 
} from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'

interface AreaSubnavProps {
  areaSlug?: string | null
  areaName?: string | null
}

interface NavItem {
  label: string
  path: string
  icon: React.ElementType
}

export function AreaSubnav({ areaSlug: propAreaSlug, areaName }: AreaSubnavProps) {
  const { areaSlug: paramAreaSlug } = useParams<{ areaSlug: string }>()
  const areaSlug = propAreaSlug || paramAreaSlug

  if (!areaSlug) return null

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: `/planning/${areaSlug}/dashboard`, icon: LayoutDashboard },
    { label: 'Kanban', path: `/planning/${areaSlug}/kanban`, icon: Columns3 },
    { label: 'Calendário', path: `/planning/${areaSlug}/calendar`, icon: Calendar },
    { label: 'Timeline', path: `/planning/${areaSlug}/timeline`, icon: GanttChart },
    { label: 'PE-2026', path: `/planning/${areaSlug}/pe-2026`, icon: FileText },
  ]

  return (
    <div className="bg-surface border-b border-border">
      <div className="px-4 py-2">
        {areaName && (
          <h2 className="text-sm font-semibold text-foreground mb-2">
            Área: {areaName}
          </h2>
        )}
        <nav className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-muted hover:bg-accent hover:text-foreground'
                  )
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

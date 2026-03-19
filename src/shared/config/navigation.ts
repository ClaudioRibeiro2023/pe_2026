import type { LucideProps } from 'lucide-react'
import {
  LayoutDashboard,
  Target,
  BarChart3,
  ClipboardList,
  Users,
  Calendar,
  Compass,
  File,
  FileText,
  Settings,
  Plus,
  Gauge,
  Lightbulb,
  Database,
  Shield,
  Building2,
  Kanban,
  GanttChart,
  PieChart,
  Briefcase,
  FolderKanban,
  FileCheck,
  FilePlus,
  Layers,
} from '@/shared/ui/icons'
import { ROUTES } from './routes'
import type { UserRole } from '@/shared/types'
import { getNavigableAreas, AREA_LABELS } from './rbac'

export type NavIcon = (props: LucideProps) => JSX.Element

export interface NavSubItem {
  label: string
  href: string
  icon: NavIcon
  allowedRoles?: UserRole[]
}

export interface NavItem {
  label: string
  href?: string
  icon: NavIcon
  subItems?: NavSubItem[]
  defaultOpen?: boolean
  allowedRoles?: UserRole[]
}

export interface NavSection {
  id: string
  title: string
  icon: NavIcon
  items: NavItem[]
  collapsible?: boolean
  allowedRoles?: UserRole[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface QuickAction {
  label: string
  icon: NavIcon
  to: string
}

export const navSections: NavSection[] = [
  {
    id: 'overview',
    title: 'Visão Geral',
    icon: LayoutDashboard,
    items: [
      {
        label: 'Dashboard',
        href: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        label: 'Calendário',
        href: ROUTES.CALENDAR,
        icon: Calendar,
      },
      {
        label: 'Relatórios',
        href: ROUTES.REPORTS,
        icon: FileText,
      },
    ],
  },
  {
    id: 'management',
    title: 'Gerencial',
    icon: Briefcase,
    items: [
      {
        label: 'Estratégia',
        href: ROUTES.STRATEGY,
        icon: Compass,
      },
      {
        label: 'Metas',
        href: ROUTES.GOALS,
        icon: Target,
      },
      {
        label: 'Indicadores',
        href: ROUTES.INDICATORS,
        icon: BarChart3,
      },
      {
        label: 'Áreas',
        href: ROUTES.AREAS,
        icon: Building2,
      },
    ],
  },
  {
    id: 'planning',
    title: 'Planejamento',
    icon: FolderKanban,
    items: [
      {
        label: 'Dashboard',
        href: ROUTES.PLANNING_DASHBOARD,
        icon: PieChart,
      },
      {
        label: 'Kanban',
        href: ROUTES.PLANNING_KANBAN,
        icon: Kanban,
      },
      {
        label: 'Calendário',
        href: ROUTES.PLANNING_CALENDAR,
        icon: Calendar,
      },
      {
        label: 'Timeline',
        href: ROUTES.PLANNING_TIMELINE,
        icon: GanttChart,
      },
      {
        label: 'Plano de Ação',
        icon: ClipboardList,
        subItems: [
          {
            label: 'Criar Novo',
            href: ROUTES.PLANNING_ACTIONS_NEW,
            icon: FilePlus,
          },
          {
            label: 'Gerenciar',
            href: ROUTES.PLANNING_ACTIONS_MANAGE,
            icon: ClipboardList,
          },
          {
            label: 'Templates',
            href: ROUTES.PLANNING_ACTIONS_TEMPLATES,
            icon: Layers,
          },
          {
            label: 'Aprovações',
            href: ROUTES.PLANNING_ACTIONS_APPROVALS,
            icon: FileCheck,
          },
          {
            label: 'Backlog de Evidências',
            href: ROUTES.PLANNING_ACTIONS_EVIDENCES,
            icon: FileText,
          },
        ],
        defaultOpen: true,
      },
    ],
  },
  {
    id: 'area-plans',
    title: 'Planos por Área',
    icon: Building2,
    items: getNavigableAreas().map((slug) => ({
      label: AREA_LABELS[slug],
      href: `/planning/${slug}/dashboard`,
      icon: Building2,
    })),
  },
  {
    id: 'analytics',
    title: 'Análises',
    icon: Gauge,
    items: [
      {
        label: 'Scoreboard',
        href: ROUTES.ANALYTICS_SCOREBOARD,
        icon: Gauge,
      },
      {
        label: 'Insights',
        href: ROUTES.ANALYTICS_INSIGHTS,
        icon: Lightbulb,
      },
      {
        label: 'Qualidade de Dados',
        href: ROUTES.ANALYTICS_DATA_HEALTH,
        icon: Database,
      },
    ],
  },
  {
    id: 'settings',
    title: 'Configurações',
    icon: Settings,
    allowedRoles: ['admin', 'direcao', 'gestor'],
    items: [
      {
        label: 'Usuários',
        href: ROUTES.ADMIN,
        icon: Users,
        allowedRoles: ['admin'],
      },
      {
        label: 'Contextos',
        href: ROUTES.ADMIN_CONTEXTS,
        icon: Database,
        allowedRoles: ['admin'],
      },
      {
        label: 'Validação',
        href: ROUTES.ADMIN_VALIDATION,
        icon: Shield,
        allowedRoles: ['admin'],
      },
      {
        label: 'Migração',
        href: ROUTES.ADMIN_MIGRATION,
        icon: Layers,
        allowedRoles: ['admin'],
      },
      {
        label: 'Governança',
        href: ROUTES.GOVERNANCE_DECISIONS,
        icon: File,
      },
      {
        label: 'Fechamentos',
        href: ROUTES.GOVERNANCE_CLOSINGS,
        icon: FileCheck,
      },
      {
        label: 'Auditoria',
        href: ROUTES.AUDIT_LOGS,
        icon: Shield,
        allowedRoles: ['admin', 'gestor'],
      },
    ],
  },
]

// Flatten nav items including subitems, only items with href
const navItemsWithSection = navSections.flatMap((section) =>
  section.items.flatMap((item) => {
    const result: Array<{ label: string; href: string; icon: NavIcon; sectionTitle: string; parentLabel?: string }> = []
    
    // Add item if it has href
    if (item.href) {
      result.push({ label: item.label, href: item.href, icon: item.icon, sectionTitle: section.title })
    }
    
    // Add subitems if they exist
    if (item.subItems) {
      item.subItems.forEach((subItem) => {
        result.push({
          label: subItem.label,
          href: subItem.href,
          icon: subItem.icon,
          sectionTitle: section.title,
          parentLabel: item.label,
        })
      })
    }
    
    return result
  })
)

const quickActions: Array<{ match: string; action: QuickAction }> = [
  {
    match: ROUTES.GOALS,
    action: {
      label: 'Nova Meta',
      icon: Plus,
      to: `${ROUTES.GOALS}?create=1`,
    },
  },
  {
    match: ROUTES.INDICATORS,
    action: {
      label: 'Novo Indicador',
      icon: Plus,
      to: `${ROUTES.INDICATORS}?create=1`,
    },
  },
  {
    match: ROUTES.ACTION_PLANS,
    action: {
      label: 'Novo Plano',
      icon: Plus,
      to: `${ROUTES.ACTION_PLANS}?create=1`,
    },
  },
  {
    match: ROUTES.AREA_PLANS,
    action: {
      label: 'Novo Plano de Área',
      icon: Plus,
      to: `${ROUTES.AREA_PLANS}?create=1`,
    },
  },
]

export function getNavContext(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  const match = [...navItemsWithSection]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => normalized === item.href || normalized.startsWith(`${item.href}/`))

  return {
    sectionTitle: match?.sectionTitle ?? 'Visão Geral',
    item: match ?? null,
    parentLabel: match?.parentLabel,
  }
}

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const { sectionTitle, item, parentLabel } = getNavContext(pathname)

  if (!item) {
    return [{ label: sectionTitle }]
  }

  const crumbs: BreadcrumbItem[] = [{ label: sectionTitle }]
  
  // Add parent label if item is a subitem
  if (parentLabel) {
    crumbs.push({ label: parentLabel })
  }
  
  crumbs.push({ label: item.label, href: item.href })

  return crumbs
}

export function getQuickAction(pathname: string): QuickAction | null {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  const match = quickActions.find((action) =>
    normalized === action.match || normalized.startsWith(`${action.match}/`)
  )

  return match?.action ?? null
}

import { useState, useRef, useEffect, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { ROUTES } from '@/shared/config/routes'
import { routePreloaders } from '@/app/routePreloaders'
import { useAuth } from '@/features/auth/AuthProvider'
import { navSections } from '@/shared/config/navigation'
import { filterNavByRole } from '@/shared/lib/navAccess'
import { ChevronsLeft, ChevronsRight, ChevronDown, ChevronRight } from '@/shared/ui/icons'
import { Logo, LogoMark } from '@/shared/ui/Logo'
import type { UserRole } from '@/shared/types'

interface NavItemWithSubItems {
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  subItems?: Array<{
    label: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }>
  defaultOpen?: boolean
}

function SidebarItem({
  item,
  collapsed,
  onPreload,
}: {
  item: NavItemWithSubItems
  collapsed: boolean
  onPreload: (href: string) => void
}) {
  const [isOpen, setIsOpen] = useState(item.defaultOpen ?? false)
  const Icon = item.icon
  const hasSubItems = item.subItems && item.subItems.length > 0

  // If collapsed and has subitems, just show the parent icon that navigates to first subitem
  if (collapsed && hasSubItems) {
    const firstSubItem = item.subItems![0]
    return (
      <NavLink
        to={firstSubItem.href}
        onMouseEnter={() => onPreload(firstSubItem.href)}
        onFocus={() => onPreload(firstSubItem.href)}
        title={item.label}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-2.5 px-2 py-2 rounded-md text-sm font-medium transition-colors justify-center',
            isActive
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
              : 'text-muted hover:text-foreground hover:bg-accent'
          )
        }
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
      </NavLink>
    )
  }

  // If no subitems and no href, skip
  if (!hasSubItems && !item.href) return null

  // Simple link without subitems
  if (!hasSubItems && item.href) {
    return (
      <NavLink
        to={item.href}
        end={item.href === ROUTES.DASHBOARD}
        onMouseEnter={() => onPreload(item.href!)}
        onFocus={() => onPreload(item.href!)}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
              : 'text-muted hover:text-foreground hover:bg-accent',
            collapsed && 'justify-center px-2'
          )
        }
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </NavLink>
    )
  }

  // Expandable item with subitems
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors',
          'text-muted hover:text-foreground hover:bg-accent'
        )}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted" />
        )}
      </button>
      {isOpen && (
        <div className="mt-1 ml-4 pl-2 border-l border-border space-y-0.5">
          {item.subItems!.map((subItem) => {
            const SubIcon = subItem.icon
            return (
              <NavLink
                key={subItem.href}
                to={subItem.href}
                onMouseEnter={() => onPreload(subItem.href)}
                onFocus={() => onPreload(subItem.href)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-muted hover:text-foreground hover:bg-accent/50'
                  )
                }
              >
                <SubIcon className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{subItem.label}</span>
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  direcao: 'Direção',
  gestor: 'Gestor',
  colaborador: 'Colaborador',
  cliente: 'Cliente',
}

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-danger-500/20 text-danger-400 border-danger-500/30',
  direcao: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
  gestor: 'bg-info-500/20 text-info-400 border-info-500/30',
  colaborador: 'bg-success-500/20 text-success-400 border-success-500/30',
  cliente: 'bg-accent text-muted border-border',
}

const ALL_ROLES: UserRole[] = ['admin', 'direcao', 'gestor', 'colaborador', 'cliente']

export function Sidebar() {
  const { user, roleOverride, setRoleOverride } = useAuth()
  const userRole = user?.profile?.role
  const userEmail = user?.email || 'usuário'
  const [showRolePicker, setShowRolePicker] = useState(false)

  // Filter nav sections directly — bypasses any memoization issues
  const sections = filterNavByRole(navSections, userRole)

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('sidebar-collapsed') === 'true'
  })
  const navRef = useRef<HTMLElement>(null)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const checkScroll = useCallback(() => {
    const el = navRef.current
    if (!el) return
    setCanScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 8)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = navRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect() }
  }, [checkScroll, sections])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('sidebar-collapsed', String(next))
      }
      return next
    })
  }

  const handlePreload = (href: string) => {
    routePreloaders[href]?.()
  }

  return (
    <aside
      data-tour="sidebar"
      className={cn(
        'hidden lg:flex lg:flex-col bg-surface border-r border-border transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-14 border-b border-border',
        collapsed ? 'px-3 justify-center' : 'px-4'
      )}>
        {collapsed ? (
          <LogoMark className="w-8 h-8" />
        ) : (
          <>
            <Logo collapsed={false} />
            <button
              onClick={toggleCollapsed}
              className="ml-auto p-1.5 rounded-md text-muted hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Recolher menu"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav ref={navRef} className={cn('flex-1 py-3 overflow-y-auto relative', collapsed ? 'px-2' : 'px-3')}>
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className={cn(sectionIndex > 0 && 'mt-6')}>
            {!collapsed && (
              <p className="px-2 mb-2 text-[11px] font-medium text-muted uppercase tracking-wider">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarItem
                  key={item.label}
                  item={item as NavItemWithSubItems}
                  collapsed={collapsed}
                  onPreload={handlePreload}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Scroll indicator */}
      {canScrollDown && (
        <div className="h-6 bg-gradient-to-t from-surface to-transparent pointer-events-none -mt-6 relative z-10" />
      )}

      {/* Footer — User identification */}
      <div className={cn('border-t border-border', collapsed ? 'px-2 py-2' : 'px-3 py-3')}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div
              title={`${userEmail} (${userRole ? ROLE_LABELS[userRole] : '...'})`}
              className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold uppercase"
            >
              {userEmail.charAt(0)}
            </div>
            <button
              onClick={toggleCollapsed}
              className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Expandir menu"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold uppercase">
                {userEmail.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {userEmail}
                </p>
                {userRole && (
                  <button
                    onClick={() => setShowRolePicker(!showRolePicker)}
                    className={cn(
                      'inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded border cursor-pointer hover:opacity-80 transition-opacity',
                      ROLE_COLORS[userRole]
                    )}
                    title="Clique para trocar role (teste)"
                  >
                    {ROLE_LABELS[userRole]}
                    {roleOverride && <span className="text-[8px]">⚡</span>}
                  </button>
                )}
              </div>
            </div>
            {showRolePicker && (
              <div className="bg-accent/50 rounded-md p-2 space-y-1">
                <p className="text-[10px] font-medium text-muted mb-1">Simular role:</p>
                {ALL_ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      setRoleOverride(userRole === role && !roleOverride ? null : role)
                      setShowRolePicker(false)
                    }}
                    className={cn(
                      'w-full text-left px-2 py-1 rounded text-[11px] font-medium transition-colors',
                      userRole === role
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-muted hover:bg-accent'
                    )}
                  >
                    {ROLE_LABELS[role]}
                    {role === userRole && roleOverride && ' ✓'}
                    {role === userRole && !roleOverride && ' (atual)'}
                  </button>
                ))}
                {roleOverride && (
                  <button
                    onClick={() => { setRoleOverride(null); setShowRolePicker(false) }}
                    className="w-full text-left px-2 py-1 rounded text-[11px] font-medium text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                  >
                    Resetar para original
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted">v1.0.0</p>
              <NavLink
                to={ROUTES.ADMIN_VALIDATION}
                className="text-[10px] text-muted hover:text-primary-500 transition-colors"
                title="Diagnóstico da plataforma"
              >
                Diagnóstico
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

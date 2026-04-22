import { useState, useRef, useEffect, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { ROUTES } from '@/shared/config/routes'
import { routePreloaders } from '@/app/routePreloaders'
import { useAuth } from '@/features/auth/AuthProvider'
import { navSections } from '@/shared/config/navigation'
import { filterNavByRole } from '@/shared/lib/navAccess'
import type { NavBadge } from '@/shared/config/navigation'
import { ChevronsLeft, ChevronsRight, ChevronDown, Search } from '@/shared/ui/icons'
import { Logo, LogoMark } from '@/shared/ui/Logo'
import type { UserRole } from '@/shared/types'
import { SidebarTooltip } from './components/SidebarTooltip'
import { useCommandPalette } from '@/shared/hooks/useCommandPalette'

interface NavItemWithSubItems {
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  subItems?: Array<{
    label: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: NavBadge
    notificationCount?: number
  }>
  defaultOpen?: boolean
  badge?: NavBadge
  notificationCount?: number
}

const BADGE_CLASS: Record<string, string> = {
  BETA: 'bg-warning-500/20 text-warning-400 border-warning-500/20',
  DEV: 'bg-primary-500/20 text-primary-400 border-primary-500/20',
  NEW: 'bg-success-500/20 text-success-400 border-success-500/20',
}

function Badge({ children }: { children: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full tracking-wide border',
        BADGE_CLASS[children] || 'bg-gray-500/20 text-gray-400 border-gray-500/20'
      )}
    >
      {children}
    </span>
  )
}

function NotificationDot({ count }: { count: number }) {
  return (
    <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-danger-500 text-white text-[10px] font-bold px-1 ring-2 ring-surface">
      {count > 99 ? '99+' : count}
    </span>
  )
}

function ActiveBar() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary-500"
    />
  )
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
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(item.defaultOpen ?? false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const Icon = item.icon
  const hasSubItems = item.subItems && item.subItems.length > 0

  const hasActiveChild = item.subItems?.some(
    (sub) => location.pathname === sub.href || location.pathname.startsWith(`${sub.href}/`)
  ) ?? false

  // Auto-expandir quando tem filho ativo
  useEffect(() => {
    if (hasActiveChild) setIsOpen(true)
  }, [hasActiveChild])

  // Contagem de notificações do item + filhos
  const totalNotifications =
    (item.notificationCount ?? 0) +
    (item.subItems?.reduce((sum, s) => sum + (s.notificationCount ?? 0), 0) ?? 0)

  // Mouse enter / leave com delay curto para não piscar
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleMouseEnter = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
    if (collapsed) setTooltipOpen(true)
  }
  const handleMouseLeave = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
    tooltipTimer.current = setTimeout(() => setTooltipOpen(false), 100)
  }

  // ── Colapsada com subitems: navega para o 1º filho ──
  if (collapsed && hasSubItems) {
    const firstSubItem = item.subItems![0]
    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NavLink
          to={firstSubItem.href}
          onMouseEnter={() => onPreload(firstSubItem.href)}
          onFocus={() => onPreload(firstSubItem.href)}
          className={({ isActive }) => {
            const activeState = isActive || hasActiveChild
            return cn(
              'relative flex items-center justify-center min-h-[40px] min-w-[40px] rounded-lg transition-all duration-150',
              activeState
                ? 'bg-primary-500/10 text-primary-500'
                : 'text-muted hover:text-foreground hover:bg-accent'
            )
          }}
        >
          {(hasActiveChild) && <ActiveBar />}
          <span className="relative">
            <Icon className="h-[18px] w-[18px] flex-shrink-0" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-danger-500 text-white text-[9px] font-bold px-0.5 ring-2 ring-surface">
                {totalNotifications > 99 ? '99+' : totalNotifications}
              </span>
            )}
          </span>
        </NavLink>
        <SidebarTooltip
          label={item.label}
          badge={item.badge}
          notificationCount={totalNotifications}
          visible={tooltipOpen}
        />
      </div>
    )
  }

  // ── Sem subitems e sem href ──
  if (!hasSubItems && !item.href) return null

  // ── Link simples ──
  if (!hasSubItems && item.href) {
    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NavLink
          to={item.href}
          end={item.href === ROUTES.DASHBOARD}
          onMouseEnter={() => onPreload(item.href!)}
          onFocus={() => onPreload(item.href!)}
          className={({ isActive }) =>
            cn(
              'group relative flex items-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              collapsed
                ? 'justify-center min-h-[40px] min-w-[40px]'
                : 'px-2.5 py-2 hover:translate-x-0.5',
              isActive
                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'text-muted hover:text-foreground hover:bg-accent'
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <ActiveBar />}
              <span className="relative flex-shrink-0">
                <Icon className="h-[18px] w-[18px]" />
                {collapsed && item.notificationCount != null && item.notificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-danger-500 text-white text-[9px] font-bold px-0.5 ring-2 ring-surface">
                    {item.notificationCount > 99 ? '99+' : item.notificationCount}
                  </span>
                )}
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && <Badge>{item.badge}</Badge>}
                  {item.notificationCount != null && item.notificationCount > 0 && (
                    <NotificationDot count={item.notificationCount} />
                  )}
                </>
              )}
            </>
          )}
        </NavLink>
        {collapsed && (
          <SidebarTooltip
            label={item.label}
            badge={item.badge}
            notificationCount={item.notificationCount}
            visible={tooltipOpen}
          />
        )}
      </div>
    )
  }

  // ── Expansível com subitems ──
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={cn(
          'relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:translate-x-0.5',
          hasActiveChild
            ? 'text-primary-600 dark:text-primary-400 bg-primary-500/5'
            : 'text-muted hover:text-foreground hover:bg-accent'
        )}
      >
        {hasActiveChild && <ActiveBar />}
        <Icon className="h-[18px] w-[18px] flex-shrink-0" />
        <span className="flex-1 text-left truncate">{item.label}</span>
        {item.badge && <Badge>{item.badge}</Badge>}
        {totalNotifications > 0 && <NotificationDot count={totalNotifications} />}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200',
            isOpen ? '' : '-rotate-90',
            hasActiveChild ? 'text-primary-500' : 'text-muted'
          )}
        />
      </button>
      {isOpen && (
        <div className="mt-1 ml-4 pl-2 border-l border-primary-500/20 space-y-0.5">
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
                    'group flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-all duration-150',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-500/10'
                      : 'text-muted hover:text-foreground hover:bg-accent/50'
                  )
                }
              >
                <SubIcon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="flex-1 truncate">{subItem.label}</span>
                {subItem.badge && <Badge>{subItem.badge}</Badge>}
                {subItem.notificationCount != null && subItem.notificationCount > 0 && (
                  <NotificationDot count={subItem.notificationCount} />
                )}
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

interface SidebarProps {
  /** Se true, força exibição em mobile (drawer). Default: escondido em <lg. */
  forceVisible?: boolean
}

export function Sidebar({ forceVisible = false }: SidebarProps = {}) {
  const { user, roleOverride, setRoleOverride } = useAuth()
  const commandPalette = useCommandPalette()
  const userRole = user?.profile?.role
  const userEmail = user?.email || 'usuário'
  const [showRolePicker, setShowRolePicker] = useState(false)

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

  const MOD_KEY = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'

  return (
    <aside
      data-tour="sidebar"
      role="navigation"
      aria-label="Menu principal"
      className={cn(
        'flex flex-col bg-surface border-r border-border transition-[width] duration-200 ease-out h-full',
        forceVisible ? 'flex' : 'hidden lg:flex',
        collapsed ? 'w-[56px]' : 'w-60'
      )}
    >
      {/* ── Logo + Collapse ── */}
      <div className={cn(
        'flex items-center h-[52px] border-b border-border flex-shrink-0',
        collapsed ? 'px-2 justify-center' : 'px-3 justify-between'
      )}>
        {collapsed ? (
          <LogoMark className="w-8 h-8" />
        ) : (
          <>
            <Logo collapsed={false} />
            <button
              onClick={toggleCollapsed}
              className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Recolher menu"
              title="Recolher menu"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* ── Quick Search Trigger ── */}
      <div className={cn('pt-2 pb-1 flex-shrink-0', collapsed ? 'px-2' : 'px-2.5')}>
        <button
          onClick={commandPalette.toggle}
          className={cn(
            'group w-full flex items-center gap-2 rounded-lg transition-all duration-150',
            'bg-accent/50 hover:bg-accent border border-border hover:border-border-strong',
            'text-muted hover:text-foreground',
            collapsed ? 'p-2 justify-center' : 'px-2.5 py-1.5'
          )}
          title={collapsed ? `Buscar (${MOD_KEY}+K)` : undefined}
          aria-label="Abrir busca global"
        >
          <Search className="h-4 w-4 flex-shrink-0 group-hover:rotate-12 transition-transform" />
          {!collapsed && (
            <>
              <span className="text-xs flex-1 text-left">Buscar...</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-muted">
                {MOD_KEY}K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav ref={navRef} className={cn('flex-1 py-2 overflow-y-auto relative', collapsed ? 'px-2' : 'px-2.5')}>
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className={cn(sectionIndex > 0 && 'mt-3 pt-3')}>
            {sectionIndex > 0 && (
              <div className={cn('border-t border-border mb-2', collapsed ? '-mx-2' : '-mx-2.5')} />
            )}
            {!collapsed ? (
              <p className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted/70 select-none">
                {section.title}
              </p>
            ) : (
              <div className="sr-only">{section.title}</div>
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

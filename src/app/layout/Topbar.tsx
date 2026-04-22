import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, LogOut, ChevronDown, ChevronRight, Search, Moon, Sun, Bell } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import { useAuth } from '@/features/auth/AuthProvider'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { useNotifications } from '@/shared/contexts/NotificationContext'
import { NotificationPanel } from '@/shared/components/notifications/NotificationPanel'
import { MobileDrawer } from '@/shared/components/mobile/MobileDrawer'
import { getBreadcrumbs, getNavContext, getQuickAction } from '@/shared/config/navigation'

interface TopbarProps {
  onOpenSearch?: () => void
}

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  direcao: 'Direção',
  gestor: 'Gestor',
  colaborador: 'Colaborador',
  cliente: 'Cliente',
}

export function Topbar({ onOpenSearch }: TopbarProps) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { unreadCount } = useNotifications()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)

  // Fechar menus flutuantes ao mudar de rota
  useEffect(() => {
    setMenuOpen(false)
    setNotificationsOpen(false)
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Fechar menu com ESC
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const { sectionTitle } = getNavContext(location.pathname)
  const breadcrumbs = getBreadcrumbs(location.pathname)
  const quickAction = getQuickAction(location.pathname)
  const userLabel = user?.email ? user.email.split('@')[0] : 'Usuário'
  const userEmail = user?.email || 'Usuário'
  const userRole = user?.profile?.role
  const userInitial = (userEmail.charAt(0) || 'U').toUpperCase()

  return (
    <header
      role="banner"
      className="relative z-30 flex items-center justify-between h-[52px] px-3 md:px-5 bg-surface/90 backdrop-blur-sm border-b border-border flex-shrink-0"
    >
      {/* ── Left: Mobile menu + Breadcrumb ── */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-accent text-muted hover:text-foreground transition-colors flex-shrink-0"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop breadcrumb */}
        <div className="hidden sm:flex flex-col min-w-0">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted/80 font-semibold leading-tight">
            {sectionTitle}
          </span>
          <nav
            aria-label="Trilha de navegação"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground mt-0.5 truncate"
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <div key={`${crumb.label}-${index}`} className="flex items-center gap-1.5 min-w-0">
                  {crumb.href && !isLast ? (
                    <Link
                      to={crumb.href}
                      className="text-foreground hover:text-primary-600 transition-colors truncate"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cn('truncate', isLast ? 'text-foreground' : 'text-muted')}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <ChevronRight className="h-3.5 w-3.5 text-muted/60 flex-shrink-0" />}
                </div>
              )
            })}
          </nav>
        </div>

        {/* Mobile: último segmento */}
        <span className="sm:hidden text-sm font-semibold text-foreground truncate">
          {breadcrumbs[breadcrumbs.length - 1]?.label ?? 'Dashboard'}
        </span>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Search pill (desktop) */}
        <button
          data-tour="search"
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 px-3 h-8 rounded-lg border border-border bg-accent/40 hover:bg-accent hover:border-border-strong text-muted hover:text-foreground transition-colors"
          aria-label="Abrir busca global"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-[13px]">Buscar...</span>
          <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-surface rounded border border-border">
            ⌘K
          </kbd>
        </button>

        {/* Search icon-only (mobile/tablet) */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-lg hover:bg-accent text-muted hover:text-foreground transition-colors"
          aria-label="Buscar"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* QuickAction contextual */}
        {quickAction && (
          <Link
            to={quickAction.to}
            className="hidden md:inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-primary-600 text-white text-[13px] font-medium shadow-sm hover:bg-primary-700 transition-colors ml-1"
          >
            <quickAction.icon className="h-3.5 w-3.5" />
            {quickAction.label}
          </Link>
        )}

        <div className="w-px h-5 bg-border mx-1 hidden md:block" aria-hidden="true" />

        {/* Notifications */}
        <div className="relative">
          <button
            data-tour="notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg hover:bg-accent text-muted hover:text-foreground transition-colors"
            aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
            title="Notificações"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white px-1 ring-2 ring-surface">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        </div>

        {/* Theme toggle com rotação */}
        <button
          data-tour="theme"
          onClick={toggleTheme}
          className="group p-2 rounded-lg hover:bg-accent text-muted hover:text-foreground transition-colors"
          aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          <span className="block transition-transform duration-300 group-hover:rotate-12">
            {theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </span>
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 pl-1 pr-2 h-9 rounded-lg hover:bg-accent transition-colors max-w-[220px]"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {userInitial}
            </div>
            <span
              className="hidden sm:block text-[13px] font-medium text-foreground truncate max-w-[120px]"
              title={userEmail}
            >
              {userLabel}
            </span>
            <ChevronDown
              className={cn('h-3.5 w-3.5 text-muted transition-transform', menuOpen && 'rotate-180')}
            />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div
                role="menu"
                className="absolute right-0 mt-2 w-60 bg-surface rounded-xl shadow-lg border border-border py-1 z-50 animate-fade-in"
              >
                <div className="px-3 py-2.5 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-medium text-foreground truncate"
                        title={userEmail}
                      >
                        {userEmail}
                      </p>
                      <p className="text-[11px] text-muted">
                        {userRole ? ROLE_LABEL[userRole] ?? userRole : 'Usuário'}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    signOut()
                  }}
                  role="menuitem"
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <LogOut className="h-4 w-4 text-muted" />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  )
}

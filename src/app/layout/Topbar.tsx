import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, LogOut, User, ChevronDown, ChevronRight, Search, Moon, Sun, Bell } from '@/shared/ui/icons'
import { useAuth } from '@/features/auth/AuthProvider'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { useNotifications } from '@/shared/contexts/NotificationContext'
import { NotificationPanel } from '@/shared/components/notifications/NotificationPanel'
import { MobileDrawer } from '@/shared/components/mobile/MobileDrawer'
import { getBreadcrumbs, getNavContext, getQuickAction } from '@/shared/config/navigation'

interface TopbarProps {
  onOpenSearch?: () => void
}

export function Topbar({ onOpenSearch }: TopbarProps) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { unreadCount } = useNotifications()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Fechar todos os menus flutuantes ao navegar para outra rota
  useEffect(() => {
    setMenuOpen(false)
    setNotificationsOpen(false)
    setMobileMenuOpen(false)
  }, [location.pathname])
  const { sectionTitle } = getNavContext(location.pathname)
  const breadcrumbs = getBreadcrumbs(location.pathname)
  const quickAction = getQuickAction(location.pathname)
  const userLabel = user?.email ? user.email.split('@')[0] : 'Usuário'
  const userEmail = user?.email || 'Usuário'

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-surface border-b border-border">
      {/* Mobile menu button */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-accent"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5 text-muted" />
        </button>
        <div className="hidden sm:flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.18em] text-foreground/60 dark:text-foreground/50 font-medium">
            {sectionTitle}
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {breadcrumbs.map((crumb, index) => (
              <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="text-foreground hover:text-primary-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-muted">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User menu */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            data-tour="notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg hover:bg-accent text-muted hover:text-foreground transition-colors"
            title="Notificações"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-600 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        </div>
        {/* Theme toggle */}
        <button
          data-tour="theme"
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-accent text-muted hover:text-foreground transition-colors"
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        {/* Search button */}
        <button
          data-tour="search"
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-accent/50 hover:bg-accent text-muted hover:text-foreground transition-colors"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Buscar...</span>
          <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-surface rounded border border-border">
            ⌘K
          </kbd>
        </button>
        {quickAction && (
          <Link
            to={quickAction.to}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors"
          >
            <quickAction.icon className="h-4 w-4" />
            {quickAction.label}
          </Link>
        )}
        <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-accent transition-colors max-w-[220px]"
        >
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="h-4 w-4 text-primary-600" />
          </div>
          <span
            className="hidden sm:block text-sm font-medium text-foreground truncate max-w-[140px]"
            title={userEmail}
          >
            {userLabel}
          </span>
          <ChevronDown className="h-4 w-4 text-muted" />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border py-1 z-20">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-muted capitalize">
                  {user?.profile?.role || 'Usuário'}
                </p>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  signOut()
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-accent"
              >
                <LogOut className="h-4 w-4" />
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

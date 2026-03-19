import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { X, ChevronDown } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import { useNavAccess } from '@/shared/hooks/useNavAccess'
import { useFavorites } from '@/shared/contexts/FavoritesContext'
import { routePreloaders } from '@/app/routePreloaders'
import { env } from '@/shared/config/env'
import type { NavItem } from '@/shared/config/navigation'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { favorites } = useFavorites()
  const { sections } = useNavAccess()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Get all items with href (including subitems) for favorites
  const allItemsWithHref = sections.flatMap((section) =>
    section.items.flatMap((item) => {
      const items: Array<{ label: string; href: string; icon: typeof item.icon }> = []
      if (item.href) {
        items.push({ label: item.label, href: item.href, icon: item.icon })
      }
      if (item.subItems) {
        item.subItems.forEach((sub) => {
          items.push({ label: sub.label, href: sub.href, icon: sub.icon })
        })
      }
      return items
    })
  )

  const favoriteItems = allItemsWithHref.filter((item) => favorites.includes(item.href))

  const handlePreload = (href: string) => {
    routePreloaders[href]?.()
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-80 bg-surface border-r border-border z-50 lg:hidden',
          'transform transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-foreground">{env.appName}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent text-muted hover:text-foreground transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-4 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {/* Favorites */}
          {favoriteItems.length > 0 && (
            <div className="space-y-2">
              <p className="nav-section-title">Favoritos</p>
              <div className="space-y-1">
                {favoriteItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      onMouseEnter={() => handlePreload(item.href)}
                      onFocus={() => handlePreload(item.href)}
                      className={({ isActive }) =>
                        cn('nav-item', isActive && 'nav-item-active')
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={cn('nav-item-icon', isActive && 'nav-item-icon-active')}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="flex-1">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          )}

          {/* Sections */}
          {sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <div className="flex items-center gap-2 nav-section-title">
                <section.icon className="h-4 w-4 text-muted" />
                <span>{section.title}</span>
              </div>
              <div className="space-y-1">
                {section.items.map((item, index) => (
                  <MobileNavItem
                    key={item.href || `${section.id}-${index}`}
                    item={item}
                    onClose={onClose}
                    onPreload={handlePreload}
                    openSubmenu={openSubmenu}
                    setOpenSubmenu={setOpenSubmenu}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="py-4 px-4 border-t border-border">
          <p className="text-xs text-muted text-center">v{env.appVersion}</p>
        </div>
      </aside>
    </>
  )
}

interface MobileNavItemProps {
  item: NavItem
  onClose: () => void
  onPreload: (href: string) => void
  openSubmenu: string | null
  setOpenSubmenu: (id: string | null) => void
}

function MobileNavItem({ item, onClose, onPreload, openSubmenu, setOpenSubmenu }: MobileNavItemProps) {
  const location = useLocation()
  const itemId = item.href || item.label

  // Check if any subitem is active
  const hasActiveChild = item.subItems?.some(
    (sub) => location.pathname === sub.href || location.pathname.startsWith(`${sub.href}/`)
  )

  const isOpen = openSubmenu === itemId || hasActiveChild

  // If item has no subitems, render as simple link
  if (!item.subItems || item.subItems.length === 0) {
    if (!item.href) return null

    const Icon = item.icon
    return (
      <NavLink
        to={item.href}
        onClick={onClose}
        onMouseEnter={() => onPreload(item.href!)}
        className={({ isActive }) =>
          cn('nav-item', isActive && 'nav-item-active')
        }
      >
        {({ isActive }) => (
          <>
            <span className={cn('nav-item-icon', isActive && 'nav-item-icon-active')}>
              <Icon className="h-4 w-4" />
            </span>
            <span className="flex-1">{item.label}</span>
          </>
        )}
      </NavLink>
    )
  }

  // Render item with accordion submenu
  const Icon = item.icon

  return (
    <div className="space-y-1">
      <button
        onClick={() => setOpenSubmenu(isOpen ? null : itemId)}
        className={cn(
          'nav-item w-full justify-between',
          hasActiveChild && 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
        )}
      >
        <span className="flex items-center gap-3">
          <span className="nav-item-icon">
            <Icon className="h-4 w-4" />
          </span>
          <span>{item.label}</span>
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Subitems */}
      {isOpen && (
        <div className="ml-4 pl-4 border-l border-border/60 space-y-1">
          {item.subItems.map((subItem) => {
            const SubIcon = subItem.icon
            return (
              <NavLink
                key={subItem.href}
                to={subItem.href}
                onClick={onClose}
                onMouseEnter={() => onPreload(subItem.href)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-medium dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-muted hover:text-foreground hover:bg-accent/70'
                  )
                }
              >
                <SubIcon className="h-4 w-4" />
                <span>{subItem.label}</span>
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import type { NavItem, NavSubItem } from '@/shared/config/navigation'

interface NavItemWithSubmenuProps {
  item: NavItem
  collapsed: boolean
  onPreload?: (href: string) => void
}

export function NavItemWithSubmenu({ item, collapsed, onPreload }: NavItemWithSubmenuProps) {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(item.defaultOpen ?? false)

  // Check if any subitem is active
  const hasActiveChild = item.subItems?.some(
    (sub) => location.pathname === sub.href || location.pathname.startsWith(`${sub.href}/`)
  )

  // Auto-expand if child is active
  useEffect(() => {
    if (hasActiveChild && !isOpen) {
      setIsOpen(true)
    }
  }, [hasActiveChild, isOpen])

  // If item has no subitems, render as simple link
  if (!item.subItems || item.subItems.length === 0) {
    if (!item.href) return null

    return (
      <NavLink
        to={item.href}
        onMouseEnter={() => onPreload?.(item.href!)}
        className={({ isActive }) =>
          cn(
            'nav-item group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            isActive
              ? 'nav-item-active'
              : 'text-muted hover:text-foreground hover:bg-accent'
          )
        }
      >
        <span className="nav-item-icon flex-shrink-0">
          <item.icon className="h-5 w-5" />
        </span>
        {!collapsed && <span className="truncate">{item.label}</span>}
      </NavLink>
    )
  }

  // Render item with submenu
  const Icon = item.icon

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'nav-item group flex w-full items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          hasActiveChild
            ? 'text-primary-600 dark:text-primary-400 hover:bg-accent'
            : 'text-muted hover:text-foreground hover:bg-accent'
        )}
      >
        <span className="flex items-center gap-3">
          <span className="nav-item-icon flex-shrink-0">
            <Icon className="h-5 w-5" />
          </span>
          {!collapsed && <span className="truncate">{item.label}</span>}
        </span>
        {!collapsed && (
          <ChevronDown
            className={cn(
              'h-4 w-4 flex-shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        )}
      </button>

      {/* Subitems */}
      <AnimatePresence initial={false}>
        {isOpen && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-4 pl-4 border-l border-primary-200 dark:border-primary-800/50 space-y-1 py-1">
              {item.subItems.map((subItem) => (
                <SubItemLink
                  key={subItem.href}
                  subItem={subItem}
                  onPreload={onPreload}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip for collapsed sidebar */}
      {collapsed && (
        <div className="absolute left-full ml-2 hidden group-hover:block z-50">
          <div className="bg-surface border border-border rounded-lg shadow-lg py-2 px-1 min-w-[160px]">
            <div className="px-3 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              {item.label}
            </div>
            {item.subItems.map((subItem) => (
              <NavLink
                key={subItem.href}
                to={subItem.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                    isActive
                      ? 'nav-item-active'
                      : 'text-muted hover:text-foreground hover:bg-accent'
                  )
                }
              >
                <subItem.icon className="h-4 w-4" />
                {subItem.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface SubItemLinkProps {
  subItem: NavSubItem
  onPreload?: (href: string) => void
}

function SubItemLink({ subItem, onPreload }: SubItemLinkProps) {
  const Icon = subItem.icon

  return (
    <NavLink
      to={subItem.href}
      onMouseEnter={() => onPreload?.(subItem.href)}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200',
          isActive
            ? 'nav-item-active'
            : 'text-muted hover:text-foreground hover:bg-accent/70'
        )
      }
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{subItem.label}</span>
    </NavLink>
  )
}

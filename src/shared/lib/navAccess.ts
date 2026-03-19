import type { NavSection, NavItem, NavSubItem } from '@/shared/config/navigation'
import type { UserRole } from '@/shared/types'

/**
 * Check if a role is allowed to access a section/item
 */
function isRoleAllowed(allowedRoles: UserRole[] | undefined, userRole: UserRole | undefined): boolean {
  // If no roles specified, allow all
  if (!allowedRoles || allowedRoles.length === 0) {
    return true
  }
  
  // If no user role, deny access
  if (!userRole) {
    return false
  }
  
  return allowedRoles.includes(userRole)
}

/**
 * Filter navigation sections based on user role
 */
export function filterNavByRole(
  sections: NavSection[],
  userRole: UserRole | undefined
): NavSection[] {
  return sections
    .filter((section) => isRoleAllowed(section.allowedRoles, userRole))
    .map((section) => ({
      ...section,
      items: filterItemsByRole(section.items, userRole),
    }))
    .filter((section) => section.items.length > 0)
}

/**
 * Filter nav items based on user role
 */
function filterItemsByRole(items: NavItem[], userRole: UserRole | undefined): NavItem[] {
  return items
    .filter((item) => isRoleAllowed(item.allowedRoles, userRole))
    .map((item) => {
      if (item.subItems) {
        return {
          ...item,
          subItems: filterSubItemsByRole(item.subItems, userRole),
        }
      }
      return item
    })
    .filter((item) => {
      // Keep item if it has href or has subitems after filtering
      if (item.href) return true
      if (item.subItems && item.subItems.length > 0) return true
      return false
    })
}

/**
 * Filter sub items based on user role
 */
function filterSubItemsByRole(subItems: NavSubItem[], userRole: UserRole | undefined): NavSubItem[] {
  return subItems.filter((subItem) => isRoleAllowed(subItem.allowedRoles, userRole))
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(
  pathname: string,
  userRole: UserRole | undefined,
  sections: NavSection[]
): boolean {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  
  // Check all sections
  for (const section of sections) {
    // Check section-level access
    if (!isRoleAllowed(section.allowedRoles, userRole)) {
      continue
    }
    
    for (const item of section.items) {
      // Check item-level access
      if (!isRoleAllowed(item.allowedRoles, userRole)) {
        continue
      }
      
      // Check if route matches item href
      if (item.href && (normalized === item.href || normalized.startsWith(`${item.href}/`))) {
        return true
      }
      
      // Check subitems
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (!isRoleAllowed(subItem.allowedRoles, userRole)) {
            continue
          }
          
          if (normalized === subItem.href || normalized.startsWith(`${subItem.href}/`)) {
            return true
          }
        }
      }
    }
  }
  
  // Route not found in navigation - allow by default (for public routes like login)
  return true
}

/**
 * Get all accessible routes for a user role
 */
export function getAccessibleRoutes(
  sections: NavSection[],
  userRole: UserRole | undefined
): string[] {
  const routes: string[] = []
  const filteredSections = filterNavByRole(sections, userRole)
  
  for (const section of filteredSections) {
    for (const item of section.items) {
      if (item.href) {
        routes.push(item.href)
      }
      
      if (item.subItems) {
        for (const subItem of item.subItems) {
          routes.push(subItem.href)
        }
      }
    }
  }
  
  return routes
}

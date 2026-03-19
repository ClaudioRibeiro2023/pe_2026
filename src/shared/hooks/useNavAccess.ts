import { useMemo } from 'react'
import { useAuth } from '@/features/auth/AuthProvider'
import { navSections } from '@/shared/config/navigation'
import { filterNavByRole, canAccessRoute, getAccessibleRoutes } from '@/shared/lib/navAccess'

/**
 * Hook to get filtered navigation sections based on user role
 */
export function useNavAccess() {
  const { user } = useAuth()
  const userRole = user?.profile?.role

  // Compute sections directly (not memoized) to avoid stale closure issues
  const sections = filterNavByRole(navSections, userRole)

  const canAccess = useMemo(() => {
    return (pathname: string) => canAccessRoute(pathname, userRole, navSections)
  }, [userRole])

  const accessibleRoutes = useMemo(() => {
    return getAccessibleRoutes(navSections, userRole)
  }, [userRole])

  return {
    sections,
    canAccess,
    accessibleRoutes,
    userRole,
  }
}

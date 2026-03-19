import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { ROUTES } from '@/shared/config/routes'
import type { UserRole } from '@/shared/types'

interface RequireRoleProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
}

export function RequireRole({
  children,
  allowedRoles,
  fallback,
}: RequireRoleProps) {
  const { user } = useAuth()

  const userRole = user?.profile?.role

  if (!userRole || !allowedRoles.includes(userRole)) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <>{children}</>
}

/**
 * useRBAC — Hook for Role-Based Access Control
 *
 * Provides area access checks, feature checks, and navigable areas
 * based on the current user's role and the MULTIAREA flag.
 */

import { useMemo } from 'react'
import { useAuth } from '@/features/auth/AuthProvider'
import {
  getAllowedAreas,
  canAccessArea,
  getNavigableAreas,
  hasFeature,
  MULTIAREA_ENABLED,
  AREA_LABELS,
  type AreaSlug,
  type Feature,
} from '@/shared/config/rbac'

export function useRBAC() {
  const { user } = useAuth()
  const role = user?.profile?.role
  const userAreaId = user?.profile?.area_id

  const allowedAreas = useMemo(
    () => getAllowedAreas(role, userAreaId),
    [role, userAreaId]
  )

  const navigableAreas = useMemo(() => getNavigableAreas(), [])

  const areaOptions = useMemo(
    () =>
      navigableAreas.map((slug) => ({
        slug,
        label: AREA_LABELS[slug],
        accessible: allowedAreas.includes(slug),
      })),
    [navigableAreas, allowedAreas]
  )

  return {
    role,
    multiAreaEnabled: MULTIAREA_ENABLED,
    allowedAreas,
    navigableAreas,
    areaOptions,
    canAccess: (areaSlug: AreaSlug) => canAccessArea(role, areaSlug, userAreaId),
    can: (feature: Feature) => hasFeature(role, feature),
  }
}

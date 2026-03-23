/**
 * RBAC — Role-Based Access Control + Area Access Matrix
 *
 * Defines which roles can access which areas and features.
 * Supports an RH-only mode via the MULTIAREA_ENABLED flag.
 */

import type { UserRole } from '@/shared/types'

// ============================================================
// MULTIAREA FLAG — set to false to restrict app to RH-only
// ============================================================
export const MULTIAREA_ENABLED = true

// ============================================================
// AREA SLUGS (canonical list)
// ============================================================
export type AreaSlug = 'rh' | 'marketing' | 'pd' | 'operacoes' | 'cs' | 'comercial' | 'financeiro'

export const ALL_AREA_SLUGS: AreaSlug[] = ['rh', 'marketing', 'pd', 'operacoes', 'cs', 'comercial', 'financeiro']

export const AREA_LABELS: Record<AreaSlug, string> = {
  rh: 'RH',
  marketing: 'Marketing',
  pd: 'P&D / Produto / Dados',
  operacoes: 'Operações',
  cs: 'CS / Relacionamento',
  comercial: 'Comercial',
  financeiro: 'Financeiro',
}

// ============================================================
// ROLE → AREA ACCESS MATRIX
// ============================================================

/**
 * Defines which areas each role can access.
 * 'admin' and 'direcao' can see all areas.
 * 'gestor' sees their own area (resolved at runtime via user profile).
 * 'colaborador' sees their own area.
 * 'cliente' sees nothing (external).
 */
export const ROLE_AREA_ACCESS: Record<UserRole, AreaSlug[] | '*'> = {
  admin: '*',
  direcao: '*',
  gestor: '*',       // gestor sees all areas (filtered by area_id at runtime if needed)
  colaborador: '*',  // colaborador can browse but limited actions
  cliente: [],       // no area access
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Returns the list of area slugs a given role+areaId can access.
 * Respects MULTIAREA_ENABLED flag.
 */
export function getAllowedAreas(role?: UserRole, _userAreaId?: string): AreaSlug[] {
  if (!MULTIAREA_ENABLED) {
    return ['rh']
  }

  if (!role) return []

  const access = ROLE_AREA_ACCESS[role]
  if (access === '*') return [...ALL_AREA_SLUGS]
  return access
}

/**
 * Check if a role can access a specific area.
 */
export function canAccessArea(role?: UserRole, areaSlug?: AreaSlug, userAreaId?: string): boolean {
  if (!role || !areaSlug) return false
  const allowed = getAllowedAreas(role, userAreaId)
  return allowed.includes(areaSlug)
}

/**
 * Returns area slugs available for navigation (respects MULTIAREA flag).
 */
export function getNavigableAreas(): AreaSlug[] {
  if (!MULTIAREA_ENABLED) return ['rh']
  return [...ALL_AREA_SLUGS]
}

/**
 * Feature-level permissions per role.
 */
export type Feature =
  | 'view_dashboard'
  | 'view_calendar'
  | 'manage_actions'
  | 'approve_evidence'
  | 'view_reports'
  | 'view_closings'
  | 'create_closing'
  | 'export_csv'
  | 'export_pdf'
  | 'manage_pack'
  | 'manage_roles'

export const ROLE_FEATURES: Record<UserRole, Feature[]> = {
  admin: [
    'view_dashboard', 'view_calendar', 'manage_actions', 'approve_evidence',
    'view_reports', 'view_closings', 'create_closing', 'export_csv', 'export_pdf',
    'manage_pack', 'manage_roles',
  ],
  direcao: [
    'view_dashboard', 'view_calendar', 'manage_actions', 'approve_evidence',
    'view_reports', 'view_closings', 'create_closing', 'export_csv', 'export_pdf',
    'manage_pack',
  ],
  gestor: [
    'view_dashboard', 'view_calendar', 'manage_actions', 'approve_evidence',
    'view_reports', 'view_closings', 'create_closing', 'export_csv', 'export_pdf',
    'manage_pack',
  ],
  colaborador: [
    'view_dashboard', 'view_calendar', 'view_reports', 'view_closings',
    'export_csv', 'export_pdf',
  ],
  cliente: [],
}

export function hasFeature(role?: UserRole, feature?: Feature): boolean {
  if (!role || !feature) return false
  return ROLE_FEATURES[role]?.includes(feature) ?? false
}

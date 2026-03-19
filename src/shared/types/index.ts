// User roles
export type UserRole = 'admin' | 'direcao' | 'gestor' | 'colaborador' | 'cliente'

// Helper: roles que podem aprovar evidências e ver backlog
export const APPROVAL_ROLES: UserRole[] = ['admin', 'direcao', 'gestor']

// Helper: verificar se role pode aprovar
export function canApproveEvidence(role?: UserRole): boolean {
  return !!role && APPROVAL_ROLES.includes(role)
}

// User profile
export interface UserProfile {
  id: string
  user_id: string
  role: UserRole
  active: boolean
  area_id?: string
  created_at: string
  updated_at: string
}

// Auth user with profile
export interface AuthUser {
  id: string
  email: string
  profile?: UserProfile
}

// Generic API response
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Pagination
export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Common entity fields
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

import { describe, it, expect } from 'vitest'
import { filterNavByRole, canAccessRoute, getAccessibleRoutes } from '../navAccess'
import type { NavSection } from '@/shared/config/navigation'

// Stub icon — navAccess never calls the icon function, so a placeholder is safe
const Icon = (() => null) as unknown as NavSection['icon']

const mockSections: NavSection[] = [
  {
    id: 'principal',
    title: 'Principal',
    icon: Icon,
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: Icon },
      { label: 'Calendário', href: '/calendar', icon: Icon },
    ],
  },
  {
    id: 'admin',
    title: 'Admin',
    icon: Icon,
    allowedRoles: ['admin'],
    items: [
      { label: 'Painel Admin', href: '/admin', icon: Icon },
      {
        label: 'Configurações',
        icon: Icon,
        subItems: [
          { label: 'Usuários', href: '/admin/users', icon: Icon },
          { label: 'Áreas', href: '/admin/areas', icon: Icon, allowedRoles: ['admin'] },
        ],
      },
    ],
  },
  {
    id: 'gestao',
    title: 'Gestão',
    icon: Icon,
    allowedRoles: ['admin', 'direcao', 'gestor'],
    items: [
      { label: 'Relatórios', href: '/reports', icon: Icon, allowedRoles: ['admin', 'direcao', 'gestor'] },
    ],
  },
]

describe('filterNavByRole', () => {
  it('admin sees all sections', () => {
    const result = filterNavByRole(mockSections, 'admin')
    expect(result).toHaveLength(3)
  })

  it('gestor sees Principal + Gestão, not Admin', () => {
    const result = filterNavByRole(mockSections, 'gestor')
    const titles = result.map(s => s.title)
    expect(titles).toContain('Principal')
    expect(titles).toContain('Gestão')
    expect(titles).not.toContain('Admin')
  })

  it('colaborador sees only Principal (no allowedRoles = open)', () => {
    const result = filterNavByRole(mockSections, 'colaborador')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Principal')
  })

  it('undefined role sees only sections without allowedRoles', () => {
    const result = filterNavByRole(mockSections, undefined)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Principal')
  })

  it('cliente sees only open sections', () => {
    const result = filterNavByRole(mockSections, 'cliente')
    expect(result).toHaveLength(1)
  })
})

describe('canAccessRoute', () => {
  it('admin can access /admin', () => {
    expect(canAccessRoute('/admin', 'admin', mockSections)).toBe(true)
  })

  it('gestor gets true for /admin (route not in their nav = public fallback)', () => {
    // canAccessRoute returns true for routes not found in filtered navigation
    // This is by design: actual enforcement is server-side (RLS)
    expect(canAccessRoute('/admin', 'gestor', mockSections)).toBe(true)
  })

  it('admin can access /admin/areas (sub-route)', () => {
    expect(canAccessRoute('/admin/areas', 'admin', mockSections)).toBe(true)
  })

  it('returns true for unknown routes (public routes)', () => {
    expect(canAccessRoute('/login', 'colaborador', mockSections)).toBe(true)
  })

  it('handles trailing slashes', () => {
    expect(canAccessRoute('/dashboard/', 'admin', mockSections)).toBe(true)
  })
})

describe('getAccessibleRoutes', () => {
  it('admin gets all routes', () => {
    const routes = getAccessibleRoutes(mockSections, 'admin')
    expect(routes).toContain('/dashboard')
    expect(routes).toContain('/admin')
    expect(routes).toContain('/admin/users')
    expect(routes).toContain('/admin/areas')
    expect(routes).toContain('/reports')
  })

  it('colaborador gets only open routes', () => {
    const routes = getAccessibleRoutes(mockSections, 'colaborador')
    expect(routes).toContain('/dashboard')
    expect(routes).toContain('/calendar')
    expect(routes).not.toContain('/admin')
    expect(routes).not.toContain('/reports')
  })

  it('undefined role gets only open routes', () => {
    const routes = getAccessibleRoutes(mockSections, undefined)
    expect(routes).toContain('/dashboard')
    expect(routes).not.toContain('/admin')
  })
})

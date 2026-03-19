import { describe, it, expect } from 'vitest'
import { navSections, getNavContext, getBreadcrumbs, getQuickAction } from '../navigation'
import { ROUTES } from '../routes'

describe('navSections', () => {
  it('has at least 5 sections', () => {
    expect(navSections.length).toBeGreaterThanOrEqual(5)
  })

  it('every section has id, title, icon, and items', () => {
    for (const section of navSections) {
      expect(section.id).toBeTruthy()
      expect(section.title).toBeTruthy()
      expect(section.icon).toBeDefined()
      expect(Array.isArray(section.items)).toBe(true)
    }
  })

  it('every item with href has a valid route string', () => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (item.href) {
          expect(item.href).toMatch(/^\//)
        }
        if (item.subItems) {
          for (const sub of item.subItems) {
            expect(sub.href).toMatch(/^\//)
          }
        }
      }
    }
  })

  it('overview section contains Dashboard', () => {
    const overview = navSections.find(s => s.id === 'overview')
    expect(overview).toBeDefined()
    const dash = overview!.items.find(i => i.label === 'Dashboard')
    expect(dash).toBeDefined()
    expect(dash!.href).toBe(ROUTES.DASHBOARD)
  })

  it('settings section restricts access by role', () => {
    const settings = navSections.find(s => s.id === 'settings')
    expect(settings).toBeDefined()
    expect(settings!.allowedRoles).toBeDefined()
    expect(settings!.allowedRoles).toContain('admin')
  })

  it('planning section has subItems for Plano de Ação', () => {
    const planning = navSections.find(s => s.id === 'planning')
    expect(planning).toBeDefined()
    const actionPlan = planning!.items.find(i => i.label === 'Plano de Ação')
    expect(actionPlan).toBeDefined()
    expect(actionPlan!.subItems).toBeDefined()
    expect(actionPlan!.subItems!.length).toBeGreaterThanOrEqual(3)
  })
})

describe('getNavContext', () => {
  it('returns sectionTitle for dashboard', () => {
    const ctx = getNavContext(ROUTES.DASHBOARD)
    expect(ctx.sectionTitle).toBe('Visão Geral')
    expect(ctx.item).not.toBeNull()
    expect(ctx.item!.label).toBe('Dashboard')
  })

  it('returns correct section for goals', () => {
    const ctx = getNavContext(ROUTES.GOALS)
    expect(ctx.sectionTitle).toBe('Gerencial')
    expect(ctx.item!.label).toBe('Metas')
  })

  it('returns fallback for unknown path', () => {
    const ctx = getNavContext('/unknown/page')
    expect(ctx.sectionTitle).toBe('Visão Geral')
    expect(ctx.item).toBeNull()
  })

  it('matches nested paths to parent route', () => {
    const ctx = getNavContext(ROUTES.STRATEGY + '/overview')
    expect(ctx.item).not.toBeNull()
  })

  it('strips trailing slash', () => {
    const ctx = getNavContext(ROUTES.DASHBOARD + '/')
    expect(ctx.item).not.toBeNull()
  })
})

describe('getBreadcrumbs', () => {
  it('returns section-only breadcrumb for unknown path', () => {
    const crumbs = getBreadcrumbs('/unknown')
    expect(crumbs.length).toBe(1)
    expect(crumbs[0].label).toBe('Visão Geral')
  })

  it('returns section + item for dashboard', () => {
    const crumbs = getBreadcrumbs(ROUTES.DASHBOARD)
    expect(crumbs.length).toBeGreaterThanOrEqual(2)
    expect(crumbs[0].label).toBe('Visão Geral')
    expect(crumbs[crumbs.length - 1].label).toBe('Dashboard')
  })

  it('includes parent label for subItems', () => {
    const crumbs = getBreadcrumbs(ROUTES.PLANNING_ACTIONS_MANAGE)
    const labels = crumbs.map(c => c.label)
    expect(labels).toContain('Plano de Ação')
  })
})

describe('getQuickAction', () => {
  it('returns Nova Meta action for goals path', () => {
    const action = getQuickAction(ROUTES.GOALS)
    expect(action).not.toBeNull()
    expect(action!.label).toBe('Nova Meta')
  })

  it('returns Novo Indicador for indicators path', () => {
    const action = getQuickAction(ROUTES.INDICATORS)
    expect(action).not.toBeNull()
    expect(action!.label).toBe('Novo Indicador')
  })

  it('returns null for path without quick action', () => {
    const action = getQuickAction(ROUTES.DASHBOARD)
    expect(action).toBeNull()
  })

  it('matches nested paths', () => {
    const action = getQuickAction(ROUTES.GOALS + '/detail/123')
    expect(action).not.toBeNull()
    expect(action!.label).toBe('Nova Meta')
  })
})

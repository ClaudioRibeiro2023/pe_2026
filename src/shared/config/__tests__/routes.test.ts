import { describe, it, expect } from 'vitest'
import { ROUTES, type RouteKey } from '../routes'

describe('ROUTES config', () => {
  it('exports a non-empty object', () => {
    expect(Object.keys(ROUTES).length).toBeGreaterThan(0)
  })

  it('all route values are strings starting with /', () => {
    for (const [, value] of Object.entries(ROUTES)) {
      expect(typeof value).toBe('string')
      expect(value).toMatch(/^\//)
    }
  })

  it('contains essential routes', () => {
    const essential: RouteKey[] = [
      'LOGIN', 'DASHBOARD', 'GOALS', 'INDICATORS',
      'ACTION_PLANS', 'ADMIN', 'REPORTS', 'STRATEGY',
    ]
    for (const key of essential) {
      expect(ROUTES[key]).toBeDefined()
    }
  })

  it('has no duplicate route values (except aliases)', () => {
    const seen = new Map<string, string[]>()
    for (const [key, val] of Object.entries(ROUTES)) {
      if (!seen.has(val)) seen.set(val, [])
      seen.get(val)!.push(key)
    }
    // Allow known aliases (STRATEGY and STRATEGY_OVERVIEW both map to /strategy)
    const duplicates = [...seen.entries()]
      .filter(([, keys]) => keys.length > 1)
      .filter(([, keys]) => {
        // Allow STRATEGY/STRATEGY_OVERVIEW alias
        const sorted = keys.sort().join(',')
        return sorted !== 'STRATEGY,STRATEGY_OVERVIEW'
      })
    expect(duplicates).toHaveLength(0)
  })

  it('LOGIN route is /login', () => {
    expect(ROUTES.LOGIN).toBe('/login')
  })

  it('DASHBOARD route is /dashboard', () => {
    expect(ROUTES.DASHBOARD).toBe('/dashboard')
  })

  it('route values do not have trailing slashes', () => {
    for (const value of Object.values(ROUTES)) {
      expect(value).not.toMatch(/\/$/)
    }
  })

  it('dynamic routes use :param syntax', () => {
    const dynamicRoutes = Object.values(ROUTES).filter(r => r.includes(':'))
    expect(dynamicRoutes.length).toBeGreaterThan(0)
    for (const route of dynamicRoutes) {
      expect(route).toMatch(/\/:[a-zA-Z]+/)
    }
  })
})

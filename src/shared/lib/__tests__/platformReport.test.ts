import { describe, it, expect } from 'vitest'
import { runPlatformReport, type PlatformCheck } from '../platformReport'

describe('runPlatformReport', () => {
  it('returns an array of checks', () => {
    const results = runPlatformReport('admin')
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBeGreaterThan(0)
  })

  it('each check has required properties', () => {
    const results = runPlatformReport('admin')
    for (const check of results) {
      expect(check).toHaveProperty('id')
      expect(check).toHaveProperty('category')
      expect(check).toHaveProperty('name')
      expect(check).toHaveProperty('status')
      expect(check).toHaveProperty('message')
      expect(['passed', 'failed', 'warning']).toContain(check.status)
    }
  })

  it('passes auth-role check when role is provided', () => {
    const results = runPlatformReport('admin')
    const authCheck = results.find((r: PlatformCheck) => r.id === 'auth-role')
    expect(authCheck).toBeDefined()
    expect(authCheck!.status).toBe('passed')
  })

  it('fails auth-role check when role is undefined', () => {
    const results = runPlatformReport(undefined)
    const authCheck = results.find((r: PlatformCheck) => r.id === 'auth-role')
    expect(authCheck).toBeDefined()
    expect(authCheck!.status).toBe('failed')
  })

  it('includes RBAC section check for admin', () => {
    const results = runPlatformReport('admin')
    const rbacCheck = results.find((r: PlatformCheck) => r.id === 'rbac-sections')
    expect(rbacCheck).toBeDefined()
    expect(rbacCheck!.status).toBe('passed')
  })

  it('includes navigation integrity checks', () => {
    const results = runPlatformReport('admin')
    const navOrphan = results.find((r: PlatformCheck) => r.id === 'nav-orphan-routes')
    const navInvalid = results.find((r: PlatformCheck) => r.id === 'nav-invalid-hrefs')
    expect(navOrphan).toBeDefined()
    expect(navInvalid).toBeDefined()
  })

  it('all roles produce checks without errors', () => {
    const roles = ['admin', 'direcao', 'gestor', 'colaborador', 'cliente'] as const
    for (const role of roles) {
      const results = runPlatformReport(role)
      expect(results.length).toBeGreaterThan(0)
    }
  })
})

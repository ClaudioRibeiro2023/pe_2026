import { describe, it, expect } from 'vitest'
import {
  getAllowedAreas,
  canAccessArea,
  getNavigableAreas,
  hasFeature,
  ALL_AREA_SLUGS,
  MULTIAREA_ENABLED,
} from '../rbac'

describe('getAllowedAreas', () => {
  it('admin gets all areas', () => {
    const areas = getAllowedAreas('admin')
    expect(areas).toEqual(ALL_AREA_SLUGS)
  })

  it('direcao gets all areas', () => {
    expect(getAllowedAreas('direcao')).toEqual(ALL_AREA_SLUGS)
  })

  it('gestor gets all areas (browsing allowed)', () => {
    expect(getAllowedAreas('gestor')).toEqual(ALL_AREA_SLUGS)
  })

  it('colaborador gets all areas (browsing allowed)', () => {
    expect(getAllowedAreas('colaborador')).toEqual(ALL_AREA_SLUGS)
  })

  it('cliente gets empty array', () => {
    expect(getAllowedAreas('cliente')).toEqual([])
  })

  it('undefined role gets empty array', () => {
    expect(getAllowedAreas(undefined)).toEqual([])
  })
})

describe('canAccessArea', () => {
  it('admin can access rh', () => {
    expect(canAccessArea('admin', 'rh')).toBe(true)
  })

  it('admin can access financeiro', () => {
    expect(canAccessArea('admin', 'financeiro')).toBe(true)
  })

  it('cliente cannot access any area', () => {
    expect(canAccessArea('cliente', 'rh')).toBe(false)
    expect(canAccessArea('cliente', 'marketing')).toBe(false)
  })

  it('returns false for undefined role', () => {
    expect(canAccessArea(undefined, 'rh')).toBe(false)
  })

  it('returns false for undefined area', () => {
    expect(canAccessArea('admin', undefined)).toBe(false)
  })
})

describe('getNavigableAreas', () => {
  it('returns all areas when MULTIAREA is enabled', () => {
    if (MULTIAREA_ENABLED) {
      expect(getNavigableAreas()).toEqual(ALL_AREA_SLUGS)
    }
  })

  it('returns exactly 5 areas', () => {
    const areas = getNavigableAreas()
    if (MULTIAREA_ENABLED) {
      expect(areas).toHaveLength(5)
    } else {
      expect(areas).toEqual(['rh'])
    }
  })
})

describe('hasFeature', () => {
  it('admin has manage_roles', () => {
    expect(hasFeature('admin', 'manage_roles')).toBe(true)
  })

  it('direcao does NOT have manage_roles', () => {
    expect(hasFeature('direcao', 'manage_roles')).toBe(false)
  })

  it('gestor has manage_actions', () => {
    expect(hasFeature('gestor', 'manage_actions')).toBe(true)
  })

  it('colaborador cannot manage_actions', () => {
    expect(hasFeature('colaborador', 'manage_actions')).toBe(false)
  })

  it('colaborador can export_csv', () => {
    expect(hasFeature('colaborador', 'export_csv')).toBe(true)
  })

  it('cliente has no features', () => {
    expect(hasFeature('cliente', 'view_dashboard')).toBe(false)
    expect(hasFeature('cliente', 'export_csv')).toBe(false)
  })

  it('undefined role has no features', () => {
    expect(hasFeature(undefined, 'view_dashboard')).toBe(false)
  })

  it('undefined feature returns false', () => {
    expect(hasFeature('admin', undefined)).toBe(false)
  })
})

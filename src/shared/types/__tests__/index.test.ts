import { describe, it, expect } from 'vitest'
import { canApproveEvidence, APPROVAL_ROLES } from '../index'

describe('canApproveEvidence', () => {
  it('admin can approve', () => {
    expect(canApproveEvidence('admin')).toBe(true)
  })

  it('direcao can approve', () => {
    expect(canApproveEvidence('direcao')).toBe(true)
  })

  it('gestor can approve', () => {
    expect(canApproveEvidence('gestor')).toBe(true)
  })

  it('colaborador cannot approve', () => {
    expect(canApproveEvidence('colaborador')).toBe(false)
  })

  it('cliente cannot approve', () => {
    expect(canApproveEvidence('cliente')).toBe(false)
  })

  it('undefined role cannot approve', () => {
    expect(canApproveEvidence(undefined)).toBe(false)
  })
})

describe('APPROVAL_ROLES', () => {
  it('contains exactly admin, direcao, gestor', () => {
    expect(APPROVAL_ROLES).toEqual(['admin', 'direcao', 'gestor'])
  })
})

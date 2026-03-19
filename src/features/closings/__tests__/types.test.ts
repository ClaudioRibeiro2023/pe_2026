import { describe, it, expect } from 'vitest'
import {
  CLOSING_STATUS_LABELS,
  CLOSING_STATUS_COLORS,
  type ClosingStatus,
} from '../types'

describe('CLOSING_STATUS maps', () => {
  const statuses: ClosingStatus[] = ['draft', 'final', 'archived']

  it('LABELS has entry for every status', () => {
    for (const s of statuses) {
      expect(CLOSING_STATUS_LABELS[s]).toBeTruthy()
    }
  })

  it('COLORS has entry for every status', () => {
    for (const s of statuses) {
      expect(CLOSING_STATUS_COLORS[s]).toBeTruthy()
    }
  })

  it('LABELS and COLORS have same keys', () => {
    expect(Object.keys(CLOSING_STATUS_LABELS).sort()).toEqual(
      Object.keys(CLOSING_STATUS_COLORS).sort()
    )
  })

  it('LABELS values are Portuguese strings', () => {
    expect(CLOSING_STATUS_LABELS.draft).toBe('Rascunho')
    expect(CLOSING_STATUS_LABELS.final).toBe('Final')
    expect(CLOSING_STATUS_LABELS.archived).toBe('Arquivado')
  })

  it('COLORS values contain CSS class strings', () => {
    for (const s of statuses) {
      expect(CLOSING_STATUS_COLORS[s]).toMatch(/bg-/)
      expect(CLOSING_STATUS_COLORS[s]).toMatch(/text-/)
    }
  })
})

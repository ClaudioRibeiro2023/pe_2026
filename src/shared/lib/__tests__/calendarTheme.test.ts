import { describe, it, expect } from 'vitest'
import {
  EVENT_STATUS_TOKENS,
  EVENT_STATUS_DOT,
  CAL,
  mapActionStatus,
  type CalendarEventStatus,
} from '../calendarTheme'

describe('EVENT_STATUS_TOKENS', () => {
  const statuses: CalendarEventStatus[] = [
    'default', 'overdue', 'in_progress', 'completed', 'blocked', 'awaiting',
  ]

  it('has an entry for every status', () => {
    for (const status of statuses) {
      expect(EVENT_STATUS_TOKENS[status]).toBeDefined()
      expect(typeof EVENT_STATUS_TOKENS[status]).toBe('string')
    }
  })

  it('tokens include both light and dark classes', () => {
    for (const status of statuses) {
      expect(EVENT_STATUS_TOKENS[status]).toContain('bg-')
      expect(EVENT_STATUS_TOKENS[status]).toContain('text-')
      expect(EVENT_STATUS_TOKENS[status]).toContain('dark:')
    }
  })
})

describe('EVENT_STATUS_DOT', () => {
  it('has a dot class for every status', () => {
    const statuses: CalendarEventStatus[] = [
      'default', 'overdue', 'in_progress', 'completed', 'blocked', 'awaiting',
    ]
    for (const status of statuses) {
      expect(EVENT_STATUS_DOT[status]).toMatch(/^bg-/)
    }
  })
})

describe('CAL constants', () => {
  it('grid contains grid-cols-7', () => {
    expect(CAL.grid).toContain('grid-cols-7')
  })

  it('dayBase contains min-h', () => {
    expect(CAL.dayBase).toContain('min-h-')
  })

  it('dayToday contains ring', () => {
    expect(CAL.dayToday).toContain('ring')
  })

  it('skeleton contains animate-pulse', () => {
    expect(CAL.skeleton).toContain('animate-pulse')
  })
})

describe('mapActionStatus', () => {
  it('maps CONCLUIDA to completed', () => {
    expect(mapActionStatus('CONCLUIDA')).toBe('completed')
  })

  it('maps EM_ANDAMENTO to in_progress', () => {
    expect(mapActionStatus('EM_ANDAMENTO')).toBe('in_progress')
  })

  it('maps BLOQUEADA to blocked', () => {
    expect(mapActionStatus('BLOQUEADA')).toBe('blocked')
  })

  it('maps AGUARDANDO_EVIDENCIA to awaiting', () => {
    expect(mapActionStatus('AGUARDANDO_EVIDENCIA')).toBe('awaiting')
  })

  it('maps EM_VALIDACAO to awaiting', () => {
    expect(mapActionStatus('EM_VALIDACAO')).toBe('awaiting')
  })

  it('maps CANCELADA to default', () => {
    expect(mapActionStatus('CANCELADA')).toBe('default')
  })

  it('maps unknown status to default', () => {
    expect(mapActionStatus('SOME_UNKNOWN')).toBe('default')
    expect(mapActionStatus('')).toBe('default')
  })
})

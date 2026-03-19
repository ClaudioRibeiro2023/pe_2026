import { describe, it, expect } from 'vitest'
import {
  ACTION_STATUS_LABELS,
  ACTION_STATUS_COLORS,
  PLAN_STATUS_LABELS,
  PLAN_STATUS_COLORS,
  EVIDENCE_STATUS_LABELS,
  EVIDENCE_STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  RISK_LEVEL_LABELS,
  RISK_LEVEL_COLORS,
  type ActionStatus,
  type AreaPlanStatus,
  type EvidenceStatus,
  type ActionPriority,
  type RiskLevel,
} from '../types'

describe('ACTION_STATUS maps', () => {
  const statuses: ActionStatus[] = [
    'PENDENTE', 'EM_ANDAMENTO', 'BLOQUEADA',
    'AGUARDANDO_EVIDENCIA', 'EM_VALIDACAO', 'CONCLUIDA', 'CANCELADA',
  ]

  it('LABELS has entry for every status', () => {
    for (const s of statuses) {
      expect(ACTION_STATUS_LABELS[s]).toBeTruthy()
    }
  })

  it('COLORS has entry for every status', () => {
    for (const s of statuses) {
      expect(ACTION_STATUS_COLORS[s]).toBeTruthy()
    }
  })

  it('LABELS and COLORS have same keys', () => {
    expect(Object.keys(ACTION_STATUS_LABELS).sort()).toEqual(Object.keys(ACTION_STATUS_COLORS).sort())
  })
})

describe('PLAN_STATUS maps', () => {
  const statuses: AreaPlanStatus[] = ['RASCUNHO', 'EM_APROVACAO', 'ATIVO', 'CONCLUIDO', 'ARQUIVADO']

  it('LABELS has entry for every status', () => {
    for (const s of statuses) {
      expect(PLAN_STATUS_LABELS[s]).toBeTruthy()
    }
  })

  it('COLORS has entry for every status', () => {
    for (const s of statuses) {
      expect(PLAN_STATUS_COLORS[s]).toBeTruthy()
    }
  })
})

describe('EVIDENCE_STATUS maps', () => {
  const statuses: EvidenceStatus[] = ['PENDENTE', 'APROVADA_GESTOR', 'APROVADA', 'REJEITADA']

  it('LABELS has entry for every status', () => {
    for (const s of statuses) {
      expect(EVIDENCE_STATUS_LABELS[s]).toBeTruthy()
    }
  })

  it('COLORS has entry for every status', () => {
    for (const s of statuses) {
      expect(EVIDENCE_STATUS_COLORS[s]).toBeTruthy()
    }
  })
})

describe('PRIORITY maps', () => {
  const priorities: ActionPriority[] = ['P0', 'P1', 'P2']

  it('LABELS has entry for every priority', () => {
    for (const p of priorities) {
      expect(PRIORITY_LABELS[p]).toBeTruthy()
    }
  })

  it('COLORS has entry for every priority', () => {
    for (const p of priorities) {
      expect(PRIORITY_COLORS[p]).toBeTruthy()
    }
  })
})

describe('RISK_LEVEL maps', () => {
  const levels: RiskLevel[] = ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO']

  it('LABELS has entry for every level', () => {
    for (const l of levels) {
      expect(RISK_LEVEL_LABELS[l]).toBeTruthy()
    }
  })

  it('COLORS has entry for every level', () => {
    for (const l of levels) {
      expect(RISK_LEVEL_COLORS[l]).toBeTruthy()
    }
  })

  it('LABELS and COLORS have same keys', () => {
    expect(Object.keys(RISK_LEVEL_LABELS).sort()).toEqual(Object.keys(RISK_LEVEL_COLORS).sort())
  })
})

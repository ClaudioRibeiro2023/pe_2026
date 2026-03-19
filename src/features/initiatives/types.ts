export interface InitiativesContext {
  metadata: InitiativesMetadata
  capacity: CapacitySummary
  prioritizationCriteria: PrioritizationCriterion[]
  evidenceRequirement: EvidenceRequirement
  initiatives: Initiative[]
}

export interface InitiativesMetadata {
  version: string
  lastUpdate: string
  source: string
}

export interface CapacitySummary {
  wipInstitutionalLimit: number
  wipAreaLimit: number
  inProgressCount: number
  blockedCount: number
  p0Count: number
}

export interface PrioritizationCriterion {
  id: string
  title: string
  description: string
  weight: string
}

export interface EvidenceRequirement {
  mandatory: boolean
  requiredArtifacts: string[]
  validation: string
}

export interface Initiative {
  id: string
  title: string
  type: 'ENT' | 'MET' | 'SIS' | 'ORG' | 'COM'
  priority: 'P0' | 'P1' | 'P2'
  pillar: string
  okr: string
  kr: string
  owner: string
  sponsor: string
  status: 'PLANEJADA' | 'EM_ANDAMENTO' | 'BLOQUEADA' | 'CONCLUIDA' | 'CANCELADA'
  startDate: string
  endDate: string
  effort: 'BAIXO' | 'MEDIO' | 'ALTO'
  dependencies: string[]
  evidences: string[]
}

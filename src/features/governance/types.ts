export interface GovernanceContext {
  metadata: GovernanceMetadata
  canonicalArtifacts: GovernanceArtifact[]
  rbacRoles: GovernanceRole[]
  decisions: GovernanceDecision[]
  risks: GovernanceRisk[]
  evidences: GovernanceEvidence[]
  traceability: GovernanceTraceability[]
  versionLogs: GovernanceVersionLog[]
  evidenceValidation: EvidenceValidationSummary
  cadenceRituals: GovernanceCadenceRitual[]
  auditReports: GovernanceAuditReport[]
}

export interface GovernanceMetadata {
  version: string
  lastUpdate: string
  source: string
}

export interface GovernanceArtifact {
  id: string
  docRef: string
  title: string
  description: string
  owner: string
  module: string
  status: 'ATIVO' | 'EM_VALIDACAO' | 'EM_CONSTRUCAO' | string
  lastUpdate: string
  link?: string
}

export interface GovernanceRole {
  id: string
  title: string
  level: string
  scope: string
  responsibilities: string[]
}

export interface GovernanceDecision {
  id: string
  title: string
  description: string
  date: string
  owner: string
  impact: 'ALTO' | 'MEDIO' | 'BAIXO' | string
  status: 'ATIVA' | 'EM_REVISAO' | 'CONCLUIDA' | string
  pillars: string[]
  tags?: string[]
}

export interface GovernanceRisk {
  id: string
  title: string
  category: string
  description: string
  impact: 'ALTO' | 'MEDIO' | 'BAIXO' | string
  probability: 'ALTA' | 'MEDIA' | 'BAIXA' | string
  exposure: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAIXO' | string
  triggers: string[]
  mitigation: string
  contingency: string
  owner: string
  cadence: string
  status: 'ATIVO' | 'MITIGADO' | 'ENCERRADO' | string
  kpis: string[]
}

export interface GovernanceEvidence {
  id: string
  title: string
  type: string
  description: string
  date: string
  owner: string
  related: string[]
  link?: string
  validated: boolean
  validatedBy?: string
  validatedAt?: string
}

export interface GovernanceTraceability {
  id: string
  pillar: string
  subpillar: string
  objective: string
  kr: string
  initiative: string
  evidences: string[]
  kpis: string[]
  status: string
}

export interface GovernanceVersionLog {
  id: string
  entityType: 'KPI' | 'OKR' | 'INIT' | string
  entityId: string
  version: string
  date: string
  owner: string
  summary: string
  evidence?: string
}

export interface EvidenceValidationSummary {
  policy: string
  lastAudit: string
  validator: string
  pending: string[]
  validated: string[]
}

export interface GovernanceCadenceRitual {
  id: string
  title: string
  cadence: string
  focus: string
  participants: string
  outputs: string[]
}

export interface GovernanceAuditReport {
  id: string
  title: string
  cadence: string
  owner: string
  scope: string
  lastUpdate: string
  status: string
}

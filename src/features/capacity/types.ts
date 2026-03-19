export interface CapacityContext {
  metadata: CapacityMetadata
  allocation: AllocationSummary
  quarterlyMix: QuarterlyMix[]
  wipLimits: WipLimits
  tacticalReinforcement: TacticalReinforcement[]
  budgetGuidelines: BudgetGuideline[]
}

export interface CapacityMetadata {
  version: string
  lastUpdate: string
  source: string
}

export interface AllocationSummary {
  focus: string
  q1Priority: string
  constraints: string[]
}

export interface QuarterlyMix {
  quarter: string
  distribution: CapacityDistribution
}

export interface CapacityDistribution {
  operacao: string
  ativacao: string
  produtoDados: string
  comercialMarketing: string
  governanca: string
}

export interface WipLimits {
  institutional: string
  perArea: string
  rule: string
}

export interface TacticalReinforcement {
  id: string
  area: string
  action: string
  rationale: string
}

export interface BudgetGuideline {
  id: string
  category: string
  rule: string
}

export interface FinanceContext {
  metadata: FinanceMetadata
  budget: BudgetStatus
  unitCosts: UnitCost[]
  cash: CashProjection
  receivables: ReceivablesAging
}

export interface FinanceMetadata {
  version: string
  lastUpdate: string
  source: string
}

export interface BudgetStatus {
  status: 'OK' | 'ATENCAO' | 'CRITICO' | string
  variancePercent: number
  lastReview: string
  nextReview: string
  notes: string[]
}

export interface UnitCost {
  id: string
  unit: string
  period: string
  costPerHa: number
  margin: number
  status: 'OK' | 'ATENCAO' | 'CRITICO' | string
}

export interface CashProjection {
  projected30: number
  projected60: number
  projected90: number
  runwayDays: number
  alert: string
}

export interface ReceivablesAging {
  aging30: number
  aging60: number
  aging90: number
  overdue: number
}

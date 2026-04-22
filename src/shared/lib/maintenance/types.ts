/**
 * Sistema de Manutenção Autônoma - PE2026
 * 
 * Responsabilidades:
 * - Detectar anomalias na repo (lixo, duplicatas, artefatos)
 * - Classificar por nível de risco (auto, aprovação, bloqueado)
 * - Orquestrar execução via adaptadores apropriados
 * - Auditar todas as ações
 */

export type MaintenanceRiskLevel = 'safe' | 'approval' | 'blocked'

export type MaintenanceActionType = 
  | 'cleanup_dist'
  | 'cleanup_storage_orphaned'
  | 'cleanup_metrics'
  | 'consolidate_docs'
  | 'remove_console_logs'
  | 'audit_mock_usage'
  | 'check_duplicate_logic'
  | 'verify_broken_imports'
  | 'cleanup_temp_files'

export interface MaintenanceFinding {
  id: string
  type: MaintenanceActionType
  riskLevel: MaintenanceRiskLevel
  title: string
  description: string
  location?: string
  estimatedImpact: 'low' | 'medium' | 'high'
  autoFixable: boolean
  createdAt: Date
}

export interface MaintenanceAction {
  id: string
  findingId: string
  type: MaintenanceActionType
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rejected'
  executedBy: 'system' | 'user'
  executedAt?: Date
  dryRun: boolean
  result?: {
    success: boolean
    message: string
    details?: Record<string, unknown>
  }
}

export interface MaintenanceReport {
  id: string
  runAt: Date
  durationMs: number
  findings: MaintenanceFinding[]
  actions: MaintenanceAction[]
  summary: {
    totalFindings: number
    safeCount: number
    approvalCount: number
    blockedCount: number
    autoExecuted: number
    pendingApproval: number
  }
}

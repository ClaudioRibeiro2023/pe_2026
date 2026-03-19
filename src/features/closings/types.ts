/**
 * Closings Module — Type Definitions
 * Fechamentos periódicos com snapshots, audit trail e comparativos
 */

export type ClosingStatus = 'draft' | 'final' | 'archived'

export interface ClosingKpis {
  total_actions: number
  done: number
  in_progress: number
  overdue: number
  not_started: number
  cancelled: number
  avg_progress: number
}

export interface StatusDistribution {
  status: string
  count: number
  percentage: number
}

export interface ProgramDistribution {
  program: string
  label: string
  count: number
  percentage: number
}

export interface ClosingActionItem {
  action_id: string
  title: string
  status: string
  progress: number
  due_date: string
  responsible: string
  area_id: string
  area_name: string
  program: string
}

export interface ClosingSnapshot {
  id: string
  period: string
  area_id: string | null
  area_name: string | null
  pack_id: string | null
  pack_name: string | null
  status: ClosingStatus
  kpis: ClosingKpis
  status_distribution: StatusDistribution[]
  program_distribution: ProgramDistribution[]
  actions: ClosingActionItem[]
  created_at: string
  created_by: string
  notes: string
}

export interface AuditEvent {
  id: string
  closing_id: string | null
  action: 'snapshot_created' | 'snapshot_deleted' | 'snapshot_finalized' | 'export_requested' | 'comparison_viewed'
  target: string
  details: string
  user: string
  timestamp: string
}

export interface ClosingDelta {
  closing_a: { id: string; period: string }
  closing_b: { id: string; period: string }
  kpi_deltas: {
    total_actions: number
    done: number
    in_progress: number
    overdue: number
    not_started: number
    cancelled: number
    avg_progress: number
  }
  status_changes: Array<{
    status: string
    count_a: number
    count_b: number
    delta: number
  }>
  new_actions: string[]
  removed_actions: string[]
}

export interface ClosingFilters {
  area_id?: string | null
  period?: string | null
  status?: ClosingStatus | null
  search?: string | null
}

export interface CreateClosingInput {
  period: string
  area_id: string | null
  pack_id: string | null
  notes: string
}

export const CLOSING_STATUS_LABELS: Record<ClosingStatus, string> = {
  draft: 'Rascunho',
  final: 'Final',
  archived: 'Arquivado',
}

export const CLOSING_STATUS_COLORS: Record<ClosingStatus, string> = {
  draft: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  final: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
  archived: 'bg-accent text-muted',
}

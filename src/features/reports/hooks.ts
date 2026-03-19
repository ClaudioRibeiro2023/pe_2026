import { useMemo } from 'react'
import { useAreas, useActionsByPackId, useAreaPlanProgress } from '@/features/area-plans/hooks'
import type { PlanAction, ActionStatus } from '@/features/area-plans/types'

export interface DateRange {
  start: string // yyyy-MM-dd
  end: string   // yyyy-MM-dd
}

export interface ReportKPIs {
  totalActions: number
  completed: number
  inProgress: number
  pending: number
  blocked: number
  awaitingEvidence: number
  inValidation: number
  cancelled: number
  overdue: number
  completionRate: number
  avgProgress: number
}

export interface ProgramBreakdown {
  programKey: string
  total: number
  completed: number
  completionRate: number
}

export interface StatusDistribution {
  status: ActionStatus
  count: number
  percentage: number
}

/** Filter actions by date range. Actions with no start_date AND no due_date are excluded. */
function filterByDateRange(actions: PlanAction[], range?: DateRange): PlanAction[] {
  if (!range) return actions
  return actions.filter(a => {
    const start = a.start_date || a.due_date
    const end = a.due_date || a.start_date
    if (!start && !end) return false
    if (start && start > range.end) return false
    if (end && end < range.start) return false
    return true
  })
}

function computeKPIs(actions: PlanAction[]): ReportKPIs {
  const today = new Date().toISOString().split('T')[0]
  const total = actions.length
  const completed = actions.filter(a => a.status === 'CONCLUIDA').length
  const inProgress = actions.filter(a => a.status === 'EM_ANDAMENTO').length
  const pending = actions.filter(a => a.status === 'PENDENTE').length
  const blocked = actions.filter(a => a.status === 'BLOQUEADA').length
  const awaitingEvidence = actions.filter(a => a.status === 'AGUARDANDO_EVIDENCIA').length
  const inValidation = actions.filter(a => a.status === 'EM_VALIDACAO').length
  const cancelled = actions.filter(a => a.status === 'CANCELADA').length
  const overdue = actions.filter(a => a.due_date && a.due_date < today && a.status !== 'CONCLUIDA' && a.status !== 'CANCELADA').length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
  const avgProgress = total > 0 ? Math.round(actions.reduce((s, a) => s + a.progress, 0) / total) : 0

  return { totalActions: total, completed, inProgress, pending, blocked, awaitingEvidence, inValidation, cancelled, overdue, completionRate, avgProgress }
}

function computeStatusDistribution(actions: PlanAction[]): StatusDistribution[] {
  const total = actions.length
  const statuses: ActionStatus[] = ['PENDENTE', 'EM_ANDAMENTO', 'BLOQUEADA', 'AGUARDANDO_EVIDENCIA', 'EM_VALIDACAO', 'CONCLUIDA', 'CANCELADA']
  return statuses.map(status => {
    const count = actions.filter(a => a.status === status).length
    return { status, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 }
  }).filter(s => s.count > 0)
}

function computeProgramBreakdown(actions: PlanAction[]): ProgramBreakdown[] {
  const map = new Map<string, { total: number; completed: number }>()
  for (const a of actions) {
    const key = a.program_key || 'SEM_PROGRAMA'
    const entry = map.get(key) || { total: 0, completed: 0 }
    entry.total++
    if (a.status === 'CONCLUIDA') entry.completed++
    map.set(key, entry)
  }
  return Array.from(map.entries())
    .map(([programKey, v]) => ({
      programKey,
      total: v.total,
      completed: v.completed,
      completionRate: v.total > 0 ? Math.round((v.completed / v.total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total)
}

export function useReportData(packId: string | undefined, dateRange?: DateRange) {
  const { data: areas = [], isLoading: areasLoading } = useAreas()
  const { data: rawActions = [], isLoading: actionsLoading } = useActionsByPackId(packId)
  const { data: planProgress = [], isLoading: progressLoading } = useAreaPlanProgress(new Date().getFullYear())

  const actions = useMemo(() => filterByDateRange(rawActions, dateRange), [rawActions, dateRange])
  const kpis = useMemo(() => computeKPIs(actions), [actions])
  const statusDistribution = useMemo(() => computeStatusDistribution(actions), [actions])
  const programBreakdown = useMemo(() => computeProgramBreakdown(actions), [actions])

  return {
    areas,
    actions,
    allActions: rawActions,
    planProgress,
    kpis,
    statusDistribution,
    programBreakdown,
    isLoading: areasLoading || actionsLoading || progressLoading,
  }
}

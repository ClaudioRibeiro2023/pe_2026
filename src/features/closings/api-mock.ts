/**
 * Closings Module — Mock API & Store
 * Persistência em memória com opcional localStorage
 */

import { mockStore as areaMockStore } from '@/features/area-plans/utils/mockData'
import type {
  ClosingSnapshot,
  ClosingActionItem,
  ClosingKpis,
  StatusDistribution,
  ProgramDistribution,
  AuditEvent,
  ClosingDelta,
  ClosingFilters,
  CreateClosingInput,
  ClosingStatus,
} from './types'

// ============================================================
// STORE
// ============================================================

let idCounter = 100

function generateId(prefix = 'closing'): string {
  return `${prefix}-${Date.now()}-${++idCounter}`
}

function now(): string {
  return new Date().toISOString()
}

export const closingsStore = {
  closings: [] as ClosingSnapshot[],
  auditEvents: [] as AuditEvent[],
}

// ============================================================
// PERSISTENCE (optional localStorage)
// ============================================================

const LS_KEY = 'pe2026_closings_v1'
const LS_AUDIT_KEY = 'pe2026_closings_audit_v1'

function saveToLocalStorage(): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(closingsStore.closings))
    localStorage.setItem(LS_AUDIT_KEY, JSON.stringify(closingsStore.auditEvents))
  } catch {
    // silently fail
  }
}

function loadFromLocalStorage(): boolean {
  try {
    const data = localStorage.getItem(LS_KEY)
    const auditData = localStorage.getItem(LS_AUDIT_KEY)
    if (data) {
      closingsStore.closings = JSON.parse(data)
      if (auditData) {
        closingsStore.auditEvents = JSON.parse(auditData)
      }
      return true
    }
  } catch {
    // silently fail
  }
  return false
}

// ============================================================
// SNAPSHOT CAPTURE HELPERS
// ============================================================

const PROGRAM_LABELS: Record<string, string> = {
  CON: 'Consolidação',
  DES: 'Desenvolvimento',
  REC: 'Recuperação',
  INO: 'Inovação',
}

function getAreaIdForPlan(planId: string): string | null {
  const plan = areaMockStore.plans.find((p) => p.id === planId)
  return plan?.area_id ?? null
}

function captureActions(areaId: string | null): ClosingActionItem[] {
  let actions = [...areaMockStore.actions]

  if (areaId) {
    // Filter actions whose plan belongs to the target area
    const planIdsForArea = new Set(
      areaMockStore.plans.filter((p) => p.area_id === areaId).map((p) => p.id)
    )
    actions = actions.filter((a) => planIdsForArea.has(a.plan_id))
  }

  return actions.map((a) => {
    const derivedAreaId = getAreaIdForPlan(a.plan_id)
    const area = derivedAreaId ? areaMockStore.areas.find((ar) => ar.id === derivedAreaId) : null
    return {
      action_id: a.id,
      title: a.title,
      status: a.status,
      progress: a.progress ?? 0,
      due_date: a.due_date ?? '',
      responsible: a.responsible ?? 'N/A',
      area_id: derivedAreaId ?? '',
      area_name: area?.name ?? 'N/A',
      program: a.program_key ?? 'CON',
    }
  })
}

function computeKpis(actions: ClosingActionItem[]): ClosingKpis {
  const total = actions.length
  const done = actions.filter((a) => a.status === 'done' || a.status === 'concluida').length
  const inProgress = actions.filter((a) => a.status === 'in_progress' || a.status === 'em_andamento').length
  const overdue = actions.filter((a) => {
    if (!a.due_date) return false
    return new Date(a.due_date) < new Date() && a.status !== 'done' && a.status !== 'concluida'
  }).length
  const notStarted = actions.filter((a) => a.status === 'not_started' || a.status === 'nao_iniciada').length
  const cancelled = actions.filter((a) => a.status === 'cancelled' || a.status === 'cancelada').length
  const avgProgress = total > 0 ? Math.round(actions.reduce((sum, a) => sum + a.progress, 0) / total) : 0

  return { total_actions: total, done, in_progress: inProgress, overdue, not_started: notStarted, cancelled, avg_progress: avgProgress }
}

function computeStatusDist(actions: ClosingActionItem[]): StatusDistribution[] {
  const total = actions.length
  const map = new Map<string, number>()
  for (const a of actions) {
    map.set(a.status, (map.get(a.status) ?? 0) + 1)
  }
  return Array.from(map.entries()).map(([status, count]) => ({
    status,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }))
}

function computeProgramDist(actions: ClosingActionItem[]): ProgramDistribution[] {
  const total = actions.length
  const map = new Map<string, number>()
  for (const a of actions) {
    const prog = a.program || 'CON'
    map.set(prog, (map.get(prog) ?? 0) + 1)
  }
  return Array.from(map.entries()).map(([program, count]) => ({
    program,
    label: PROGRAM_LABELS[program] ?? program,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }))
}

// ============================================================
// AUDIT
// ============================================================

function appendAudit(
  closingId: string | null,
  action: AuditEvent['action'],
  target: string,
  details: string,
  user = 'sistema'
): void {
  closingsStore.auditEvents.push({
    id: generateId('audit'),
    closing_id: closingId,
    action,
    target,
    details,
    user,
    timestamp: now(),
  })
}

// ============================================================
// API FUNCTIONS
// ============================================================

export async function createClosingSnapshot(input: CreateClosingInput, user = 'admin@empresa.com'): Promise<ClosingSnapshot> {
  const areaName = input.area_id
    ? areaMockStore.areas.find((a) => a.id === input.area_id)?.name ?? null
    : null

  const actions = captureActions(input.area_id)
  const kpis = computeKpis(actions)
  const statusDist = computeStatusDist(actions)
  const programDist = computeProgramDist(actions)

  const snapshot: ClosingSnapshot = {
    id: generateId('closing'),
    period: input.period,
    area_id: input.area_id,
    area_name: areaName,
    pack_id: input.pack_id,
    pack_name: input.pack_id ? `Pack ${input.pack_id}` : null,
    status: 'draft' as ClosingStatus,
    kpis,
    status_distribution: statusDist,
    program_distribution: programDist,
    actions,
    created_at: now(),
    created_by: user,
    notes: input.notes,
  }

  closingsStore.closings.push(snapshot)
  appendAudit(snapshot.id, 'snapshot_created', `Closing ${input.period}`, `Area: ${areaName ?? 'Todas'}, Actions: ${actions.length}`, user)
  saveToLocalStorage()

  return snapshot
}

export async function listClosings(filters?: ClosingFilters): Promise<ClosingSnapshot[]> {
  let result = [...closingsStore.closings]

  if (filters?.area_id) {
    result = result.filter((c) => c.area_id === filters.area_id)
  }
  if (filters?.period) {
    result = result.filter((c) => c.period === filters.period)
  }
  if (filters?.status) {
    result = result.filter((c) => c.status === filters.status)
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase()
    result = result.filter(
      (c) =>
        c.period.includes(s) ||
        (c.area_name?.toLowerCase().includes(s) ?? false) ||
        c.notes.toLowerCase().includes(s)
    )
  }

  return result.sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getClosingById(id: string): Promise<ClosingSnapshot | null> {
  return closingsStore.closings.find((c) => c.id === id) ?? null
}

export async function deleteClosing(id: string, user = 'admin@empresa.com'): Promise<boolean> {
  const idx = closingsStore.closings.findIndex((c) => c.id === id)
  if (idx === -1) return false
  const closing = closingsStore.closings[idx]
  closingsStore.closings.splice(idx, 1)
  appendAudit(id, 'snapshot_deleted', `Closing ${closing.period}`, `Deleted`, user)
  saveToLocalStorage()
  return true
}

export async function finalizeClosing(id: string, user = 'admin@empresa.com'): Promise<ClosingSnapshot | null> {
  const closing = closingsStore.closings.find((c) => c.id === id)
  if (!closing) return null
  closing.status = 'final'
  appendAudit(id, 'snapshot_finalized', `Closing ${closing.period}`, `Finalized`, user)
  saveToLocalStorage()
  return closing
}

export async function diffClosings(idA: string, idB: string): Promise<ClosingDelta | null> {
  const a = closingsStore.closings.find((c) => c.id === idA)
  const b = closingsStore.closings.find((c) => c.id === idB)
  if (!a || !b) return null

  const kpiDeltas = {
    total_actions: b.kpis.total_actions - a.kpis.total_actions,
    done: b.kpis.done - a.kpis.done,
    in_progress: b.kpis.in_progress - a.kpis.in_progress,
    overdue: b.kpis.overdue - a.kpis.overdue,
    not_started: b.kpis.not_started - a.kpis.not_started,
    cancelled: b.kpis.cancelled - a.kpis.cancelled,
    avg_progress: b.kpis.avg_progress - a.kpis.avg_progress,
  }

  // Merge status distributions
  const allStatuses = new Set([
    ...a.status_distribution.map((s) => s.status),
    ...b.status_distribution.map((s) => s.status),
  ])
  const statusChanges = Array.from(allStatuses).map((status) => {
    const countA = a.status_distribution.find((s) => s.status === status)?.count ?? 0
    const countB = b.status_distribution.find((s) => s.status === status)?.count ?? 0
    return { status, count_a: countA, count_b: countB, delta: countB - countA }
  })

  const actionIdsA = new Set(a.actions.map((ac) => ac.action_id))
  const actionIdsB = new Set(b.actions.map((ac) => ac.action_id))
  const newActions = [...actionIdsB].filter((id) => !actionIdsA.has(id))
  const removedActions = [...actionIdsA].filter((id) => !actionIdsB.has(id))

  appendAudit(null, 'comparison_viewed', `${a.period} vs ${b.period}`, `Compared closings`)

  return {
    closing_a: { id: a.id, period: a.period },
    closing_b: { id: b.id, period: b.period },
    kpi_deltas: kpiDeltas,
    status_changes: statusChanges,
    new_actions: newActions,
    removed_actions: removedActions,
  }
}

export async function getAuditEvents(closingId?: string | null): Promise<AuditEvent[]> {
  let events = [...closingsStore.auditEvents]
  if (closingId) {
    events = events.filter((e) => e.closing_id === closingId)
  }
  return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export function logExportEvent(closingId: string, format: string, user = 'admin@empresa.com'): void {
  appendAudit(closingId, 'export_requested', `Export ${format}`, `Format: ${format}`, user)
  saveToLocalStorage()
}

// ============================================================
// SEEDS (3 RH closings)
// ============================================================

let seeded = false

export function seedClosings(): void {
  if (seeded) return
  seeded = true

  // Try loading from localStorage first
  if (loadFromLocalStorage() && closingsStore.closings.length > 0) {
    return
  }

  // Seed closings for all areas with packs
  const areaConfigs = [
    { slug: 'rh', periods: ['2026-01', '2026-02', '2026-03'], mults: [0.6, 0.8, 1.0] },
    { slug: 'marketing', periods: ['2026-01', '2026-02'], mults: [0.7, 1.0] },
    { slug: 'operacoes', periods: ['2026-01', '2026-02'], mults: [0.5, 0.9] },
    { slug: 'financeiro', periods: ['2026-01', '2026-02'], mults: [0.6, 1.0] },
  ]

  for (const cfg of areaConfigs) {
    const area = areaMockStore.areas.find((a) => a.slug === cfg.slug)
    if (!area) continue

    const actions = captureActions(area.id)

    cfg.periods.forEach((period, idx) => {
      const seedId = `closing-seed-${cfg.slug}-${period}`
      // Idempotency: skip if already exists
      if (closingsStore.closings.some((c) => c.id === seedId)) return

      const mult = cfg.mults[idx]
      const snapshotActions = actions.map((a) => ({
        ...a,
        progress: Math.min(100, Math.round(a.progress * mult)),
        status:
          a.progress * mult >= 100
            ? 'done'
            : a.progress * mult > 0
              ? 'in_progress'
              : a.status,
      }))

      const kpis = computeKpis(snapshotActions)
      const statusDist = computeStatusDist(snapshotActions)
      const programDist = computeProgramDist(snapshotActions)

      const snapshot: ClosingSnapshot = {
        id: seedId,
        period,
        area_id: area.id,
        area_name: area.name,
        pack_id: null,
        pack_name: null,
        status: idx < cfg.periods.length - 1 ? 'final' : 'draft',
        kpis,
        status_distribution: statusDist,
        program_distribution: programDist,
        actions: snapshotActions,
        created_at: `${period}-15T10:00:00Z`,
        created_by: 'admin@empresa.com',
        notes: `Fechamento mensal ${period} — Area ${area.name}`,
      }

      closingsStore.closings.push(snapshot)
      appendAudit(
        snapshot.id,
        'snapshot_created',
        `Closing ${period}`,
        `Seed: Area ${area.name}, Actions: ${snapshotActions.length}`,
        'sistema'
      )
    })
  }

  saveToLocalStorage()
}

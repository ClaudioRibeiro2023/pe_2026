/**
 * Closings Module — Export Utilities
 * CSV export with UTF-8 BOM
 */

import type { ClosingSnapshot, ClosingDelta } from './types'
import { logExportEvent } from './api-mock'

function downloadCsv(content: string, filename: string): void {
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeCsv(value: string | number | null | undefined): string {
  if (value == null) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportClosingCsv(closing: ClosingSnapshot): void {
  const header = ['ID Ação', 'Título', 'Status', 'Progresso (%)', 'Vencimento', 'Responsável', 'Área', 'Programa']
  const rows = closing.actions.map((a) => [
    escapeCsv(a.action_id),
    escapeCsv(a.title),
    escapeCsv(a.status),
    escapeCsv(a.progress),
    escapeCsv(a.due_date),
    escapeCsv(a.responsible),
    escapeCsv(a.area_name),
    escapeCsv(a.program),
  ])

  // KPI summary at the top
  const kpiRows = [
    ['--- KPIs do Fechamento ---'],
    ['Período', escapeCsv(closing.period)],
    ['Área', escapeCsv(closing.area_name)],
    ['Total Ações', String(closing.kpis.total_actions)],
    ['Concluídas', String(closing.kpis.done)],
    ['Em Andamento', String(closing.kpis.in_progress)],
    ['Atrasadas', String(closing.kpis.overdue)],
    ['Não Iniciadas', String(closing.kpis.not_started)],
    ['Canceladas', String(closing.kpis.cancelled)],
    ['Progresso Médio', `${closing.kpis.avg_progress}%`],
    [''],
    ['--- Ações do Snapshot ---'],
  ]

  const csv = [...kpiRows, header, ...rows].map((row) => row.join(',')).join('\n')

  const areaSlug = closing.area_name?.toLowerCase().replace(/\s+/g, '_') ?? 'todas'
  const filename = `closing_${closing.period}_${areaSlug}.csv`

  downloadCsv(csv, filename)
  logExportEvent(closing.id, 'csv')
}

export function exportCompareCsv(delta: ClosingDelta): void {
  const header = ['Métrica', `${delta.closing_a.period} (A)`, `${delta.closing_b.period} (B)`, 'Delta']

  const kpiKeys: Array<{ key: keyof typeof delta.kpi_deltas; label: string }> = [
    { key: 'total_actions', label: 'Total Ações' },
    { key: 'done', label: 'Concluídas' },
    { key: 'in_progress', label: 'Em Andamento' },
    { key: 'overdue', label: 'Atrasadas' },
    { key: 'not_started', label: 'Não Iniciadas' },
    { key: 'cancelled', label: 'Canceladas' },
    { key: 'avg_progress', label: 'Progresso Médio (%)' },
  ]

  const rows = kpiKeys.map((k) => {
    const deltaVal = delta.kpi_deltas[k.key]
    return [escapeCsv(k.label), '', '', String(deltaVal)]
  })

  // Status distribution changes
  const statusRows = [
    [''],
    ['--- Distribuição por Status ---'],
    ['Status', 'Contagem A', 'Contagem B', 'Delta'],
    ...delta.status_changes.map((s) => [
      escapeCsv(s.status),
      String(s.count_a),
      String(s.count_b),
      String(s.delta),
    ]),
  ]

  const summaryRows = [
    [''],
    ['--- Resumo ---'],
    ['Novas Ações', String(delta.new_actions.length)],
    ['Ações Removidas', String(delta.removed_actions.length)],
  ]

  const csv = [header, ...rows, ...statusRows, ...summaryRows].map((row) => row.join(',')).join('\n')

  const filename = `compare_${delta.closing_a.period}_vs_${delta.closing_b.period}.csv`
  downloadCsv(csv, filename)
}

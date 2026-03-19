/**
 * PDF Export — Closings Module
 * Institutional template for closing snapshots
 */

import { buildAndDownloadPDF } from './index'
import type { PDFBuildOptions, PDFSection } from './types'
import type { ClosingSnapshot, ClosingDelta } from '@/features/closings/types'

export async function exportClosingToPDF(closing: ClosingSnapshot): Promise<void> {
  const sections: PDFSection[] = []

  // KPIs
  sections.push({
    type: 'kpis',
    title: 'KPIs do Fechamento',
    items: [
      { label: 'Total Acoes', value: closing.kpis.total_actions },
      { label: 'Concluidas', value: closing.kpis.done },
      { label: 'Em Andamento', value: closing.kpis.in_progress },
      { label: 'Atrasadas', value: closing.kpis.overdue },
      { label: 'Nao Iniciadas', value: closing.kpis.not_started },
      { label: 'Canceladas', value: closing.kpis.cancelled },
      { label: 'Progresso Medio', value: closing.kpis.avg_progress, suffix: '%' },
    ],
  })

  // Status distribution
  if (closing.status_distribution.length > 0) {
    sections.push({
      type: 'table',
      title: 'Distribuicao por Status',
      columns: [
        { header: 'Status', dataKey: 'status' },
        { header: 'Quantidade', dataKey: 'count' },
        { header: 'Percentual', dataKey: 'percentage' },
      ],
      data: closing.status_distribution.map((s) => ({
        status: s.status,
        count: s.count,
        percentage: `${s.percentage}%`,
      })),
    })
  }

  // Program distribution
  if (closing.program_distribution.length > 0) {
    sections.push({
      type: 'table',
      title: 'Distribuicao por Programa',
      columns: [
        { header: 'Programa', dataKey: 'label' },
        { header: 'Quantidade', dataKey: 'count' },
        { header: 'Percentual', dataKey: 'percentage' },
      ],
      data: closing.program_distribution.map((p) => ({
        label: p.label,
        count: p.count,
        percentage: `${p.percentage}%`,
      })),
    })
  }

  // Actions table
  if (closing.actions.length > 0) {
    sections.push({
      type: 'table',
      title: `Acoes do Snapshot (${closing.actions.length})`,
      columns: [
        { header: 'Titulo', dataKey: 'title' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Progresso', dataKey: 'progress' },
        { header: 'Vencimento', dataKey: 'due_date' },
        { header: 'Responsavel', dataKey: 'responsible' },
        { header: 'Area', dataKey: 'area_name' },
      ],
      data: closing.actions.map((a) => ({
        ...a,
        progress: `${a.progress}%`,
        due_date: a.due_date ? new Date(a.due_date).toLocaleDateString('pt-BR') : '-',
      })),
    })
  }

  // Notes
  if (closing.notes) {
    sections.push({
      type: 'text',
      title: 'Observacoes',
      content: closing.notes,
    })
  }

  const options: PDFBuildOptions = {
    meta: {
      title: `Fechamento ${closing.period}`,
      subtitle: `Status: ${closing.status}`,
      area: closing.area_name || 'Todas as areas',
      period: closing.period,
      version: '1.0',
      generatedBy: closing.created_by,
    },
    sections,
  }

  const areaSlug = (closing.area_name || 'todas').toLowerCase().replace(/\s+/g, '_')
  const filename = `closing_${closing.period}_${areaSlug}.pdf`
  await buildAndDownloadPDF(options, filename)
}

export async function exportClosingCompareToPDF(
  closingA: ClosingSnapshot,
  closingB: ClosingSnapshot,
  delta: ClosingDelta
): Promise<void> {
  const sections: PDFSection[] = []

  // Delta KPIs
  const kpiLabels = [
    { key: 'total_actions' as const, label: 'Total Acoes' },
    { key: 'done' as const, label: 'Concluidas' },
    { key: 'in_progress' as const, label: 'Em Andamento' },
    { key: 'overdue' as const, label: 'Atrasadas' },
    { key: 'not_started' as const, label: 'Nao Iniciadas' },
    { key: 'cancelled' as const, label: 'Canceladas' },
    { key: 'avg_progress' as const, label: 'Progresso Medio' },
  ]

  sections.push({
    type: 'table',
    title: 'Variacao de KPIs',
    columns: [
      { header: 'Metrica', dataKey: 'label' },
      { header: `${closingA.period} (A)`, dataKey: 'valueA' },
      { header: `${closingB.period} (B)`, dataKey: 'valueB' },
      { header: 'Delta', dataKey: 'delta' },
    ],
    data: kpiLabels.map((k) => {
      const keyA = closingA.kpis[k.key]
      const keyB = closingB.kpis[k.key]
      const d = delta.kpi_deltas[k.key]
      return {
        label: k.label,
        valueA: keyA,
        valueB: keyB,
        delta: d > 0 ? `+${d}` : String(d),
      }
    }),
  })

  // Status changes
  if (delta.status_changes.length > 0) {
    sections.push({
      type: 'table',
      title: 'Mudancas por Status',
      columns: [
        { header: 'Status', dataKey: 'status' },
        { header: closingA.period, dataKey: 'count_a' },
        { header: closingB.period, dataKey: 'count_b' },
        { header: 'Delta', dataKey: 'delta' },
      ],
      data: delta.status_changes.map((s) => ({
        ...s,
        delta: s.delta > 0 ? `+${s.delta}` : String(s.delta),
      })),
    })
  }

  // Summary
  sections.push({
    type: 'kpis',
    title: 'Resumo',
    items: [
      { label: 'Novas Acoes', value: delta.new_actions.length },
      { label: 'Acoes Removidas', value: delta.removed_actions.length },
    ],
  })

  const options: PDFBuildOptions = {
    meta: {
      title: 'Comparativo de Fechamentos',
      subtitle: `${closingA.period} vs ${closingB.period}`,
      area: closingA.area_name || 'Todas',
      version: '1.0',
    },
    sections,
  }

  const filename = `compare_${closingA.period}_vs_${closingB.period}.pdf`
  await buildAndDownloadPDF(options, filename)
}

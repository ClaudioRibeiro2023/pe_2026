/**
 * PDF Export — Strategic Pack Module
 * Institutional template for area strategic packs
 */

import { buildAndDownloadPDF } from './index'
import type { PDFBuildOptions, PDFSection } from './types'

export interface PackPDFData {
  areaName: string
  packName: string
  period?: string
  programs?: Array<{ key: string; label: string; count: number }>
  objectives?: Array<{ title: string; status: string; linkedActions: number }>
  actions?: Array<Record<string, unknown>>
  actionColumns?: Array<{ header: string; dataKey: string }>
  kpis?: Array<{ label: string; value: string | number; suffix?: string }>
}

export async function exportPackToPDF(data: PackPDFData): Promise<void> {
  const sections: PDFSection[] = []

  // KPIs
  if (data.kpis && data.kpis.length > 0) {
    sections.push({
      type: 'kpis',
      title: 'Indicadores do Pack',
      items: data.kpis,
    })
  }

  // Programs
  if (data.programs && data.programs.length > 0) {
    sections.push({
      type: 'table',
      title: 'Programas',
      columns: [
        { header: 'Programa', dataKey: 'label' },
        { header: 'Chave', dataKey: 'key' },
        { header: 'Acoes', dataKey: 'count' },
      ],
      data: data.programs,
    })
  }

  // Objectives
  if (data.objectives && data.objectives.length > 0) {
    sections.push({
      type: 'table',
      title: 'Objetivos',
      columns: [
        { header: 'Titulo', dataKey: 'title' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Acoes Vinculadas', dataKey: 'linkedActions' },
      ],
      data: data.objectives,
    })
  }

  // Actions
  if (data.actions && data.actionColumns) {
    sections.push({
      type: 'table',
      title: `Acoes do Pack (${data.actions.length})`,
      columns: data.actionColumns,
      data: data.actions,
    })
  }

  const options: PDFBuildOptions = {
    meta: {
      title: `Pack Estrategico — ${data.areaName}`,
      subtitle: data.packName,
      area: data.areaName,
      pack: data.packName,
      period: data.period,
      version: '1.0',
    },
    sections,
  }

  const areaSlug = data.areaName.toLowerCase().replace(/\s+/g, '_')
  const packSlug = data.packName.toLowerCase().replace(/\s+/g, '_')
  const filename = `pack_${areaSlug}_${packSlug}.pdf`
  await buildAndDownloadPDF(options, filename)
}

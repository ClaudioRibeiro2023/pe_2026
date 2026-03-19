/**
 * PDF Export — Reports Module
 * Uses institutional template with chart embed support
 */

import { buildAndDownloadPDF, captureAllCharts } from './index'
import type { PDFBuildOptions, PDFSection, PDFFilter } from './types'
import { format } from 'date-fns/format'

export interface ReportPDFData {
  title: string
  reportType: string
  area?: string
  pack?: string
  period?: string
  filters?: PDFFilter[]
  kpis?: Array<{ label: string; value: string | number; suffix?: string }>
  statusDistribution?: Array<{ status: string; count: number; percentage: number }>
  actionsByPack?: Array<Record<string, unknown>>
  actionsByPackColumns?: Array<{ header: string; dataKey: string }>
}

export async function exportReportInstitutionalPDF(data: ReportPDFData): Promise<void> {
  const sections: PDFSection[] = []

  // KPIs section
  if (data.kpis && data.kpis.length > 0) {
    sections.push({
      type: 'kpis',
      title: 'Indicadores Chave',
      items: data.kpis,
    })
  }

  // Try to capture charts from the page
  try {
    const charts = await captureAllCharts('[data-pdf-chart]')
    for (const chart of charts) {
      sections.push({
        type: 'chart',
        title: chart.title,
        imageDataUrl: chart.result.imageDataUrl,
        fallbackNote: chart.result.error
          ? `Grafico nao disponivel: ${chart.result.error}`
          : undefined,
        width: 170,
        height: 55,
      })
    }
  } catch {
    sections.push({
      type: 'text',
      title: 'Graficos',
      content: 'Graficos nao puderam ser capturados nesta exportacao.',
    })
  }

  // Status distribution table
  if (data.statusDistribution && data.statusDistribution.length > 0) {
    sections.push({
      type: 'table',
      title: 'Distribuicao por Status',
      columns: [
        { header: 'Status', dataKey: 'status' },
        { header: 'Quantidade', dataKey: 'count' },
        { header: 'Percentual', dataKey: 'percentage' },
      ],
      data: data.statusDistribution.map((s) => ({
        status: s.status,
        count: s.count,
        percentage: `${s.percentage}%`,
      })),
    })
  }

  // Actions table
  if (data.actionsByPack && data.actionsByPackColumns) {
    sections.push({
      type: 'table',
      title: 'Acoes por Pack',
      columns: data.actionsByPackColumns,
      data: data.actionsByPack,
    })
  }

  const options: PDFBuildOptions = {
    meta: {
      title: data.title,
      subtitle: data.reportType,
      area: data.area,
      pack: data.pack,
      period: data.period,
      version: '1.0',
    },
    filters: data.filters,
    sections,
  }

  const filename = `relatorio_${(data.area || 'geral').toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
  await buildAndDownloadPDF(options, filename)
}

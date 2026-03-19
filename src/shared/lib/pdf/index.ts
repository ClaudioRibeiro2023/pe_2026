/**
 * PDF Institutional Template — Central Builder
 * Reusable across Reports, Closings, and Packs exports
 */

import type { PDFBuildOptions } from './types'
import { renderHeader, applyFooters } from './template'
import { renderFiltersBlock, renderSection } from './sections'

let pdfLibsPromise: Promise<{
  jsPDF: typeof import('jspdf').default
  autoTable: typeof import('jspdf-autotable').default
}> | null = null

export const loadPdfLibs = async () => {
  if (!pdfLibsPromise) {
    pdfLibsPromise = Promise.all([import('jspdf'), import('jspdf-autotable')]).then(
      ([jsPDFModule, autoTableModule]) => ({
        jsPDF: jsPDFModule.default,
        autoTable: autoTableModule.default,
      })
    )
  }
  return pdfLibsPromise
}

export async function buildInstitutionalPDF(options: PDFBuildOptions): Promise<import('jspdf').default> {
  const { jsPDF, autoTable } = await loadPdfLibs()
  const doc = new jsPDF()

  // Header
  let y = renderHeader(doc, options.meta)

  // Filters
  if (options.filters && options.filters.length > 0) {
    y = renderFiltersBlock(doc, options.filters, y)
  }

  // Sections
  for (const section of options.sections) {
    y = renderSection(doc, autoTable, section, y)
  }

  // Apply footers to all pages
  applyFooters(doc, options.meta)

  return doc
}

export async function buildAndDownloadPDF(options: PDFBuildOptions, filename: string): Promise<void> {
  const doc = await buildInstitutionalPDF(options)
  doc.save(filename)
}

export { captureChart, captureAllCharts, captureChartCanvas, captureElementAsImage } from './chartCapture'
export type { PDFBuildOptions, PDFDocumentMeta, PDFSection, PDFFilter, PDFKpiItem, PDFTableColumn, PDFChartSection } from './types'
export { PDF_COLORS, PDF_LAYOUT } from './types'

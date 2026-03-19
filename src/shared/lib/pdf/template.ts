/**
 * PDF Institutional Template — Header, Footer, Page Numbers
 */

import { format } from 'date-fns/format'
import { ptBR } from 'date-fns/locale/pt-BR'
import { PDF_COLORS, PDF_LAYOUT } from './types'
import type { PDFDocumentMeta } from './types'
import type jsPDF from 'jspdf'

export function renderHeader(doc: jsPDF, meta: PDFDocumentMeta): number {
  const { marginLeft } = PDF_LAYOUT
  let y = 15

  // Title
  doc.setFontSize(18)
  doc.setTextColor(...PDF_COLORS.primary)
  doc.text(meta.title, marginLeft, y)
  y += 7

  // Subtitle
  if (meta.subtitle) {
    doc.setFontSize(11)
    doc.setTextColor(...PDF_COLORS.textMuted)
    doc.text(meta.subtitle, marginLeft, y)
    y += 5
  }

  // Meta line: area | pack | period
  const metaParts: string[] = []
  if (meta.area) metaParts.push(`Area: ${meta.area}`)
  if (meta.pack) metaParts.push(`Pack: ${meta.pack}`)
  if (meta.period) metaParts.push(`Periodo: ${meta.period}`)

  if (metaParts.length > 0) {
    doc.setFontSize(9)
    doc.setTextColor(...PDF_COLORS.textMuted)
    doc.text(metaParts.join('  |  '), marginLeft, y)
    y += 5
  }

  // Timestamp
  doc.setFontSize(8)
  doc.setTextColor(...PDF_COLORS.textLight)
  const ts = format(new Date(), "dd/MM/yyyy 'as' HH:mm", { locale: ptBR })
  doc.text(`Gerado em: ${ts}${meta.version ? `  |  v${meta.version}` : ''}`, marginLeft, y)
  y += 3

  // Separator line
  doc.setDrawColor(...PDF_COLORS.border)
  doc.setLineWidth(0.3)
  doc.line(marginLeft, y, marginLeft + PDF_LAYOUT.contentWidth, y)
  y += 5

  return y
}

export function renderFooter(doc: jsPDF, pageNum: number, totalPages: number, meta: PDFDocumentMeta): void {
  const { marginLeft, pageHeight, contentWidth } = PDF_LAYOUT
  const y = pageHeight - 10

  doc.setDrawColor(...PDF_COLORS.border)
  doc.setLineWidth(0.2)
  doc.line(marginLeft, y - 3, marginLeft + contentWidth, y - 3)

  doc.setFontSize(7)
  doc.setTextColor(...PDF_COLORS.textLight)

  // Left: title
  doc.text(meta.title, marginLeft, y)

  // Center: page
  const pageText = `Pagina ${pageNum} de ${totalPages}`
  const pageTextWidth = doc.getTextWidth(pageText)
  doc.text(pageText, marginLeft + (contentWidth - pageTextWidth) / 2, y)

  // Right: timestamp
  const ts = format(new Date(), 'dd/MM/yyyy HH:mm')
  const tsWidth = doc.getTextWidth(ts)
  doc.text(ts, marginLeft + contentWidth - tsWidth, y)

  // Draft watermark
  if (meta.draft) {
    doc.setFontSize(50)
    doc.setTextColor(200, 200, 200)
    doc.text('DRAFT', 60, 160, { angle: 45 })
  }
}

export function applyFooters(doc: jsPDF, meta: PDFDocumentMeta): void {
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    renderFooter(doc, i, totalPages, meta)
  }
}

export function addPageBreakIfNeeded(doc: jsPDF, currentY: number, neededHeight: number = 40): number {
  if (currentY + neededHeight > PDF_LAYOUT.pageHeight - PDF_LAYOUT.footerHeight - 10) {
    doc.addPage()
    return PDF_LAYOUT.marginTop
  }
  return currentY
}

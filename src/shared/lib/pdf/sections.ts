/**
 * PDF Institutional Template — Section Renderers
 */

import { PDF_COLORS, PDF_LAYOUT } from './types'
import type { PDFSection, PDFFilter, PDFKpiItem, PDFTableColumn } from './types'
import { addPageBreakIfNeeded } from './template'
import type jsPDF from 'jspdf'
import type autoTable from 'jspdf-autotable'

export function renderFiltersBlock(doc: jsPDF, filters: PDFFilter[], startY: number): number {
  if (filters.length === 0) return startY
  let y = startY

  const blockHeight = 8 + filters.length * 5
  y = addPageBreakIfNeeded(doc, y, blockHeight)

  doc.setFillColor(...PDF_COLORS.bgLight)
  doc.roundedRect(PDF_LAYOUT.marginLeft, y, PDF_LAYOUT.contentWidth, blockHeight, 2, 2, 'F')

  doc.setFontSize(8)
  doc.setTextColor(...PDF_COLORS.textMuted)
  doc.text('Filtros aplicados:', PDF_LAYOUT.marginLeft + 4, y + 5)
  y += 9

  for (const f of filters) {
    doc.setTextColor(...PDF_COLORS.text)
    doc.text(`${f.label}: ${f.value}`, PDF_LAYOUT.marginLeft + 8, y)
    y += 5
  }

  return y + 4
}

export function renderSectionTitle(doc: jsPDF, title: string, startY: number): number {
  let y = addPageBreakIfNeeded(doc, startY, 15)

  doc.setFontSize(12)
  doc.setTextColor(...PDF_COLORS.primary)
  doc.text(title, PDF_LAYOUT.marginLeft, y)
  y += 2

  doc.setDrawColor(...PDF_COLORS.primary)
  doc.setLineWidth(0.5)
  doc.line(PDF_LAYOUT.marginLeft, y, PDF_LAYOUT.marginLeft + 40, y)

  return y + 5
}

export function renderKpiGrid(doc: jsPDF, items: PDFKpiItem[], startY: number): number {
  const y = addPageBreakIfNeeded(doc, startY, 25)

  const cols = Math.min(items.length, 4)
  const cellWidth = PDF_LAYOUT.contentWidth / cols
  const cellHeight = 18

  items.forEach((item, idx) => {
    const col = idx % cols
    const row = Math.floor(idx / cols)
    const x = PDF_LAYOUT.marginLeft + col * cellWidth
    const cy = y + row * (cellHeight + 2)

    doc.setFillColor(...PDF_COLORS.bgLight)
    doc.roundedRect(x + 1, cy, cellWidth - 2, cellHeight, 1, 1, 'F')

    doc.setFontSize(14)
    doc.setTextColor(...PDF_COLORS.primary)
    const valueStr = `${item.value}${item.suffix || ''}`
    doc.text(valueStr, x + cellWidth / 2, cy + 8, { align: 'center' })

    doc.setFontSize(7)
    doc.setTextColor(...PDF_COLORS.textMuted)
    doc.text(item.label, x + cellWidth / 2, cy + 14, { align: 'center' })
  })

  const totalRows = Math.ceil(items.length / cols)
  return y + totalRows * (cellHeight + 2) + 4
}

export function renderTable(
  doc: jsPDF,
  autoTableFn: typeof autoTable,
  columns: PDFTableColumn[],
  data: Record<string, unknown>[],
  startY: number
): number {
  autoTableFn(doc, {
    startY,
    head: [columns.map((c) => c.header)],
    body: data.map((row) => columns.map((c) => String(row[c.dataKey] ?? ''))),
    styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
    headStyles: {
      fillColor: PDF_COLORS.primary,
      textColor: PDF_COLORS.white,
      fontSize: 8,
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: PDF_COLORS.bgLight },
    margin: { left: PDF_LAYOUT.marginLeft, right: PDF_LAYOUT.marginRight },
    tableWidth: 'auto',
  })

  return doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 8 : startY + 30
}

export function renderTextBlock(doc: jsPDF, content: string, startY: number): number {
  const y = addPageBreakIfNeeded(doc, startY, 20)

  doc.setFontSize(9)
  doc.setTextColor(...PDF_COLORS.text)

  const lines = doc.splitTextToSize(content, PDF_LAYOUT.contentWidth)
  doc.text(lines, PDF_LAYOUT.marginLeft, y)

  return y + lines.length * 4.5 + 4
}

export function renderChartImage(doc: jsPDF, imageDataUrl: string | null, title: string, fallbackNote: string | undefined, startY: number, width?: number, height?: number): number {
  let y = addPageBreakIfNeeded(doc, startY, (height || 60) + 15)

  if (imageDataUrl) {
    const imgW = width || PDF_LAYOUT.contentWidth
    const imgH = height || 60
    try {
      doc.addImage(imageDataUrl, 'PNG', PDF_LAYOUT.marginLeft, y, imgW, imgH)
      y += imgH + 4
    } catch {
      doc.setFontSize(8)
      doc.setTextColor(...PDF_COLORS.textLight)
      doc.text(`[Grafico "${title}" nao pode ser embutido]`, PDF_LAYOUT.marginLeft, y + 5)
      y += 10
    }
  } else {
    doc.setFontSize(8)
    doc.setTextColor(...PDF_COLORS.textLight)
    doc.text(fallbackNote || `[Grafico "${title}" indisponivel]`, PDF_LAYOUT.marginLeft, y + 5)
    y += 10
  }

  return y
}

export function renderSection(doc: jsPDF, autoTableFn: typeof autoTable, section: PDFSection, startY: number): number {
  const y = renderSectionTitle(doc, section.title, startY)

  switch (section.type) {
    case 'kpis':
      return renderKpiGrid(doc, section.items, y)
    case 'table':
      return renderTable(doc, autoTableFn, section.columns, section.data, y)
    case 'text':
      return renderTextBlock(doc, section.content, y)
    case 'chart':
      return renderChartImage(doc, section.imageDataUrl, section.title, section.fallbackNote, y, section.width, section.height)
    default:
      return y
  }
}

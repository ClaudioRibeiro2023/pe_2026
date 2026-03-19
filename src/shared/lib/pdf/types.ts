/**
 * PDF Institutional Template — Type Definitions
 */

export interface PDFDocumentMeta {
  title: string
  subtitle?: string
  area?: string
  pack?: string
  period?: string
  version?: string
  generatedBy?: string
  draft?: boolean
}

export interface PDFFilter {
  label: string
  value: string
}

export interface PDFKpiItem {
  label: string
  value: string | number
  suffix?: string
}

export interface PDFTableColumn {
  header: string
  dataKey: string
  width?: number
}

export interface PDFTableSection {
  type: 'table'
  title: string
  columns: PDFTableColumn[]
  data: Record<string, unknown>[]
}

export interface PDFKpiSection {
  type: 'kpis'
  title: string
  items: PDFKpiItem[]
}

export interface PDFTextSection {
  type: 'text'
  title: string
  content: string
}

export interface PDFChartSection {
  type: 'chart'
  title: string
  imageDataUrl: string | null
  fallbackNote?: string
  width?: number
  height?: number
}

export type PDFSection = PDFTableSection | PDFKpiSection | PDFTextSection | PDFChartSection

export interface PDFBuildOptions {
  meta: PDFDocumentMeta
  filters?: PDFFilter[]
  sections: PDFSection[]
  showCover?: boolean
  showToc?: boolean
}

export const PDF_COLORS = {
  primary: [0, 98, 184] as [number, number, number],
  primaryLight: [230, 240, 250] as [number, number, number],
  text: [30, 30, 30] as [number, number, number],
  textMuted: [100, 100, 100] as [number, number, number],
  textLight: [140, 140, 140] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  bgLight: [248, 250, 252] as [number, number, number],
  border: [220, 225, 230] as [number, number, number],
  success: [16, 185, 129] as [number, number, number],
  danger: [239, 68, 68] as [number, number, number],
  warning: [245, 158, 11] as [number, number, number],
  info: [59, 130, 246] as [number, number, number],
}

export const PDF_LAYOUT = {
  marginLeft: 14,
  marginRight: 14,
  marginTop: 20,
  marginBottom: 20,
  pageWidth: 210,
  pageHeight: 297,
  contentWidth: 182,
  headerHeight: 40,
  footerHeight: 15,
}

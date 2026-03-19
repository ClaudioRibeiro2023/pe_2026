import { format } from 'date-fns/format'
import { ptBR } from 'date-fns/locale/pt-BR'

let pdfLibsPromise: Promise<{
  jsPDF: typeof import('jspdf').default
  autoTable: typeof import('jspdf-autotable').default
}> | null = null

const loadPdfLibs = async () => {
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

// Exportar para PDF
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function exportToPDF<T extends Record<string, any>>(
  data: T[],
  columns: { header: string; dataKey: keyof T }[],
  title: string
) {
  const { jsPDF, autoTable } = await loadPdfLibs()
  const doc = new jsPDF()
  
  // Título
  doc.setFontSize(18)
  doc.text(title, 14, 20)
  
  // Data
  doc.setFontSize(10)
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 14, 28)
  
  // Tabela
  autoTable(doc, {
    startY: 35,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => String(row[col.dataKey] || ''))),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] },
  })
  
  // Download
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}

// Exportar para Excel
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  columns: { header: string; dataKey: keyof T }[],
  filename: string
) {
  const separator = ';'
  const escapeCell = (value: unknown) => {
    const raw = value === null || value === undefined ? '' : String(value)
    const needsQuotes = raw.includes('"') || raw.includes('\n') || raw.includes('\r') || raw.includes(separator)
    const escaped = raw.replace(/"/g, '""')
    return needsQuotes ? `"${escaped}"` : escaped
  }

  const rows: string[] = []
  rows.push(columns.map((col) => escapeCell(col.header)).join(separator))
  for (const row of data) {
    rows.push(columns.map((col) => escapeCell(row[col.dataKey])).join(separator))
  }

  const csv = `\ufeff${rows.join('\r\n')}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// Export PDF com layout melhorado (cabecalho + filtros + secoes)
export interface ReportPDFOptions {
  title: string
  reportType: string
  filters?: { label: string; value: string }[]
  sections: {
    title: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>[]
    columns: { header: string; dataKey: string }[]
  }[]
}

export async function exportReportToPDF(options: ReportPDFOptions) {
  const { jsPDF, autoTable } = await loadPdfLibs()
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.setTextColor(0, 98, 184) // primary-600
  doc.text(options.title, 14, 20)
  doc.setFontSize(11)
  doc.setTextColor(100, 100, 100)
  doc.text(options.reportType, 14, 28)
  doc.setFontSize(9)
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'as' HH:mm", { locale: ptBR })}`, 14, 34)

  let yPos = 40

  // Filters block
  if (options.filters && options.filters.length > 0) {
    doc.setFillColor(245, 247, 250)
    doc.rect(14, yPos, 182, 8 + options.filters.length * 6, 'F')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    doc.text('Filtros aplicados:', 18, yPos + 5)
    yPos += 10
    for (const f of options.filters) {
      doc.setTextColor(60, 60, 60)
      doc.text(`${f.label}: ${f.value}`, 22, yPos)
      yPos += 6
    }
    yPos += 4
  }

  // Sections
  for (const section of options.sections) {
    if (yPos > 260) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setTextColor(30, 30, 30)
    doc.text(section.title, 14, yPos)
    yPos += 4

    autoTable(doc, {
      startY: yPos,
      head: [section.columns.map(c => c.header)],
      body: section.data.map(row => section.columns.map(c => String(row[c.dataKey] || ''))),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 98, 184], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    })
    yPos = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : yPos + 30
  }

  doc.save(`${options.title.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}

// Hook para exportação com suporte a toast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useExport<T extends Record<string, any>>() {
  const exportData = async (
    data: T[],
    columns: { header: string; dataKey: keyof T }[],
    title: string,
    fmt: 'pdf' | 'excel',
    onSuccess?: () => void,
    onError?: (err: string) => void
  ) => {
    if (data.length === 0) {
      onError?.('Nao ha dados para exportar')
      return
    }
    try {
      if (fmt === 'pdf') {
        await exportToPDF(data, columns, title)
      } else {
        exportToExcel(data, columns, title)
      }
      onSuccess?.()
    } catch (e) {
      onError?.(e instanceof Error ? e.message : 'Erro ao exportar')
    }
  }

  return { exportData, exportReportToPDF }
}

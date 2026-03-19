import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FileText, Download, Calendar, Check, Loader2, Eye } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { useToast } from '@/shared/ui/Toast'
import { generateMonthlyReportMarkdown } from '../utils/generateMonthlyReport'
import { exportToPdf } from '../utils/exportToPdf'
import type { PackFull } from '../types'
import type { PlanAction } from '@/features/area-plans/types'

interface MonthlyCloseButtonProps {
  pack: PackFull
  areaName: string
  actions: PlanAction[]
  pendingEvidences: number
  approvedEvidences: number
  rejectedEvidences: number
  onSaveReport?: (markdown: string, month: string) => Promise<void>
}

export function MonthlyCloseButton({
  pack,
  areaName,
  actions,
  pendingEvidences,
  approvedEvidences,
  rejectedEvidences,
  onSaveReport,
}: MonthlyCloseButtonProps) {
  const { addToast } = useToast()
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return format(now, 'yyyy-MM')
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      const [year, month] = selectedMonth.split('-').map(Number)
      const monthDate = new Date(year, month - 1, 1)
      
      const markdown = generateMonthlyReportMarkdown({
        pack,
        areaName,
        month: monthDate,
        actions,
        pendingEvidences,
        approvedEvidences,
        rejectedEvidences,
      })
      
      setGeneratedMarkdown(markdown)
      
      if (onSaveReport) {
        await onSaveReport(markdown, selectedMonth)
      }
      
      addToast({
        type: 'success',
        title: 'Relatório gerado',
        message: `Fechamento de ${format(monthDate, 'MMMM/yyyy', { locale: ptBR })} criado com sucesso.`,
      })
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      addToast({
        type: 'error',
        title: 'Erro ao gerar',
        message: 'Não foi possível gerar o relatório mensal.',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPdf = async () => {
    if (!generatedMarkdown) {
      addToast({
        type: 'warning',
        title: 'Gere o relatório primeiro',
        message: 'É necessário gerar o relatório antes de exportar para PDF.',
      })
      return
    }

    setIsExporting(true)
    try {
      const [year, month] = selectedMonth.split('-').map(Number)
      const monthDate = new Date(year, month - 1, 1)
      const filename = `Fechamento_${areaName}_${format(monthDate, 'yyyy-MM')}.pdf`
      
      await exportToPdf(generatedMarkdown, filename)
      
      addToast({
        type: 'success',
        title: 'PDF exportado',
        message: `Arquivo ${filename} gerado com sucesso.`,
      })
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      addToast({
        type: 'error',
        title: 'Erro ao exportar',
        message: 'Não foi possível gerar o PDF.',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadMarkdown = () => {
    if (!generatedMarkdown) return
    
    const [year, month] = selectedMonth.split('-').map(Number)
    const monthDate = new Date(year, month - 1, 1)
    const filename = `Fechamento_${areaName}_${format(monthDate, 'yyyy-MM')}.md`
    
    const blob = new Blob([generatedMarkdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    addToast({
      type: 'success',
      title: 'Markdown baixado',
      message: `Arquivo ${filename} salvo.`,
    })
  }

  // Generate month options (current + last 11 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy', { locale: ptBR }),
    }
  })

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Fechamento Mensal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted" />
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value)
                setGeneratedMarkdown(null)
              }}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : generatedMarkdown ? (
              <Check className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            {generatedMarkdown ? 'Regenerar' : 'Fechar Mês'}
          </Button>
        </div>

        {generatedMarkdown && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Ocultar' : 'Visualizar'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar MD
            </Button>

            <Button
              size="sm"
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Exportar PDF
            </Button>
          </div>
        )}

        {showPreview && generatedMarkdown && (
          <div className="mt-4 p-4 bg-accent rounded-lg border border-border max-h-96 overflow-auto">
            <pre className="text-xs whitespace-pre-wrap font-mono">
              {generatedMarkdown}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

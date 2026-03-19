import { useMemo, lazy, Suspense } from 'react'
import { BarChart3, TrendingUp } from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { Progress } from '@/shared/ui/Progress'
import { ExportButtons } from '@/shared/components/export/ExportButtons'
import { useExport } from '@/shared/lib/export'
import { exportReportInstitutionalPDF } from '@/shared/lib/pdf/exportReports'
import { useToast } from '@/shared/ui/Toast'
import type { ProgramBreakdown, StatusDistribution, ReportKPIs } from '../hooks'
import type { AreaPlanProgress } from '@/features/area-plans/types'
import type { FilterSummary } from '../types'

const StatusBarChart = lazy(() => import('./charts/StatusBarChart'))
const ProgramDoughnutChart = lazy(() => import('./charts/ProgramDoughnutChart'))

interface ProgressReportProps {
  kpis: ReportKPIs
  statusDistribution: StatusDistribution[]
  programBreakdown: ProgramBreakdown[]
  planProgress: AreaPlanProgress[]
  areaName: string
  filters?: FilterSummary
}

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em Andamento',
  BLOQUEADA: 'Bloqueada',
  AGUARDANDO_EVIDENCIA: 'Aguard. Evidencia',
  EM_VALIDACAO: 'Validacao',
  CONCLUIDA: 'Concluida',
  CANCELADA: 'Cancelada',
}

const PROGRAM_LABELS: Record<string, string> = {
  CON: 'Contratacao',
  DES: 'Desenvolvimento',
  REC: 'Reconhecimento',
  INO: 'Inovacao',
  SEM_PROGRAMA: 'Sem Programa',
}

export function ProgressReport({ kpis, statusDistribution, programBreakdown, planProgress, areaName, filters }: ProgressReportProps) {
  const { exportData } = useExport<Record<string, string>>()
  const { addToast } = useToast()

  const toastSuccess = () => addToast({ type: 'success', title: 'Exportado com sucesso' })
  const toastError = (msg: string) => addToast({ type: 'error', title: 'Erro ao exportar', message: msg })

  const exportRows = useMemo(() => [
    ...programBreakdown.map(p => ({
      tipo: 'Programa',
      nome: PROGRAM_LABELS[p.programKey] || p.programKey,
      total: String(p.total),
      concluidas: String(p.completed),
      taxa: `${p.completionRate}%`,
    })),
    ...statusDistribution.map(s => ({
      tipo: 'Status',
      nome: STATUS_LABELS[s.status] || s.status,
      total: String(s.count),
      concluidas: '-',
      taxa: `${s.percentage}%`,
    })),
  ], [programBreakdown, statusDistribution])

  const exportColumns = [
    { header: 'Tipo', dataKey: 'tipo' as const },
    { header: 'Nome', dataKey: 'nome' as const },
    { header: 'Total', dataKey: 'total' as const },
    { header: 'Concluidas', dataKey: 'concluidas' as const },
    { header: 'Taxa', dataKey: 'taxa' as const },
  ]

  const handleExportPDF = async () => {
    try {
      await exportReportInstitutionalPDF({
        title: `Relatorio de Progresso`,
        reportType: `Progresso Geral - ${areaName}`,
        area: areaName,
        pack: filters?.pack,
        period: filters ? `${filters.periodStart} a ${filters.periodEnd}` : undefined,
        filters: filters ? [
          { label: 'Area', value: filters.area },
          { label: 'Pack', value: filters.pack },
          { label: 'Periodo', value: `${filters.periodStart} a ${filters.periodEnd}` },
        ] : [],
        kpis: [
          { label: 'Taxa Conclusao', value: kpis.completionRate, suffix: '%' },
          { label: 'Progresso Medio', value: kpis.avgProgress, suffix: '%' },
          { label: 'Total Acoes', value: kpis.totalActions },
          { label: 'Concluidas', value: kpis.completed },
          { label: 'Em Andamento', value: kpis.inProgress },
          { label: 'Atrasadas', value: kpis.overdue },
        ],
        statusDistribution: statusDistribution.map(s => ({
          status: STATUS_LABELS[s.status] || s.status,
          count: s.count,
          percentage: s.percentage,
        })),
        actionsByPack: programBreakdown.map(p => ({
          programa: PROGRAM_LABELS[p.programKey] || p.programKey,
          total: String(p.total),
          concluidas: String(p.completed),
          taxa: `${p.completionRate}%`,
        })),
        actionsByPackColumns: [
          { header: 'Programa', dataKey: 'programa' },
          { header: 'Total', dataKey: 'total' },
          { header: 'Concluidas', dataKey: 'concluidas' },
          { header: 'Taxa', dataKey: 'taxa' },
        ],
      })
      toastSuccess()
    } catch (e) { toastError(e instanceof Error ? e.message : 'Erro') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Progresso Geral</h3>
          <p className="text-sm text-muted">{areaName} - Visao agregada</p>
        </div>
        <ExportButtons
          onExportPDF={handleExportPDF}
          onExportExcel={() => exportData(exportRows, exportColumns, `Progresso ${areaName}`, 'excel', toastSuccess, toastError)}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-muted mb-1">Conclusao</p>
            <p className="text-3xl font-bold text-success-600">{kpis.completionRate}%</p>
            <p className="text-xs text-muted mt-1">{kpis.completed}/{kpis.totalActions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-muted mb-1">Progresso Medio</p>
            <p className="text-3xl font-bold text-primary-600">{kpis.avgProgress}%</p>
            <p className="text-xs text-muted mt-1">media individual</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-muted mb-1">Atrasadas</p>
            <p className={`text-3xl font-bold ${kpis.overdue > 0 ? 'text-danger-600' : 'text-success-600'}`}>{kpis.overdue}</p>
            <p className="text-xs text-muted mt-1">de {kpis.totalActions} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-primary-600" />
              <h4 className="text-sm font-semibold text-foreground">Distribuicao por Status</h4>
            </div>
            <div className="h-64" data-pdf-chart="status-bar" data-pdf-chart-title="Distribuicao por Status">
              <Suspense fallback={<div className="h-full flex items-center justify-center text-muted text-sm">Carregando grafico...</div>}>
                <StatusBarChart statusDistribution={statusDistribution} />
              </Suspense>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-primary-600" />
              <h4 className="text-sm font-semibold text-foreground">Progresso por Programa</h4>
            </div>
            <div className="h-64" data-pdf-chart="program-doughnut" data-pdf-chart-title="Progresso por Programa">
              <Suspense fallback={<div className="h-full flex items-center justify-center text-muted text-sm">Carregando grafico...</div>}>
                <ProgramDoughnutChart programBreakdown={programBreakdown} />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Breakdown (bars) */}
      <Card>
        <CardContent className="py-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-primary-600" />
            <h4 className="text-sm font-semibold text-foreground">Progresso por Programa (detalhado)</h4>
          </div>
          <div className="space-y-4">
            {programBreakdown.map(prog => (
              <div key={prog.programKey} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {PROGRAM_LABELS[prog.programKey] || prog.programKey}
                    </span>
                    <span className="text-xs text-muted font-mono">{prog.programKey}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {prog.completed}/{prog.total} ({prog.completionRate}%)
                  </span>
                </div>
                <Progress value={prog.completionRate} size="md" variant="gradient" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Table */}
      <Card>
        <CardContent className="py-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary-600" />
            <h4 className="text-sm font-semibold text-foreground">Distribuicao por Status (tabela)</h4>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-muted">Status</th>
                  <th className="text-right py-2 px-3 font-medium text-muted">Qtd</th>
                  <th className="text-right py-2 px-3 font-medium text-muted">%</th>
                  <th className="py-2 px-3 font-medium text-muted w-40"></th>
                </tr>
              </thead>
              <tbody>
                {statusDistribution.map(({ status, count, percentage }) => (
                  <tr key={status} className="border-b border-border/50">
                    <td className="py-2 px-3 text-foreground">{STATUS_LABELS[status] || status}</td>
                    <td className="py-2 px-3 text-right font-mono text-foreground">{count}</td>
                    <td className="py-2 px-3 text-right font-mono text-foreground">{percentage}%</td>
                    <td className="py-2 px-3">
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* All Areas Progress (if multiple) */}
      {planProgress.length > 1 && (
        <Card>
          <CardContent className="py-5">
            <h4 className="text-sm font-semibold text-foreground mb-4">Comparativo por Area</h4>
            <div className="space-y-3">
              {planProgress.sort((a, b) => b.completion_percentage - a.completion_percentage).map(pp => (
                <div key={pp.plan_id} className="flex items-center gap-3">
                  <span className="text-sm text-foreground w-28 truncate">{pp.area_name}</span>
                  <div className="flex-1">
                    <Progress value={pp.completion_percentage} size="sm" variant="gradient" />
                  </div>
                  <span className="text-xs font-mono text-muted w-16 text-right">{pp.completion_percentage}%</span>
                  <span className="text-xs text-muted w-20 text-right">{pp.completed_actions}/{pp.total_actions}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

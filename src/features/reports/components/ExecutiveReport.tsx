import {
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  XCircle,
  ShieldAlert,
  FileCheck,
} from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { Progress } from '@/shared/ui/Progress'
import { ExportButtons } from '@/shared/components/export/ExportButtons'
import { useExport } from '@/shared/lib/export'
import { useToast } from '@/shared/ui/Toast'
import type { ReportKPIs, StatusDistribution } from '../hooks'
import type { FilterSummary } from '../types'

interface ExecutiveReportProps {
  kpis: ReportKPIs
  statusDistribution: StatusDistribution[]
  areaName: string
  packId: string
  filters?: FilterSummary
}

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em Andamento',
  BLOQUEADA: 'Bloqueada',
  AGUARDANDO_EVIDENCIA: 'Aguardando Evidencia',
  EM_VALIDACAO: 'Em Validacao',
  CONCLUIDA: 'Concluida',
  CANCELADA: 'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  PENDENTE: 'bg-muted',
  EM_ANDAMENTO: 'bg-primary-500',
  BLOQUEADA: 'bg-danger-500',
  AGUARDANDO_EVIDENCIA: 'bg-warning-500',
  EM_VALIDACAO: 'bg-info-500',
  CONCLUIDA: 'bg-success-500',
  CANCELADA: 'bg-muted',
}

export function ExecutiveReport({ kpis, statusDistribution, areaName, packId, filters }: ExecutiveReportProps) {
  const { exportData, exportReportToPDF } = useExport<{ metric: string; value: string }>()
  const { addToast } = useToast()

  const exportRows = [
    { metric: 'Total Acoes', value: String(kpis.totalActions) },
    { metric: 'Concluidas', value: String(kpis.completed) },
    { metric: 'Em Andamento', value: String(kpis.inProgress) },
    { metric: 'Pendentes', value: String(kpis.pending) },
    { metric: 'Bloqueadas', value: String(kpis.blocked) },
    { metric: 'Atrasadas', value: String(kpis.overdue) },
    { metric: 'Taxa Conclusao', value: `${kpis.completionRate}%` },
    { metric: 'Progresso Medio', value: `${kpis.avgProgress}%` },
  ]

  const exportColumns = [
    { header: 'Metrica', dataKey: 'metric' as const },
    { header: 'Valor', dataKey: 'value' as const },
  ]

  const toastSuccess = () => addToast({ type: 'success', title: 'Exportado com sucesso' })
  const toastError = (msg: string) => addToast({ type: 'error', title: 'Erro ao exportar', message: msg })

  const handleExportPDF = async () => {
    try {
      await exportReportToPDF({
        title: 'Relatorios',
        reportType: `Executivo - ${areaName}`,
        filters: filters ? [
          { label: 'Area', value: filters.area },
          { label: 'Pack', value: filters.pack },
          { label: 'Periodo', value: `${filters.periodStart} a ${filters.periodEnd}` },
        ] : [],
        sections: [{
          title: 'KPIs',
          data: exportRows,
          columns: [{ header: 'Metrica', dataKey: 'metric' }, { header: 'Valor', dataKey: 'value' }],
        }, {
          title: 'Distribuicao por Status',
          data: statusDistribution.map(s => ({ status: STATUS_LABELS[s.status] || s.status, count: String(s.count), pct: `${s.percentage}%` })),
          columns: [{ header: 'Status', dataKey: 'status' }, { header: 'Qtd', dataKey: 'count' }, { header: '%', dataKey: 'pct' }],
        }],
      })
      toastSuccess()
    } catch (e) { toastError(e instanceof Error ? e.message : 'Erro desconhecido') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Relatorio Executivo</h3>
          <p className="text-sm text-muted">{areaName} - {packId}</p>
        </div>
        <ExportButtons
          onExportPDF={handleExportPDF}
          onExportExcel={() => exportData(exportRows, exportColumns, `Executivo ${areaName}`, 'excel', toastSuccess, toastError)}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard icon={<Target className="h-5 w-5 text-primary-600" />} label="Total Acoes" value={kpis.totalActions} />
        <KPICard icon={<CheckCircle className="h-5 w-5 text-success-600" />} label="Concluidas" value={kpis.completed} accent="success" />
        <KPICard icon={<TrendingUp className="h-5 w-5 text-primary-600" />} label="Em Andamento" value={kpis.inProgress} accent="primary" />
        <KPICard icon={<AlertTriangle className="h-5 w-5 text-danger-600" />} label="Atrasadas" value={kpis.overdue} accent="danger" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard icon={<Clock className="h-5 w-5 text-muted" />} label="Pendentes" value={kpis.pending} />
        <KPICard icon={<ShieldAlert className="h-5 w-5 text-danger-600" />} label="Bloqueadas" value={kpis.blocked} accent="danger" />
        <KPICard icon={<FileCheck className="h-5 w-5 text-warning-600" />} label="Aguard. Evidencia" value={kpis.awaitingEvidence} accent="warning" />
        <KPICard icon={<XCircle className="h-5 w-5 text-muted" />} label="Canceladas" value={kpis.cancelled} />
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="py-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Taxa de Conclusao</span>
            <span className="text-2xl font-bold text-foreground">{kpis.completionRate}%</span>
          </div>
          <Progress value={kpis.completionRate} size="lg" variant="gradient" />
          <p className="text-xs text-muted mt-2">
            {kpis.completed} de {kpis.totalActions} acoes concluidas | Progresso medio: {kpis.avgProgress}%
          </p>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardContent className="py-5">
          <h4 className="text-sm font-semibold text-foreground mb-4">Distribuicao por Status</h4>
          <div className="space-y-3">
            {statusDistribution.map(({ status, count, percentage }) => (
              <div key={status} className="flex items-center gap-3">
                <span className="text-xs text-muted w-36 truncate">{STATUS_LABELS[status] || status}</span>
                <div className="flex-1 h-2.5 bg-accent rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${STATUS_COLORS[status] || 'bg-muted'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground w-16 text-right">{count} ({percentage}%)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KPICard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent?: string }) {
  const valueColor = accent === 'success' ? 'text-success-600'
    : accent === 'danger' ? 'text-danger-600'
    : accent === 'warning' ? 'text-warning-600'
    : accent === 'primary' ? 'text-primary-600'
    : 'text-foreground'

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="text-xs text-muted">{label}</p>
            <p className={`text-xl font-bold ${valueColor}`}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

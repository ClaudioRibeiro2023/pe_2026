/**
 * Closings Compare Page — Comparativo entre 2 fechamentos
 */

import { useSearchParams, useNavigate } from 'react-router-dom'
import { useClosingDetail, useClosingComparison } from '../hooks'
import { exportCompareCsv } from '../export'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { useToast } from '@/shared/ui/Toast'
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from '@/shared/ui/icons'

function DeltaBadge({ value, suffix = '' }: { value: number; suffix?: string }) {
  if (value === 0) return <span className="flex items-center gap-1 text-muted text-sm"><Minus className="h-3.5 w-3.5" />0{suffix}</span>
  if (value > 0) return <span className="flex items-center gap-1 text-success-600 dark:text-success-400 text-sm font-medium"><TrendingUp className="h-3.5 w-3.5" />+{value}{suffix}</span>
  return <span className="flex items-center gap-1 text-danger-600 dark:text-danger-400 text-sm font-medium"><TrendingDown className="h-3.5 w-3.5" />{value}{suffix}</span>
}

export function ClosingsComparePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const idA = searchParams.get('a')
  const idB = searchParams.get('b')

  const { closing: closingA } = useClosingDetail(idA)
  const { closing: closingB } = useClosingDetail(idB)
  const { delta, loading } = useClosingComparison(idA, idB)

  const handleExport = () => {
    if (!delta) return
    exportCompareCsv(delta)
    addToast({ type: 'success', title: 'Comparativo CSV exportado' })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted">Carregando comparativo...</div>
  }

  if (!delta || !closingA || !closingB) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <BarChart3 className="h-12 w-12 text-muted" />
        <h2 className="text-lg font-medium text-foreground">Selecione 2 fechamentos para comparar</h2>
        <Button variant="outline" onClick={() => navigate('/governance/closings')}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
      </div>
    )
  }

  const kpiRows = [
    { label: 'Total Ações', value: delta.kpi_deltas.total_actions },
    { label: 'Concluídas', value: delta.kpi_deltas.done },
    { label: 'Em Andamento', value: delta.kpi_deltas.in_progress },
    { label: 'Atrasadas', value: delta.kpi_deltas.overdue },
    { label: 'Não Iniciadas', value: delta.kpi_deltas.not_started },
    { label: 'Canceladas', value: delta.kpi_deltas.cancelled },
    { label: 'Progresso Médio', value: delta.kpi_deltas.avg_progress, suffix: '%' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/governance/closings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Comparativo</h1>
            <p className="text-sm text-muted mt-0.5">
              {closingA.period} ({closingA.area_name ?? 'Todas'}) vs {closingB.period} ({closingB.area_name ?? 'Todas'})
            </p>
          </div>
        </div>
        <Button size="sm" onClick={handleExport}>
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      {/* KPI Deltas */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Variação de KPIs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border bg-accent/30">
                <th className="px-4 py-2 text-left font-medium text-muted">Métrica</th>
                <th className="px-4 py-2 text-right font-medium text-muted">{closingA.period} (A)</th>
                <th className="px-4 py-2 text-right font-medium text-muted">{closingB.period} (B)</th>
                <th className="px-4 py-2 text-right font-medium text-muted">Delta</th>
              </tr>
            </thead>
            <tbody>
              {kpiRows.map((row) => {
                const keyA = row.label === 'Total Ações' ? closingA.kpis.total_actions
                  : row.label === 'Concluídas' ? closingA.kpis.done
                  : row.label === 'Em Andamento' ? closingA.kpis.in_progress
                  : row.label === 'Atrasadas' ? closingA.kpis.overdue
                  : row.label === 'Não Iniciadas' ? closingA.kpis.not_started
                  : row.label === 'Canceladas' ? closingA.kpis.cancelled
                  : closingA.kpis.avg_progress

                const keyB = row.label === 'Total Ações' ? closingB.kpis.total_actions
                  : row.label === 'Concluídas' ? closingB.kpis.done
                  : row.label === 'Em Andamento' ? closingB.kpis.in_progress
                  : row.label === 'Atrasadas' ? closingB.kpis.overdue
                  : row.label === 'Não Iniciadas' ? closingB.kpis.not_started
                  : row.label === 'Canceladas' ? closingB.kpis.cancelled
                  : closingB.kpis.avg_progress

                return (
                  <tr key={row.label} className="border-b border-border hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-foreground">{row.label}</td>
                    <td className="px-4 py-2.5 text-right text-muted">{keyA}{row.suffix ?? ''}</td>
                    <td className="px-4 py-2.5 text-right text-muted">{keyB}{row.suffix ?? ''}</td>
                    <td className="px-4 py-2.5 text-right">
                      <DeltaBadge value={row.value} suffix={row.suffix} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Status Distribution Changes */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Mudanças na Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border bg-accent/30">
                <th className="px-4 py-2 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-2 text-right font-medium text-muted">{closingA.period}</th>
                <th className="px-4 py-2 text-right font-medium text-muted">{closingB.period}</th>
                <th className="px-4 py-2 text-right font-medium text-muted">Delta</th>
              </tr>
            </thead>
            <tbody>
              {delta.status_changes.map((s) => (
                <tr key={s.status} className="border-b border-border hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-2 text-foreground capitalize">{s.status.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-2 text-right text-muted">{s.count_a}</td>
                  <td className="px-4 py-2 text-right text-muted">{s.count_b}</td>
                  <td className="px-4 py-2 text-right"><DeltaBadge value={s.delta} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* New/Removed Actions Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <TrendingUp className="h-5 w-5 text-success-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{delta.new_actions.length}</p>
            <p className="text-xs text-muted">Novas ações em {closingB.period}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <TrendingDown className="h-5 w-5 text-danger-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{delta.removed_actions.length}</p>
            <p className="text-xs text-muted">Ações removidas desde {closingA.period}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

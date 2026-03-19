/**
 * Closing Details Page — Detalhe do fechamento com KPIs, tabela de ações, audit trail
 */

import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useClosingDetail, useClosingActions, useAuditTrail } from '../hooks'
import { exportClosingCsv } from '../export'
import { exportClosingToPDF } from '@/shared/lib/pdf/exportClosings'
import { CLOSING_STATUS_LABELS, CLOSING_STATUS_COLORS } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { useToast } from '@/shared/ui/Toast'
import { cn } from '@/shared/lib/cn'
import {
  ArrowLeft,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  FileText,
  History,
  Target,
  Users,
  Search,
} from '@/shared/ui/icons'

const PAGE_SIZE = 15

export function ClosingDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { closing, loading, refresh } = useClosingDetail(id ?? null)
  const { finalize } = useClosingActions()
  const { events: auditEvents } = useAuditTrail(id ?? null)

  const [actionSearch, setActionSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<'title' | 'status' | 'progress' | 'due_date'>('title')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filteredActions = useMemo(() => {
    if (!closing) return []
    let result = [...closing.actions]
    if (actionSearch) {
      const s = actionSearch.toLowerCase()
      result = result.filter(
        (a) => a.title.toLowerCase().includes(s) || a.responsible.toLowerCase().includes(s)
      )
    }
    result.sort((a, b) => {
      const aVal = a[sortField] ?? ''
      const bVal = b[sortField] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [closing, actionSearch, sortField, sortDir])

  const totalPages = Math.ceil(filteredActions.length / PAGE_SIZE)
  const pagedActions = filteredActions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const handleExport = () => {
    if (!closing) return
    exportClosingCsv(closing)
    addToast({ type: 'success', title: 'CSV exportado', message: closing.period })
  }

  const handleExportPDF = async () => {
    if (!closing) return
    try {
      await exportClosingToPDF(closing)
      addToast({ type: 'success', title: 'PDF exportado', message: closing.period })
    } catch {
      addToast({ type: 'error', title: 'Erro ao exportar PDF' })
    }
  }

  const handleFinalize = async () => {
    if (!closing) return
    await finalize(closing.id)
    addToast({ type: 'success', title: 'Fechamento finalizado' })
    refresh()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted">Carregando...</div>
  }

  if (!closing) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <FileText className="h-12 w-12 text-muted" />
        <h2 className="text-lg font-medium text-foreground">Fechamento não encontrado</h2>
        <Button variant="outline" onClick={() => navigate('/governance/closings')}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/governance/closings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Fechamento {closing.period}</h1>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', CLOSING_STATUS_COLORS[closing.status])}>
                {CLOSING_STATUS_LABELS[closing.status]}
              </span>
            </div>
            <p className="text-sm text-muted mt-0.5">
              {closing.area_name ?? 'Todas as áreas'} • Criado em {new Date(closing.created_at).toLocaleDateString('pt-BR')} por {closing.created_by}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {closing.status === 'draft' && (
            <Button variant="outline" size="sm" onClick={handleFinalize}>
              <CheckCircle className="h-4 w-4" /> Finalizar
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4" /> PDF
          </Button>
          <Button size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" /> CSV
          </Button>
        </div>
      </div>

      {/* Notes */}
      {closing.notes && (
        <Card>
          <CardContent className="py-3">
            <p className="text-sm text-muted">{closing.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total', value: closing.kpis.total_actions, icon: BarChart3, color: 'text-primary-500' },
          { label: 'Concluídas', value: closing.kpis.done, icon: CheckCircle, color: 'text-success-500' },
          { label: 'Em Andamento', value: closing.kpis.in_progress, icon: Clock, color: 'text-info-500' },
          { label: 'Atrasadas', value: closing.kpis.overdue, icon: AlertTriangle, color: 'text-danger-500' },
          { label: 'Não Iniciadas', value: closing.kpis.not_started, icon: Target, color: 'text-muted' },
          { label: 'Canceladas', value: closing.kpis.cancelled, icon: FileText, color: 'text-warning-500' },
          { label: 'Progresso', value: `${closing.kpis.avg_progress}%`, icon: BarChart3, color: 'text-primary-500' },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label}>
              <CardContent className="py-3 text-center">
                <Icon className={cn('h-4 w-4 mx-auto mb-1', kpi.color)} />
                <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-[11px] text-muted">{kpi.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {closing.status_distribution.map((s) => (
              <div key={s.status} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-sm text-foreground capitalize">{s.status.replace(/_/g, ' ')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${s.percentage}%` }} />
                  </div>
                  <span className="text-xs text-muted w-12 text-right">{s.count} ({s.percentage}%)</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Distribuição por Programa</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {closing.program_distribution.map((p) => (
              <div key={p.program} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-sm text-foreground">{p.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-info-500 rounded-full" style={{ width: `${p.percentage}%` }} />
                  </div>
                  <span className="text-xs text-muted w-12 text-right">{p.count} ({p.percentage}%)</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actions Table */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Ações do Snapshot ({filteredActions.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Buscar ações..."
                value={actionSearch}
                onChange={(e) => { setActionSearch(e.target.value); setCurrentPage(1) }}
                className="w-full pl-9 pr-3 py-1.5 border border-border rounded-md bg-surface text-foreground text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-border bg-accent/30">
                  {[
                    { key: 'title' as const, label: 'Título' },
                    { key: 'status' as const, label: 'Status' },
                    { key: 'progress' as const, label: 'Progresso' },
                    { key: 'due_date' as const, label: 'Vencimento' },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="px-3 py-2 text-left font-medium text-muted cursor-pointer hover:text-foreground"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label} {sortField === col.key && (sortDir === 'asc' ? '↑' : '↓')}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left font-medium text-muted">Responsável</th>
                  <th className="px-3 py-2 text-left font-medium text-muted">Área</th>
                </tr>
              </thead>
              <tbody>
                {pagedActions.map((a) => (
                  <tr key={a.action_id} className="border-b border-border hover:bg-accent/30 transition-colors">
                    <td className="px-3 py-2 text-foreground max-w-[250px] truncate">{a.title}</td>
                    <td className="px-3 py-2">
                      <span className="capitalize text-xs">{a.status.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-accent rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${a.progress}%` }} />
                        </div>
                        <span className="text-xs text-muted">{a.progress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-muted">{a.due_date ? new Date(a.due_date).toLocaleDateString('pt-BR') : '—'}</td>
                    <td className="px-3 py-2 text-xs text-foreground">{a.responsible}</td>
                    <td className="px-3 py-2 text-xs text-muted">{a.area_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-border">
              <span className="text-xs text-muted">
                Mostrando {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredActions.length)} de {filteredActions.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs rounded-md text-muted hover:text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
                >
                  Anterior
                </button>
                <span className="text-xs text-muted px-2">{currentPage}/{totalPages}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs rounded-md text-muted hover:text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="h-4 w-4" />
            Trilha de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          {auditEvents.length === 0 ? (
            <p className="text-sm text-muted py-4 text-center">Nenhum evento registrado</p>
          ) : (
            <div className="space-y-2">
              {auditEvents.map((evt) => (
                <div key={evt.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">{evt.target}</span>
                      <span className="text-[11px] text-muted flex-shrink-0">
                        {new Date(evt.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{evt.details}</p>
                    <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                      <Users className="h-3 w-3" /> {evt.user} • {evt.action.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

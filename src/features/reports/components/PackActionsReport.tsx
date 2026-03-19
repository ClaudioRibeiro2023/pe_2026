import { useState, useMemo } from 'react'
import { Search, Filter } from '@/shared/ui/icons'
import { Badge } from '@/shared/ui/Badge'
import { Progress } from '@/shared/ui/Progress'
import { DataTable, type DataTableColumn } from '@/shared/ui/DataTable'
import { ExportButtons } from '@/shared/components/export/ExportButtons'
import { useExport } from '@/shared/lib/export'
import { useToast } from '@/shared/ui/Toast'
import type { PlanAction, ActionStatus } from '@/features/area-plans/types'
import type { FilterSummary } from '../types'

interface PackActionsReportProps {
  actions: PlanAction[]
  areaName: string
  filters?: FilterSummary
}

const STATUS_BADGE: Record<ActionStatus, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' }> = {
  PENDENTE: { label: 'Pendente', variant: 'default' },
  EM_ANDAMENTO: { label: 'Em Andamento', variant: 'primary' },
  BLOQUEADA: { label: 'Bloqueada', variant: 'danger' },
  AGUARDANDO_EVIDENCIA: { label: 'Aguard. Evid.', variant: 'warning' },
  EM_VALIDACAO: { label: 'Validacao', variant: 'info' },
  CONCLUIDA: { label: 'Concluida', variant: 'success' },
  CANCELADA: { label: 'Cancelada', variant: 'default' },
}

const FILTER_TABS: { label: string; value: ActionStatus | 'ALL' }[] = [
  { label: 'Todas', value: 'ALL' },
  { label: 'Pendentes', value: 'PENDENTE' },
  { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
  { label: 'Concluidas', value: 'CONCLUIDA' },
  { label: 'Atrasadas', value: 'BLOQUEADA' },
]

const TODAY = new Date().toISOString().split('T')[0]

const actionColumns: DataTableColumn<PlanAction>[] = [
  {
    key: 'title',
    header: 'Titulo',
    sortable: true,
    render: (row) => (
      <div className="min-w-0">
        <span className="text-sm font-medium text-foreground truncate block">{row.title}</span>
        {row.responsible && <span className="text-xs text-muted">{row.responsible}</span>}
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    align: 'center',
    render: (row) => {
      const badge = STATUS_BADGE[row.status]
      const isOverdue = row.due_date && row.due_date < TODAY && row.status !== 'CONCLUIDA' && row.status !== 'CANCELADA'
      return (
        <div className="flex flex-col items-center gap-1">
          <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
          {isOverdue && <Badge variant="danger" size="sm" pulse>Atrasada</Badge>}
        </div>
      )
    },
  },
  {
    key: 'priority',
    header: 'Pri',
    sortable: true,
    align: 'center',
    className: 'min-w-[50px]',
    render: (row) => <span className="text-xs text-muted font-mono">{row.priority}</span>,
  },
  {
    key: 'progress',
    header: 'Progresso',
    sortable: true,
    align: 'center',
    className: 'min-w-[120px]',
    render: (row) => (
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted">Prog.</span>
          <span className="font-medium text-foreground">{row.progress}%</span>
        </div>
        <Progress value={row.progress} size="sm" />
      </div>
    ),
  },
  {
    key: 'due_date',
    header: 'Prazo',
    sortable: true,
    align: 'center',
    className: 'min-w-[100px]',
    render: (row) => {
      const isOverdue = row.due_date && row.due_date < TODAY && row.status !== 'CONCLUIDA' && row.status !== 'CANCELADA'
      return <span className={`text-xs ${isOverdue ? 'text-danger-600 font-medium' : 'text-muted'}`}>{row.due_date || '-'}</span>
    },
  },
  {
    key: 'program_key',
    header: 'Programa',
    sortable: true,
    align: 'center',
    className: 'min-w-[80px]',
    render: (row) => <span className="text-xs text-muted font-mono">{row.program_key || '-'}</span>,
  },
]

export function PackActionsReport({ actions, areaName, filters }: PackActionsReportProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ActionStatus | 'ALL'>('ALL')
  const { exportData, exportReportToPDF } = useExport<Record<string, string>>()
  const { addToast } = useToast()

  const toastSuccess = () => addToast({ type: 'success', title: 'Exportado com sucesso' })
  const toastError = (msg: string) => addToast({ type: 'error', title: 'Erro ao exportar', message: msg })

  const filtered = useMemo(() => {
    let result = [...actions]
    if (statusFilter !== 'ALL') {
      result = result.filter(a => a.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.responsible?.toLowerCase().includes(q)
      )
    }
    return result.sort((a, b) => {
      const pri = { P0: 0, P1: 1, P2: 2 }
      return (pri[a.priority] ?? 9) - (pri[b.priority] ?? 9)
    })
  }, [actions, statusFilter, search])

  const exportRows = filtered.map(a => ({
    id: a.id,
    titulo: a.title,
    status: STATUS_BADGE[a.status]?.label || a.status,
    prioridade: a.priority,
    progresso: `${a.progress}%`,
    responsavel: a.responsible || '-',
    inicio: a.start_date || '-',
    prazo: a.due_date || '-',
    programa: a.program_key || '-',
  }))

  const exportColumns = [
    { header: 'ID', dataKey: 'id' as const },
    { header: 'Titulo', dataKey: 'titulo' as const },
    { header: 'Status', dataKey: 'status' as const },
    { header: 'Prioridade', dataKey: 'prioridade' as const },
    { header: 'Progresso', dataKey: 'progresso' as const },
    { header: 'Responsavel', dataKey: 'responsavel' as const },
    { header: 'Inicio', dataKey: 'inicio' as const },
    { header: 'Prazo', dataKey: 'prazo' as const },
    { header: 'Programa', dataKey: 'programa' as const },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Acoes por Pack</h3>
          <p className="text-sm text-muted">{areaName} - {filtered.length} de {actions.length} acoes</p>
        </div>
        <ExportButtons
          onExportPDF={async () => {
            try {
              await exportReportToPDF({
                title: 'Relatorios',
                reportType: `Acoes por Pack - ${areaName}`,
                filters: filters ? [
                  { label: 'Area', value: filters.area },
                  { label: 'Pack', value: filters.pack },
                  { label: 'Periodo', value: `${filters.periodStart} a ${filters.periodEnd}` },
                ] : [],
                sections: [{
                  title: `Acoes (${filtered.length})`,
                  data: exportRows,
                  columns: exportColumns.map(c => ({ header: c.header, dataKey: c.dataKey as string })),
                }],
              })
              toastSuccess()
            } catch (e) { toastError(e instanceof Error ? e.message : 'Erro') }
          }}
          onExportExcel={() => exportData(exportRows, exportColumns, `Acoes ${areaName}`, 'excel', toastSuccess, toastError)}
          disabled={filtered.length === 0}
        />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar por titulo, descricao ou responsavel..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="h-4 w-4 text-muted mr-1" />
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                statusFilter === tab.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface text-muted border border-border hover:bg-accent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions DataTable */}
      <DataTable<PlanAction>
        columns={actionColumns}
        rows={filtered}
        rowKey="id"
        pageSizeOptions={[10, 25, 50]}
        emptyState={
          <div className="py-12 text-center text-muted text-sm">
            Nenhuma acao encontrada com os filtros atuais.
          </div>
        }
      />
    </div>
  )
}

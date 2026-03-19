import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Building2,
  Search,
} from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageLoader } from '@/shared/ui/Loader'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { FilterBar } from '@/shared/ui/FilterBar'
import { DataTable, type DataTableColumn } from '@/shared/ui/DataTable'
import { Badge } from '@/shared/ui/Badge'
import { useQuery } from '@tanstack/react-query'
import { fetchAreaPlanProgress } from '../api'
import type { AreaPlanProgress } from '../types'

export function AreaPlansDashboard() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: planProgress = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['area-plan-progress', currentYear],
    queryFn: () => fetchAreaPlanProgress(currentYear),
  })

  const stats = useMemo(() => {
    if (!planProgress.length) return null

    const totalPlans = planProgress.length
    const totalActions = planProgress.reduce((sum, p) => sum + p.total_actions, 0)
    const completedActions = planProgress.reduce((sum, p) => sum + p.completed_actions, 0)
    const overdueActions = planProgress.reduce((sum, p) => sum + p.overdue_actions, 0)
    const awaitingEvidence = planProgress.reduce((sum, p) => sum + p.awaiting_evidence, 0)
    const inValidation = planProgress.reduce((sum, p) => sum + p.in_validation, 0)
    const avgCompletion =
      planProgress.reduce((sum, p) => sum + p.completion_percentage, 0) / totalPlans

    return {
      totalPlans,
      totalActions,
      completedActions,
      overdueActions,
      awaitingEvidence,
      inValidation,
      avgCompletion: Math.round(avgCompletion),
      completionRate: totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0,
    }
  }, [planProgress])

  if (isLoading) {
    return <PageLoader text="Carregando dashboard..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar dashboard"
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    )
  }

  if (!planProgress.length) {
    return (
      <EmptyState
        title="Sem planos de ação"
        description="Nenhum plano de ação por área foi encontrado para o ano atual."
        action={
          <Button onClick={() => navigate('/planning')}>
            Criar primeiro plano
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard de Planos por Área</h1>
          <p className="text-muted mt-1">
            Visão executiva dos planos de ação por área - {currentYear}
          </p>
        </div>
        <Button onClick={() => navigate('/planning')}>
          <Building2 className="h-4 w-4" />
          Ver todos os planos
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Planos Ativos</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalPlans}</p>
                </div>
                <Target className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold text-success-600">{stats.completionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Ações Concluídas</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.completedActions}/{stats.totalActions}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-success-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Em Atraso</p>
                  <p className="text-2xl font-bold text-danger-600">{stats.overdueActions}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-danger-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FilterBar */}
      <FilterBar>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar area..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-9 pr-3 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Buscar area"
          />
        </div>
      </FilterBar>

      {/* Progress by Area — DataTable */}
      <AreaProgressTable
        data={planProgress}
        searchQuery={searchQuery}
        onRowClick={(slug: string) => navigate(`/planning/${slug}/dashboard`)}
      />

      {/* Alerts Section */}
      {stats && (stats.overdueActions > 0 || stats.awaitingEvidence > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.overdueActions > 0 && (
            <Card className="border-danger-200 bg-danger-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-danger-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-danger-700">Ações em Atraso</h4>
                    <p className="text-sm text-danger-600 mt-1">
                      {stats.overdueActions} ações estão com prazo vencido e precisam de atenção.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 border-danger-300 text-danger-700 hover:bg-danger-100"
                      onClick={() => navigate('/planning?filter=overdue')}
                    >
                      Ver ações atrasadas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {stats.awaitingEvidence > 0 && (
            <Card className="border-warning-200 bg-warning-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-warning-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-warning-700">Aguardando Evidência</h4>
                    <p className="text-sm text-warning-600 mt-1">
                      {stats.awaitingEvidence} ações aguardam envio de evidências.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 border-warning-300 text-warning-700 hover:bg-warning-100"
                      onClick={() => navigate('/planning?filter=awaiting')}
                    >
                      Ver ações pendentes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

/* ---- Sub-component: DataTable for area progress ---- */

interface AreaProgressTableProps {
  data: AreaPlanProgress[]
  searchQuery: string
  onRowClick: (slug: string) => void
}

const areaColumns: DataTableColumn<AreaPlanProgress>[] = [
  {
    key: 'area_name',
    header: 'Area',
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-primary-600 flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{row.area_name}</p>
          <p className="text-xs text-muted truncate">{row.plan_title}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'total_actions',
    header: 'Acoes',
    sortable: true,
    align: 'center',
    className: 'min-w-[80px]',
  },
  {
    key: 'completed_actions',
    header: 'Concluidas',
    sortable: true,
    align: 'center',
    className: 'min-w-[100px]',
    render: (row) => <span className="text-success-600 font-medium">{row.completed_actions}</span>,
  },
  {
    key: 'overdue_actions',
    header: 'Atrasadas',
    sortable: true,
    align: 'center',
    className: 'min-w-[100px]',
    render: (row) =>
      row.overdue_actions > 0 ? (
        <span className="text-danger-600 font-medium">{row.overdue_actions}</span>
      ) : (
        <span className="text-muted">0</span>
      ),
  },
  {
    key: 'completion_percentage',
    header: 'Progresso',
    sortable: true,
    align: 'center',
    className: 'min-w-[140px]',
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              row.completion_percentage >= 80
                ? 'bg-success-500'
                : row.completion_percentage >= 50
                ? 'bg-primary-500'
                : row.completion_percentage >= 25
                ? 'bg-warning-500'
                : 'bg-danger-500'
            }`}
            style={{ width: `${row.completion_percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-foreground w-8 text-right">{row.completion_percentage}%</span>
      </div>
    ),
  },
  {
    key: 'plan_status',
    header: 'Status',
    sortable: true,
    align: 'center',
    render: (row) => {
      const variant = row.plan_status === 'ATIVO' ? 'success' as const : row.plan_status === 'EM_APROVACAO' ? 'warning' as const : row.plan_status === 'CONCLUIDO' ? 'primary' as const : 'default' as const
      return <Badge variant={variant} size="sm">{String(row.plan_status).replace(/_/g, ' ')}</Badge>
    },
  },
]

function AreaProgressTable({ data, searchQuery, onRowClick }: AreaProgressTableProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return data
    const q = searchQuery.toLowerCase()
    return data.filter(
      (p) =>
        p.area_name.toLowerCase().includes(q) ||
        p.plan_title.toLowerCase().includes(q),
    )
  }, [data, searchQuery])

  return (
    <div
      className="cursor-pointer"
      onClick={(e) => {
        const target = e.target as HTMLElement
        const row = target.closest('tr')
        if (!row || row.closest('thead')) return
        const idx = Array.from(row.parentElement?.children ?? []).indexOf(row)
        if (idx >= 0 && idx < filtered.length) {
          onRowClick(filtered[idx].area_slug)
        }
      }}
    >
      <DataTable<AreaPlanProgress>
        columns={areaColumns}
        rows={filtered}
        rowKey="plan_id"
        emptyState={
          <div className="py-12 text-center text-muted text-sm">
            Nenhuma area encontrada.
          </div>
        }
      />
    </div>
  )
}

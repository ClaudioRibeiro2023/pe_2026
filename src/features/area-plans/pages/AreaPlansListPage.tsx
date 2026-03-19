import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  LayoutGrid, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  FileCheck,
  Building2,
  ChevronRight,
  Plus,
  X,
  Search
} from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { PageLoader } from '@/shared/ui/Loader'
import { PageHeader } from '@/shared/ui/PageHeader'
import type { Crumb } from '@/shared/ui/Breadcrumbs'
import { FilterBar } from '@/shared/ui/FilterBar'
import { DataTable, type DataTableColumn } from '@/shared/ui/DataTable'
import { useAreaPlans, useAreaPlanProgress, useEvidenceBacklog, useActionsByPackId } from '../hooks'
import { PlanStatusBadge } from '../components/StatusBadge'
import { ProgressBar } from '../components/ProgressBar'
import { UnifiedPlanWizard } from '../components/UnifiedPlanWizard'
import type { AreaPlanProgress, PlanAction, ActionStatus } from '../types'
import { EvidenceBacklogList } from '../components/ApprovalPanel'
import { useAuth } from '@/features/auth/AuthProvider'

interface AreaPlansListPageProps {
  areaSlugFilter?: string | null
  packIdFilter?: string | null
}

const STATUS_VARIANT: Record<ActionStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  PENDENTE: 'default',
  EM_ANDAMENTO: 'primary',
  BLOQUEADA: 'danger',
  AGUARDANDO_EVIDENCIA: 'warning',
  EM_VALIDACAO: 'info',
  CONCLUIDA: 'success',
  CANCELADA: 'default',
}

const packActionColumns: DataTableColumn<PlanAction>[] = [
  {
    key: 'title',
    header: 'Titulo',
    sortable: true,
    render: (row) => (
      <div className="min-w-0">
        <p className="font-medium text-foreground truncate">{row.title}</p>
        <p className="text-xs text-muted truncate">{row.description || 'Sem descricao'}</p>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    align: 'center',
    render: (row) => (
      <Badge variant={STATUS_VARIANT[row.status]} size="sm">
        {row.status.replace(/_/g, ' ')}
      </Badge>
    ),
  },
  {
    key: 'progress',
    header: 'Progresso',
    sortable: true,
    align: 'center',
    className: 'min-w-[80px]',
    render: (row) => <span className="text-sm font-medium text-foreground">{row.progress}%</span>,
  },
  {
    key: 'responsible',
    header: 'Responsavel',
    sortable: true,
    render: (row) => <span className="text-sm text-muted">{row.responsible || '-'}</span>,
  },
  {
    key: 'due_date',
    header: 'Prazo',
    sortable: true,
    align: 'center',
    render: (row) => <span className="text-xs text-muted">{row.due_date || '-'}</span>,
  },
]

export function AreaPlansListPage({ areaSlugFilter, packIdFilter }: AreaPlansListPageProps = {}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentYear = new Date().getFullYear()
  const [selectedYear] = useState(currentYear)
  const [showCreateWizard, setShowCreateWizard] = useState(false)
  const [activeTab, setActiveTab] = useState<'plans' | 'evidences'>('plans')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'evidences') {
      setActiveTab('evidences')
    }
  }, [searchParams])

  const { user } = useAuth()
  const { isLoading: plansLoading } = useAreaPlans(selectedYear)
  const { data: progress, isLoading: progressLoading } = useAreaPlanProgress(selectedYear)
  const { data: evidenceBacklog = [], isLoading: backlogLoading } = useEvidenceBacklog()
  const { data: packActions = [], isLoading: packActionsLoading } = useActionsByPackId(packIdFilter || undefined)

  const userRole = user?.profile?.role || 'colaborador'
  const canViewBacklog = userRole === 'admin' || userRole === 'gestor' || userRole === 'direcao'

  const mappedBacklog = evidenceBacklog.map((item) => ({
    evidence_id: item.evidence_id,
    action_id: item.action_id,
    action_title: item.action_title,
    area_name: item.area_name,
    filename: item.filename,
    status: item.evidence_status,
    submitted_at: item.submitted_at,
    submitted_by_email: item.submitted_by || '',
  }))

  const isLoading = plansLoading || progressLoading || (activeTab === 'evidences' && backlogLoading) || packActionsLoading

  // Filtra por área se areaSlugFilter estiver definido
  const filteredProgress = areaSlugFilter
    ? progress?.filter((p) => p.area_slug === areaSlugFilter)
    : progress

  const stats = filteredProgress?.reduce(
    (acc, p) => ({
      totalActions: acc.totalActions + p.total_actions,
      completedActions: acc.completedActions + p.completed_actions,
      overdueActions: acc.overdueActions + p.overdue_actions,
      awaitingEvidence: acc.awaitingEvidence + p.awaiting_evidence,
      inValidation: acc.inValidation + p.in_validation,
      totalCostEstimate: acc.totalCostEstimate + p.total_cost_estimate,
      totalCostActual: acc.totalCostActual + p.total_cost_actual,
    }),
    {
      totalActions: 0,
      completedActions: 0,
      overdueActions: 0,
      awaitingEvidence: 0,
      inValidation: 0,
      totalCostEstimate: 0,
      totalCostActual: 0,
    }
  ) || {
    totalActions: 0,
    completedActions: 0,
    overdueActions: 0,
    awaitingEvidence: 0,
    inValidation: 0,
    totalCostEstimate: 0,
    totalCostActual: 0,
  }

  const overallProgress = stats.totalActions > 0 
    ? Math.round((stats.completedActions / stats.totalActions) * 100) 
    : 0

  const handleAreaClick = (areaSlug: string) => {
    navigate(`/planning/${areaSlug}/dashboard`)
  }

  if (isLoading) {
    return <PageLoader text="Carregando planos de área..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planos de Ação"
        description={packIdFilter
          ? 'Ações do Strategic Pack filtradas'
          : `Visão consolidada dos planos de ação de todas as áreas - ${selectedYear}`
        }
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Planejamento', href: '/planning' },
          { label: 'Gerenciar Ações' },
        ] as Crumb[]}
        actions={
          <Button onClick={() => setShowCreateWizard(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        }
      />

      {/* FilterBar */}
      <FilterBar
        actions={
          <div className="flex items-center gap-2">
            {areaSlugFilter && (
              <Badge variant="info" size="md">
                Area: {areaSlugFilter}
                <button
                  onClick={() => navigate('/planning/actions/manage')}
                  className="ml-1 hover:text-info-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {packIdFilter && (
              <Badge variant="primary" size="md">
                Pack: {packIdFilter.substring(0, 8)}...
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)
                    params.delete('packId')
                    navigate(`/planning/actions/manage?${params.toString()}`)
                  }}
                  className="ml-1 hover:text-primary-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        }
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Buscar por area ou plano..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-9 pr-3 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Buscar acoes"
          />
        </div>
      </FilterBar>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-muted">Progresso Geral</p>
                <p className="text-2xl font-bold text-foreground">{overallProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success-100 dark:bg-success-200/20 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-muted">Ações Concluídas</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.completedActions}/{stats.totalActions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-danger-100 dark:bg-danger-100/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-danger-600" />
              </div>
              <div>
                <p className="text-sm text-muted">Ações Atrasadas</p>
                <p className="text-2xl font-bold text-danger-600">{stats.overdueActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning-100 dark:bg-warning-100/20 rounded-lg">
                <FileCheck className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="text-sm text-muted">Aguardando Aprovação</p>
                <p className="text-2xl font-bold text-warning-600">
                  {stats.awaitingEvidence + stats.inValidation}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'plans'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          Planos por Área
        </button>
        {canViewBacklog && (
          <button
            onClick={() => setActiveTab('evidences')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'evidences'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            Backlog de Evidências
            {evidenceBacklog.length > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-warning-100 text-warning-700 dark:bg-warning-100/20 dark:text-warning-500">
                {evidenceBacklog.length}
              </span>
            )}
          </button>
        )}
      </div>

      {activeTab === 'plans' && packIdFilter && packActions.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Ações do Strategic Pack ({packActions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable<PlanAction>
            columns={packActionColumns}
            rows={packActions}
            rowKey="id"
            pageSizeOptions={[10, 25, 50]}
          />
        </CardContent>
      </Card>
      )}

      {activeTab === 'plans' && !packIdFilter && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Planos por Área
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProgress && filteredProgress.length > 0 ? (
            <div className="space-y-3">
              {filteredProgress
                .sort((a, b) => b.completion_percentage - a.completion_percentage)
                .map((areaProgress: AreaPlanProgress) => (
                  <div
                    key={areaProgress.plan_id}
                    onClick={() => handleAreaClick(areaProgress.area_slug)}
                    className="p-4 border border-border rounded-lg hover:border-primary-300 hover:bg-accent/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {areaProgress.area_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{areaProgress.area_name}</h3>
                          <p className="text-sm text-muted">{areaProgress.plan_title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <PlanStatusBadge status={areaProgress.plan_status} />
                        <ChevronRight className="w-5 h-5 text-muted" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted">Total</p>
                        <p className="font-semibold">{areaProgress.total_actions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Concluídas</p>
                        <p className="font-semibold text-success-600">{areaProgress.completed_actions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Pendentes</p>
                        <p className="font-semibold text-primary-600">{areaProgress.pending_actions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Atrasadas</p>
                        <p className="font-semibold text-danger-600">{areaProgress.overdue_actions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Evidências</p>
                        <p className="font-semibold text-warning-600">
                          {areaProgress.awaiting_evidence + areaProgress.in_validation}
                        </p>
                      </div>
                    </div>

                    <ProgressBar value={areaProgress.completion_percentage} size="sm" />
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <LayoutGrid className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum plano encontrado</h3>
              <p className="text-muted mb-4">
                Não há planos de ação cadastrados para {selectedYear}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {activeTab === 'evidences' && canViewBacklog && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Backlog de Evidências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EvidenceBacklogList
              evidences={mappedBacklog}
              userRole={userRole as 'admin' | 'gestor' | 'direcao'}
              onSelectEvidence={(id) => navigate(`/planning/actions/approvals?evidence=${id}`)}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === 'plans' && stats.totalCostEstimate > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Orçamento Consolidado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted mb-1">Estimado</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalCostEstimate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Realizado</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalCostActual)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted mb-1">Variação</p>
                <p className={`text-2xl font-bold ${stats.totalCostActual > stats.totalCostEstimate ? 'text-danger-600' : 'text-success-600'}`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalCostActual - stats.totalCostEstimate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unified Plan Creation Wizard */}
      <UnifiedPlanWizard
        open={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        year={selectedYear}
      />
    </div>
  )
}

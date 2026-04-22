import { useState, useEffect, useMemo } from 'react'
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
import { Modal } from '@/shared/ui/Modal'
import { PageLoader } from '@/shared/ui/Loader'
import { PageHeader } from '@/shared/ui/PageHeader'
import type { Crumb } from '@/shared/ui/Breadcrumbs'
import { FilterBar } from '@/shared/ui/FilterBar'
import { DataTable, type DataTableColumn } from '@/shared/ui/DataTable'
import { useAreaPlans, useAreaPlanProgress, useEvidenceBacklog, useActionsByPackId, useAction, useSubtasks } from '../hooks'
import { PlanStatusBadge, ActionStatusBadge, PriorityBadge } from '../components/StatusBadge'
import { ProgressBar } from '../components/ProgressBar'
import { UnifiedPlanWizard } from '../components/UnifiedPlanWizard'
import type { AreaPlanProgress, PlanAction, ActionStatus } from '../types'
import { EvidenceBacklogList } from '../components/ApprovalPanel'
import { ActionTreeView } from '../components/ActionTreeView'
import { ActionCard } from '../components/ActionCard'
import { SubtaskList } from '../components/SubtaskList'
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

function computePackHierarchyStats(actions: PlanAction[]) {
  const byId = new Map(actions.map((action) => [action.id, action]))
  const roots = actions.filter((action) => !action.parent_action_id || !byId.has(action.parent_action_id))
  const children = actions.filter((action) => action.parent_action_id && byId.has(action.parent_action_id))
  const leafNodes = actions.filter((action) => action.node_type === 'acao')

  const depthCache = new Map<string, number>()
  const getDepth = (action: PlanAction, trail = new Set<string>()): number => {
    if (depthCache.has(action.id)) return depthCache.get(action.id)!
    if (!action.parent_action_id || !byId.has(action.parent_action_id) || trail.has(action.id)) {
      depthCache.set(action.id, 1)
      return 1
    }

    const parent = byId.get(action.parent_action_id)
    if (!parent) {
      depthCache.set(action.id, 1)
      return 1
    }

    const nextTrail = new Set(trail)
    nextTrail.add(action.id)
    const depth = getDepth(parent, nextTrail) + 1
    depthCache.set(action.id, depth)
    return depth
  }

  const maxDepth = actions.length > 0 ? Math.max(...actions.map((action) => getDepth(action))) : 0

  return {
    total: actions.length,
    roots: roots.length,
    children: children.length,
    leafNodes: leafNodes.length,
    maxDepth,
  }
}

function buildPackActionColumns(onInspect: (action: PlanAction) => void): DataTableColumn<PlanAction>[] {
  return [
    {
      key: 'title',
      header: 'Titulo',
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{row.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={row.priority} />
            <Badge variant={row.parent_action_id ? 'info' : 'default'} size="sm">
              {row.parent_action_id ? 'Subação' : 'Raiz'}
            </Badge>
          </div>
          <p className="text-xs text-muted truncate mt-1">{row.description || 'Sem descricao'}</p>
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
    {
      key: 'details',
      header: 'Abrir',
      align: 'center',
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => onInspect(row)}>
          Detalhar
        </Button>
      ),
    },
  ]
}

export function AreaPlansListPage({ areaSlugFilter, packIdFilter }: AreaPlansListPageProps = {}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentYear = new Date().getFullYear()
  const [selectedYear] = useState(currentYear)
  const [showCreateWizard, setShowCreateWizard] = useState(false)
  const [activeTab, setActiveTab] = useState<'plans' | 'evidences'>('plans')
  const [searchQuery, setSearchQuery] = useState('')
  const [packViewMode, setPackViewMode] = useState<'tree' | 'table'>(packIdFilter ? 'tree' : 'table')
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null)

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
  const { data: selectedAction, isLoading: selectedActionLoading } = useAction(selectedActionId || '')
  const { data: selectedSubtasks = [] } = useSubtasks(selectedActionId || '')

  useEffect(() => {
    if (packIdFilter) {
      setPackViewMode('tree')
    }
  }, [packIdFilter])

  useEffect(() => {
    setSelectedActionId(null)
  }, [packIdFilter])

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  const selectedPackAction = useMemo(
    () => (selectedActionId ? packActions.find((action) => action.id === selectedActionId) || null : null),
    [packActions, selectedActionId]
  )

  const detailAction = selectedAction ?? selectedPackAction
  const detailSubtasks = detailAction?.subtasks ?? selectedSubtasks
  const detailChildActions = useMemo(
    () => (detailAction ? packActions.filter((action) => action.parent_action_id === detailAction.id) : []),
    [detailAction?.id, packActions]
  )
  const filteredProgress = areaSlugFilter
    ? progress?.filter((p) => p.area_slug === areaSlugFilter)
    : progress

  const visibleProgress = useMemo(() => {
    const baseProgress = filteredProgress ?? []

    if (packIdFilter || !normalizedSearchQuery) return baseProgress

    return baseProgress.filter((item) => {
      const haystack = [item.area_name, item.plan_title, item.plan_status].join(' ').toLowerCase()
      return haystack.includes(normalizedSearchQuery)
    })
  }, [filteredProgress, normalizedSearchQuery, packIdFilter])

  const visiblePackActions = useMemo(() => {
    if (!packIdFilter || !normalizedSearchQuery) return packActions

    return packActions.filter((action) => {
      const haystack = [
        action.title,
        action.description,
        action.responsible,
        action.assigned_to,
        action.priority,
        action.status,
        action.node_type,
        action.program_key,
        action.objective_key,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedSearchQuery)
    })
  }, [packActions, normalizedSearchQuery, packIdFilter])

  const isDetailLoading = !!selectedActionId && !detailAction && selectedActionLoading
  const isDetailMissing = !!selectedActionId && !detailAction && !selectedActionLoading
  const packHierarchyStats = useMemo(() => computePackHierarchyStats(visiblePackActions), [visiblePackActions])
  const packActionColumns = useMemo(() => buildPackActionColumns((action) => setSelectedActionId(action.id)), [])

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

  const stats = visibleProgress?.reduce(
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
            placeholder="Buscar por área, plano ou ação..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-9 pr-3 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Buscar áreas, planos e ações"
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

      {activeTab === 'plans' && packIdFilter && (
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Ações do Strategic Pack ({visiblePackActions.length})
              </CardTitle>

              <div className="flex items-center gap-2">
                <Button
                  variant={packViewMode === 'tree' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPackViewMode('tree')}
                >
                  Estrutura
                </Button>
                <Button
                  variant={packViewMode === 'table' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPackViewMode('table')}
                >
                  Tabela
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted">
              A visão em árvore destaca a cadeia pai → filha; a tabela mantém a leitura analítica e o acesso rápido ao detalhe.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="rounded-lg border border-border bg-accent/30 p-3">
                <p className="text-xs text-muted">Total</p>
                <p className="text-xl font-semibold text-foreground">{packHierarchyStats.total}</p>
              </div>
              <div className="rounded-lg border border-border bg-accent/30 p-3">
                <p className="text-xs text-muted">Raiz</p>
                <p className="text-xl font-semibold text-foreground">{packHierarchyStats.roots}</p>
              </div>
              <div className="rounded-lg border border-border bg-accent/30 p-3">
                <p className="text-xs text-muted">Subações</p>
                <p className="text-xl font-semibold text-foreground">{packHierarchyStats.children}</p>
              </div>
              <div className="rounded-lg border border-border bg-accent/30 p-3">
                <p className="text-xs text-muted">Folhas operacionais</p>
                <p className="text-xl font-semibold text-foreground">{packHierarchyStats.leafNodes}</p>
              </div>
              <div className="rounded-lg border border-border bg-accent/30 p-3">
                <p className="text-xs text-muted">Profundidade máx.</p>
                <p className="text-xl font-semibold text-foreground">{packHierarchyStats.maxDepth}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {visiblePackActions.length > 0 ? (
              packViewMode === 'tree' ? (
                <div className="p-4">
                  <ActionTreeView
                    actions={visiblePackActions}
                    selectedActionId={selectedActionId || undefined}
                    onActionClick={(action) => setSelectedActionId(action.id)}
                  />
                </div>
              ) : (
                <DataTable<PlanAction>
                  columns={packActionColumns}
                  rows={visiblePackActions}
                  rowKey="id"
                  pageSizeOptions={[10, 25, 50]}
                />
              )
            ) : packActions.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <FileCheck className="w-10 h-10 text-muted mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-foreground">Nenhuma ação cadastrada no pack</h3>
                  <p className="text-sm text-muted">
                    Gere ou vincule ações para começar a acompanhar a execução detalhada.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3">
                <Search className="w-10 h-10 text-muted mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-foreground">Nenhuma ação encontrada</h3>
                  <p className="text-sm text-muted">
                    Ajuste a busca ou limpe o filtro para voltar a ver todas as ações do pack.
                  </p>
                </div>
                {normalizedSearchQuery && (
                  <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                    Limpar busca
                  </Button>
                )}
              </div>
            )}
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
          {visibleProgress && visibleProgress.length > 0 ? (
            <div className="space-y-3">
              {[...visibleProgress]
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

      <Modal
        open={!!selectedActionId}
        onClose={() => setSelectedActionId(null)}
        title={detailAction?.title}
        description={detailAction?.description || 'Detalhamento operacional da ação selecionada'}
        size="2xl"
      >
        {isDetailLoading ? (
          <div className="py-8 text-center text-muted">Carregando detalhe da ação...</div>
        ) : isDetailMissing ? (
          <div className="py-8 text-center text-muted">A ação selecionada não foi encontrada.</div>
        ) : detailAction ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <ActionStatusBadge status={detailAction.status} />
              <PriorityBadge priority={detailAction.priority} />
              <Badge variant={detailAction.parent_action_id ? 'info' : 'default'} size="sm">
                {detailAction.parent_action_id ? 'Subação' : 'Raiz'}
              </Badge>
              <Badge variant="info" size="sm">
                {detailAction.node_type.replace(/_/g, ' ')}
              </Badge>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Visão executiva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted mb-1">Progresso</p>
                    <ProgressBar value={detailAction.progress} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted">Responsável</p>
                      <p className="font-medium text-foreground">{detailAction.responsible || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted">Designado</p>
                      <p className="font-medium text-foreground">{detailAction.assigned_to || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted">Início</p>
                      <p className="font-medium text-foreground">{detailAction.start_date || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted">Prazo</p>
                      <p className="font-medium text-foreground">{detailAction.due_date || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted">Concluída em</p>
                      <p className="font-medium text-foreground">{detailAction.completed_at || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted">Evidência obrigatória</p>
                      <p className="font-medium text-foreground">{detailAction.evidence_required ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>

                  {detailAction.cost_estimate !== null && detailAction.cost_estimate !== undefined && (
                    <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border">
                      <div>
                        <p className="text-muted">Custo estimado</p>
                        <p className="font-medium text-foreground">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: detailAction.currency || 'BRL' }).format(detailAction.cost_estimate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted">Custo realizado</p>
                        <p className="font-medium text-foreground">
                          {detailAction.cost_actual !== null && detailAction.cost_actual !== undefined
                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: detailAction.currency || 'BRL' }).format(detailAction.cost_actual)
                            : '-'}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Relações e sinais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted">Subtarefas</p>
                      <p className="font-medium text-foreground">{detailSubtasks.length}</p>
                    </div>
                    <div>
                      <p className="text-muted">Filhas no pack</p>
                      <p className="font-medium text-foreground">{detailChildActions.length}</p>
                    </div>
                    <div>
                      <p className="text-muted">Comentários</p>
                      <p className="font-medium text-foreground">{detailAction.comments?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted">Evidências</p>
                      <p className="font-medium text-foreground">{detailAction.evidences?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted">Riscos</p>
                      <p className="font-medium text-foreground">{detailAction.risks?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted">Parent</p>
                      <p className="font-medium text-foreground">{detailAction.parent_action_id || '-'}</p>
                    </div>
                  </div>

                  {detailAction.notes && (
                    <div>
                      <p className="text-muted mb-1">Observações</p>
                      <p className="text-foreground whitespace-pre-wrap rounded-lg border border-border bg-accent/30 p-3 text-sm">
                        {detailAction.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subtarefas</CardTitle>
              </CardHeader>
              <CardContent>
                <SubtaskList
                  actionId={detailAction.id}
                  subtasks={detailSubtasks}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações filhas</CardTitle>
              </CardHeader>
              <CardContent>
                {detailChildActions.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {detailChildActions.map((child) => (
                      <ActionCard
                        key={child.id}
                        action={child}
                        compact
                        onClick={() => setSelectedActionId(child.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">Esta ação ainda não possui filhas vinculadas no pack.</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

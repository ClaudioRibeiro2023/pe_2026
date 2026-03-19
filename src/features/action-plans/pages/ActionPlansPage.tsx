import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plus,
  ClipboardList,
  Filter,
  Activity,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Flag,
  Users,
  Target,
  TrendingUp,
} from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { formatCurrency, formatDate, formatNumber } from '@/shared/lib/format'
import { LazyModal } from '@/shared/ui/LazyModal'
import { Loader, PageLoader } from '@/shared/ui/Loader'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { useToast } from '@/shared/ui/Toast'
import { SearchBar } from '@/shared/components/filters/SearchBar'
import { FilterSelect } from '@/shared/components/filters/FilterSelect'
import { Pagination } from '@/shared/components/pagination/Pagination'
import { ExportButtons } from '@/shared/components/export/ExportButtons'
import { useFilters } from '@/shared/hooks/useFilters'
import { usePagination } from '@/shared/hooks/usePagination'
import { useExport } from '@/shared/lib/export'
import { ActionPlanCard } from '../components/ActionPlanCard'
import {
  useActionPlans,
  useCreateActionPlan,
  useUpdateActionPlan,
  useDeleteActionPlan,
} from '../hooks'
import type { ActionPlan } from '../types'
import type { ActionPlanFormSchema } from '../schemas'

const ActionPlanDetails = lazy(() =>
  import('../components/ActionPlanDetails').then((m) => ({ default: m.ActionPlanDetails }))
)
const ActionPlanForm = lazy(() =>
  import('../components/ActionPlanForm').then((m) => ({ default: m.ActionPlanForm }))
)

export function ActionPlansPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<ActionPlan | null>(null)
  const [deletingPlan, setDeletingPlan] = useState<ActionPlan | null>(null)
  const [viewingPlan, setViewingPlan] = useState<ActionPlan | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('create') === '1' && !createModalOpen) {
      setCreateModalOpen(true)
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('create')
      setSearchParams(nextParams, { replace: true })
    }
  }, [createModalOpen, searchParams, setSearchParams])

  const { addToast } = useToast()
  const { data: plans, isLoading, error, refetch } = useActionPlans()
  const createMutation = useCreateActionPlan()
  const updateMutation = useUpdateActionPlan()
  const deleteMutation = useDeleteActionPlan()
  const { exportData } = useExport()

  const simulatedPlan = {
    title: 'Plano Diretor 2026',
    subtitle: 'Transformação digital e eficiência operacional com foco em impacto mensurável.',
    owner: 'Gabriela Martins',
    sponsor: 'Comitê Executivo',
    deadline: '2026-11-30',
    budget: 3250000,
    progress: 62,
    programs: 6,
    okrs: 9,
    initiatives: [
      {
        title: 'Automação de processos críticos',
        owner: 'Operações',
        progress: 72,
        status: 'Em andamento',
      },
      {
        title: 'Analytics preditivo e forecast',
        owner: 'BI & Dados',
        progress: 54,
        status: 'Em andamento',
      },
      {
        title: 'Governança de dados & compliance',
        owner: 'Jurídico',
        progress: 38,
        status: 'Planejado',
      },
    ],
    kpis: [
      { label: 'ROI estimado', value: '2,4x' },
      { label: 'Economia anual', value: formatCurrency(1800000) },
      { label: 'Engajamento interno', value: '↑ 18%' },
    ],
    risks: [
      { label: 'Dependência de fornecedores críticos', level: 'Moderado' },
      { label: 'Aderência ao change management', level: 'Alto' },
    ],
  }

  const initiativeStatusStyles: Record<string, string> = {
    'Em andamento': 'border-primary-100 bg-primary-50 text-primary-700',
    Planejado: 'border-warning-100 bg-warning-50 text-warning-700',
    Concluído: 'border-success-100 bg-success-50 text-success-700',
  }

  const riskStyles: Record<string, string> = {
    Alto: 'border-danger-100 bg-danger-50 text-danger-700',
    Moderado: 'border-warning-100 bg-warning-50 text-warning-700',
    Baixo: 'border-success-100 bg-success-50 text-success-700',
  }

  const portfolioStats = useMemo(() => {
    const safePlans = plans || []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const activePlans = safePlans.filter(
      (plan) => plan.status !== 'completed' && plan.status !== 'cancelled'
    )
    const completedPlans = safePlans.filter((plan) => plan.status === 'completed')
    const overduePlans = activePlans.filter((plan) => {
      if (!plan.due_date) return false
      return new Date(plan.due_date) < today
    })
    const dueSoonThreshold = 14 * 24 * 60 * 60 * 1000
    const dueSoonPlans = activePlans.filter((plan) => {
      if (!plan.due_date) return false
      const dueDate = new Date(plan.due_date)
      const diff = dueDate.getTime() - today.getTime()
      return diff >= 0 && diff <= dueSoonThreshold
    })
    const nextDeadline = activePlans
      .filter((plan) => plan.due_date)
      .sort(
        (a, b) => new Date(a.due_date as string).getTime() - new Date(b.due_date as string).getTime()
      )[0]?.due_date

    return {
      total: safePlans.length,
      active: activePlans.length,
      completed: completedPlans.length,
      overdue: overduePlans.length,
      dueSoon: dueSoonPlans.length,
      completionRate: safePlans.length
        ? Math.round((completedPlans.length / safePlans.length) * 100)
        : 0,
      nextDeadline,
    }
  }, [plans])

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearFilters,
    filteredData,
    hasActiveFilters,
  } = useFilters({
    data: plans || [],
    searchFields: ['title', 'description', 'responsible'],
    filterFn: (plan, filters) => {
      if (filters.status && plan.status !== filters.status) return false
      if (filters.priority && plan.priority !== filters.priority) return false
      return true
    },
  })

  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter(Boolean).length + (searchQuery.trim() ? 1 : 0),
    [filters, searchQuery]
  )

  const pagination = usePagination({
    totalItems: filteredData.length,
    itemsPerPage: 9,
  })

  const paginatedPlans = filteredData.slice(pagination.startIndex, pagination.endIndex)

  const executiveStats = [
    {
      label: 'Planos ativos',
      value: formatNumber(portfolioStats.active),
      helper: `${formatNumber(portfolioStats.total)} no portfólio`,
      icon: Activity,
      tone: 'border-primary-100 bg-primary-50 text-primary-700',
    },
    {
      label: 'Conclusão',
      value: `${portfolioStats.completionRate}%`,
      helper: `${formatNumber(portfolioStats.completed)} entregas encerradas`,
      icon: CheckCircle,
      tone: 'border-success-100 bg-success-50 text-success-700',
    },
    {
      label: 'Alertas críticos',
      value: formatNumber(portfolioStats.overdue),
      helper: `${formatNumber(portfolioStats.dueSoon)} vencem em 14 dias`,
      icon: AlertTriangle,
      tone: 'border-danger-100 bg-danger-50 text-danger-700',
    },
    {
      label: 'Próximo marco',
      value: portfolioStats.nextDeadline ? formatDate(portfolioStats.nextDeadline) : 'Sem prazo',
      helper: 'Agenda executiva',
      icon: Calendar,
      tone: 'border-warning-100 bg-warning-50 text-warning-700',
    },
  ]

  const handleExportPDF = () => {
    exportData(
      filteredData,
      [
        { header: 'Título', dataKey: 'title' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Prioridade', dataKey: 'priority' },
        { header: 'Responsável', dataKey: 'responsible' },
        { header: 'Prazo', dataKey: 'due_date' },
      ],
      'Planos de Ação',
      'pdf'
    )
  }

  const handleExportExcel = () => {
    exportData(
      filteredData,
      [
        { header: 'Título', dataKey: 'title' },
        { header: 'Descrição', dataKey: 'description' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Prioridade', dataKey: 'priority' },
        { header: 'Responsável', dataKey: 'responsible' },
        { header: 'Prazo', dataKey: 'due_date' },
        { header: 'Progresso', dataKey: 'progress' },
      ],
      'Planos de Ação',
      'excel'
    )
  }

  const handleCreate = async (data: ActionPlanFormSchema) => {
    try {
      await createMutation.mutateAsync(data as any)
      setCreateModalOpen(false)
      addToast({
        type: 'success',
        title: 'Plano criado',
        message: 'O plano de ação foi criado com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao criar',
        message: 'Não foi possível criar o plano de ação.',
      })
    }
  }

  const handleUpdate = async (data: ActionPlanFormSchema) => {
    if (!editingPlan) return

    try {
      await updateMutation.mutateAsync({ id: editingPlan.id, data: data as any })
      setEditingPlan(null)
      addToast({
        type: 'success',
        title: 'Plano atualizado',
        message: 'O plano de ação foi atualizado com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao atualizar',
        message: 'Não foi possível atualizar o plano de ação.',
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingPlan) return

    try {
      await deleteMutation.mutateAsync(deletingPlan.id)
      setDeletingPlan(null)
      addToast({
        type: 'success',
        title: 'Plano excluído',
        message: 'O plano de ação foi excluído com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir o plano de ação.',
      })
    }
  }

  if (isLoading) {
    return <PageLoader text="Carregando planos..." />
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar planos"
        message={error instanceof Error ? error.message : 'Não foi possível carregar os planos de ação.'}
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">Portfólio executivo</p>
          <h1 className="text-3xl font-semibold text-foreground mt-2">Planos de Ação</h1>
          <p className="text-muted mt-2 max-w-2xl">
            Consolide iniciativas estratégicas, alinhe prioridades e acompanhe o avanço com
            governança de ponta a ponta.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButtons
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            disabled={!plans || filteredData.length === 0}
            size="md"
          />
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Plano
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {executiveStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted">{stat.label}</p>
                    <p className="text-2xl font-semibold text-foreground mt-2">{stat.value}</p>
                    <p className="text-xs text-muted mt-1">{stat.helper}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${stat.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Card className="border-border/60 shadow-soft">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary-700">
                <Flag className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em]">Plano simulado</span>
              </div>
              <CardTitle className="text-xl mt-2">{simulatedPlan.title}</CardTitle>
              <p className="text-sm text-muted mt-1">{simulatedPlan.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="px-3 py-1 rounded-full border border-primary-100 bg-primary-50 text-primary-700">
                Governança ativa
              </span>
              <span className="px-3 py-1 rounded-full border border-border text-muted bg-surface">
                Portfolio 2026
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Líder</p>
                    <p className="text-sm font-semibold text-foreground mt-2">{simulatedPlan.owner}</p>
                  </div>
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Patrocínio</p>
                    <p className="text-sm font-semibold text-foreground mt-2">{simulatedPlan.sponsor}</p>
                  </div>
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Prazo crítico</p>
                    <p className="text-sm font-semibold text-foreground mt-2">
                      {formatDate(simulatedPlan.deadline)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Budget</p>
                    <p className="text-sm font-semibold text-foreground mt-2">
                      {formatCurrency(simulatedPlan.budget)}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Progresso geral</span>
                    <span className="font-semibold text-foreground">{simulatedPlan.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-accent">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                      style={{ width: `${simulatedPlan.progress}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded-lg border border-border p-3">
                      <p className="uppercase tracking-[0.2em] text-muted">Programas</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Target className="h-4 w-4 text-primary-600" />
                        <span className="text-sm font-semibold text-foreground">
                          {formatNumber(simulatedPlan.programs)}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="uppercase tracking-[0.2em] text-muted">OKRs</p>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="h-4 w-4 text-primary-600" />
                        <span className="text-sm font-semibold text-foreground">
                          {formatNumber(simulatedPlan.okrs)}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <p className="uppercase tracking-[0.2em] text-muted">Squads</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="h-4 w-4 text-primary-600" />
                        <span className="text-sm font-semibold text-foreground">12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Iniciativas prioritárias</p>
                <div className="space-y-3">
                  {simulatedPlan.initiatives.map((initiative) => (
                    <div key={initiative.title} className="rounded-xl border border-border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{initiative.title}</p>
                          <p className="text-xs text-muted mt-1">{initiative.owner}</p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                            initiativeStatusStyles[initiative.status]
                          }`}
                        >
                          {initiative.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs">
                        <div className="flex-1 h-1.5 rounded-full bg-accent">
                          <div
                            className="h-1.5 rounded-full bg-primary-500"
                            style={{ width: `${initiative.progress}%` }}
                          />
                        </div>
                        <span className="font-semibold text-foreground">{initiative.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">KPIs estratégicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {simulatedPlan.kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-xl border border-border p-4 flex items-center justify-between">
                  <span className="text-sm text-muted">{kpi.label}</span>
                  <span className="text-sm font-semibold text-foreground">{kpi.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Riscos & alertas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {simulatedPlan.risks.map((risk) => (
                <div key={risk.label} className="rounded-xl border border-border p-4 space-y-2">
                  <p className="text-sm font-semibold text-foreground">{risk.label}</p>
                  <span
                    className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      riskStyles[risk.level]
                    }`}
                  >
                    Nível {risk.level}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="border-border/60">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg">Planos em execução</CardTitle>
            <p className="text-sm text-muted mt-1">
              Monitoramento operacional do portfólio real com foco em entregas e prazos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
              <TrendingUp className="h-4 w-4" />
              {portfolioStats.completionRate}% de conclusão
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
              <Activity className="h-4 w-4" />
              {formatNumber(portfolioStats.active)} ativos
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {showFilters && (
            <div className="rounded-2xl border border-border bg-accent/40 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Buscar planos..."
                  className="md:col-span-2"
                />
                <FilterSelect
                  label="Status"
                  value={filters.status || 'all'}
                  onChange={(value) => setFilter('status', value === 'all' ? '' : value)}
                  options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'pending', label: 'Pendente' },
                    { value: 'in_progress', label: 'Em Andamento' },
                    { value: 'completed', label: 'Concluído' },
                    { value: 'cancelled', label: 'Cancelado' },
                  ]}
                />
                <FilterSelect
                  label="Prioridade"
                  value={filters.priority || 'all'}
                  onChange={(value) => setFilter('priority', value === 'all' ? '' : value)}
                  options={[
                    { value: 'all', label: 'Todas' },
                    { value: 'low', label: 'Baixa' },
                    { value: 'medium', label: 'Média' },
                    { value: 'high', label: 'Alta' },
                    { value: 'urgent', label: 'Urgente' },
                  ]}
                />
                {hasActiveFilters && (
                  <div className="md:col-span-4">
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {plans && plans.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
              <p>
                Mostrando {formatNumber(paginatedPlans.length)} de {formatNumber(filteredData.length)} plano(s)
                {hasActiveFilters && (
                  <span className="ml-2 text-xs text-muted">• {formatNumber(plans.length)} no total</span>
                )}
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em]">
                {hasActiveFilters ? 'Filtro ativo' : 'Visão completa'}
              </span>
            </div>
          )}

          {!plans || plans.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="h-8 w-8" />}
              title="Nenhum plano cadastrado"
              description="Crie seu primeiro plano de ação para começar."
              action={
                <Button onClick={() => setCreateModalOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Criar Plano
                </Button>
              }
            />
          ) : filteredData.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="h-8 w-8" />}
              title="Nenhum plano encontrado"
              description="Tente ajustar os filtros de busca."
              action={
                <Button variant="outline" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedPlans.map((plan) => (
                  <ActionPlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={setEditingPlan}
                    onDelete={setDeletingPlan}
                    onView={setViewingPlan}
                  />
                ))}
              </div>

              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.goToPage}
                canGoNext={pagination.canGoNext}
                canGoPrevious={pagination.canGoPrevious}
                paginationRange={pagination.paginationRange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <LazyModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Novo Plano de Ação"
        size="lg"
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-10">
              <Loader text="Carregando formulário..." />
            </div>
          }
        >
          <ActionPlanForm
            onSubmit={handleCreate}
            onCancel={() => setCreateModalOpen(false)}
            loading={createMutation.isPending}
          />
        </Suspense>
      </LazyModal>

      {/* Edit Modal */}
      <LazyModal
        open={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        title="Editar Plano de Ação"
        size="lg"
      >
        {editingPlan && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-10">
                <Loader text="Carregando formulário..." />
              </div>
            }
          >
            <ActionPlanForm
              plan={editingPlan}
              onSubmit={handleUpdate}
              onCancel={() => setEditingPlan(null)}
              loading={updateMutation.isPending}
            />
          </Suspense>
        )}
      </LazyModal>

      {/* Delete Confirmation Modal */}
      <LazyModal
        open={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        title="Excluir Plano"
      >
        <div className="space-y-4">
          <p className="text-muted">
            Tem certeza que deseja excluir o plano{' '}
            <strong>{deletingPlan?.title}</strong>? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeletingPlan(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              Excluir
            </Button>
          </div>
        </div>
      </LazyModal>

      {/* Details Modal */}
      {viewingPlan && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="w-full max-w-xl bg-surface rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-center py-10">
                  <Loader text="Carregando detalhes..." />
                </div>
              </div>
            </div>
          }
        >
          <ActionPlanDetails
            plan={viewingPlan}
            open={!!viewingPlan}
            onClose={() => setViewingPlan(null)}
          />
        </Suspense>
      )}
    </div>
  )
}

import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Target, Filter, Calendar, CheckCircle, TrendingUp, AlertTriangle } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent } from '@/shared/ui/Card'
import { LazyModal } from '@/shared/ui/LazyModal'
import { Loader, PageLoader } from '@/shared/ui/Loader'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { useToast } from '@/shared/ui/Toast'
import { formatDate, formatNumber } from '@/shared/lib/format'
import { SearchBar } from '@/shared/components/filters/SearchBar'
import { FilterSelect } from '@/shared/components/filters/FilterSelect'
import { Pagination } from '@/shared/components/pagination/Pagination'
import { ExportButtons } from '@/shared/components/export/ExportButtons'
import { useFilters } from '@/shared/hooks/useFilters'
import { usePagination } from '@/shared/hooks/usePagination'
import { useExport } from '@/shared/lib/export'
import { GoalCard } from '../components/GoalCard'
import {
  useGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
} from '../hooks'
import type { Goal, GoalFormData } from '../types'
import type { GoalFormSchema } from '../schemas'

const GoalForm = lazy(() =>
  import('../components/GoalForm').then((m) => ({ default: m.GoalForm }))
)

export function GoalsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null)
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
  const { data: goals, isLoading, error, refetch } = useGoals()
  const createMutation = useCreateGoal()
  const updateMutation = useUpdateGoal()
  const deleteMutation = useDeleteGoal()
  const { exportData } = useExport()

  // Filtros e busca
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearFilters,
    filteredData,
    hasActiveFilters,
  } = useFilters({
    data: goals || [],
    searchFields: ['title', 'description', 'category'],
    filterFn: (goal, filters) => {
      if (filters.status && goal.status !== filters.status) return false
      if (filters.period && goal.period !== filters.period) return false
      return true
    },
  })

  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter(Boolean).length + (searchQuery.trim() ? 1 : 0),
    [filters, searchQuery]
  )

  // Paginação
  const pagination = usePagination({
    totalItems: filteredData.length,
    itemsPerPage: 9,
  })

  const paginatedGoals = filteredData.slice(pagination.startIndex, pagination.endIndex)

  const goalStats = useMemo(() => {
    const safeGoals = goals || []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const openGoals = safeGoals.filter(
      (goal) => goal.status !== 'completed' && goal.status !== 'cancelled'
    )
    const completedGoals = safeGoals.filter((goal) => goal.status === 'completed')
    const overdueGoals = openGoals.filter((goal) => new Date(goal.end_date) < today)
    const nextDeadline = openGoals
      .filter((goal) => goal.end_date)
      .sort(
        (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
      )[0]?.end_date
    const totalProgress = safeGoals.reduce((acc, goal) => {
      if (!goal.target_value) return acc
      return acc + (goal.current_value / goal.target_value) * 100
    }, 0)
    const averageProgress = safeGoals.length
      ? Math.round(totalProgress / safeGoals.length)
      : 0
    const completionRate = safeGoals.length
      ? Math.round((completedGoals.length / safeGoals.length) * 100)
      : 0

    return {
      total: safeGoals.length,
      open: openGoals.length,
      completed: completedGoals.length,
      overdue: overdueGoals.length,
      nextDeadline,
      averageProgress,
      completionRate,
    }
  }, [goals])

  const deadlineTone = goalStats.overdue > 0
    ? 'border-danger-100 bg-danger-50 text-danger-700'
    : 'border-warning-100 bg-warning-50 text-warning-700'
  const DeadlineIcon = goalStats.overdue > 0 ? AlertTriangle : Calendar

  const executiveStats = [
    {
      label: 'Metas em andamento',
      value: formatNumber(goalStats.open),
      helper: `${formatNumber(goalStats.total)} no total`,
      icon: Target,
      tone: 'border-primary-100 bg-primary-50 text-primary-700',
    },
    {
      label: 'Progresso médio',
      value: `${formatNumber(goalStats.averageProgress)}%`,
      helper: `Base em ${formatNumber(goalStats.total)} metas`,
      icon: TrendingUp,
      tone: 'border-primary-100 bg-primary-50 text-primary-700',
    },
    {
      label: 'Conclusão',
      value: `${formatNumber(goalStats.completionRate)}%`,
      helper: `${formatNumber(goalStats.completed)} concluídas`,
      icon: CheckCircle,
      tone: 'border-success-100 bg-success-50 text-success-700',
    },
    {
      label: 'Próximo prazo',
      value: goalStats.nextDeadline ? formatDate(goalStats.nextDeadline) : 'Sem prazo',
      helper: goalStats.overdue > 0
        ? `${formatNumber(goalStats.overdue)} em atraso`
        : 'Agenda estratégica',
      icon: DeadlineIcon,
      tone: deadlineTone,
    },
  ]

  const handleExportPDF = () => {
    exportData(
      filteredData,
      [
        { header: 'Título', dataKey: 'title' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Progresso', dataKey: 'current_value' },
        { header: 'Meta', dataKey: 'target_value' },
        { header: 'Categoria', dataKey: 'category' },
      ],
      'Metas',
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
        { header: 'Progresso', dataKey: 'current_value' },
        { header: 'Meta', dataKey: 'target_value' },
        { header: 'Unidade', dataKey: 'unit' },
        { header: 'Categoria', dataKey: 'category' },
        { header: 'Período', dataKey: 'period' },
      ],
      'Metas',
      'excel'
    )
  }

  const handleCreate = async (data: GoalFormSchema) => {
    try {
      await createMutation.mutateAsync(data as GoalFormData)
      setCreateModalOpen(false)
      addToast({
        type: 'success',
        title: 'Meta criada',
        message: 'A meta foi criada com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao criar',
        message: 'Não foi possível criar a meta.',
      })
    }
  }

  const handleUpdate = async (data: GoalFormSchema) => {
    if (!editingGoal) return

    try {
      await updateMutation.mutateAsync({ id: editingGoal.id, data })
      setEditingGoal(null)
      addToast({
        type: 'success',
        title: 'Meta atualizada',
        message: 'A meta foi atualizada com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao atualizar',
        message: 'Não foi possível atualizar a meta.',
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingGoal) return

    try {
      await deleteMutation.mutateAsync(deletingGoal.id)
      setDeletingGoal(null)
      addToast({
        type: 'success',
        title: 'Meta excluída',
        message: 'A meta foi excluída com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir a meta.',
      })
    }
  }

  if (isLoading) {
    return <PageLoader text="Carregando metas..." />
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar metas"
        message={error instanceof Error ? error.message : 'Não foi possível carregar as metas.'}
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">Performance estratégica</p>
          <h1 className="text-3xl font-semibold text-foreground mt-2">Metas</h1>
          <p className="text-muted mt-2 max-w-2xl">
            Acompanhe a evolução, ritmo e os prazos críticos para manter o portfólio no rumo certo.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButtons
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            disabled={!goals || filteredData.length === 0}
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
            Nova Meta
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

      {/* Filters */}
      {showFilters && (
        <div className="rounded-2xl border border-border bg-accent/40 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar metas..."
              className="md:col-span-3"
            />
            <FilterSelect
              label="Status"
              value={filters.status || 'all'}
              onChange={(value) => setFilter('status', value === 'all' ? '' : value)}
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'active', label: 'Ativas' },
                { value: 'paused', label: 'Pausadas' },
                { value: 'completed', label: 'Concluídas' },
                { value: 'cancelled', label: 'Canceladas' },
              ]}
            />
            <FilterSelect
              label="Período"
              value={filters.period || 'all'}
              onChange={(value) => setFilter('period', value === 'all' ? '' : value)}
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'daily', label: 'Diário' },
                { value: 'weekly', label: 'Semanal' },
                { value: 'monthly', label: 'Mensal' },
                { value: 'quarterly', label: 'Trimestral' },
                { value: 'yearly', label: 'Anual' },
              ]}
            />
            {hasActiveFilters && (
              <div className="flex items-end md:col-span-3">
                <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Info */}
      {goals && goals.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
          <p>
            Mostrando {formatNumber(paginatedGoals.length)} de {formatNumber(filteredData.length)} meta(s)
            {hasActiveFilters && goals.length > 0 && (
              <span className="ml-2 text-xs text-muted">• {formatNumber(goals.length)} no total</span>
            )}
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em]">
            {hasActiveFilters ? 'Filtro ativo' : 'Visão completa'}
          </span>
        </div>
      )}

      {/* List */}
      {!goals || goals.length === 0 ? (
        <EmptyState
          icon={<Target className="h-8 w-8" />}
          title="Nenhuma meta cadastrada"
          description="Crie sua primeira meta para começar a acompanhar o progresso."
          action={
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Criar Meta
            </Button>
          }
        />
      ) : filteredData.length === 0 ? (
        <EmptyState
          icon={<Target className="h-8 w-8" />}
          title="Nenhuma meta encontrada"
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
            {paginatedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={setEditingGoal}
                onDelete={setDeletingGoal}
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

      {/* Create Modal */}
      <LazyModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Nova Meta"
        size="xl"
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-10">
              <Loader text="Carregando formulário..." />
            </div>
          }
        >
          <GoalForm
            onSubmit={handleCreate}
            onCancel={() => setCreateModalOpen(false)}
            loading={createMutation.isPending}
          />
        </Suspense>
      </LazyModal>

      {/* Edit Modal */}
      <LazyModal
        open={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        title="Editar Meta"
        size="xl"
      >
        {editingGoal && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-10">
                <Loader text="Carregando formulário..." />
              </div>
            }
          >
            <GoalForm
              goal={editingGoal}
              onSubmit={handleUpdate}
              onCancel={() => setEditingGoal(null)}
              loading={updateMutation.isPending}
            />
          </Suspense>
        )}
      </LazyModal>

      {/* Delete Confirmation Modal */}
      <LazyModal
        open={!!deletingGoal}
        onClose={() => setDeletingGoal(null)}
        title="Excluir Meta"
      >
        <div className="space-y-4">
          <p className="text-muted">
            Tem certeza que deseja excluir a meta{' '}
            <strong>{deletingGoal?.title}</strong>? Esta ação não pode ser
            desfeita.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeletingGoal(null)}>
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
    </div>
  )
}

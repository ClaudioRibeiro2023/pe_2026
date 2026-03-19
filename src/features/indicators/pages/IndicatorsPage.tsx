import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, BarChart3, Filter, Activity, TrendingUp, TrendingDown, Calendar } from '@/shared/ui/icons'
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
import { IndicatorCard } from '../components/IndicatorCard'
import {
  useIndicators,
  useCreateIndicator,
  useUpdateIndicator,
  useDeleteIndicator,
} from '../hooks'
import type { Indicator } from '../types'
import type { IndicatorFormSchema } from '../schemas'

const IndicatorForm = lazy(() =>
  import('../components/IndicatorForm').then((m) => ({ default: m.IndicatorForm }))
)

export function IndicatorsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null)
  const [deletingIndicator, setDeletingIndicator] = useState<Indicator | null>(null)
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
  const { data: indicators, isLoading, error, refetch } = useIndicators()
  const createMutation = useCreateIndicator()
  const updateMutation = useUpdateIndicator()
  const deleteMutation = useDeleteIndicator()
  const { exportData } = useExport()

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearFilters,
    filteredData,
    hasActiveFilters,
  } = useFilters({
    data: indicators || [],
    searchFields: ['name', 'category'],
    filterFn: (indicator, filters) => {
      if (filters.trend && indicator.trend !== filters.trend) return false
      if (filters.category && indicator.category !== filters.category) return false
      return true
    },
  })

  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter(Boolean).length + (searchQuery.trim() ? 1 : 0),
    [filters, searchQuery]
  )

  const categoryOptions = useMemo(() => {
    const categories = Array.from(
      new Set((indicators || []).map((indicator) => indicator.category).filter(Boolean))
    ).sort()

    return [
      { value: 'all', label: 'Todas' },
      ...categories.map((category) => ({ value: category, label: category })),
    ]
  }, [indicators])

  const pagination = usePagination({
    totalItems: filteredData.length,
    itemsPerPage: 12,
  })

  const paginatedIndicators = filteredData.slice(pagination.startIndex, pagination.endIndex)

  const indicatorStats = useMemo(() => {
    const safeIndicators = indicators || []
    const withTrend = safeIndicators.filter((indicator) => indicator.trend)
    const positive = safeIndicators.filter((indicator) => indicator.trend === 'up')
    const negative = safeIndicators.filter((indicator) => indicator.trend === 'down')
    const latestUpdate = safeIndicators
      .filter((indicator) => indicator.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date
    const trendCoverage = safeIndicators.length
      ? Math.round((withTrend.length / safeIndicators.length) * 100)
      : 0

    return {
      total: safeIndicators.length,
      positive: positive.length,
      negative: negative.length,
      trendCoverage,
      latestUpdate,
    }
  }, [indicators])

  const executiveStats = [
    {
      label: 'Indicadores monitorados',
      value: formatNumber(indicatorStats.total),
      helper: `${formatNumber(indicatorStats.trendCoverage)}% com tendência`,
      icon: Activity,
      tone: 'border-primary-100 bg-primary-50 text-primary-700',
    },
    {
      label: 'Em alta',
      value: formatNumber(indicatorStats.positive),
      helper: 'Sinais positivos',
      icon: TrendingUp,
      tone: 'border-success-100 bg-success-50 text-success-700',
    },
    {
      label: 'Em baixa',
      value: formatNumber(indicatorStats.negative),
      helper: 'Pontos de atenção',
      icon: TrendingDown,
      tone: 'border-danger-100 bg-danger-50 text-danger-700',
    },
    {
      label: 'Última atualização',
      value: indicatorStats.latestUpdate ? formatDate(indicatorStats.latestUpdate) : 'Sem dados',
      helper: 'Relatórios recentes',
      icon: Calendar,
      tone: 'border-warning-100 bg-warning-50 text-warning-700',
    },
  ]

  const handleExportPDF = () => {
    exportData(
      filteredData,
      [
        { header: 'Nome', dataKey: 'name' },
        { header: 'Valor', dataKey: 'value' },
        { header: 'Unidade', dataKey: 'unit' },
        { header: 'Categoria', dataKey: 'category' },
        { header: 'Tendência', dataKey: 'trend' },
      ],
      'Indicadores',
      'pdf'
    )
  }

  const handleExportExcel = () => {
    exportData(
      filteredData,
      [
        { header: 'Nome', dataKey: 'name' },
        { header: 'Valor', dataKey: 'value' },
        { header: 'Valor Anterior', dataKey: 'previous_value' },
        { header: 'Unidade', dataKey: 'unit' },
        { header: 'Categoria', dataKey: 'category' },
        { header: 'Tendência', dataKey: 'trend' },
        { header: 'Data', dataKey: 'date' },
      ],
      'Indicadores',
      'excel'
    )
  }

  const handleCreate = async (data: IndicatorFormSchema) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await createMutation.mutateAsync(data as any)
      setCreateModalOpen(false)
      addToast({
        type: 'success',
        title: 'Indicador criado',
        message: 'O indicador foi criado com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao criar',
        message: 'Não foi possível criar o indicador.',
      })
    }
  }

  const handleUpdate = async (data: IndicatorFormSchema) => {
    if (!editingIndicator) return

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateMutation.mutateAsync({ id: editingIndicator.id, data: data as any })
      setEditingIndicator(null)
      addToast({
        type: 'success',
        title: 'Indicador atualizado',
        message: 'O indicador foi atualizado com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao atualizar',
        message: 'Não foi possível atualizar o indicador.',
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingIndicator) return

    try {
      await deleteMutation.mutateAsync(deletingIndicator.id)
      setDeletingIndicator(null)
      addToast({
        type: 'success',
        title: 'Indicador excluído',
        message: 'O indicador foi excluído com sucesso.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir o indicador.',
      })
    }
  }

  if (isLoading) {
    return <PageLoader text="Carregando indicadores..." />
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar indicadores"
        message={error instanceof Error ? error.message : 'Não foi possível carregar os indicadores.'}
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">Painel de métricas</p>
          <h1 className="text-3xl font-semibold text-foreground mt-2">Indicadores</h1>
          <p className="text-muted mt-2 max-w-2xl">
            Priorize tendências, sinais críticos e atualizações recentes para decisões rápidas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButtons
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            disabled={!indicators || filteredData.length === 0}
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
            Novo Indicador
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
              placeholder="Buscar indicadores..."
              className="md:col-span-3"
            />
            <FilterSelect
              label="Tendência"
              value={filters.trend || 'all'}
              onChange={(value) => setFilter('trend', value === 'all' ? '' : value)}
              options={[
                { value: 'all', label: 'Todas' },
                { value: 'up', label: 'Alta' },
                { value: 'down', label: 'Baixa' },
                { value: 'stable', label: 'Estável' },
              ]}
            />
            <FilterSelect
              label="Categoria"
              value={filters.category || 'all'}
              onChange={(value) => setFilter('category', value === 'all' ? '' : value)}
              options={categoryOptions}
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
      {indicators && indicators.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
          <p>
            Mostrando {formatNumber(paginatedIndicators.length)} de {formatNumber(filteredData.length)} indicador(es)
            {hasActiveFilters && indicators.length > 0 && (
              <span className="ml-2 text-xs text-muted">• {formatNumber(indicators.length)} no total</span>
            )}
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em]">
            {hasActiveFilters ? 'Filtro ativo' : 'Visão completa'}
          </span>
        </div>
      )}

      {/* List */}
      {!indicators || indicators.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="h-8 w-8" />}
          title="Nenhum indicador cadastrado"
          description="Crie seu primeiro indicador para começar a acompanhar métricas."
          action={
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Criar Indicador
            </Button>
          }
        />
      ) : filteredData.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="h-8 w-8" />}
          title="Nenhum indicador encontrado"
          description="Tente ajustar os filtros de busca."
          action={
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedIndicators.map((indicator) => (
              <IndicatorCard
                key={indicator.id}
                indicator={indicator}
                onEdit={setEditingIndicator}
                onDelete={setDeletingIndicator}
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
        title="Novo Indicador"
        size="lg"
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-10">
              <Loader text="Carregando formulário..." />
            </div>
          }
        >
          <IndicatorForm
            onSubmit={handleCreate}
            onCancel={() => setCreateModalOpen(false)}
            loading={createMutation.isPending}
          />
        </Suspense>
      </LazyModal>

      {/* Edit Modal */}
      <LazyModal
        open={!!editingIndicator}
        onClose={() => setEditingIndicator(null)}
        title="Editar Indicador"
        size="lg"
      >
        {editingIndicator && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-10">
                <Loader text="Carregando formulário..." />
              </div>
            }
          >
            <IndicatorForm
              indicator={editingIndicator}
              onSubmit={handleUpdate}
              onCancel={() => setEditingIndicator(null)}
              loading={updateMutation.isPending}
            />
          </Suspense>
        )}
      </LazyModal>

      {/* Delete Confirmation Modal */}
      <LazyModal
        open={!!deletingIndicator}
        onClose={() => setDeletingIndicator(null)}
        title="Excluir Indicador"
      >
        <div className="space-y-4">
          <p className="text-muted">
            Tem certeza que deseja excluir o indicador{' '}
            <strong>{deletingIndicator?.name}</strong>? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeletingIndicator(null)}>
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

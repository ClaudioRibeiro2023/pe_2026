import { useState, useMemo, useCallback } from 'react'
import { BarChart3, ClipboardList, TrendingUp, Calendar } from '@/shared/ui/icons'
import { PageLoader } from '@/shared/ui/Loader'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PageHeader } from '@/shared/ui/PageHeader'
import type { Crumb } from '@/shared/ui/Breadcrumbs'
import { FilterBar, FilterField, filterSelectClass, filterInputClass } from '@/shared/ui/FilterBar'
import { useReportData } from '../hooks'
import type { DateRange } from '../hooks'
import { ExecutiveReport } from '../components/ExecutiveReport'
import { PackActionsReport } from '../components/PackActionsReport'
import { ProgressReport } from '../components/ProgressReport'
import { useAreas } from '@/features/area-plans/hooks'
import { useQuery } from '@tanstack/react-query'
import { fetchAreaPlans } from '@/features/area-plans/api-mock'

type ReportTab = 'executive' | 'actions' | 'progress'

const TABS: { id: ReportTab; label: string; icon: React.ElementType }[] = [
  { id: 'executive', label: 'Executivo', icon: BarChart3 },
  { id: 'actions', label: 'Acoes', icon: ClipboardList },
  { id: 'progress', label: 'Progresso', icon: TrendingUp },
]

const DEFAULT_DATE_RANGE: DateRange = { start: '2026-01-01', end: '2026-12-31' }

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('executive')
  const [selectedAreaSlug, setSelectedAreaSlug] = useState('rh')
  const [selectedPackId, setSelectedPackId] = useState<string | undefined>(undefined)
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE)

  const { data: areas = [] } = useAreas()
  const { data: plans = [] } = useQuery({
    queryKey: ['area-plans', 2026],
    queryFn: () => fetchAreaPlans(2026),
  })

  // Derive packs from selected area
  const selectedArea = useMemo(() => areas.find(a => a.slug === selectedAreaSlug), [areas, selectedAreaSlug])
  const areaPlans = useMemo(() => plans.filter(p => p.area_id === selectedArea?.id), [plans, selectedArea])
  const availablePacks = useMemo(() => {
    return areaPlans.filter(p => p.pack_id).map(p => ({ id: p.pack_id!, label: p.pack_id!, planTitle: p.title }))
  }, [areaPlans])

  // Auto-select first pack when area changes
  const effectivePackId = useMemo(() => {
    if (selectedPackId && availablePacks.some(p => p.id === selectedPackId)) return selectedPackId
    return availablePacks[0]?.id || undefined
  }, [selectedPackId, availablePacks])

  const handleAreaChange = useCallback((slug: string) => {
    setSelectedAreaSlug(slug)
    setSelectedPackId(undefined)
  }, [])

  const { kpis, statusDistribution, programBreakdown, actions, planProgress, isLoading } = useReportData(effectivePackId, dateRange)

  const areaName = selectedArea?.name || selectedAreaSlug.toUpperCase()
  const filterSummary = { area: areaName, pack: effectivePackId || '-', periodStart: dateRange.start, periodEnd: dateRange.end }

  if (isLoading) {
    return <PageLoader text="Carregando relatorios..." />
  }

  const breadcrumbs: Crumb[] = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Relatórios' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Relatórios"
        description="Visão consolidada de planos, ações e progresso por área"
        breadcrumbs={breadcrumbs}
      />

      {/* Filters */}
      <FilterBar>
        <FilterField label="Area:" htmlFor="rpt-area">
          <select
            id="rpt-area"
            value={selectedAreaSlug}
            onChange={e => handleAreaChange(e.target.value)}
            className={filterSelectClass}
          >
            {areas.map(a => (
              <option key={a.slug} value={a.slug}>{a.name}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Pack:" htmlFor="rpt-pack">
          {availablePacks.length > 0 ? (
            <select
              id="rpt-pack"
              value={effectivePackId || ''}
              onChange={e => setSelectedPackId(e.target.value)}
              className={filterSelectClass}
            >
              {availablePacks.map(p => (
                <option key={p.id} value={p.id}>{p.id}</option>
              ))}
            </select>
          ) : (
            <span className="text-sm text-muted italic">nenhum</span>
          )}
        </FilterField>
        <FilterField label="" htmlFor="rpt-start">
          <Calendar className="h-3.5 w-3.5 text-muted" />
        </FilterField>
        <FilterField label="De:" htmlFor="rpt-start">
          <input
            id="rpt-start"
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className={filterInputClass}
          />
        </FilterField>
        <FilterField label="Ate:" htmlFor="rpt-end">
          <input
            id="rpt-end"
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className={filterInputClass}
          />
        </FilterField>
      </FilterBar>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-muted hover:text-foreground hover:border-border'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {!effectivePackId ? (
        <EmptyState
          title="Nenhum pack encontrado"
          description="A area selecionada nao possui packs de planejamento. Selecione outra area."
        />
      ) : (
        <>
          {activeTab === 'executive' && (
            <ExecutiveReport
              kpis={kpis}
              statusDistribution={statusDistribution}
              areaName={areaName}
              packId={effectivePackId}
              filters={filterSummary}
            />
          )}
          {activeTab === 'actions' && (
            <PackActionsReport
              actions={actions}
              areaName={areaName}
              filters={filterSummary}
            />
          )}
          {activeTab === 'progress' && (
            <ProgressReport
              kpis={kpis}
              statusDistribution={statusDistribution}
              programBreakdown={programBreakdown}
              planProgress={planProgress}
              areaName={areaName}
              filters={filterSummary}
            />
          )}
        </>
      )}
    </div>
  )
}

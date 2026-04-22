/**
 * Dashboard de Iniciativas (INITs) PE2026
 * 
 * Exibe todas as iniciativas (corporativas e setoriais) organizadas por área,
 * com filtros por prioridade, status, pilar e motor estratégico.
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Building2,
  Filter,
  Search,
  Calendar,
  DollarSign,
  ArrowRight,
  LayoutGrid,
  Download,
  ChevronDown,
  Settings
} from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageHeader } from '@/shared/ui/PageHeader'
import { PageLoader } from '@/shared/ui/Loader'
import { FilterBar } from '@/shared/ui/FilterBar'
import type { Crumb } from '@/shared/ui/Breadcrumbs'
import { usePillars } from '@/features/area-plans/hooks'
import { useCanonicalInitiatives } from '@/features/initiatives/hooks'
import type { Initiative } from '@/features/area-plans/types'

// Tipos de visualização
type ViewMode = 'grid' | 'list'
type FilterPriority = 'ALL' | 'P0' | 'P1' | 'P2'
type FilterStatus = 'ALL' | 'PLANEJADA' | 'EM_ANDAMENTO' | 'CONCLUIDA'
type FilterTypeCategory = 'ALL' | 'CORP' | 'SET'

// Cores por prioridade
const PRIORITY_COLORS = {
  P0: { bg: 'bg-danger-100', text: 'text-danger-700', border: 'border-danger-200', icon: 'text-danger-600' },
  P1: { bg: 'bg-warning-100', text: 'text-warning-700', border: 'border-warning-200', icon: 'text-warning-600' },
  P2: { bg: 'bg-success-100', text: 'text-success-700', border: 'border-success-200', icon: 'text-success-600' },
}

// Cores por tipo
const TYPE_COLORS: Record<string, string> = {
  MET: 'bg-primary-100 text-primary-700',
  SIS: 'bg-info-100 text-info-700',
  COM: 'bg-success-100 text-success-700',
  ENT: 'bg-warning-100 text-warning-700',
  ORG: 'bg-danger-100 text-danger-700',
}

// Badge de prioridade
function PriorityBadge({ priority }: { priority: string }) {
  const colors = PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.P2
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
      {priority}
    </span>
  )
}

// Badge de tipo
function TypeBadge({ type }: { type: string }) {
  const className = TYPE_COLORS[type] || 'bg-gray-100 text-gray-700'
  const labels: Record<string, string> = {
    MET: 'Metodologia',
    SIS: 'Sistema',
    COM: 'Comunicação',
    ENT: 'Entrega',
    ORG: 'Organização',
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {labels[type] || type}
    </span>
  )
}

// Card de iniciativa
function InitiativeCard({ 
  initiative, 
  areaName, 
  onClick 
}: { 
  initiative: Initiative
  areaName: string
  onClick: () => void 
}) {
  const isSectorial = initiative.code.includes('-') && !initiative.code.startsWith('INIT-00')
  const priorityColors = PRIORITY_COLORS[initiative.priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.P2
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
      style={{ borderLeftColor: initiative.priority === 'P0' ? '#ef4444' : initiative.priority === 'P1' ? '#f59e0b' : '#10b981' }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <PriorityBadge priority={initiative.priority || 'P2'} />
              <TypeBadge type={initiative.type || 'MET'} />
              {isSectorial && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                  Setorial
                </span>
              )}
            </div>
            
            <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
              {initiative.code}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {initiative.title}
            </p>
            
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {areaName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {initiative.end_date || '—'}
              </span>
              {initiative.budget_estimate && initiative.budget_estimate > 0 && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {(initiative.budget_estimate / 1000).toFixed(0)}K
                </span>
              )}
            </div>
          </div>
          
          <div className={`p-2 rounded-full ${priorityColors.bg}`}>
            {initiative.priority === 'P0' ? (
              <AlertCircle className={`w-4 h-4 ${priorityColors.icon}`} />
            ) : initiative.priority === 'P1' ? (
              <TrendingUp className={`w-4 h-4 ${priorityColors.icon}`} />
            ) : (
              <CheckCircle2 className={`w-4 h-4 ${priorityColors.icon}`} />
            )}
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
            {(initiative.status || 'PLANEJADA').replace('_', ' ')}
          </span>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            Ver detalhes
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Estatísticas
function StatsSummary({ initiatives }: { initiatives: Initiative[] }) {
  const stats = useMemo(() => {
    const total = initiatives.length
    const p0 = initiatives.filter(i => i.priority === 'P0').length
    const p1 = initiatives.filter(i => i.priority === 'P1').length
    const p2 = initiatives.filter(i => i.priority === 'P2').length
    const corp = initiatives.filter(i => i.code.startsWith('INIT-00') || !i.code.includes('-')).length
    const setorial = total - corp
    const emAndamento = initiatives.filter(i => i.status === 'EM_ANDAMENTO').length
    const concluidas = initiatives.filter(i => i.status === 'CONCLUIDA').length
    
    const totalBudget = initiatives.reduce((sum, i) => sum + ((i as any).budget_allocated || i.budget_estimate || 0), 0)
    
    return { total, p0, p1, p2, corp, setorial, emAndamento, concluidas, totalBudget }
  }, [initiatives])
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Target className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Total INITs</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Prioridade P0</p>
              <p className="text-2xl font-bold text-danger-600">{stats.p0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Prioridade P1</p>
              <p className="text-2xl font-bold text-warning-600">{stats.p1}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Prioridade P2</p>
              <p className="text-2xl font-bold text-success-600">{stats.p2}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Setoriais</p>
              <p className="text-2xl font-bold">{stats.setorial}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-info-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Orçamento</p>
              <p className="text-lg font-bold">
                {(stats.totalBudget / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Página principal
export function InitiativesDashboardPage() {
  const navigate = useNavigate()
  
  // Estados dos filtros
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('ALL')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL')
  const [filterTypeCategory, setFilterTypeCategory] = useState<FilterTypeCategory>('ALL')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterArea, _setFilterArea] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filtros avançados
  const [filterPillar, setFilterPillar] = useState<string>('ALL')
  const [filterMotor, setFilterMotor] = useState<string>('ALL')
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterStartDate, setFilterStartDate] = useState<string>('')
  const [filterEndDate, setFilterEndDate] = useState<string>('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'budget'>('priority')
  
  // Carregar dados
  const { data: initiatives = [], isLoading: initiativesLoading } = useCanonicalInitiatives()
  const { data: pillars = [], isLoading: pillarsLoading } = usePillars()
  
  // Lista de motores únicos das iniciativas
  const motors = useMemo(() => {
    const motorSet = new Set<string>()
    initiatives.forEach(i => {
      if (i.motor?.code) motorSet.add(i.motor.code)
    })
    return Array.from(motorSet).sort()
  }, [initiatives])
  
  // Filtrar iniciativas
  const filteredInitiatives = useMemo(() => {
    let result = initiatives.filter(initiative => {
      // Filtro por prioridade
      if (filterPriority !== 'ALL' && initiative.priority !== filterPriority) {
        return false
      }
      
      // Filtro por status
      if (filterStatus !== 'ALL' && initiative.status !== filterStatus) {
        return false
      }
      
      // Filtro por tipo (corporativa vs setorial)
      const isCorp = initiative.code.startsWith('INIT-00') || !initiative.code.includes('-')
      if (filterTypeCategory === 'CORP' && !isCorp) return false
      if (filterTypeCategory === 'SET' && isCorp) return false
      
      // Filtro por área - usar campo owner como proxy
      if (filterArea !== 'ALL') {
        const ownerMatch = (initiative.owner || '').toLowerCase().includes(filterArea.toLowerCase())
        if (!ownerMatch) return false
      }
      
      // Filtro avançado: por pilar
      if (filterPillar !== 'ALL' && initiative.pillar?.code !== filterPillar) {
        return false
      }
      
      // Filtro avançado: por motor
      if (filterMotor !== 'ALL' && initiative.motor?.code !== filterMotor) {
        return false
      }
      
      // Filtro avançado: por tipo de iniciativa
      if (filterType !== 'ALL' && initiative.type !== filterType) {
        return false
      }
      
      // Filtro avançado: por período
      if (filterStartDate && initiative.start_date) {
        if (initiative.start_date < filterStartDate) return false
      }
      if (filterEndDate && initiative.end_date) {
        if (initiative.end_date > filterEndDate) return false
      }
      
      // Filtro de busca
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const searchable = [
          initiative.code,
          initiative.title,
          initiative.owner,
          initiative.sponsor,
          initiative.pillar?.code,
          initiative.motor?.code,
          initiative.type,
        ].filter(Boolean).join(' ').toLowerCase()
        
        if (!searchable.includes(query)) return false
      }
      
      return true
    })
    
    // Ordenação
    result.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { P0: 0, P1: 1, P2: 2 }
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3
        return aPriority - bPriority
      }
      if (sortBy === 'date') {
        return (a.end_date || '').localeCompare(b.end_date || '')
      }
      if (sortBy === 'budget') {
        return (b.budget_estimate || 0) - (a.budget_estimate || 0)
      }
      return 0
    })
    
    return result
  }, [initiatives, filterPriority, filterStatus, filterTypeCategory, filterArea, filterPillar, filterMotor, filterType, filterStartDate, filterEndDate, searchQuery, sortBy])
  
  // Agrupar por área para visualização (usando owner como proxy)
  const initiativesByArea = useMemo(() => {
    const grouped = new Map<string, Initiative[]>()
    
    filteredInitiatives.forEach(initiative => {
      const areaName = (initiative.owner || 'Sem Área')
      if (!grouped.has(areaName)) {
        grouped.set(areaName, [])
      }
      grouped.get(areaName)!.push(initiative)
    })
    
    return Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filteredInitiatives])
  
  const isLoading = initiativesLoading || pillarsLoading
  
  // Resetar filtros avançados
  const resetAdvancedFilters = () => {
    setFilterPillar('ALL')
    setFilterMotor('ALL')
    setFilterType('ALL')
    setFilterStartDate('')
    setFilterEndDate('')
  }
  
  if (isLoading) {
    return <PageLoader text="Carregando iniciativas..." />
  }
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Iniciativas PE2026"
        description="Visão consolidada das 84 iniciativas (22 corporativas + 48 setoriais)"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Planejamento', href: '/planning' },
          { label: 'Iniciativas' },
        ] as Crumb[]}
        actions={
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        }
      />
      
      {/* Estatísticas */}
      <StatsSummary initiatives={initiatives} />
      
      {/* Filtros */}
      <FilterBar>
        <div className="flex flex-wrap items-center gap-3">
          {/* Busca */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Buscar por código, título, responsável..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          {/* Filtro de Prioridade */}
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value as FilterPriority)}
            className="h-9 px-3 rounded-lg border border-border bg-surface text-sm"
          >
            <option value="ALL">Todas Prioridades</option>
            <option value="P0">P0 - Crítica</option>
            <option value="P1">P1 - Estratégica</option>
            <option value="P2">P2 - Importante</option>
          </select>
          
          {/* Filtro de Status */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as FilterStatus)}
            className="h-9 px-3 rounded-lg border border-border bg-surface text-sm"
          >
            <option value="ALL">Todos Status</option>
            <option value="PLANEJADA">Planejada</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDA">Concluída</option>
          </select>
          
          {/* Filtro de Tipo (Corp vs Set) */}
          <select
            value={filterTypeCategory}
            onChange={e => setFilterTypeCategory(e.target.value as FilterTypeCategory)}
            className="h-9 px-3 rounded-lg border border-border bg-surface text-sm"
          >
            <option value="ALL">Todos Tipos</option>
            <option value="CORP">Corporativas</option>
            <option value="SET">Setoriais</option>
          </select>
          
          {/* Toggle Filtros Avançados */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={showAdvancedFilters ? 'bg-primary-100 text-primary-700' : ''}
          >
            <Settings className="w-4 h-4 mr-1" />
            Filtros
            <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </Button>
          
          {/* Ordenação */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="h-9 px-3 rounded-lg border border-border bg-surface text-sm"
          >
            <option value="priority">Ordenar: Prioridade</option>
            <option value="date">Ordenar: Data</option>
            <option value="budget">Ordenar: Orçamento</option>
          </select>
          
          {/* Toggle View */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-sm flex items-center gap-1 ${
                viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'hover:bg-accent'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'hover:bg-accent'
              }`}
            >
              <LayoutGrid className="w-4 h-4 rotate-90" />
              Lista
            </button>
          </div>
        </div>
        
        {/* Filtros Avançados Expandidos */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap items-center gap-3">
              {/* Filtro por Pilar */}
              <select
                value={filterPillar}
                onChange={e => setFilterPillar(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-surface text-sm"
              >
                <option value="ALL">Todos Pilares</option>
                {pillars.map(pillar => (
                  <option key={pillar.id} value={pillar.code}>{pillar.code} - {pillar.title}</option>
                ))}
              </select>
              
              {/* Filtro por Motor */}
              <select
                value={filterMotor}
                onChange={e => setFilterMotor(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-surface text-sm"
              >
                <option value="ALL">Todos Motores</option>
                {motors.map(motor => (
                  <option key={motor} value={motor}>{motor}</option>
                ))}
              </select>
              
              {/* Filtro por Tipo de Iniciativa */}
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-surface text-sm"
              >
                <option value="ALL">Todos Tipos de Iniciativa</option>
                <option value="MET">Metodologia</option>
                <option value="SIS">Sistema</option>
                <option value="COM">Comunicação</option>
                <option value="ENT">Entrega</option>
                <option value="ORG">Organização</option>
              </select>
              
              {/* Filtro por Data Início */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Início:</span>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={e => setFilterStartDate(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-border bg-surface text-sm"
                />
              </div>
              
              {/* Filtro por Data Fim */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Fim:</span>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={e => setFilterEndDate(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-border bg-surface text-sm"
                />
              </div>
              
              {/* Reset Filtros Avançados */}
              <Button variant="ghost" size="sm" onClick={resetAdvancedFilters}>
                Limpar filtros
              </Button>
            </div>
          </div>
        )}
      </FilterBar>
      
      {/* Resultados */}
      <div className="space-y-8">
        {initiativesByArea.length > 0 ? (
          initiativesByArea.map(([areaName, areaInitiatives]) => (
            <div key={areaName}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold">{areaName}</h2>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {areaInitiatives.length} iniciativas
                </span>
              </div>
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {areaInitiatives.map(initiative => (
                    <InitiativeCard
                      key={initiative.id}
                      initiative={initiative}
                      areaName={areaName}
                      onClick={() => navigate(`/planning/initiatives/${initiative.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="divide-y divide-border">
                    {areaInitiatives.map(initiative => (
                      <div
                        key={initiative.id}
                        className="p-4 flex items-center justify-between hover:bg-accent/50 cursor-pointer"
                        onClick={() => navigate(`/planning/initiatives/${initiative.id}`)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <PriorityBadge priority={initiative.priority || 'P2'} />
                            <TypeBadge type={initiative.type || 'MET'} />
                            <span className="text-sm font-mono text-muted">{initiative.code}</span>
                          </div>
                          <p className="font-medium text-foreground truncate">
                            {initiative.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted ml-4">
                          <span>{initiative.end_date || '—'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ))
        ) : (
          <Card className="py-12">
            <div className="text-center">
              <Filter className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma iniciativa encontrada
              </h3>
              <p className="text-muted">
                Ajuste os filtros para ver mais resultados.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

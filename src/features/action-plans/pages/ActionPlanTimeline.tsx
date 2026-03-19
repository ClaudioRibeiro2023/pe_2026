import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageLoader } from '@/shared/ui/Loader'
import { ErrorState } from '@/shared/ui/ErrorState'
import { useActionPlans } from '../hooks'
import type { ActionPlan, ActionPlanHealth } from '../types'

// Cores de saúde
const healthColors: Record<ActionPlanHealth, string> = {
  on_track: 'bg-success-500',
  at_risk: 'bg-warning-500',
  off_track: 'bg-danger-500',
}

// Cores de área (para diferenciar visualmente)
const areaColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-cyan-500',
  'bg-teal-500',
  'bg-orange-500',
]

function getAreaColor(areaId: string, areas: string[]): string {
  const index = areas.indexOf(areaId)
  return areaColors[index % areaColors.length]
}

// Calcular posição e largura da barra no timeline
function calculateBarPosition(
  startDate: string | null,
  endDate: string | null,
  timelineStart: Date,
  timelineEnd: Date
): { left: number; width: number } | null {
  if (!startDate || !endDate) return null
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  const totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))
  
  const startOffset = Math.max(0, Math.ceil((start.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)))
  const endOffset = Math.min(totalDays, Math.ceil((end.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)))
  
  const left = (startOffset / totalDays) * 100
  const width = Math.max(2, ((endOffset - startOffset) / totalDays) * 100)
  
  return { left, width }
}

// Gerar array de meses para o header
function generateMonths(start: Date, end: Date): { month: string; year: number; width: number }[] {
  const months: { month: string; year: number; width: number }[] = []
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  
  const current = new Date(start)
  current.setDate(1)
  
  while (current <= end) {
    const monthStart = new Date(current)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    
    const effectiveStart = monthStart < start ? start : monthStart
    const effectiveEnd = monthEnd > end ? end : monthEnd
    
    const daysInRange = Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const width = (daysInRange / totalDays) * 100
    
    months.push({
      month: current.toLocaleDateString('pt-BR', { month: 'short' }),
      year: current.getFullYear(),
      width,
    })
    
    current.setMonth(current.getMonth() + 1)
  }
  
  return months
}

// Componente de barra do Gantt
function GanttBar({ 
  plan, 
  position, 
  areaColor,
  onClick,
}: { 
  plan: ActionPlan
  position: { left: number; width: number }
  areaColor: string
  onClick: (plan: ActionPlan) => void
}) {
  return (
    <div
      className="absolute h-6 rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center overflow-hidden group"
      style={{ left: `${position.left}%`, width: `${position.width}%` }}
      onClick={() => onClick(plan)}
      title={`${plan.title} (${plan.progress}%)`}
    >
      {/* Barra de fundo */}
      <div className={`absolute inset-0 ${areaColor} opacity-30 rounded`} />
      
      {/* Barra de progresso */}
      <div 
        className={`absolute inset-y-0 left-0 ${healthColors[plan.health]} rounded-l ${plan.progress === 100 ? 'rounded-r' : ''}`}
        style={{ width: `${plan.progress}%` }}
      />
      
      {/* Texto */}
      <span className="relative z-10 px-2 text-xs font-medium text-foreground truncate">
        {plan.title}
      </span>
      
      {/* Tooltip on hover */}
      <div className="absolute left-0 top-full mt-1 bg-foreground text-surface text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap pointer-events-none">
        {plan.progress}% concluído • {plan.area_name}
      </div>
    </div>
  )
}

export function ActionPlanTimeline() {
  const { data: plans, isLoading, error, refetch } = useActionPlans()
  const [viewMonths, setViewMonths] = useState(6) // Meses visíveis
  const [startOffset, setStartOffset] = useState(0) // Offset em meses do início
  const [filterArea, setFilterArea] = useState<string | null>(null)
  
  // Calcular período do timeline
  const { timelineStart, timelineEnd, months } = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() + startOffset, 1)
    const end = new Date(now.getFullYear(), now.getMonth() + startOffset + viewMonths, 0)
    
    return {
      timelineStart: start,
      timelineEnd: end,
      months: generateMonths(start, end),
    }
  }, [viewMonths, startOffset])
  
  // Filtrar e ordenar planos
  const filteredPlans = useMemo(() => {
    if (!plans) return []
    
    return plans
      .filter(p => {
        // Filtrar por área se selecionada
        if (filterArea && p.area_id !== filterArea) return false
        
        // Filtrar apenas planos com datas
        if (!p.when_start && !p.when_end && !p.due_date) return false
        
        return true
      })
      .sort((a, b) => {
        // Ordenar por data de início
        const aStart = a.when_start || a.due_date || ''
        const bStart = b.when_start || b.due_date || ''
        return aStart.localeCompare(bStart)
      })
  }, [plans, filterArea])
  
  // Extrair áreas únicas
  const uniqueAreas = useMemo(() => {
    if (!plans) return []
    const areas = new Map<string, string>()
    plans.forEach(p => {
      if (p.area_id && p.area_name) {
        areas.set(p.area_id, p.area_name)
      }
    })
    return Array.from(areas.entries()).map(([id, name]) => ({ id, name }))
  }, [plans])
  
  const areaIds = uniqueAreas.map(a => a.id)
  
  const handlePlanClick = (_plan: ActionPlan) => {
    // TODO: Abrir modal de detalhes
  }
  
  const navigateTimeline = (direction: 'prev' | 'next') => {
    setStartOffset(prev => direction === 'prev' ? prev - 1 : prev + 1)
  }
  
  if (isLoading) {
    return <PageLoader text="Carregando Timeline..." />
  }
  
  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar Timeline"
        message={error instanceof Error ? error.message : 'Erro desconhecido'}
        onRetry={refetch}
      />
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/action-plans">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Timeline - Planos de Ação
            </h1>
            <p className="text-muted text-sm">
              Visualização temporal do portfólio
            </p>
          </div>
        </div>
        
        {/* Controles */}
        <div className="flex items-center gap-2">
          {/* Filtro de área */}
          <select
            value={filterArea || ''}
            onChange={(e) => setFilterArea(e.target.value || null)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-surface">
            <option value="">Todas as áreas</option>
            {uniqueAreas.map(area => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>
          
          {/* Zoom */}
          <select
            value={viewMonths}
            onChange={(e) => setViewMonths(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-surface">
            <option value={3}>3 meses</option>
            <option value={6}>6 meses</option>
            <option value={12}>12 meses</option>
          </select>
          
          {/* Navegação */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => navigateTimeline('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStartOffset(0)}>
              Hoje
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateTimeline('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Timeline */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header com meses */}
            <div className="flex border-b border-border bg-accent">
              <div className="w-64 flex-shrink-0 p-3 border-r border-border">
                <span className="text-sm font-medium text-foreground">
                  Plano de Ação
                </span>
              </div>
              <div className="flex-1 flex">
                {months.map((m, i) => (
                  <div 
                    key={i}
                    className="text-center py-2 border-r border-border last:border-r-0"
                    style={{ width: `${m.width}%` }}
                  >
                    <span className="text-xs font-medium text-muted uppercase">
                      {m.month}
                    </span>
                    {i === 0 || months[i-1]?.year !== m.year ? (
                      <span className="text-xs text-muted ml-1">{m.year}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Linhas do Gantt */}
            {filteredPlans.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredPlans.map(plan => {
                  const startDate = plan.when_start || plan.due_date
                  const endDate = plan.when_end || plan.due_date
                  const position = calculateBarPosition(startDate, endDate, timelineStart, timelineEnd)
                  
                  return (
                    <div key={plan.id} className="flex hover:bg-accent">
                      {/* Nome do plano */}
                      <div className="w-64 flex-shrink-0 p-3 border-r border-border">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${healthColors[plan.health]}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {plan.title}
                            </p>
                            <p className="text-xs text-muted truncate">
                              {plan.area_name}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Área do Gantt */}
                      <div className="flex-1 relative h-12 py-3">
                        {position ? (
                          <GanttBar
                            plan={plan}
                            position={position}
                            areaColor={getAreaColor(plan.area_id || '', areaIds)}
                            onClick={handlePlanClick}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs text-muted">Sem datas definidas</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-muted">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum plano com datas definidas</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Legenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="text-muted">Saúde:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-success-500" />
                <span>No Prazo</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-warning-500" />
                <span>Em Risco</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-danger-500" />
                <span>Atrasado</span>
              </div>
            </div>
            <span className="text-muted">
              {filteredPlans.length} planos exibidos
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

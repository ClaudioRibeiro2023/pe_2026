import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  User,
  MoreVertical,
  Plus,
  AlertTriangle,
} from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageLoader } from '@/shared/ui/Loader'
import { ErrorState } from '@/shared/ui/ErrorState'
import { formatDate } from '@/shared/lib/format'
import { useActionPlans, useUpdateActionPlan } from '../hooks'
import { useToast } from '@/shared/ui/Toast'
import type { ActionPlan, ActionPlanStatus, ActionPlanHealth } from '../types'

// Configuração das colunas do Kanban
const KANBAN_COLUMNS: { id: ActionPlanStatus; title: string; color: string }[] = [
  { id: 'draft', title: 'Rascunho', color: 'bg-muted' },
  { id: 'planned', title: 'Planejado', color: 'bg-blue-500' },
  { id: 'in_progress', title: 'Em Execução', color: 'bg-primary-500' },
  { id: 'blocked', title: 'Bloqueado', color: 'bg-warning-500' },
  { id: 'completed', title: 'Concluído', color: 'bg-success-500' },
]

// Cores de saúde
const healthColors: Record<ActionPlanHealth, string> = {
  on_track: 'border-l-success-500',
  at_risk: 'border-l-warning-500',
  off_track: 'border-l-danger-500',
}

const healthLabels: Record<ActionPlanHealth, string> = {
  on_track: 'No Prazo',
  at_risk: 'Em Risco',
  off_track: 'Atrasado',
}

// Card do Kanban
function KanbanCard({ 
  plan, 
  onDragStart,
  onClick,
}: { 
  plan: ActionPlan
  onDragStart: (e: React.DragEvent, plan: ActionPlan) => void
  onClick: (plan: ActionPlan) => void
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, plan)}
      onClick={() => onClick(plan)}
      className={`
        bg-surface rounded-lg border border-border
        p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow
        border-l-4 ${healthColors[plan.health]}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-sm text-foreground line-clamp-2">
          {plan.title}
        </h4>
        <button className="text-muted hover:text-foreground p-1">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      
      {plan.area_name && (
        <p className="text-xs text-muted mb-2">
          {plan.area_name}
        </p>
      )}
      
      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted">Progresso</span>
          <span className="font-medium text-foreground">{plan.progress}%</span>
        </div>
        <div className="h-1.5 bg-accent rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${plan.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-3">
          {plan.responsible && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[80px]">{plan.responsible}</span>
            </div>
          )}
          {plan.due_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(plan.due_date)}</span>
            </div>
          )}
        </div>
        {plan.health !== 'on_track' && (
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
            plan.health === 'at_risk' 
              ? 'bg-warning-100 text-warning-700' 
              : 'bg-danger-100 text-danger-700'
          }`}>
            {healthLabels[plan.health]}
          </span>
        )}
      </div>
    </div>
  )
}

// Coluna do Kanban
function KanbanColumn({ 
  column, 
  plans,
  onDragOver,
  onDrop,
  onDragStart,
  onCardClick,
}: { 
  column: { id: ActionPlanStatus; title: string; color: string }
  plans: ActionPlan[]
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, status: ActionPlanStatus) => void
  onDragStart: (e: React.DragEvent, plan: ActionPlan) => void
  onCardClick: (plan: ActionPlan) => void
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  
  return (
    <div 
      className={`
        flex-1 min-w-[280px] max-w-[320px] bg-accent rounded-lg
        ${isDragOver ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}
      `}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
        onDragOver(e)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false)
        onDrop(e, column.id)
      }}
    >
      {/* Header da coluna */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${column.color}`} />
            <h3 className="font-medium text-foreground">{column.title}</h3>
            <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded-full">
              {plans.length}
            </span>
          </div>
          <button className="text-muted hover:text-foreground p-1">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Cards */}
      <div className="p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-280px)] overflow-y-auto">
        {plans.map(plan => (
          <KanbanCard 
            key={plan.id} 
            plan={plan} 
            onDragStart={onDragStart}
            onClick={onCardClick}
          />
        ))}
        {plans.length === 0 && (
          <div className="text-center py-8 text-muted text-sm">
            Nenhum plano
          </div>
        )}
      </div>
    </div>
  )
}

export function ActionPlanKanban() {
  const { data: plans, isLoading, error, refetch } = useActionPlans()
  const updateMutation = useUpdateActionPlan()
  const { addToast } = useToast()
  const [draggedPlan, setDraggedPlan] = useState<ActionPlan | null>(null)
  
  // Agrupar planos por status
  const plansByStatus = useMemo((): Record<ActionPlanStatus, ActionPlan[]> => {
    const grouped: Record<ActionPlanStatus, ActionPlan[]> = {
      draft: [],
      planned: [],
      in_progress: [],
      blocked: [],
      completed: [],
      cancelled: [],
    }
    
    if (!plans) return grouped
    
    plans.forEach(plan => {
      if (grouped[plan.status]) {
        grouped[plan.status].push(plan)
      }
    })
    
    return grouped
  }, [plans])
  
  const handleDragStart = (e: React.DragEvent, plan: ActionPlan) => {
    setDraggedPlan(plan)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  const handleDrop = async (e: React.DragEvent, newStatus: ActionPlanStatus) => {
    e.preventDefault()
    
    if (!draggedPlan || draggedPlan.status === newStatus) {
      setDraggedPlan(null)
      return
    }
    
    try {
      await updateMutation.mutateAsync({
        id: draggedPlan.id,
        data: { status: newStatus },
      })
      
      addToast({
        type: 'success',
        title: 'Status atualizado',
        message: `"${draggedPlan.title}" movido para ${KANBAN_COLUMNS.find(c => c.id === newStatus)?.title}`,
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao atualizar',
        message: 'Não foi possível atualizar o status do plano.',
      })
    }
    
    setDraggedPlan(null)
  }
  
  const handleCardClick = (_plan: ActionPlan) => {
    // TODO: Abrir modal de detalhes
  }
  
  if (isLoading) {
    return <PageLoader text="Carregando Kanban..." />
  }
  
  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar Kanban"
        message={error instanceof Error ? error.message : 'Erro desconhecido'}
        onRetry={refetch}
      />
    )
  }
  
  // Estatísticas rápidas
  const stats = {
    total: plans?.length || 0,
    atRisk: plans?.filter(p => p.health === 'at_risk').length || 0,
    offTrack: plans?.filter(p => p.health === 'off_track').length || 0,
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
              Kanban - Planos de Ação
            </h1>
            <p className="text-muted text-sm">
              Arraste os cards para alterar o status
            </p>
          </div>
        </div>
        
        {/* Alertas */}
        {(stats.atRisk > 0 || stats.offTrack > 0) && (
          <div className="flex items-center gap-2 px-3 py-2 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-warning-600" />
            <span className="text-sm text-warning-700 dark:text-warning-400">
              {stats.atRisk + stats.offTrack} planos precisam de atenção
            </span>
          </div>
        )}
      </div>
      
      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            plans={plansByStatus[column.id] || []}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onCardClick={handleCardClick}
          />
        ))}
      </div>
      
      {/* Legenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="text-muted">Legenda de saúde:</span>
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
              Total: {stats.total} planos
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

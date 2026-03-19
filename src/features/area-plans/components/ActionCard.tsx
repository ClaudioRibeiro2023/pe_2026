import { Calendar, User, AlertTriangle, FileCheck, MessageSquare } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import { Card, CardContent } from '@/shared/ui/Card'
import { ActionStatusBadge, PriorityBadge } from './StatusBadge'
import { ProgressBar } from './ProgressBar'
import type { PlanAction } from '../types'

interface ActionCardProps {
  action: PlanAction
  onClick?: () => void
  className?: string
  compact?: boolean
}

export function ActionCard({ action, onClick, className, compact = false }: ActionCardProps) {
  const isOverdue = action.due_date && new Date(action.due_date) < new Date() && 
    !['CONCLUIDA', 'CANCELADA'].includes(action.status)
  
  const hasEvidences = action.evidences && action.evidences.length > 0
  const hasComments = action.comments && action.comments.length > 0
  const hasRisks = action.risks && action.risks.some(r => r.risk_level === 'ALTO' || r.risk_level === 'CRITICO')

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={cn(
          'p-3 bg-surface rounded-lg border border-border hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer',
          isOverdue && 'border-red-300 bg-red-50',
          className
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{action.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <PriorityBadge priority={action.priority} />
              {action.pillar && (
                <span className="text-xs text-muted">{action.pillar.code}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <ActionStatusBadge status={action.status} />
            {action.progress > 0 && (
              <span className="text-xs text-muted">{action.progress}%</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        'hover:shadow-md transition-all cursor-pointer',
        isOverdue && 'border-red-300 bg-red-50/50',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <PriorityBadge priority={action.priority} />
              {action.pillar && (
                <span className="text-xs font-medium text-muted bg-accent px-2 py-0.5 rounded">
                  {action.pillar.code}
                </span>
              )}
              {isOverdue && (
                <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Atrasada
                </span>
              )}
            </div>
            
            <h3 className="text-sm font-semibold text-foreground mb-1">{action.title}</h3>
            
            {action.description && (
              <p className="text-xs text-muted line-clamp-2 mb-2">{action.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              {action.responsible && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {action.responsible}
                </span>
              )}
              {action.due_date && (
                <span className={cn('flex items-center gap-1', isOverdue && 'text-red-600 font-medium')}>
                  <Calendar className="w-3 h-3" />
                  {new Date(action.due_date).toLocaleDateString('pt-BR')}
                </span>
              )}
              {hasEvidences && (
                <span className="flex items-center gap-1 text-green-600">
                  <FileCheck className="w-3 h-3" />
                  {action.evidences!.length}
                </span>
              )}
              {hasComments && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {action.comments!.length}
                </span>
              )}
              {hasRisks && (
                <span className="flex items-center gap-1 text-orange-600">
                  <AlertTriangle className="w-3 h-3" />
                  Risco
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <ActionStatusBadge status={action.status} />
            {action.subtasks && action.subtasks.length > 0 && (
              <div className="w-20">
                <ProgressBar value={action.progress} size="sm" showLabel={false} />
                <p className="text-xs text-muted text-center mt-0.5">
                  {action.subtasks.filter(s => s.completed).length}/{action.subtasks.length}
                </p>
              </div>
            )}
          </div>
        </div>

        {action.cost_estimate && (
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted">
              {action.cost_type || 'Custo'}: 
              <span className="font-medium text-foreground ml-1">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: action.currency || 'BRL' }).format(action.cost_estimate)}
              </span>
            </span>
            {action.cost_actual && (
              <span className="text-muted">
                Realizado: 
                <span className={cn(
                  'font-medium ml-1',
                  action.cost_actual > action.cost_estimate ? 'text-red-600' : 'text-green-600'
                )}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: action.currency || 'BRL' }).format(action.cost_actual)}
                </span>
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

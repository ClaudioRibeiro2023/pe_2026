import { useMemo } from 'react'
import { cn } from '@/shared/lib/cn'
import { ActionCard } from './ActionCard'
import { KANBAN_COLUMNS, type PlanAction, type ActionStatus } from '../types'

interface ActionKanbanBoardProps {
  actions: PlanAction[]
  onActionClick?: (action: PlanAction) => void
  onStatusChange?: (actionId: string, newStatus: ActionStatus) => void
}

export function ActionKanbanBoard({ 
  actions, 
  onActionClick,
  onStatusChange 
}: ActionKanbanBoardProps) {
  const columns = useMemo(() => {
    return KANBAN_COLUMNS.map(column => ({
      ...column,
      actions: actions.filter(action => action.status === column.id),
    }))
  }, [actions])

  const handleDragStart = (e: React.DragEvent, actionId: string) => {
    e.dataTransfer.setData('actionId', actionId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: ActionStatus) => {
    e.preventDefault()
    const actionId = e.dataTransfer.getData('actionId')
    if (actionId && onStatusChange) {
      onStatusChange(actionId, status)
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(column => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className={cn(
            'rounded-t-lg px-3 py-2 font-medium text-sm flex items-center justify-between',
            column.color
          )}>
            <span>{column.title}</span>
            <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs">
              {column.actions.length}
            </span>
          </div>
          
          <div className={cn(
            'min-h-[500px] rounded-b-lg p-2 space-y-2',
            column.color,
            'bg-opacity-50'
          )}>
            {column.actions.length > 0 ? (
              column.actions.map(action => (
                <div
                  key={action.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, action.id)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <ActionCard
                    action={action}
                    onClick={() => onActionClick?.(action)}
                    compact
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-muted text-sm">
                Nenhuma ação
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

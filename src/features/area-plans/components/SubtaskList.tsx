import { useState } from 'react'
import { Check, Plus, Trash2, GripVertical } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useCreateSubtask, useToggleSubtask, useDeleteSubtask } from '../hooks'
import type { ActionSubtask } from '../types'

interface SubtaskListProps {
  actionId: string
  subtasks: ActionSubtask[]
  readonly?: boolean
}

export function SubtaskList({ actionId, subtasks, readonly = false }: SubtaskListProps) {
  const [newSubtask, setNewSubtask] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const createSubtask = useCreateSubtask()
  const toggleSubtask = useToggleSubtask()
  const deleteSubtask = useDeleteSubtask()

  const completedCount = subtasks.filter(s => s.completed).length
  const progress = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return

    try {
      await createSubtask.mutateAsync({
        action_id: actionId,
        title: newSubtask.trim(),
        sort_order: subtasks.length,
      })
      setNewSubtask('')
      setIsAdding(false)
    } catch (error) {
      console.error('Erro ao criar subtarefa:', error)
    }
  }

  const handleToggle = async (subtask: ActionSubtask) => {
    try {
      await toggleSubtask.mutateAsync({
        subtaskId: subtask.id,
        completed: !subtask.completed,
        actionId,
      })
    } catch (error) {
      console.error('Erro ao atualizar subtarefa:', error)
    }
  }

  const handleDelete = async (subtaskId: string) => {
    try {
      await deleteSubtask.mutateAsync({ subtaskId, actionId })
    } catch (error) {
      console.error('Erro ao excluir subtarefa:', error)
    }
  }

  const sortedSubtasks = [...subtasks].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">
          Subtarefas ({completedCount}/{subtasks.length})
        </h4>
        {subtasks.length > 0 && (
          <span className="text-xs text-muted">{progress}% concluído</span>
        )}
      </div>

      {subtasks.length > 0 && (
        <div className="w-full bg-accent rounded-full h-1.5">
          <div
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              progress === 100 ? 'bg-green-500' : 'bg-blue-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <ul className="space-y-1">
        {sortedSubtasks.map((subtask) => (
          <li
            key={subtask.id}
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg hover:bg-accent group',
              subtask.completed && 'bg-accent'
            )}
          >
            {!readonly && (
              <GripVertical className="w-4 h-4 text-muted cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            
            <button
              onClick={() => !readonly && handleToggle(subtask)}
              disabled={readonly || toggleSubtask.isPending}
              className={cn(
                'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                subtask.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-border hover:border-green-500',
                readonly && 'cursor-default'
              )}
            >
              {subtask.completed && <Check className="w-3 h-3" />}
            </button>

            <span
              className={cn(
                'flex-1 text-sm',
                subtask.completed && 'text-muted line-through'
              )}
            >
              {subtask.title}
            </span>

            {!readonly && (
              <button
                onClick={() => handleDelete(subtask.id)}
                disabled={deleteSubtask.isPending}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </li>
        ))}
      </ul>

      {!readonly && (
        <>
          {isAdding ? (
            <div className="flex items-center gap-2">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Nova subtarefa..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubtask()
                  if (e.key === 'Escape') {
                    setIsAdding(false)
                    setNewSubtask('')
                  }
                }}
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleAddSubtask}
                disabled={!newSubtask.trim() || createSubtask.isPending}
              >
                Adicionar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false)
                  setNewSubtask('')
                }}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="w-full justify-start text-muted hover:text-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar subtarefa
            </Button>
          )}
        </>
      )}
    </div>
  )
}

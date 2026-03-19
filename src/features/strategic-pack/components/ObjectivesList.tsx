import { useState } from 'react'
import { Target, Plus, Trash2, Edit2, Check, X, ListTodo } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { cn } from '@/shared/lib/cn'
import { useActionsByPackId } from '@/features/area-plans/hooks'
import type { Objective } from '../types'
import type { PlanAction } from '@/features/area-plans/types'

interface ObjectivesListProps {
  objectives: Objective[]
  packId?: string
  onUpdate: (objectives: Objective[]) => void
  readonly?: boolean
}

export function ObjectivesList({ objectives, packId, onUpdate, readonly = false }: ObjectivesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newTitle, setNewTitle] = useState('')

  // Buscar ações vinculadas ao pack
  const { data: allActions = [] } = useActionsByPackId(packId)
  
  // Filtrar ações por objetivo
  const getActionsForObjective = (objectiveKey: string): PlanAction[] => {
    return allActions.filter(a => a.objective_key === objectiveKey)
  }

  const handleEdit = (obj: Objective) => {
    setEditingId(obj.id)
    setEditTitle(obj.title)
    setEditDescription(obj.description || '')
  }

  const handleSaveEdit = () => {
    if (!editingId) return
    const updated = objectives.map(obj => 
      obj.id === editingId 
        ? { ...obj, title: editTitle, description: editDescription }
        : obj
    )
    onUpdate(updated)
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  const handleDelete = (id: string) => {
    onUpdate(objectives.filter(obj => obj.id !== id))
  }

  const handleAdd = () => {
    if (!newKey.trim() || !newTitle.trim()) return
    const newObjective: Objective = {
      id: `obj-${Date.now()}`,
      key: newKey.toUpperCase(),
      title: newTitle,
    }
    onUpdate([...objectives, newObjective])
    setNewKey('')
    setNewTitle('')
    setIsAdding(false)
  }

  const suggestedKeys = ['O1', 'O2', 'O3', 'O4', 'O5'].filter(
    key => !objectives.some(obj => obj.key === key)
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5" />
          Objetivos do Ano ({objectives.length})
        </CardTitle>
        {!readonly && !isAdding && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {objectives.length === 0 && !isAdding ? (
          <div className="text-center py-6 text-muted">
            <Target className="w-10 h-10 mx-auto mb-2 text-muted" />
            <p>Nenhum objetivo cadastrado.</p>
            {!readonly && (
              <Button variant="ghost" onClick={() => setIsAdding(true)} className="mt-2">
                Adicionar primeiro objetivo
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {objectives.map((obj) => (
              <div 
                key={obj.id}
                className="flex items-start gap-3 p-3 bg-accent rounded-lg"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm">
                  {obj.key}
                </div>
                
                {editingId === obj.id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Título do objetivo"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Descrição (opcional)"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Check className="w-3 h-3 mr-1" />
                        Salvar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                        <X className="w-3 h-3 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{obj.title}</p>
                    {obj.description && (
                      <p className="text-sm text-muted mt-1">{obj.description}</p>
                    )}
                    {/* Ações vinculadas ao objetivo */}
                    {packId && getActionsForObjective(obj.key).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted mb-1 flex items-center gap-1">
                          <ListTodo className="w-3 h-3" />
                          Ações vinculadas:
                        </p>
                        <ul className="space-y-1">
                          {getActionsForObjective(obj.key).map((action) => (
                            <li key={action.id} className="flex items-center gap-2 text-xs">
                              <span className={cn(
                                'w-1.5 h-1.5 rounded-full',
                                action.status === 'CONCLUIDA' ? 'bg-green-500' :
                                action.status === 'EM_ANDAMENTO' ? 'bg-blue-500' :
                                action.status === 'BLOQUEADA' ? 'bg-red-500' :
                                'bg-muted'
                              )} />
                              <span className="flex-1 text-muted">{action.title}</span>
                              <span className="text-muted">{action.status}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {!readonly && editingId !== obj.id && (
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(obj)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(obj.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {isAdding && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex gap-2 mb-2">
                  <select
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-sm"
                  >
                    <option value="">Key</option>
                    {suggestedKeys.map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Título do novo objetivo"
                    className="flex-1 px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAdd} disabled={!newKey || !newTitle}>
                    <Check className="w-3 h-3 mr-1" />
                    Adicionar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                    <X className="w-3 h-3 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

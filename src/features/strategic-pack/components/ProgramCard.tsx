import { useState } from 'react'
import { Briefcase, Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronUp, ListTodo } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { cn } from '@/shared/lib/cn'
import { useActionsByPackId } from '@/features/area-plans/hooks'
import type { Program } from '../types'
import type { PlanAction } from '@/features/area-plans/types'

interface ProgramCardProps {
  programs: Program[]
  packId?: string
  onUpdate: (programs: Program[]) => void
  readonly?: boolean
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Ativo', color: 'bg-green-100 text-green-700' },
  { value: 'planned', label: 'Planejado', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'completed', label: 'Concluído', color: 'bg-accent text-muted' },
] as const

export function ProgramCard({ programs, packId, onUpdate, readonly = false }: ProgramCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Program>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [newProgram, setNewProgram] = useState<Partial<Program>>({
    key: '',
    name: '',
    description: '',
    goals: [],
    status: 'planned',
  })
  const [newGoal, setNewGoal] = useState('')

  // Buscar ações vinculadas ao pack
  const { data: allActions = [] } = useActionsByPackId(packId)
  
  // Filtrar ações por programa
  const getActionsForProgram = (programKey: string): PlanAction[] => {
    return allActions.filter(a => a.program_key === programKey)
  }

  const handleEdit = (program: Program) => {
    setEditingId(program.id)
    setEditData({ ...program })
  }

  const handleSaveEdit = () => {
    if (!editingId || !editData.name) return
    const updated = programs.map(p => 
      p.id === editingId ? { ...p, ...editData } as Program : p
    )
    onUpdate(updated)
    setEditingId(null)
    setEditData({})
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = (id: string) => {
    onUpdate(programs.filter(p => p.id !== id))
  }

  const handleAddGoal = (programId: string, goal: string) => {
    if (!goal.trim()) return
    const updated = programs.map(p => 
      p.id === programId 
        ? { ...p, goals: [...p.goals, goal.trim()] }
        : p
    )
    onUpdate(updated)
  }

  const handleRemoveGoal = (programId: string, goalIndex: number) => {
    const updated = programs.map(p => 
      p.id === programId 
        ? { ...p, goals: p.goals.filter((_, i) => i !== goalIndex) }
        : p
    )
    onUpdate(updated)
  }

  const handleAdd = () => {
    if (!newProgram.key || !newProgram.name) return
    const program: Program = {
      id: `prog-${Date.now()}`,
      key: newProgram.key.toLowerCase(),
      name: newProgram.name,
      description: newProgram.description,
      goals: newProgram.goals || [],
      status: newProgram.status || 'planned',
    }
    onUpdate([...programs, program])
    setNewProgram({
      key: '',
      name: '',
      description: '',
      goals: [],
      status: 'planned',
    })
    setIsAdding(false)
  }

  const getStatusConfig = (status: string) => 
    STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Programas e Iniciativas ({programs.length})
        </CardTitle>
        {!readonly && !isAdding && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {programs.length === 0 && !isAdding ? (
          <div className="text-center py-6 text-muted">
            <Briefcase className="w-10 h-10 mx-auto mb-2 text-muted" />
            <p>Nenhum programa cadastrado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {programs.map((program) => {
              const isExpanded = expandedId === program.id
              const isEditing = editingId === program.id
              const statusConfig = getStatusConfig(program.status)

              return (
                <div 
                  key={program.id}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <div 
                    className="flex items-center gap-3 p-3 bg-accent cursor-pointer"
                    onClick={() => !isEditing && setExpandedId(isExpanded ? null : program.id)}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                      {program.key}
                    </div>

                    {isEditing ? (
                      <div className="flex-1 space-y-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editData.key || ''}
                            onChange={(e) => setEditData({ ...editData, key: e.target.value })}
                            className="w-24 px-2 py-1 border rounded text-sm"
                            placeholder="Key"
                          />
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="flex-1 px-2 py-1 border rounded text-sm"
                            placeholder="Nome do programa"
                          />
                          <select
                            value={editData.status || 'planned'}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value as Program['status'] })}
                            className="px-2 py-1 border rounded text-sm"
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <textarea
                          value={editData.description || ''}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-sm"
                          placeholder="Descrição"
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
                      <>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{program.name}</p>
                            <span className={cn('px-2 py-0.5 rounded text-xs font-medium', statusConfig.color)}>
                              {statusConfig.label}
                            </span>
                          </div>
                          {program.description && (
                            <p className="text-sm text-muted mt-0.5">{program.description}</p>
                          )}
                          <p className="text-xs text-muted mt-1">
                            {program.goals.length} meta(s)
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {!readonly && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEdit(program)
                                }}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(program.id)
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted" />
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {isExpanded && !isEditing && (
                    <div className="p-3 border-t border-border bg-surface">
                      <p className="text-sm font-medium text-foreground mb-2">Metas do Programa:</p>
                      {program.goals.length === 0 ? (
                        <p className="text-sm text-muted">Nenhuma meta definida</p>
                      ) : (
                        <ul className="space-y-1">
                          {program.goals.map((goal, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                              <span className="flex-1">{goal}</span>
                              {!readonly && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveGoal(program.id, idx)}
                                  className="text-red-500 h-6 w-6 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      {!readonly && (
                        <div className="flex gap-2 mt-3">
                          <input
                            type="text"
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                            placeholder="Nova meta..."
                            className="flex-1 px-2 py-1 border rounded text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddGoal(program.id, newGoal)
                                setNewGoal('')
                              }
                            }}
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              handleAddGoal(program.id, newGoal)
                              setNewGoal('')
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      )}

                      {/* Ações vinculadas ao programa */}
                      {packId && (
                        <div className="mt-4 pt-3 border-t border-border">
                          <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                            <ListTodo className="w-4 h-4" />
                            Ações Vinculadas:
                          </p>
                          {getActionsForProgram(program.key).length === 0 ? (
                            <p className="text-sm text-muted">Nenhuma ação vinculada</p>
                          ) : (
                            <ul className="space-y-1">
                              {getActionsForProgram(program.key).map((action) => (
                                <li key={action.id} className="flex items-center gap-2 text-sm">
                                  <span className={cn(
                                    'w-2 h-2 rounded-full',
                                    action.status === 'CONCLUIDA' ? 'bg-green-500' :
                                    action.status === 'EM_ANDAMENTO' ? 'bg-blue-500' :
                                    action.status === 'BLOQUEADA' ? 'bg-red-500' :
                                    'bg-muted'
                                  )} />
                                  <span className="flex-1">{action.title}</span>
                                  <span className="text-xs text-muted">{action.status}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {isAdding && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    value={newProgram.key || ''}
                    onChange={(e) => setNewProgram({ ...newProgram, key: e.target.value })}
                    placeholder="Key (ex: conecta)"
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="text"
                    value={newProgram.name || ''}
                    onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                    placeholder="Nome do programa"
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <select
                    value={newProgram.status || 'planned'}
                    onChange={(e) => setNewProgram({ ...newProgram, status: e.target.value as Program['status'] })}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={newProgram.description || ''}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  placeholder="Descrição (opcional)"
                  className="w-full px-2 py-1 border rounded text-sm mb-2"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAdd} disabled={!newProgram.key || !newProgram.name}>
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

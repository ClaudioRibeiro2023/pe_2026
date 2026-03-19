import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Shield, Plus, Calendar, Users, FileText, ChevronDown, ChevronUp, Check, X } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { cn } from '@/shared/lib/cn'
import type { Ritual, MeetingMinutes, RitualType, Decision, ActionItem } from '../types'

interface GovernanceRitualsProps {
  rituals: Ritual[]
  minutes: MeetingMinutes[]
  onUpdateRituals: (rituals: Ritual[]) => void
  onUpdateMinutes: (minutes: MeetingMinutes[]) => void
  readonly?: boolean
}

const RITUAL_TYPES: { value: RitualType; label: string; color: string }[] = [
  { value: 'WBR', label: 'Weekly Business Review', color: 'bg-blue-100 text-blue-700' },
  { value: 'MBR', label: 'Monthly Business Review', color: 'bg-purple-100 text-purple-700' },
  { value: 'QBR', label: 'Quarterly Business Review', color: 'bg-green-100 text-green-700' },
]

export function GovernanceRituals({ 
  rituals, 
  minutes, 
  onUpdateRituals, 
  onUpdateMinutes,
  readonly = false 
}: GovernanceRitualsProps) {
  const [expandedRitual, setExpandedRitual] = useState<string | null>(null)
  const [isAddingMinutes, setIsAddingMinutes] = useState<string | null>(null)
  const [newMinutes, setNewMinutes] = useState<Partial<MeetingMinutes>>({
    date: new Date().toISOString().split('T')[0],
    attendees: [],
    summary: '',
    decisions: [],
    action_items: [],
  })
  const [attendeesInput, setAttendeesInput] = useState('')
  const [decisionInput, setDecisionInput] = useState('')
  const [actionInput, setActionInput] = useState('')

  const getRitualConfig = (type: RitualType) => 
    RITUAL_TYPES.find(rt => rt.value === type) || RITUAL_TYPES[0]

  const getRitualMinutes = (ritualId: string) => 
    minutes.filter(m => m.ritual_id === ritualId).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

  const handleAddMinutes = (ritualId: string) => {
    if (!newMinutes.summary) return
    
    const minutesEntry: MeetingMinutes = {
      id: `min-${Date.now()}`,
      ritual_id: ritualId,
      date: newMinutes.date || new Date().toISOString().split('T')[0],
      attendees: attendeesInput.split(',').map(a => a.trim()).filter(Boolean),
      summary: newMinutes.summary || '',
      decisions: newMinutes.decisions || [],
      action_items: newMinutes.action_items || [],
      evidence_links: [],
    }

    onUpdateMinutes([...minutes, minutesEntry])
    
    // Update ritual's last_meeting
    const updatedRituals = rituals.map(r => 
      r.id === ritualId 
        ? { ...r, last_meeting: minutesEntry.date }
        : r
    )
    onUpdateRituals(updatedRituals)

    // Reset form
    setNewMinutes({
      date: new Date().toISOString().split('T')[0],
      attendees: [],
      summary: '',
      decisions: [],
      action_items: [],
    })
    setAttendeesInput('')
    setDecisionInput('')
    setActionInput('')
    setIsAddingMinutes(null)
  }

  const addDecision = () => {
    if (!decisionInput.trim()) return
    const newDecision: Decision = {
      id: `dec-${Date.now()}`,
      description: decisionInput.trim(),
      responsible: '',
    }
    setNewMinutes(prev => ({
      ...prev,
      decisions: [...(prev.decisions || []), newDecision]
    }))
    setDecisionInput('')
  }

  const addActionItem = () => {
    if (!actionInput.trim()) return
    const newAction: ActionItem = {
      id: `act-${Date.now()}`,
      description: actionInput.trim(),
      owner: '',
      status: 'pending',
    }
    setNewMinutes(prev => ({
      ...prev,
      action_items: [...(prev.action_items || []), newAction]
    }))
    setActionInput('')
  }

  const removeDecision = (index: number) => {
    setNewMinutes(prev => ({
      ...prev,
      decisions: (prev.decisions || []).filter((_, i) => i !== index)
    }))
  }

  const removeActionItem = (index: number) => {
    setNewMinutes(prev => ({
      ...prev,
      action_items: (prev.action_items || []).filter((_, i) => i !== index)
    }))
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Rituais de Governança ({rituals.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rituals.length === 0 ? (
          <div className="text-center py-6 text-muted">
            <Shield className="w-10 h-10 mx-auto mb-2 text-muted" />
            <p>Nenhum ritual cadastrado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rituals.map((ritual) => {
              const isExpanded = expandedRitual === ritual.id
              const ritualMinutes = getRitualMinutes(ritual.id)
              const config = getRitualConfig(ritual.type)

              return (
                <div 
                  key={ritual.id}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <div 
                    className="flex items-center gap-3 p-3 bg-accent cursor-pointer"
                    onClick={() => setExpandedRitual(isExpanded ? null : ritual.id)}
                  >
                    <div className={cn(
                      'flex-shrink-0 px-3 py-2 rounded-lg font-bold text-sm',
                      config.color
                    )}>
                      {ritual.type}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-foreground">{ritual.name}</p>
                      <div className="flex items-center gap-4 text-xs text-muted mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {ritual.cadence}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {ritual.participants.length} participantes
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {ritualMinutes.length} ata(s)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted">
                      {ritual.last_meeting && (
                        <span>
                          Última: {format(new Date(ritual.last_meeting), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-3 border-t border-border bg-surface">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-foreground">Atas de Reunião</p>
                        {!readonly && isAddingMinutes !== ritual.id && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsAddingMinutes(ritual.id)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Nova Ata
                          </Button>
                        )}
                      </div>

                      {isAddingMinutes === ritual.id && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <div className="w-40">
                                <label className="text-xs text-muted">Data</label>
                                <input
                                  type="date"
                                  value={newMinutes.date}
                                  onChange={(e) => setNewMinutes({ ...newMinutes, date: e.target.value })}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs text-muted">Participantes (separados por vírgula)</label>
                                <input
                                  type="text"
                                  value={attendeesInput}
                                  onChange={(e) => setAttendeesInput(e.target.value)}
                                  placeholder="João, Maria, Pedro..."
                                  className="w-full px-2 py-1 border rounded text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-muted">Resumo da Reunião</label>
                              <textarea
                                value={newMinutes.summary}
                                onChange={(e) => setNewMinutes({ ...newMinutes, summary: e.target.value })}
                                placeholder="Resumo dos principais pontos discutidos..."
                                className="w-full px-2 py-1 border rounded text-sm"
                                rows={3}
                              />
                            </div>

                            <div>
                              <label className="text-xs text-muted">Decisões</label>
                              <div className="flex gap-2 mb-1">
                                <input
                                  type="text"
                                  value={decisionInput}
                                  onChange={(e) => setDecisionInput(e.target.value)}
                                  placeholder="Adicionar decisão..."
                                  className="flex-1 px-2 py-1 border rounded text-sm"
                                  onKeyDown={(e) => e.key === 'Enter' && addDecision()}
                                />
                                <Button size="sm" variant="outline" onClick={addDecision}>
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              {(newMinutes.decisions || []).map((d, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm bg-surface px-2 py-1 rounded mb-1">
                                  <span className="flex-1">{d.description}</span>
                                  <button onClick={() => removeDecision(i)} className="text-red-500">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <div>
                              <label className="text-xs text-muted">Action Items</label>
                              <div className="flex gap-2 mb-1">
                                <input
                                  type="text"
                                  value={actionInput}
                                  onChange={(e) => setActionInput(e.target.value)}
                                  placeholder="Adicionar action item..."
                                  className="flex-1 px-2 py-1 border rounded text-sm"
                                  onKeyDown={(e) => e.key === 'Enter' && addActionItem()}
                                />
                                <Button size="sm" variant="outline" onClick={addActionItem}>
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              {(newMinutes.action_items || []).map((a, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm bg-surface px-2 py-1 rounded mb-1">
                                  <span className="flex-1">{a.description}</span>
                                  <button onClick={() => removeActionItem(i)} className="text-red-500">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleAddMinutes(ritual.id)}
                                disabled={!newMinutes.summary}
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Salvar Ata
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setIsAddingMinutes(null)}
                              >
                                <X className="w-3 h-3 mr-1" />
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {ritualMinutes.length === 0 ? (
                        <p className="text-sm text-muted">Nenhuma ata registrada</p>
                      ) : (
                        <div className="space-y-2">
                          {ritualMinutes.map((min) => (
                            <div 
                              key={min.id}
                              className="p-3 bg-accent rounded-lg text-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">
                                  {format(new Date(min.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </span>
                                <span className="text-xs text-muted">
                                  {min.attendees.length} participantes
                                </span>
                              </div>
                              <p className="text-foreground mb-2">{min.summary}</p>
                              {min.decisions.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs font-medium text-muted mb-1">Decisões:</p>
                                  <ul className="list-disc list-inside text-xs text-muted">
                                    {min.decisions.map((d, i) => (
                                      <li key={i}>{d.description}{d.responsible && ` (${d.responsible})`}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {min.action_items.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-muted mb-1">Action Items:</p>
                                  <ul className="list-disc list-inside text-xs text-muted">
                                    {min.action_items.map((a, i) => (
                                      <li key={i}>{a.description}{a.owner && ` - ${a.owner}`}{a.status === 'done' && ' ✓'}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

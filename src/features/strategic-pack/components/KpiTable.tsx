import { useState } from 'react'
import { BarChart3, Plus, Trash2, Edit2, Check, X } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import type { Kpi, KpiCadence } from '../types'

interface KpiTableProps {
  kpis: Kpi[]
  onUpdate: (kpis: Kpi[]) => void
  readonly?: boolean
}

const CADENCE_OPTIONS: { value: KpiCadence; label: string }[] = [
  { value: 'diario', label: 'Diário' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'anual', label: 'Anual' },
]

export function KpiTable({ kpis, onUpdate, readonly = false }: KpiTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Kpi>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [newKpi, setNewKpi] = useState<Partial<Kpi>>({
    name: '',
    definition: '',
    cadence: 'mensal',
    owner: '',
    target: '',
  })

  const handleEdit = (kpi: Kpi) => {
    setEditingId(kpi.id)
    setEditData({ ...kpi })
  }

  const handleSaveEdit = () => {
    if (!editingId || !editData.name) return
    const updated = kpis.map(kpi => 
      kpi.id === editingId ? { ...kpi, ...editData } as Kpi : kpi
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
    onUpdate(kpis.filter(kpi => kpi.id !== id))
  }

  const handleAdd = () => {
    if (!newKpi.name || !newKpi.target) return
    const kpi: Kpi = {
      id: `kpi-${Date.now()}`,
      name: newKpi.name || '',
      definition: newKpi.definition || '',
      cadence: newKpi.cadence || 'mensal',
      owner: newKpi.owner || '',
      target: newKpi.target || '',
      trigger: newKpi.trigger,
    }
    onUpdate([...kpis, kpi])
    setNewKpi({
      name: '',
      definition: '',
      cadence: 'mensal',
      owner: '',
      target: '',
    })
    setIsAdding(false)
  }

  const getCadenceLabel = (cadence: KpiCadence) => 
    CADENCE_OPTIONS.find(opt => opt.value === cadence)?.label || cadence

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          KPIs e Metas ({kpis.length})
        </CardTitle>
        {!readonly && !isAdding && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {kpis.length === 0 && !isAdding ? (
          <div className="text-center py-6 text-muted">
            <BarChart3 className="w-10 h-10 mx-auto mb-2 text-muted" />
            <p>Nenhum KPI cadastrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 font-medium text-muted">Nome</th>
                  <th className="text-left py-2 px-2 font-medium text-muted">Meta</th>
                  <th className="text-left py-2 px-2 font-medium text-muted">Cadência</th>
                  <th className="text-left py-2 px-2 font-medium text-muted">Dono</th>
                  <th className="text-left py-2 px-2 font-medium text-muted">Gatilho</th>
                  {!readonly && <th className="w-20"></th>}
                </tr>
              </thead>
              <tbody>
                {kpis.map((kpi) => (
                  <tr key={kpi.id} className="border-b border-border/50 hover:bg-accent">
                    {editingId === kpi.id ? (
                      <>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={editData.target || ''}
                            onChange={(e) => setEditData({ ...editData, target: e.target.value })}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={editData.cadence || 'mensal'}
                            onChange={(e) => setEditData({ ...editData, cadence: e.target.value as KpiCadence })}
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            {CADENCE_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={editData.owner || ''}
                            onChange={(e) => setEditData({ ...editData, owner: e.target.value })}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={editData.trigger || ''}
                            onChange={(e) => setEditData({ ...editData, trigger: e.target.value })}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-2 font-medium">{kpi.name}</td>
                        <td className="py-2 px-2">{kpi.target}</td>
                        <td className="py-2 px-2">
                          <span className="px-2 py-0.5 bg-accent rounded text-xs">
                            {getCadenceLabel(kpi.cadence)}
                          </span>
                        </td>
                        <td className="py-2 px-2">{kpi.owner}</td>
                        <td className="py-2 px-2 text-muted">{kpi.trigger || '—'}</td>
                        {!readonly && (
                          <td className="py-2 px-2">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(kpi)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleDelete(kpi.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {isAdding && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <input
                    type="text"
                    value={newKpi.name || ''}
                    onChange={(e) => setNewKpi({ ...newKpi, name: e.target.value })}
                    placeholder="Nome do KPI"
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="text"
                    value={newKpi.target || ''}
                    onChange={(e) => setNewKpi({ ...newKpi, target: e.target.value })}
                    placeholder="Meta"
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <select
                    value={newKpi.cadence || 'mensal'}
                    onChange={(e) => setNewKpi({ ...newKpi, cadence: e.target.value as KpiCadence })}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    {CADENCE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newKpi.owner || ''}
                    onChange={(e) => setNewKpi({ ...newKpi, owner: e.target.value })}
                    placeholder="Dono"
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="text"
                    value={newKpi.trigger || ''}
                    onChange={(e) => setNewKpi({ ...newKpi, trigger: e.target.value })}
                    placeholder="Gatilho (opcional)"
                    className="px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAdd} disabled={!newKpi.name || !newKpi.target}>
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

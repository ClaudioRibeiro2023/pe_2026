/**
 * Closings List Page — Lista de fechamentos com filtros e ações
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClosings, useClosingActions } from '../hooks'
import { exportClosingCsv } from '../export'
import { mockStore as areaMockStore } from '@/features/area-plans/utils/mockData'
import { CLOSING_STATUS_LABELS, CLOSING_STATUS_COLORS } from '../types'
import type { ClosingFilters, CreateClosingInput, ClosingStatus } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { useToast } from '@/shared/ui/Toast'
import { cn } from '@/shared/lib/cn'
import {
  FileText,
  Plus,
  Download,
  Trash2,
  Eye,
  Search,
  GitBranch,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
} from '@/shared/ui/icons'

export function ClosingsListPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [filters, setFilters] = useState<ClosingFilters>({})
  const [showCreate, setShowCreate] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableFilters = useMemo(() => filters, [filters.area_id, filters.period, filters.status, filters.search])
  const { closings, loading, refresh } = useClosings(stableFilters)
  const { create, remove, finalize, creating } = useClosingActions()

  const areas = areaMockStore.areas

  // Create form state
  const [newPeriod, setNewPeriod] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
  const [newAreaId, setNewAreaId] = useState<string>('')
  const [newNotes, setNewNotes] = useState('')

  const handleCreate = async () => {
    const input: CreateClosingInput = {
      period: newPeriod,
      area_id: newAreaId || null,
      pack_id: null,
      notes: newNotes,
    }
    await create(input)
    addToast({ type: 'success', title: 'Fechamento criado', message: `Período ${newPeriod}` })
    setShowCreate(false)
    setNewNotes('')
    refresh()
  }

  const handleDelete = async (id: string) => {
    await remove(id)
    addToast({ type: 'success', title: 'Fechamento removido' })
    refresh()
  }

  const handleFinalize = async (id: string) => {
    await finalize(id)
    addToast({ type: 'success', title: 'Fechamento finalizado' })
    refresh()
  }

  const handleExport = (closing: typeof closings[0]) => {
    exportClosingCsv(closing)
    addToast({ type: 'success', title: 'CSV exportado', message: closing.period })
  }

  const handleCompareToggle = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  const handleCompare = () => {
    if (selectedForCompare.length === 2) {
      navigate(`/governance/closings/compare?a=${selectedForCompare[0]}&b=${selectedForCompare[1]}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fechamentos</h1>
          <p className="text-sm text-muted mt-1">Snapshots periódicos com trilha de auditoria e comparativos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={compareMode ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => {
              setCompareMode(!compareMode)
              setSelectedForCompare([])
            }}
          >
            <GitBranch className="h-4 w-4" />
            {compareMode ? 'Cancelar' : 'Comparar'}
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" />
            Criar Fechamento
          </Button>
        </div>
      </div>

      {/* Compare bar */}
      {compareMode && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">
                Selecione 2 fechamentos para comparar ({selectedForCompare.length}/2)
              </p>
              <Button
                size="sm"
                disabled={selectedForCompare.length !== 2}
                onClick={handleCompare}
              >
                <GitBranch className="h-4 w-4" />
                Comparar Selecionados
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Modal Inline */}
      {showCreate && (
        <Card className="border-primary-200 dark:border-primary-800">
          <CardHeader className="py-3">
            <CardTitle className="text-base">Novo Fechamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Período</label>
                <input
                  type="month"
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-surface text-foreground text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Área (opcional)</label>
                <select
                  value={newAreaId}
                  onChange={(e) => setNewAreaId(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-surface text-foreground text-sm focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todas as áreas</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Notas</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Observações do fechamento..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-surface text-foreground text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleCreate} loading={creating}>
                Criar Snapshot
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Buscar fechamentos..."
                value={filters.search ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || null }))}
                className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-surface text-foreground text-sm focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={filters.area_id ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, area_id: e.target.value || null }))}
              className="px-3 py-2 border border-border rounded-md bg-surface text-foreground text-sm"
            >
              <option value="">Todas as Áreas</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <select
              value={filters.status ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, status: (e.target.value || null) as ClosingStatus | null }))}
              className="px-3 py-2 border border-border rounded-md bg-surface text-foreground text-sm"
            >
              <option value="">Todos os Status</option>
              <option value="draft">Rascunho</option>
              <option value="final">Final</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-32 text-muted">Carregando...</div>
      ) : closings.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <FileText className="h-12 w-12 text-muted" />
              <h3 className="text-lg font-medium text-foreground">Nenhum fechamento encontrado</h3>
              <p className="text-sm text-muted">Crie o primeiro fechamento usando o botão acima.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border">
                {compareMode && <th className="px-3 py-3 text-left font-medium text-muted">Sel.</th>}
                <th className="px-3 py-3 text-left font-medium text-muted">Período</th>
                <th className="px-3 py-3 text-left font-medium text-muted">Área</th>
                <th className="px-3 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-3 py-3 text-right font-medium text-muted">Ações</th>
                <th className="px-3 py-3 text-right font-medium text-muted">Concluídas</th>
                <th className="px-3 py-3 text-right font-medium text-muted">Atrasadas</th>
                <th className="px-3 py-3 text-right font-medium text-muted">Progresso</th>
                <th className="px-3 py-3 text-right font-medium text-muted">Ações</th>
              </tr>
            </thead>
            <tbody>
              {closings.map((c) => (
                <tr
                  key={c.id}
                  className={cn(
                    'border-b border-border hover:bg-accent/50 transition-colors',
                    compareMode && selectedForCompare.includes(c.id) && 'bg-primary-50 dark:bg-primary-900/20'
                  )}
                >
                  {compareMode && (
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedForCompare.includes(c.id)}
                        onChange={() => handleCompareToggle(c.id)}
                        className="rounded"
                        aria-label={`Selecionar ${c.period}`}
                      />
                    </td>
                  )}
                  <td className="px-3 py-3 font-medium text-foreground">{c.period}</td>
                  <td className="px-3 py-3 text-foreground">{c.area_name ?? 'Todas'}</td>
                  <td className="px-3 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', CLOSING_STATUS_COLORS[c.status])}>
                      {CLOSING_STATUS_LABELS[c.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-foreground">{c.kpis.total_actions}</td>
                  <td className="px-3 py-3 text-right">
                    <span className="flex items-center justify-end gap-1 text-success-600 dark:text-success-400">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {c.kpis.done}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="flex items-center justify-end gap-1 text-danger-600 dark:text-danger-400">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {c.kpis.overdue}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-accent rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${c.kpis.avg_progress}%` }}
                        />
                      </div>
                      <span className="text-foreground text-xs">{c.kpis.avg_progress}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/governance/closings/${c.id}`)}
                        className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-accent transition-colors"
                        title="Ver detalhes"
                        aria-label={`Ver detalhes ${c.period}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExport(c)}
                        className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-accent transition-colors"
                        title="Exportar CSV"
                        aria-label={`Exportar ${c.period}`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {c.status === 'draft' && (
                        <button
                          onClick={() => handleFinalize(c.id)}
                          className="p-1.5 rounded-md text-muted hover:text-success-600 hover:bg-accent transition-colors"
                          title="Finalizar"
                          aria-label={`Finalizar ${c.period}`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-md text-muted hover:text-danger-600 hover:bg-accent transition-colors"
                        title="Excluir"
                        aria-label={`Excluir ${c.period}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && closings.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4 text-center">
              <BarChart3 className="h-5 w-5 text-primary-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{closings.length}</p>
              <p className="text-xs text-muted">Fechamentos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <CheckCircle className="h-5 w-5 text-success-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">
                {closings.filter((c) => c.status === 'final').length}
              </p>
              <p className="text-xs text-muted">Finalizados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <Clock className="h-5 w-5 text-warning-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">
                {closings.filter((c) => c.status === 'draft').length}
              </p>
              <p className="text-xs text-muted">Rascunhos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <FileText className="h-5 w-5 text-muted mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">
                {closings.reduce((s, c) => s + c.kpis.total_actions, 0)}
              </p>
              <p className="text-xs text-muted">Total Ações (snapshots)</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

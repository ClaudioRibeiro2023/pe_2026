import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft,
  LayoutGrid,
  Kanban,
  Calendar,
  FileCheck,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp
} from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useAreaBySlug, useAreaPlanByAreaSlug, usePlanActions, usePlanStats } from '../hooks'
import { PlanStatusBadge } from '../components/StatusBadge'
import { ProgressBar } from '../components/ProgressBar'
import { ActionCard } from '../components/ActionCard'
import { normalizeActionsData } from '../utils/dataNormalization'
import type { ActionFilters, PlanAction } from '../types'

type ViewMode = 'list' | 'kanban' | 'timeline'

export function AreaPlanPage() {
  const { areaSlug } = useParams<{ areaSlug: string }>()
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters] = useState<ActionFilters>({})
  const [selectedAction, setSelectedAction] = useState<PlanAction | null>(null)

  const { data: area, isLoading: areaLoading } = useAreaBySlug(areaSlug || '')
  const { data: plan, isLoading: planLoading } = useAreaPlanByAreaSlug(areaSlug || '', currentYear)
  const { data: actionsData, isLoading: actionsLoading } = usePlanActions(plan?.id || '', {
    ...filters,
    search: searchQuery || undefined,
  })
  const actions = normalizeActionsData(actionsData)
  const { data: stats } = usePlanStats(plan?.id || '')

  const isLoading = areaLoading || planLoading || actionsLoading

  const handleActionClick = (action: PlanAction) => {
    setSelectedAction(action)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!area) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground mb-2">Área não encontrada</h2>
        <p className="text-muted mb-4">A área solicitada não existe ou você não tem acesso.</p>
        <Button onClick={() => navigate('/planning')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/area-plans')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{area.name}</h1>
            <p className="text-muted">{area.focus}</p>
          </div>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <LayoutGrid className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum plano para {currentYear}
            </h3>
            <p className="text-muted mb-4">
              Esta área ainda não possui um plano de ação para o ano atual.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Plano de Ação
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/area-plans')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{area.name}</h1>
              <PlanStatusBadge status={plan.status} />
            </div>
            <p className="text-muted">{plan.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg p-1 bg-accent">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-surface shadow-sm' : 'text-muted hover:text-foreground'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-surface shadow-sm' : 'text-muted hover:text-foreground'}`}
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded ${viewMode === 'timeline' ? 'bg-surface shadow-sm' : 'text-muted hover:text-foreground'}`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          <Link to={`/planning/${areaSlug}/dashboard`}>
            <Button variant="outline" size="sm">
              <FileCheck className="w-4 h-4 mr-2" />
              Aprovações
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted">Progresso</p>
                <p className="text-xl font-bold text-foreground">
                  {stats?.completionPercentage || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted">Concluídas</p>
                <p className="text-xl font-bold text-foreground">
                  {stats?.completed || 0}/{stats?.total || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted">Em Andamento</p>
                <p className="text-xl font-bold text-foreground">{stats?.inProgress || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted">Atrasadas</p>
                <p className="text-xl font-bold text-red-600">{stats?.overdue || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <ProgressBar value={stats?.completionPercentage || 0} size="md" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ações do Plano</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  placeholder="Buscar ações..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {actions && actions.length > 0 ? (
            <div className="space-y-3">
              {actions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onClick={() => handleActionClick(action)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <LayoutGrid className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma ação encontrada</h3>
              <p className="text-muted">
                {searchQuery 
                  ? 'Nenhuma ação corresponde à sua busca.' 
                  : 'Este plano ainda não possui ações cadastradas.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedAction.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAction(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted mb-1">Descrição</p>
                  <p className="text-foreground">{selectedAction.description || 'Sem descrição'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted mb-1">Status</p>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <PlanStatusBadge status={selectedAction.status as any} />
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Responsável</p>
                    <p className="text-foreground">{selectedAction.responsible || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Data de Início</p>
                    <p className="text-foreground">
                      {selectedAction.start_date 
                        ? new Date(selectedAction.start_date).toLocaleDateString('pt-BR') 
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Data de Entrega</p>
                    <p className="text-foreground">
                      {selectedAction.due_date 
                        ? new Date(selectedAction.due_date).toLocaleDateString('pt-BR') 
                        : '-'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted mb-2">Progresso</p>
                  <ProgressBar value={selectedAction.progress} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

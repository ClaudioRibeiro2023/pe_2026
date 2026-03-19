import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PanelTop, Plus, Settings, Star, Trash2 } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import type { Dashboard } from '../types'

const mockDashboards: Dashboard[] = [
  {
    id: '1',
    name: 'Visão Executiva',
    description: 'Dashboard principal com KPIs estratégicos',
    is_default: true,
    is_shared: true,
    owner_id: 'user-1',
    widgets: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Acompanhamento de Metas',
    description: 'Progresso das metas por área',
    is_default: false,
    is_shared: false,
    owner_id: 'user-1',
    widgets: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Performance Financeira',
    description: 'Indicadores financeiros e orçamentários',
    is_default: false,
    is_shared: true,
    owner_id: 'user-2',
    widgets: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function CustomDashboardsPage() {
  const [dashboards] = useState<Dashboard[]>(mockDashboards)
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Painéis Personalizados</h1>
          <p className="text-muted mt-1">Crie e gerencie seus dashboards customizados</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Painel
        </Button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboards.map((dashboard) => (
          <Card
            key={dashboard.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              selectedDashboard?.id === dashboard.id && 'ring-2 ring-primary-500'
            )}
            onClick={() => setSelectedDashboard(dashboard)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <PanelTop className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{dashboard.name}</CardTitle>
                    {dashboard.is_default && (
                      <span className="text-xs text-primary-600 font-medium">Padrão</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {dashboard.is_shared && (
                    <span className="px-2 py-0.5 text-xs bg-accent rounded-full text-muted">
                      Compartilhado
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted line-clamp-2">
                {dashboard.description || 'Sem descrição'}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="text-xs text-muted">
                  {dashboard.widgets.length} widgets
                </span>
                <div className="flex items-center gap-1">
                  <button
                    className="p-1.5 rounded hover:bg-accent transition-colors"
                    title="Favoritar"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Star className="h-4 w-4 text-muted hover:text-warning-500" />
                  </button>
                  <button
                    className="p-1.5 rounded hover:bg-accent transition-colors"
                    title="Configurações"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Settings className="h-4 w-4 text-muted" />
                  </button>
                  <button
                    className="p-1.5 rounded hover:bg-accent transition-colors"
                    title="Excluir"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted hover:text-danger-500" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create New Card */}
        <Card className="border-dashed cursor-pointer hover:border-primary-500 hover:bg-accent/50 transition-all">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <div className="p-3 rounded-full bg-accent mb-3">
              <Plus className="h-6 w-6 text-muted" />
            </div>
            <p className="font-medium text-foreground">Criar Novo Painel</p>
            <p className="text-sm text-muted mt-1">
              Monte seu dashboard personalizado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {dashboards.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <PanelTop className="h-12 w-12 mx-auto mb-4 text-muted opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum painel criado
            </h3>
            <p className="text-muted mb-4">
              Crie seu primeiro dashboard personalizado para visualizar seus dados
            </p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeiro Painel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

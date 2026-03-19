import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import type { Insight } from '../types'

const mockInsights: Insight[] = [
  {
    id: '1',
    title: 'Tendência positiva em vendas',
    description: 'As vendas do último trimestre mostram crescimento consistente de 12% acima da média histórica.',
    type: 'trend',
    severity: 'low',
    source: 'Indicador de Vendas',
    metric: 'Receita Mensal',
    value: 1250000,
    change: 12,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Anomalia detectada em custos operacionais',
    description: 'Custos operacionais 23% acima do esperado para o período. Recomenda-se investigação.',
    type: 'anomaly',
    severity: 'high',
    source: 'Indicador Financeiro',
    metric: 'Custos Operacionais',
    value: 450000,
    change: 23,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Oportunidade de otimização',
    description: 'Baseado nos dados históricos, há potencial para reduzir o ciclo de vendas em 15%.',
    type: 'recommendation',
    severity: 'medium',
    source: 'Análise Preditiva',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Meta em risco',
    description: 'A meta de NPS pode não ser atingida se a tendência atual continuar.',
    type: 'alert',
    severity: 'high',
    source: 'Projeção de Metas',
    metric: 'NPS',
    value: 72,
    change: -5,
    created_at: new Date().toISOString(),
  },
]

const typeConfig = {
  trend: { icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-100 dark:bg-primary-900/30' },
  anomaly: { icon: AlertTriangle, color: 'text-danger-600', bg: 'bg-danger-100 dark:bg-danger-900/30' },
  recommendation: { icon: Lightbulb, color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30' },
  alert: { icon: AlertTriangle, color: 'text-danger-600', bg: 'bg-danger-100 dark:bg-danger-900/30' },
}

export function InsightsPage() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <TrendingUp className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted">Tendências</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-danger-100 dark:bg-danger-900/30">
                <AlertTriangle className="h-5 w-5 text-danger-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted">Anomalias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30">
                <Lightbulb className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted">Recomendações</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success-100 dark:bg-success-900/30">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted">Resolvidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {mockInsights.map((insight) => {
              const config = typeConfig[insight.type]
              const Icon = config.icon

              return (
                <div
                  key={insight.id}
                  className="flex items-start gap-4 p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className={cn('p-2 rounded-lg', config.bg)}>
                    <Icon className={cn('h-5 w-5', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-foreground">{insight.title}</h3>
                        <p className="text-sm text-muted mt-1">{insight.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted">
                            Fonte: <span className="font-medium">{insight.source}</span>
                          </span>
                          {insight.metric && (
                            <span className="text-xs text-muted">
                              Métrica: <span className="font-medium">{insight.metric}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      {insight.change !== undefined && (
                        <div className={cn(
                          'flex items-center gap-1 text-sm font-medium',
                          insight.change > 0 ? 'text-success-600' : 'text-danger-600'
                        )}>
                          {insight.change > 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span>{insight.change > 0 ? '+' : ''}{insight.change}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

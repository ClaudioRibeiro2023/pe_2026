import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Database, CheckCircle, AlertTriangle } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import type { DataHealthMetric } from '../types'

const mockMetrics: DataHealthMetric[] = [
  {
    id: '1',
    name: 'Metas',
    completeness: 95,
    accuracy: 98,
    timeliness: 85,
    consistency: 92,
    overall_score: 92,
    last_updated: new Date().toISOString(),
    issues: [],
  },
  {
    id: '2',
    name: 'Indicadores',
    completeness: 88,
    accuracy: 95,
    timeliness: 72,
    consistency: 90,
    overall_score: 86,
    last_updated: new Date().toISOString(),
    issues: ['3 indicadores sem atualização há mais de 30 dias'],
  },
  {
    id: '3',
    name: 'Planos de Ação',
    completeness: 78,
    accuracy: 92,
    timeliness: 65,
    consistency: 85,
    overall_score: 80,
    last_updated: new Date().toISOString(),
    issues: ['12 planos sem responsável definido', '5 planos com datas inconsistentes'],
  },
  {
    id: '4',
    name: 'Evidências',
    completeness: 65,
    accuracy: 88,
    timeliness: 55,
    consistency: 78,
    overall_score: 71,
    last_updated: new Date().toISOString(),
    issues: ['28 evidências pendentes de validação', '15 evidências expiradas'],
  },
]

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-success-600'
  if (score >= 70) return 'text-warning-600'
  return 'text-danger-600'
}

function getScoreBg(score: number): string {
  if (score >= 90) return 'bg-success-500'
  if (score >= 70) return 'bg-warning-500'
  return 'bg-danger-500'
}

export function DataHealthPage() {
  const overallHealth = Math.round(mockMetrics.reduce((acc, m) => acc + m.overall_score, 0) / mockMetrics.length)

  return (
    <div className="space-y-6">
      {/* Overall Health */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                <Database className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Saúde Geral dos Dados</h2>
                <p className="text-sm text-muted">Qualidade e integridade dos dados do sistema</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className={cn('text-4xl font-bold', getScoreColor(overallHealth))}>
                  {overallHealth}%
                </p>
                <p className="text-sm text-muted">Score Geral</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{metric.name}</CardTitle>
                <span className={cn('text-2xl font-bold', getScoreColor(metric.overall_score))}>
                  {metric.overall_score}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {/* Dimension Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">Completude</span>
                    <span className="font-medium">{metric.completeness}%</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', getScoreBg(metric.completeness))}
                      style={{ width: `${metric.completeness}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">Precisão</span>
                    <span className="font-medium">{metric.accuracy}%</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', getScoreBg(metric.accuracy))}
                      style={{ width: `${metric.accuracy}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">Atualidade</span>
                    <span className="font-medium">{metric.timeliness}%</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', getScoreBg(metric.timeliness))}
                      style={{ width: `${metric.timeliness}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">Consistência</span>
                    <span className="font-medium">{metric.consistency}%</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', getScoreBg(metric.consistency))}
                      style={{ width: `${metric.consistency}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Issues */}
              {metric.issues.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-warning-600 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Problemas detectados</span>
                  </div>
                  <ul className="space-y-1">
                    {metric.issues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-muted flex items-start gap-2">
                        <span className="text-warning-500">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {metric.issues.length === 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-success-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Nenhum problema detectado</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

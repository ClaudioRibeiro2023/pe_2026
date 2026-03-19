import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Gauge, TrendingUp, TrendingDown, Target, BarChart3 } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'

interface ScoreItem {
  id: string
  label: string
  value: number
  target: number
  trend: 'up' | 'down' | 'stable'
  change: number
}

const mockScores: ScoreItem[] = [
  { id: '1', label: 'Execução Estratégica', value: 78, target: 85, trend: 'up', change: 5 },
  { id: '2', label: 'Saúde Financeira', value: 82, target: 80, trend: 'up', change: 3 },
  { id: '3', label: 'Engajamento', value: 71, target: 75, trend: 'down', change: -2 },
  { id: '4', label: 'Inovação', value: 65, target: 70, trend: 'stable', change: 0 },
  { id: '5', label: 'Operações', value: 88, target: 85, trend: 'up', change: 4 },
  { id: '6', label: 'Clientes', value: 76, target: 80, trend: 'up', change: 2 },
]

function getScoreColor(value: number, target: number): string {
  const ratio = value / target
  if (ratio >= 1) return 'text-success-600'
  if (ratio >= 0.85) return 'text-warning-600'
  return 'text-danger-600'
}

function getScoreBg(value: number, target: number): string {
  const ratio = value / target
  if (ratio >= 1) return 'bg-success-100 dark:bg-success-900/30'
  if (ratio >= 0.85) return 'bg-warning-100 dark:bg-warning-900/30'
  return 'bg-danger-100 dark:bg-danger-900/30'
}

export function ScoreboardPage() {
  const overallScore = Math.round(mockScores.reduce((acc, s) => acc + s.value, 0) / mockScores.length)

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 border-primary-200 dark:border-primary-800">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-primary-600">
                <Gauge className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-primary-900 dark:text-primary-100">
                  Score Estratégico Geral
                </h2>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Média ponderada de todos os pilares
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-5xl font-bold text-primary-700 dark:text-primary-300">
                {overallScore}
                <span className="text-2xl text-primary-500">/100</span>
              </p>
              <div className="flex items-center justify-center md:justify-end gap-1 mt-2 text-success-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+3.2% vs mês anterior</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockScores.map((score) => (
          <Card key={score.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">{score.label}</CardTitle>
                <div className={cn('p-2 rounded-lg', getScoreBg(score.value, score.target))}>
                  <Target className={cn('h-4 w-4', getScoreColor(score.value, score.target))} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className={cn('text-3xl font-bold', getScoreColor(score.value, score.target))}>
                    {score.value}
                  </p>
                  <p className="text-sm text-muted">Meta: {score.target}</p>
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  score.trend === 'up' && 'text-success-600',
                  score.trend === 'down' && 'text-danger-600',
                  score.trend === 'stable' && 'text-muted'
                )}>
                  {score.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                  {score.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                  {score.trend === 'stable' && <BarChart3 className="h-4 w-4" />}
                  <span>{score.change > 0 ? '+' : ''}{score.change}%</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2 bg-accent rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      score.value >= score.target ? 'bg-success-500' :
                      score.value >= score.target * 0.85 ? 'bg-warning-500' : 'bg-danger-500'
                    )}
                    style={{ width: `${Math.min(100, (score.value / score.target) * 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Timer,
  TrendingUp,
  Target,
  BarChart3,
  Calendar,
  ArrowRight,
} from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageLoader } from '@/shared/ui/Loader'
import { ErrorState } from '@/shared/ui/ErrorState'
import { formatNumber, formatCurrency } from '@/shared/lib/format'
import { useActionPlans } from '../hooks'
import { calculatePortfolioStats } from '../api'
import type { ActionPlan, ActionPlanHealth } from '../types'

// Cores para saúde
const healthColors: Record<ActionPlanHealth, { bg: string; text: string; label: string }> = {
  on_track: { bg: 'bg-success-100 dark:bg-success-900/30', text: 'text-success-700 dark:text-success-400', label: 'No Prazo' },
  at_risk: { bg: 'bg-warning-100 dark:bg-warning-900/30', text: 'text-warning-700 dark:text-warning-400', label: 'Em Risco' },
  off_track: { bg: 'bg-danger-100 dark:bg-danger-900/30', text: 'text-danger-700 dark:text-danger-400', label: 'Atrasado' },
}

// Componente de indicador de saúde
function HealthBadge({ health }: { health: ActionPlanHealth }) {
  const config = healthColors[health]
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

// Card de estatística
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = 'primary' 
}: { 
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  trend?: { value: number; label: string }
  color?: 'primary' | 'success' | 'warning' | 'danger'
}) {
  const colorClasses = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600',
    success: 'bg-success-50 dark:bg-success-900/20 text-success-600',
    warning: 'bg-warning-50 dark:bg-warning-900/20 text-warning-600',
    danger: 'bg-danger-50 dark:bg-danger-900/20 text-danger-600',
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted">{title}</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 text-xs mt-2 ${trend.value >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                <TrendingUp className={`h-3 w-3 ${trend.value < 0 ? 'rotate-180' : ''}`} />
                <span>{trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}</span>
              </div>
            )}
          </div>
          <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Card de plano prioritário
function PriorityPlanCard({ plan }: { plan: ActionPlan }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-2 h-12 rounded-full" style={{
          backgroundColor: plan.health === 'on_track' ? '#16a34a' : plan.health === 'at_risk' ? '#ca8a04' : '#dc2626'
        }} />
        <div>
          <h4 className="font-medium text-foreground">{plan.title}</h4>
          <p className="text-sm text-muted">{plan.area_name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-lg font-semibold text-foreground">{plan.progress}%</p>
          <p className="text-xs text-muted">{plan.due_date}</p>
        </div>
        <HealthBadge health={plan.health} />
      </div>
    </div>
  )
}

// Gráfico de rosca simples (SVG)
function DonutChart({ 
  data, 
  colors,
  size = 120 
}: { 
  data: { label: string; value: number }[]
  colors: string[]
  size?: number
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) return null
  
  const radius = size / 2 - 10
  const circumference = 2 * Math.PI * radius
  let currentOffset = 0
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = item.value / total
          const strokeLength = circumference * percentage
          const offset = currentOffset
          currentOffset += strokeLength
          
          return (
            <circle
              key={item.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors[index]}
              strokeWidth={16}
              strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
              strokeDashoffset={-offset}
              className="transition-all duration-500"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{total}</p>
          <p className="text-xs text-muted">Total</p>
        </div>
      </div>
    </div>
  )
}

export function ActionPlanDashboard() {
  const { data: plans, isLoading, error, refetch } = useActionPlans()
  
  const stats = useMemo(() => {
    if (!plans) return null
    return calculatePortfolioStats(plans)
  }, [plans])
  
  const priorityPlans = useMemo(() => {
    if (!plans) return []
    return plans
      .filter(p => p.status === 'in_progress' || p.status === 'blocked')
      .sort((a, b) => {
        // Priorizar por saúde (off_track > at_risk > on_track) e depois por progresso
        const healthOrder = { off_track: 0, at_risk: 1, on_track: 2 }
        if (healthOrder[a.health] !== healthOrder[b.health]) {
          return healthOrder[a.health] - healthOrder[b.health]
        }
        return a.progress - b.progress
      })
      .slice(0, 5)
  }, [plans])
  
  const totalBudget = useMemo(() => {
    if (!plans) return 0
    return plans.reduce((sum, p) => sum + (p.how_much || 0), 0)
  }, [plans])
  
  if (isLoading) {
    return <PageLoader text="Carregando dashboard..." />
  }
  
  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar dashboard"
        message={error instanceof Error ? error.message : 'Erro desconhecido'}
        onRetry={refetch}
      />
    )
  }
  
  if (!stats) return null
  
  const healthData = [
    { label: 'No Prazo', value: stats.byHealth.on_track },
    { label: 'Em Risco', value: stats.byHealth.at_risk },
    { label: 'Atrasado', value: stats.byHealth.off_track },
  ]
  
  const healthColors = ['#16a34a', '#ca8a04', '#dc2626']
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Dashboard de Planos de Ação
          </h1>
          <p className="text-muted mt-1">
            Visão executiva do portfólio de iniciativas estratégicas
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/action-plans/kanban">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Kanban
            </Button>
          </Link>
          <Link to="/action-plans/timeline">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Timeline
            </Button>
          </Link>
          <Link to="/action-plans">
            <Button>
              Ver Todos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Planos"
          value={formatNumber(stats.total)}
          subtitle={`${stats.byStatus.in_progress} em execução`}
          icon={Target}
          color="primary"
        />
        <StatCard
          title="Taxa de Conclusão"
          value={`${stats.completionRate}%`}
          subtitle={`${stats.byStatus.completed} concluídos`}
          icon={CheckCircle}
          color="success"
        />
        <StatCard
          title="Alertas"
          value={formatNumber(stats.overdue + stats.byHealth.at_risk + stats.byHealth.off_track)}
          subtitle={`${stats.overdue} atrasados, ${stats.dueSoon} vencem em breve`}
          icon={AlertTriangle}
          color="warning"
        />
        <StatCard
          title="Orçamento Total"
          value={formatCurrency(totalBudget)}
          subtitle="Investimento planejado"
          icon={Activity}
          color="primary"
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saúde do Portfólio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saúde do Portfólio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <DonutChart data={healthData} colors={healthColors} size={140} />
            </div>
            <div className="space-y-2 mt-4">
              {healthData.map((item, index) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: healthColors[index] }} 
                    />
                    <span className="text-sm text-muted">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.value} ({stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Distribuição por Área */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Área</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.byArea.slice(0, 6).map((area) => (
                <div key={area.area_id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted">{area.area_name}</span>
                    <span className="font-medium text-foreground">{area.count}</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all duration-500"
                      style={{ width: `${(area.count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Status dos Planos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status dos Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  <span className="text-sm">Rascunho</span>
                </div>
                <span className="font-medium">{stats.byStatus.draft}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  <span className="text-sm">Planejado</span>
                </div>
                <span className="font-medium">{stats.byStatus.planned}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Em Execução</span>
                </div>
                <span className="font-medium">{stats.byStatus.in_progress}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning-500" />
                  <span className="text-sm">Bloqueado</span>
                </div>
                <span className="font-medium">{stats.byStatus.blocked}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-success-50 dark:bg-success-900/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  <span className="text-sm">Concluído</span>
                </div>
                <span className="font-medium">{stats.byStatus.completed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Planos Prioritários */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Planos Prioritários</CardTitle>
          <Link to="/action-plans">
            <Button variant="outline" size="sm">
              Ver todos
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {priorityPlans.length > 0 ? (
              priorityPlans.map(plan => (
                <PriorityPlanCard key={plan.id} plan={plan} />
              ))
            ) : (
              <p className="text-center text-muted py-8">
                Nenhum plano em execução no momento
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

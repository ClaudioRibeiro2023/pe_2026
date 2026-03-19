import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Clock, FileText, TrendingDown } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { useQuery } from '@tanstack/react-query'
import { fetchAreaPlanProgress, fetchEvidenceBacklog } from '../api'

interface Alert {
  id: string
  type: 'overdue' | 'evidence' | 'risk' | 'low_progress'
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  action?: {
    label: string
    href: string
  }
}

export function PlanAlertsWidget() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const { data: planProgress = [] } = useQuery({
    queryKey: ['area-plan-progress', currentYear],
    queryFn: () => fetchAreaPlanProgress(currentYear),
  })

  const { data: evidenceBacklog = [] } = useQuery({
    queryKey: ['evidence-backlog'],
    queryFn: fetchEvidenceBacklog,
  })

  const alerts = useMemo<Alert[]>(() => {
    const result: Alert[] = []

    // Alertas de ações atrasadas
    planProgress.forEach((plan) => {
      if (plan.overdue_actions > 0) {
        result.push({
          id: `overdue-${plan.plan_id}`,
          type: 'overdue',
          title: `${plan.overdue_actions} ações em atraso`,
          description: `Área ${plan.area_name} tem ações com prazo vencido`,
          severity: 'critical',
          action: {
            label: 'Ver ações',
            href: `/planning/${plan.area_slug}/dashboard?filter=overdue`,
          },
        })
      }
    })

    // Alertas de evidências pendentes
    if (evidenceBacklog.length > 0) {
      const pendingCount = evidenceBacklog.filter((e) => e.evidence_status === 'PENDENTE').length
      if (pendingCount > 0) {
        result.push({
          id: 'evidence-pending',
          type: 'evidence',
          title: `${pendingCount} evidências aguardando validação`,
          description: 'Evidências precisam ser revisadas por gestores',
          severity: 'warning',
          action: {
            label: 'Ver backlog',
            href: '/planning/actions/evidences',
          },
        })
      }
    }

    // Alertas de baixo progresso
    planProgress.forEach((plan) => {
      if (plan.completion_percentage < 25 && plan.total_actions > 5) {
        result.push({
          id: `low-progress-${plan.plan_id}`,
          type: 'low_progress',
          title: `Progresso baixo: ${plan.completion_percentage}%`,
          description: `Área ${plan.area_name} precisa de atenção`,
          severity: 'warning',
          action: {
            label: 'Ver plano',
            href: `/planning/${plan.area_slug}/dashboard`,
          },
        })
      }
    })

    return result.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
  }, [planProgress, evidenceBacklog])

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle className="h-5 w-5" />
      case 'evidence':
        return <FileText className="h-5 w-5" />
      case 'risk':
        return <AlertTriangle className="h-5 w-5" />
      case 'low_progress':
        return <TrendingDown className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getAlertStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-danger-200 bg-danger-50 text-danger-700'
      case 'warning':
        return 'border-warning-200 bg-warning-50 text-warning-700'
      case 'info':
        return 'border-primary-200 bg-primary-50 text-primary-700'
      default:
        return 'border-border bg-accent text-muted'
    }
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum alerta no momento</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning-600" />
          Alertas ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.slice(0, 5).map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${getAlertStyles(alert.severity)}`}
          >
            <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{alert.title}</h4>
              <p className="text-xs mt-0.5 opacity-80">{alert.description}</p>
              {alert.action && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-7 text-xs"
                  onClick={() => navigate(alert.action!.href)}
                >
                  {alert.action.label}
                </Button>
              )}
            </div>
          </div>
        ))}

        {alerts.length > 5 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => navigate('/alerts')}
          >
            Ver todos os alertas ({alerts.length})
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

import { useState } from 'react'
import { 
  Wrench, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Ban, 
  FileWarning,
  RefreshCw,
  Clock,
  Shield,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { cn } from '@/shared/lib/cn'
import { useMaintenance, useMaintenanceHealthCheck } from '@/shared/lib/maintenance'
import type { MaintenanceFinding } from '@/shared/lib/maintenance'

export function MaintenanceConsolePage() {
  const { 
    isScanning, 
    findings, 
    actions, 
    report, 
    scan, 
    approveAndExecute 
  } = useMaintenance()
  
  const { lastCheck, issues, hasIssues } = useMaintenanceHealthCheck(30)
  const [dryRunMode, setDryRunMode] = useState(true)

  const safeFindings = findings.filter(f => f.riskLevel === 'safe')
  const approvalFindings = findings.filter(f => f.riskLevel === 'approval')
  const blockedFindings = findings.filter(f => f.riskLevel === 'blocked')

  const getRiskBadge = (riskLevel: MaintenanceFinding['riskLevel']) => {
    switch (riskLevel) {
      case 'safe':
        return <Badge variant="success">Seguro</Badge>
      case 'approval':
        return <Badge variant="warning">Requer Aprovação</Badge>
      case 'blocked':
        return <Badge variant="danger">Bloqueado</Badge>
    }
  }

  const getActionIcon = (type: MaintenanceFinding['type']) => {
    switch (type) {
      case 'cleanup_dist':
      case 'cleanup_storage_orphaned':
      case 'cleanup_temp_files':
        return <Trash2 className="h-4 w-4" />
      case 'remove_console_logs':
        return <FileWarning className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Console de Manutenção</h1>
          <p className="text-muted mt-1">
            Sistema autônomo de limpeza e organização da repo
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setDryRunMode(!dryRunMode)}
            className={cn(dryRunMode && 'border-warning-300 bg-warning-50')}
          >
            <Shield className="h-4 w-4 mr-2" />
            {dryRunMode ? 'Modo Dry-Run' : 'Execução Real'}
          </Button>
          <Button onClick={scan} loading={isScanning}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Escanear
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <Card className={cn(
        'border-2',
        hasIssues 
          ? 'border-warning-200 bg-warning-50' 
          : 'border-success-200 bg-success-50'
      )}>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            {hasIssues ? (
              <AlertTriangle className="h-5 w-5 text-warning-600" />
            ) : (
              <CheckCircle className="h-5 w-5 text-success-600" />
            )}
            <div>
              <span className={cn(
                'font-semibold',
                hasIssues ? 'text-warning-700' : 'text-success-700'
              )}>
                {hasIssues 
                  ? `${issues.length} issue(s) requerem atenção` 
                  : 'Repo saudável — nenhum problema detectado'}
              </span>
              {lastCheck && (
                <p className="text-sm text-muted">
                  Última verificação: {lastCheck.toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Total de Findings</p>
                  <p className="text-2xl font-bold text-foreground">{report.summary.totalFindings}</p>
                </div>
                <Wrench className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Seguros (Auto)</p>
                  <p className="text-2xl font-bold text-success-600">{report.summary.safeCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Pendentes Aprovação</p>
                  <p className="text-2xl font-bold text-warning-600">{report.summary.approvalCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Executados Auto</p>
                  <p className="text-2xl font-bold text-primary-600">{report.summary.autoExecuted}</p>
                </div>
                <Play className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Findings List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Tarefas de Manutenção Detectadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {findings.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success-500" />
              <p>Nenhuma tarefa de manutenção detectada</p>
              <p className="text-sm">A repo está organizada e limpa</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Safe Findings */}
              {safeFindings.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-success-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Execução Automática ({safeFindings.length})
                  </h3>
                  <div className="space-y-2">
                    {safeFindings.map(finding => (
                      <div 
                        key={finding.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-success-200 bg-success-50"
                      >
                        <div className="flex items-center gap-3">
                          {getActionIcon(finding.type)}
                          <div>
                            <p className="font-medium text-sm">{finding.title}</p>
                            <p className="text-xs text-muted">{finding.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRiskBadge(finding.riskLevel)}
                          <span className="text-xs text-success-600 font-medium">
                            Auto-executado
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Findings */}
              {approvalFindings.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-warning-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Requer Aprovação ({approvalFindings.length})
                  </h3>
                  <div className="space-y-2">
                    {approvalFindings.map(finding => {
                      const action = actions.find(a => a.findingId === finding.id)
                      return (
                        <div 
                          key={finding.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-warning-200 bg-warning-50"
                        >
                          <div className="flex items-center gap-3">
                            {getActionIcon(finding.type)}
                            <div>
                              <p className="font-medium text-sm">{finding.title}</p>
                              <p className="text-xs text-muted">{finding.description}</p>
                              {finding.location && (
                                <p className="text-xs text-warning-600">{finding.location}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getRiskBadge(finding.riskLevel)}
                            {action?.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => approveAndExecute(action.id)}
                                disabled={dryRunMode}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Executar
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Blocked Findings */}
              {blockedFindings.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-danger-700 mb-2 flex items-center gap-2">
                    <Ban className="h-4 w-4" />
                    Bloqueados ({blockedFindings.length})
                  </h3>
                  <div className="space-y-2">
                    {blockedFindings.map(finding => (
                      <div 
                        key={finding.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-danger-200 bg-danger-50"
                      >
                        <div className="flex items-center gap-3">
                          <Ban className="h-4 w-4 text-danger-500" />
                          <div>
                            <p className="font-medium text-sm">{finding.title}</p>
                            <p className="text-xs text-muted">{finding.description}</p>
                          </div>
                        </div>
                        {getRiskBadge(finding.riskLevel)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions History */}
      {actions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Histórico de Execuções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {actions.slice(0, 10).map(action => (
                <div 
                  key={action.id}
                  className="flex items-center justify-between p-2 rounded border border-border"
                >
                  <div className="flex items-center gap-2">
                    {action.status === 'completed' && <CheckCircle className="h-4 w-4 text-success-500" />}
                    {action.status === 'failed' && <AlertTriangle className="h-4 w-4 text-danger-500" />}
                    {action.status === 'rejected' && <Ban className="h-4 w-4 text-warning-500" />}
                    {action.status === 'running' && <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />}
                    <span className="text-sm">{action.type}</span>
                    <Badge variant={action.executedBy === 'system' ? 'default' : 'primary'}>
                      {action.executedBy === 'system' ? 'Auto' : 'Manual'}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted">
                    {action.executedAt?.toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

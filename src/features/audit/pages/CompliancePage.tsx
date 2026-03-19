import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { ShieldCheck, CheckCircle, AlertTriangle, Info } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import type { ComplianceRule } from '../types'

const mockRules: ComplianceRule[] = [
  {
    id: '1',
    name: 'Evidências Validadas',
    description: 'Todas as evidências devem ser validadas por um gestor antes de serem consideradas completas.',
    category: 'Governança',
    status: 'compliant',
    last_checked: new Date().toISOString(),
    evidence_count: 45,
    issues: [],
  },
  {
    id: '2',
    name: 'Metas com Responsável',
    description: 'Toda meta deve ter um responsável designado.',
    category: 'Gestão',
    status: 'partial',
    last_checked: new Date().toISOString(),
    evidence_count: 28,
    issues: ['3 metas sem responsável definido'],
  },
  {
    id: '3',
    name: 'Planos de Ação Atualizados',
    description: 'Planos de ação devem ser atualizados pelo menos mensalmente.',
    category: 'Execução',
    status: 'non_compliant',
    last_checked: new Date().toISOString(),
    evidence_count: 12,
    issues: ['8 planos sem atualização há mais de 30 dias', '2 planos sem prazo definido'],
  },
  {
    id: '4',
    name: 'Backup de Dados',
    description: 'Backups automáticos devem ser realizados diariamente.',
    category: 'Segurança',
    status: 'compliant',
    last_checked: new Date().toISOString(),
    evidence_count: 30,
    issues: [],
  },
]

const statusConfig = {
  compliant: { icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-100 dark:bg-success-900/30', label: 'Conforme' },
  non_compliant: { icon: AlertTriangle, color: 'text-danger-600', bg: 'bg-danger-100 dark:bg-danger-900/30', label: 'Não Conforme' },
  partial: { icon: Info, color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30', label: 'Parcial' },
  not_applicable: { icon: Info, color: 'text-muted', bg: 'bg-accent', label: 'N/A' },
}

export function CompliancePage() {
  const compliantCount = mockRules.filter(r => r.status === 'compliant').length
  const totalCount = mockRules.length
  const complianceRate = Math.round((compliantCount / totalCount) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance & Políticas</h1>
          <p className="text-muted mt-1">Monitoramento de conformidade com políticas internas</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <ShieldCheck className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{complianceRate}%</p>
                <p className="text-sm text-muted">Taxa de Conformidade</p>
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
                <p className="text-2xl font-bold text-foreground">{compliantCount}</p>
                <p className="text-sm text-muted">Conformes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30">
                <Info className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockRules.filter(r => r.status === 'partial').length}
                </p>
                <p className="text-sm text-muted">Parciais</p>
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
                <p className="text-2xl font-bold text-foreground">
                  {mockRules.filter(r => r.status === 'non_compliant').length}
                </p>
                <p className="text-sm text-muted">Não Conformes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <Card>
        <CardHeader>
          <CardTitle>Regras de Compliance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {mockRules.map((rule) => {
              const config = statusConfig[rule.status]
              const Icon = config.icon

              return (
                <div key={rule.id} className="p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={cn('p-2 rounded-lg', config.bg)}>
                        <Icon className={cn('h-5 w-5', config.color)} />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{rule.name}</h3>
                        <p className="text-sm text-muted mt-1">{rule.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs px-2 py-0.5 bg-accent rounded-full text-muted">
                            {rule.category}
                          </span>
                          <span className="text-xs text-muted">
                            {rule.evidence_count} evidências
                          </span>
                        </div>
                        {rule.issues.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {rule.issues.map((issue, idx) => (
                              <li key={idx} className="text-sm text-warning-600 flex items-start gap-2">
                                <span>•</span>
                                {issue}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <span className={cn(
                      'px-3 py-1 text-xs font-medium rounded-full',
                      config.bg,
                      config.color
                    )}>
                      {config.label}
                    </span>
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

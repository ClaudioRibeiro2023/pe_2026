import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Gauge, AlertTriangle, Target, ShieldAlert, CheckCircle } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'
import { useScoreboardWithEngine } from '@/features/scoreboard/hooks'
import type { KpiStatus } from '@/features/scoreboard/engine'

function statusColor(status: KpiStatus | string | undefined): string {
  if (status === 'OK') return 'text-success-600'
  if (status === 'CRITICO') return 'text-danger-600'
  return 'text-warning-600'
}

function statusBg(status: KpiStatus | string | undefined): string {
  if (status === 'OK') return 'bg-success-100 dark:bg-success-900/30'
  if (status === 'CRITICO') return 'bg-danger-100 dark:bg-danger-900/30'
  return 'bg-warning-100 dark:bg-warning-900/30'
}

function statusBar(status: KpiStatus | string | undefined): string {
  if (status === 'OK') return 'bg-success-500'
  if (status === 'CRITICO') return 'bg-danger-500'
  return 'bg-warning-500'
}

export function ScoreboardPage() {
  const { data: scoreboard, scoreResult, isLoading, error } = useScoreboardWithEngine()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted">
        Carregando placar estratégico…
      </div>
    )
  }

  if (error || !scoreboard || !scoreResult) {
    return (
      <div className="flex items-center justify-center h-64 text-danger-600 gap-2">
        <AlertTriangle className="h-5 w-5" />
        <span>Erro ao carregar placar. Verifique a conexão ou configuração.</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score Consolidado */}
      <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 border-primary-200 dark:border-primary-800">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-primary-600">
                <Gauge className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-primary-900 dark:text-primary-100">
                  Score Estratégico PE2026
                </h2>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  {scoreboard.metadata.source} — atualizado em {scoreboard.metadata.lastUpdate}
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-5xl font-bold text-primary-700 dark:text-primary-300">
                {scoreResult.scorePercent}
                <span className="text-2xl text-primary-500">%</span>
              </p>
              <div className="flex items-center justify-center md:justify-end gap-3 mt-2 text-sm">
                <span className="text-success-600 font-medium">{scoreResult.ok} OK</span>
                <span className="text-warning-600 font-medium">{scoreResult.atencao} Atenção</span>
                {scoreResult.critico > 0 && (
                  <span className="text-danger-600 font-medium">{scoreResult.critico} Crítico</span>
                )}
              </div>
            </div>
          </div>
          {/* EWS — Early Warnings */}
          {scoreResult.ews.filter(w => w.severity === 'CRITICO').length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="h-4 w-4 text-danger-600" />
                <span className="text-sm font-semibold text-danger-700 dark:text-danger-300">
                  Early Warning — {scoreResult.ews.filter(w => w.severity === 'CRITICO').length} alerta(s) crítico(s)
                </span>
              </div>
              {scoreResult.ews.filter(w => w.severity === 'CRITICO').slice(0, 3).map(w => (
                <p key={w.id} className="text-xs text-danger-600 dark:text-danger-400 ml-6">• {w.message}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guardrails A1–A4 */}
      <div>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          Camada A — Guardrails Institucionais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scoreboard.guardrails.map((g) => (
            <Card key={g.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted">{g.id}</span>
                  <div className={cn('p-1.5 rounded-md', statusBg(g.status))}>
                    {g.status === 'OK'
                      ? <CheckCircle className={cn('h-4 w-4', statusColor(g.status))} />
                      : <AlertTriangle className={cn('h-4 w-4', statusColor(g.status))} />
                    }
                  </div>
                </div>
                <CardTitle className="text-sm font-medium leading-tight mt-1">{g.indicador}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn('text-2xl font-bold', statusColor(g.status))}>
                  {g.valor}{g.unidade}
                </p>
                <p className="text-xs text-muted mt-1">{g.gatilho}</p>
                <p className="text-xs text-muted">{g.cadencia} · {g.owner}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* KPIs por Pilar */}
      <div>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          Camada B — KPIs por Pilar
        </h3>
        <div className="space-y-4">
          {scoreboard.pillars.map((pillar) => (
            <Card key={pillar.pillar}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  <span className="text-primary-600 mr-2">{pillar.pillar}</span>
                  {pillar.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pillar.kpis.map((kpi) => (
                    <div key={kpi.id} className={cn('rounded-lg p-3 border', statusBg(kpi.status))}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-muted">{kpi.id}</span>
                        <span className={cn('text-xs font-semibold', statusColor(kpi.status))}>
                          {kpi.status ?? 'N/A'}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-tight">{kpi.indicador}</p>
                      <p className={cn('text-xl font-bold mt-1', statusColor(kpi.status))}>
                        {kpi.valor}{kpi.unidade}
                      </p>
                      <div className="mt-2 h-1.5 bg-white/50 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', statusBar(kpi.status))}
                          style={{ width: `${Math.min(100, kpi.valor)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted mt-1">{kpi.owner}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monetização C1–C7 */}
      <div>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          Camada C — Monetização da Base Contratual
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scoreboard.monetization.metrics.map((m) => (
            <Card key={m.id}>
              <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted">{m.id}</span>
                  <Target className="h-4 w-4 text-muted" />
                </div>
                <CardTitle className="text-sm font-medium leading-tight">{m.indicador}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                  {m.valor.toLocaleString('pt-BR')}
                  <span className="text-sm text-muted ml-1">{m.unidade}</span>
                </p>
                <p className="text-xs text-warning-600 mt-1">{m.alert}</p>
                <p className="text-xs text-muted">{m.cadencia} · {m.owner}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* War Room status */}
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="font-semibold">War Room:</span>
          <span className={cn(
            'px-2 py-0.5 rounded text-xs font-bold',
            scoreboard.monetization.warRoom.status === 'Ativo'
              ? 'bg-success-100 text-success-700'
              : 'bg-muted/20 text-muted'
          )}>
            {scoreboard.monetization.warRoom.status}
          </span>
          <span className="text-muted">{scoreboard.monetization.warRoom.focus}</span>
        </div>
      </div>
    </div>
  )
}

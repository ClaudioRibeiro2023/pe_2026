import { GitBranch, TrendingUp, TrendingDown, Target } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { InfoTooltip } from '@/shared/ui/InfoTooltip'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { formatCurrency, formatNumber } from '@/shared/lib/format'
import { useStrategicContext } from '@/features/strategy/hooks'

const scenarioConfig = {
  pessimista: {
    gradient: 'from-danger-500 to-danger-600',
    light: 'bg-danger-50',
    border: 'border-danger-200',
    text: 'text-danger-700',
    icon: TrendingDown,
  },
  base: {
    gradient: 'from-primary-500 to-primary-600',
    light: 'bg-primary-50',
    border: 'border-primary-200',
    text: 'text-primary-700',
    icon: Target,
  },
  otimista: {
    gradient: 'from-success-500 to-success-600',
    light: 'bg-success-50',
    border: 'border-success-200',
    text: 'text-success-700',
    icon: TrendingUp,
  },
}

export function StrategyScenariosPage() {
  const { data, isLoading, isError, error, refetch } = useStrategicContext()

  if (isLoading) {
    return <PageLoader text="Carregando cenários..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar Cenários"
        message={error instanceof Error ? error.message : undefined}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!data) {
    return (
      <EmptyState
        title="Sem dados de cenários"
        description="Não foi possível encontrar o contexto estratégico."
      />
    )
  }

  const { cenarios, valorEsperado, q1Fixo } = data.metas2026
  const scenarioEntries = [
    { key: 'pessimista' as const, label: 'Pessimista', data: cenarios.pessimista },
    { key: 'base' as const, label: 'Base', data: cenarios.base },
    { key: 'otimista' as const, label: 'Otimista', data: cenarios.otimista },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarioEntries.map((scenario) => {
          const config = scenarioConfig[scenario.key]
          const Icon = config.icon

          return (
            <InfoTooltip
              key={scenario.key}
              title={`Cenário ${scenario.label}`}
              description={`Probabilidade ${formatNumber(scenario.data.probabilidade)}% e receita projetada de ${formatCurrency(scenario.data.receita)}.`}
              details={`Hectares: ${formatNumber(scenario.data.hectares)} · Variação YoY: ${formatNumber(scenario.data.variacao, 1)}% · Gatilho: ${scenario.data.gatilho}`}
            >
              <Card
                className={`overflow-hidden border-2 ${config.border} hover:shadow-lg transition-all`}
              >
                <div className={`bg-gradient-to-r ${config.gradient} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-semibold">{scenario.label}</span>
                    </div>
                    <span className="px-2 py-1 text-xs font-bold bg-white/20 rounded-full">
                      {formatNumber(scenario.data.probabilidade)}%
                    </span>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-foreground">
                      {formatCurrency(scenario.data.receita)}
                    </p>
                    <p className="text-sm text-muted mt-1">Receita projetada</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${config.light}`}>
                      <p className="text-xs text-muted">Hectares</p>
                      <p className={`text-lg font-bold ${config.text}`}>
                        {formatNumber(scenario.data.hectares)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${config.light}`}>
                      <p className="text-xs text-muted">Variação YoY</p>
                      <p className={`text-lg font-bold ${config.text}`}>
                        {scenario.data.variacao > 0 ? '+' : ''}{formatNumber(scenario.data.variacao, 1)}%
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/50 border border-border">
                    <p className="text-xs font-medium text-muted mb-1">Gatilho</p>
                    <p className="text-sm text-foreground">{scenario.data.gatilho}</p>
                  </div>
                </CardContent>
              </Card>
            </InfoTooltip>
          )
        })}
      </div>

      {/* Expected Value & Q1 Fixed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoTooltip
          title="Valor Esperado (Estatístico)"
          description={`Receita estatística esperada de ${formatCurrency(valorEsperado.receita)}.`}
          details={`${formatNumber(valorEsperado.hectares)} ha · ${formatNumber(valorEsperado.variacao, 1)}% vs 2025`}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-violet-600 p-4 text-white">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">Valor Esperado (Estatístico)</span>
              </div>
            </div>
            <CardContent className="p-5">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-foreground">
                  {formatCurrency(valorEsperado.receita)}
                </p>
                <p className="text-sm text-muted mt-1">
                  {formatNumber(valorEsperado.hectares)} ha · {formatNumber(valorEsperado.variacao, 1)}% vs 2025
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoTooltip
                  title="Techdengue"
                  description="Receita esperada no cenário estatístico para Techdengue."
                  details={formatCurrency(valorEsperado.techdengue)}
                >
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                    <p className="text-xs text-muted mb-1">Techdengue</p>
                    <p className="text-xl font-bold text-blue-700">
                      {formatCurrency(valorEsperado.techdengue)}
                    </p>
                  </div>
                </InfoTooltip>
                <InfoTooltip
                  title="Aero Engenharia"
                  description="Receita esperada no cenário estatístico para Aero Engenharia."
                  details={formatCurrency(valorEsperado.aeroeng)}
                >
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                    <p className="text-xs text-muted mb-1">Aero Engenharia</p>
                    <p className="text-xl font-bold text-amber-700">
                      {formatCurrency(valorEsperado.aeroeng)}
                    </p>
                  </div>
                </InfoTooltip>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>

        <InfoTooltip
          title="Q1 Fixo (Garantido)"
          description={`Receita garantida de ${formatCurrency(q1Fixo.receita)} para o trimestre.`}
          details={`${formatNumber(q1Fixo.hectares)} ha · Participação ${formatNumber(q1Fixo.participacao, 1)}%`}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white">
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                <span className="font-semibold">Q1 Fixo (Garantido)</span>
              </div>
            </div>
            <CardContent className="p-5">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-foreground">
                  {formatNumber(q1Fixo.hectares)} ha
                </p>
                <p className="text-sm text-muted mt-1">
                  {formatCurrency(q1Fixo.receita)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Participação no total</p>
                  <p className="text-lg font-bold text-emerald-700">
                    {formatNumber(q1Fixo.participacao, 1)}%
                  </p>
                </div>
                <p className="text-sm text-muted">{q1Fixo.descricao}</p>
              </div>
            </CardContent>
          </Card>
        </InfoTooltip>
      </div>

      {/* Scenario Triggers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary-600" />
            Gatilhos de Cenário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.gatilhosCenario.map((gatilho) => {
              const targetConfig = scenarioConfig[gatilho.cenarioAlvo as keyof typeof scenarioConfig] || scenarioConfig.base

              return (
                <InfoTooltip
                  key={gatilho.id}
                  title={`Gatilho ${gatilho.id}`}
                  description={`Cenário alvo: ${gatilho.cenarioAlvo}.`}
                  details={`${gatilho.gatilho} · Prazo: ${gatilho.prazo} · Ação: ${gatilho.acao}`}
                >
                  <div
                    className={`p-4 rounded-xl border-2 ${targetConfig.border} hover:shadow-md transition-all`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-muted bg-accent px-2 py-0.5 rounded">
                            {gatilho.id}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${targetConfig.light} ${targetConfig.text}`}>
                            → {gatilho.cenarioAlvo}
                          </span>
                        </div>
                        <p className="font-medium text-foreground">{gatilho.gatilho}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 rounded-lg bg-accent/50">
                        <p className="text-xs text-muted">Prazo</p>
                        <p className="text-sm font-medium text-foreground">{gatilho.prazo}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-accent/50">
                        <p className="text-xs text-muted">Ação</p>
                        <p className="text-sm font-medium text-foreground truncate">{gatilho.acao}</p>
                      </div>
                    </div>
                  </div>
                </InfoTooltip>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

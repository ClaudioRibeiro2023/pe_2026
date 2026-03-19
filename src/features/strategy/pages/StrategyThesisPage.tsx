import { FileText, Target, Compass, TrendingUp, Building2 } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { InfoTooltip } from '@/shared/ui/InfoTooltip'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PageLoader } from '@/shared/ui/Loader'
import { formatDate } from '@/shared/lib/format'
import { useStrategicContext } from '@/features/strategy/hooks'

const frontierStyles: Record<string, string> = {
  'Estrutura e governança': 'bg-primary-100 text-primary-700 border-primary-200',
  'Crescimento e diversificação': 'bg-success-100 text-success-700 border-success-200',
  'Excelência operacional': 'bg-warning-100 text-warning-700 border-warning-200',
  'Produto e dados': 'bg-info-100 text-info-700 border-info-200',
  'Pessoas e liderança': 'bg-purple-100 text-purple-700 border-purple-200',
}

export function StrategyThesisPage() {
  const { data, isLoading, isError, error, refetch } = useStrategicContext()

  if (isLoading) {
    return <PageLoader text="Carregando tese estratégica..." />
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar Tese"
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
        title="Sem dados de tese"
        description="Não foi possível encontrar o contexto estratégico."
      />
    )
  }

  const pillars = data.pillars ?? []
  const themes = data.themes ?? []

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-8 text-white">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-white/80">PE2026 · Tese Estratégica</span>
          </div>
          <h2 className="text-3xl font-bold mb-3">
            Monetização, Governança e Escala
          </h2>
          <p className="text-lg text-white/90 max-w-3xl">
            Transformar a base contratual em receita previsível, com governança clara, 
            operação escalável e prova de valor contínua para o mercado.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">5 Pilares</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
              <Compass className="h-4 w-4" />
              <span className="text-sm font-medium">{themes.length} Temas</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Horizonte 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diretrizes Fundamentais */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary-600" />
          Diretrizes Fundamentais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoTooltip
            title="Diretriz: Monetização"
            description="Prioridade absoluta em converter saldo contratual em execução e receita."
            details="Foco no Pareto Top-14 e previsibilidade 30/60/90."
          >
            <Card className="border-l-4 border-l-primary-500">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-primary-600 mb-2">Monetização</p>
                <p className="text-sm text-foreground">
                  Prioridade absoluta em converter saldo contratual em execução e receita, 
                  com foco no Pareto Top-14 e previsibilidade 30/60/90.
                </p>
              </CardContent>
            </Card>
          </InfoTooltip>
          <InfoTooltip
            title="Diretriz: Governança"
            description="Separação clara Aero x Techdengue com cadências de gestão." 
            details="WBR/MBR/QBR, decisões rastreáveis e evidências validadas."
          >
            <Card className="border-l-4 border-l-success-500">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-success-600 mb-2">Governança</p>
                <p className="text-sm text-foreground">
                  Separação clara Aero x Techdengue, cadência WBR/MBR/QBR, 
                  decisões rastreáveis e evidências validadas.
                </p>
              </CardContent>
            </Card>
          </InfoTooltip>
          <InfoTooltip
            title="Diretriz: Escala"
            description="Operação com margem sustentável e capacidade planejada." 
            details="Qualidade auditável em cada entrega."
          >
            <Card className="border-l-4 border-l-warning-500">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-warning-600 mb-2">Escala</p>
                <p className="text-sm text-foreground">
                  Operação com margem sustentável (≥30%), capacidade planejada 
                  e qualidade auditável em cada entrega.
                </p>
              </CardContent>
            </Card>
          </InfoTooltip>
        </div>
      </div>

      {/* Fronteiras Estratégicas */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Fronteiras Estratégicas</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {pillars.map((pillar) => {
            const styleClass = frontierStyles[pillar.frontier] || 'bg-accent text-muted border-border'
            return (
              <InfoTooltip
                key={pillar.id}
                title={`Fronteira ${pillar.frontier}`}
                description={pillar.title}
                details={`Pilar ${pillar.id} · ${pillar.subpillars.length} subpilares`}
              >
                <Card className={`border-2 ${styleClass.split(' ')[2] || 'border-border'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{pillar.id}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${styleClass}`}>
                        {pillar.frontier}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-foreground mb-3">{pillar.title}</p>
                    <div className="space-y-2">
                      {pillar.subpillars.map((sub) => (
                        <div key={sub.id} className="flex items-start gap-2 text-sm">
                          <span className="text-muted font-mono text-xs mt-0.5">{sub.id}</span>
                          <span className="text-foreground">{sub.title}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </InfoTooltip>
            )
          })}
        </div>
      </div>

      {/* Temas Estratégicos */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Temas Estratégicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <InfoTooltip
              key={theme.id}
              title={`Tema ${theme.id}`}
              description={theme.title}
              details={`Pilar ${theme.pillar} · ${theme.description}`}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-muted bg-accent px-2 py-0.5 rounded">
                          {theme.id}
                        </span>
                        <span className="text-xs text-muted">·</span>
                        <span className="text-xs text-primary-600 font-medium">{theme.pillar}</span>
                      </div>
                      <p className="font-medium text-foreground mb-1">{theme.title}</p>
                      <p className="text-sm text-muted">{theme.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </InfoTooltip>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-muted pt-4 border-t border-border">
        <span>Versão {data.metadata.version}</span>
        <span>Atualizado em {formatDate(data.metadata.lastUpdate)}</span>
      </div>
    </div>
  )
}

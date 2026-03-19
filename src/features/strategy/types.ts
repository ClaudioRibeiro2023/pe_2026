export interface StrategicContext {
  metadata: {
    version: string
    lastUpdate: string
    source: string
  }
  pillars: StrategicPillar[]
  themes: StrategicTheme[]
  objectives: StrategicObjective[]
  performance2025: {
    receita: {
      consolidado: number
      techdengue: number
      aeroeng: number
      crescimentoYoY: number
      metaAtingimento: number
    }
    operacional: {
      margemOperacional: number
      margemMeta: number
      resultadoOperacional: number
      despesas: number
      economiaVsMeta: number
    }
    volumetria: {
      hectaresMapeados: number
      medicoes: number
      haPorMedicao: number
      precoMedio: number
    }
    financeiro: {
      roi: number
      payback: number
      pmrTechdengue: number
      pmrAeroeng: number
      inadimplencia: number
    }
  }
  alertasCriticos: StrategicAlert[]
  indicadoresSaudaveis: HealthyIndicator[]
  concentracaoCarteira: {
    techdengue: {
      hhi: number
      cr5: number
      cr10: number
      cr20: number
      status: string
      interpretacao: string
    }
    aeroeng: {
      hhi: number
      cr2: number
      cr3: number
      status: string
      interpretacao: string
      clientes: Array<{
        nome: string
        receita: number
        participacao: number
        impactoPerda: number
      }>
    }
  }
  economiaUnitaria: {
    niveis: Array<{
      nivel: number
      descricao: string
      valor: number
      componentes: string[]
      margem: number
    }>
    precoVenda: number
    margemUnitaria: number
    breakEven: number
  }
  sazonalidade: {
    indices: Array<{ mes: string; indice: number; categoria: string }>
    amplitude: number
    coeficienteVariacao: number
    trimestres: Record<string, { valor: number; participacao: number }>
  }
  metas2026: {
    cenarios: {
      pessimista: Scenario
      base: Scenario & { oficial?: boolean }
      otimista: Scenario
    }
    valorEsperado: {
      receita: number
      hectares: number
      variacao: number
      techdengue: number
      aeroeng: number
    }
    q1Fixo: {
      hectares: number
      receita: number
      participacao: number
      status: string
      descricao: string
    }
  }
  gatilhosCenario: Array<{
    id: string
    gatilho: string
    prazo: string
    acao: string
    cenarioAlvo: string
  }>
  kpis: {
    techdengue: KpiDefinition[]
    aeroeng: KpiDefinition[]
  }
  estruturaCustos: {
    custoEstruturalMinimo: {
      anual: number
      mensal: number
      descricao: string
    }
    pontoEquilibrio: {
      anual: number
      mensal: number
      margemSeguranca: number
    }
    alavancagem: {
      gao: number
      interpretacao: string
      margemContribuicao: number
    }
    elasticidade: Array<{
      crescimentoReceita: number
      crescimentoCusto: number
      novaMargemOperacional: number
    }>
  }
  capacidadeOperacional: {
    atual: {
      operadoresCampo: number
      capacidadeMaxMes: number
      produtividadeMedia: number
      utilizizacao?: number
      utilizacao?: number
    }
    necessaria: {
      picoFevereiro: number
      produtividadePico: number
      acaoNecessaria: string
    }
    capacidadeOciosa: number
  }
  insights: {
    estrategicos: string[]
    operacionais: string[]
    financeiros: string[]
  }
}

export interface StrategicAlert {
  id: string
  nivel: 'CRITICO' | 'ATENCAO' | string
  categoria: string
  titulo: string
  metrica: string
  risco: string
  acaoRequerida: string
  prazo: string
  impacto: string
  probabilidade: string
}

export interface HealthyIndicator {
  indicador: string
  valor: number
  meta?: number
  status: string
  variacao?: number
  threshold?: number
}

export interface StrategicPillar {
  id: string
  title: string
  frontier: string
  subpillars: Array<{
    id: string
    title: string
    frontier: string
  }>
}

export interface StrategicTheme {
  id: string
  title: string
  description: string
  pillar: string
}

export interface StrategicObjective {
  id: string
  title: string
  pillar: string
  theme: string
  owner: string
  linkedOkrs: string[]
  krs: string[]
}

export interface Scenario {
  probabilidade: number
  receita: number
  hectares: number
  variacao: number
  gatilho: string
  techdengue: number
  aeroeng: number
}

export interface KpiDefinition {
  indicador: string
  meta: number
  alertaAmarelo: number
  alertaVermelho: number
  unidade: string
  inverso?: boolean
}

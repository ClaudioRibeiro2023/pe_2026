export interface OkrsContext {
  metadata: OkrsMetadata
  corporate: CorporateOkr[]
  areas: AreaOkrSummary[]
}

export interface OkrsMetadata {
  version: string
  lastUpdate: string
  source: string
}

export interface CorporateOkr {
  id: string
  pillar: string
  objective: string
  owner: string
  priority: string
  krs: KeyResult[]
}

export interface KeyResult {
  id: string
  title: string
  target: string
  status: 'EM_ANDAMENTO' | 'ATENCAO' | 'CONCLUIDO' | string
  evidence: string[]
  kpis: string[]
  initiatives: string[]
}

export interface AreaOkrSummary {
  area: string
  owner: string
  focus: string
  okrs: AreaOkr[]
  modules?: AreaModule[]
}

export interface AreaOkr {
  id: string
  objective: string
  linkedCorporateKrs: string[]
  status: 'EM_ANDAMENTO' | 'ATENCAO' | 'CONCLUIDO' | string
}

export interface AreaModule {
  id: string
  title: string
  status: 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'ATENCAO' | 'CONCLUIDO' | string
  linkedOkrs?: string[]
  linkedInitiatives?: string[]
  notes?: string
}

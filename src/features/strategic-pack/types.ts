// Types para o Sistema de Strategic Pack por Área

// ============================================================
// ENUMS E STATUS
// ============================================================

export type PackStatus = 'draft' | 'review' | 'published' | 'archived'

export type SectionKey = 
  | 'overview' 
  | 'diagnosis' 
  | 'objectives' 
  | 'programs' 
  | 'governance' 
  | 'docs'

export type ChangeType = 
  | 'created' 
  | 'updated' 
  | 'published' 
  | 'archived'
  | 'attachment_added' 
  | 'attachment_removed'
  | 'section_updated' 
  | 'status_changed'
  | 'comment_added'
  | 'comment_resolved'

export type ReferenceType = 
  | 'plan' 
  | 'action' 
  | 'evidence' 
  | 'approval' 
  | 'externalDoc'

export type CommentStatus = 'open' | 'resolved'

export type RitualType = 'WBR' | 'MBR' | 'QBR'

export type KpiCadence = 'diario' | 'semanal' | 'mensal' | 'trimestral' | 'anual'

// ============================================================
// ENTIDADES PRINCIPAIS
// ============================================================

export interface PackOwners {
  headName: string
  backupName?: string
}

export interface AreaStrategicPack {
  id: string
  area_slug: string
  year: number
  status: PackStatus
  version: string
  summary: string | null
  owners: PackOwners
  created_at: string
  updated_at: string
}

export interface AreaPackSection {
  id: string
  pack_id: string
  key: SectionKey
  title: string
  body_markdown: string | null
  structured_data: Record<string, unknown>
  sort_order: number
  updated_at: string
  updated_by: string | null
}

export interface PackAttachment {
  id: string
  pack_id: string
  section_id: string | null
  filename: string
  content_type: string | null
  storage_path: string
  file_size: number | null
  tags: string[]
  version_label: string
  uploaded_by: string | null
  uploaded_at: string
}

export interface PackReference {
  id: string
  pack_id: string
  ref_type: ReferenceType
  label: string
  url: string
  metadata: Record<string, unknown>
}

export interface PackComment {
  id: string
  pack_id: string
  section_id: string | null
  author: string
  body: string
  status: CommentStatus
  created_at: string
  resolved_at?: string
  resolved_by?: string
}

export interface PackChangeLog {
  id: string
  pack_id: string
  actor: string
  change_type: ChangeType
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  created_at: string
}

// ============================================================
// DADOS ESTRUTURADOS POR SEÇÃO (MVP-2)
// ============================================================

export interface Objective {
  id: string
  key: string // O1, O2, O3, O4, O5
  title: string
  description?: string
}

export interface Kpi {
  id: string
  name: string
  definition: string
  cadence: KpiCadence
  owner: string
  target: string
  trigger?: string
  current_value?: string
}

export interface Program {
  id: string
  key: string // conecta, desenvolve, reconhece, inova (RH)
  name: string
  description?: string
  goals: string[]
  status: 'active' | 'planned' | 'completed'
}

export interface Ritual {
  id: string
  type: RitualType
  name: string
  cadence: string
  participants: string[]
  last_meeting?: string
  next_meeting?: string
}

export interface MeetingMinutes {
  id: string
  ritual_id: string
  date: string
  attendees: string[]
  summary: string
  decisions: Decision[]
  action_items: ActionItem[]
  evidence_links: EvidenceLink[]
  attachment_id?: string
}

export interface Decision {
  id: string
  description: string
  responsible?: string
  due_date?: string
}

export interface ActionItem {
  id: string
  description: string
  owner?: string
  due_date?: string
  action_id?: string // Link para PlanAction existente
  status: 'pending' | 'done'
}

export interface EvidenceLink {
  id: string
  label: string
  url?: string
  attachment_id?: string
}

export interface MonthlyClose {
  id: string
  pack_id: string
  month: string // YYYY-MM
  generated_at: string
  generated_by: string
  markdown_content: string
  pdf_attachment_id?: string
  md_attachment_id?: string
}

// Dados estruturados da seção "overview"
export interface OverviewData {
  mandate?: string
  objectives?: Objective[]
  kpi_snapshot?: Kpi[]
  programs_summary?: { key: string; name: string; status: string }[]
  quick_links?: { label: string; url: string }[]
}

// Dados estruturados da seção "diagnosis"
export interface DiagnosisData {
  baselines?: { label: string; value: string }[]
  premises?: string[]
  constraints?: string[]
  sources?: { title: string; url?: string; attachment_id?: string }[]
}

// Dados estruturados da seção "objectives"
export interface ObjectivesData {
  objectives?: Objective[]
  macro_goals?: string[]
  kpis?: Kpi[]
}

// Dados estruturados da seção "programs"
export interface ProgramsData {
  programs?: Program[]
}

// Dados estruturados da seção "governance"
export interface GovernanceData {
  rituals?: Ritual[]
  minutes?: MeetingMinutes[]
  decisions?: { date: string; description: string; responsible: string }[]
  monthly_closes?: MonthlyClose[]
}

// ============================================================
// DTOs (Data Transfer Objects)
// ============================================================

export interface CreatePackData {
  area_slug: string
  year: number
  summary?: string
  owners?: PackOwners
}

export interface UpdatePackData {
  status?: PackStatus
  version?: string
  summary?: string
  owners?: PackOwners
}

export interface CreateSectionData {
  pack_id: string
  key: SectionKey
  title: string
  body_markdown?: string
  structured_data?: Record<string, unknown>
  sort_order?: number
}

export interface UpdateSectionData {
  title?: string
  body_markdown?: string
  structured_data?: Record<string, unknown>
}

export interface CreateAttachmentData {
  pack_id: string
  section_id?: string
  filename: string
  content_type?: string
  storage_path: string
  file_size?: number
  tags?: string[]
  version_label?: string
}

export interface CreateCommentData {
  pack_id: string
  section_id?: string
  body: string
}

export interface CreateChangeLogData {
  pack_id: string
  change_type: ChangeType
  before?: Record<string, unknown>
  after?: Record<string, unknown>
}

// ============================================================
// VIEWS E AGREGADOS
// ============================================================

export interface PackWithSections extends AreaStrategicPack {
  sections: AreaPackSection[]
}

export interface PackFull extends AreaStrategicPack {
  sections: AreaPackSection[]
  attachments: PackAttachment[]
  comments: PackComment[]
  references: PackReference[]
}

export interface SectionWithComments extends AreaPackSection {
  comments: PackComment[]
  attachments: PackAttachment[]
}

// ============================================================
// CONFIGURAÇÃO DE SEÇÕES
// ============================================================

export interface SectionConfig {
  key: SectionKey
  title: string
  icon: string
  description: string
  hasStructuredData: boolean
}

export const SECTION_CONFIGS: SectionConfig[] = [
  {
    key: 'overview',
    title: 'Visão Geral',
    icon: 'LayoutDashboard',
    description: 'Mandato, objetivos do ano e links rápidos',
    hasStructuredData: true,
  },
  {
    key: 'diagnosis',
    title: 'Diagnóstico e Base',
    icon: 'FileSearch',
    description: 'Baselines, premissas e fontes',
    hasStructuredData: true,
  },
  {
    key: 'objectives',
    title: 'Objetivos e Metas',
    icon: 'Target',
    description: 'Objetivos O1-O5, metas e KPIs',
    hasStructuredData: true,
  },
  {
    key: 'programs',
    title: 'Programas e Iniciativas',
    icon: 'Boxes',
    description: 'Programas da área e iniciativas ativas',
    hasStructuredData: true,
  },
  {
    key: 'governance',
    title: 'Governança e Evidências',
    icon: 'Shield',
    description: 'Rituais, atas e decisões',
    hasStructuredData: true,
  },
  {
    key: 'docs',
    title: 'Documentos',
    icon: 'Files',
    description: 'Upload e gestão de anexos',
    hasStructuredData: false,
  },
]

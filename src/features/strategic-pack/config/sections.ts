// Configuração das seções do Strategic Pack
import { 
  LayoutDashboard, 
  Search, 
  Target, 
  Briefcase, 
  Shield, 
  FileText 
} from '@/shared/ui/icons'
import type { SectionKey } from '../types'

export interface SectionConfig {
  key: SectionKey
  title: string
  description: string
  icon: React.ElementType
  hasStructuredData: boolean
  structuredFields?: string[]
  structuredComponents?: string[]
}

export const SECTION_CONFIGS: Record<SectionKey, SectionConfig> = {
  overview: {
    key: 'overview',
    title: 'Visão Geral',
    description: 'Mandato, objetivos do ano e links rápidos',
    icon: LayoutDashboard,
    hasStructuredData: true,
    structuredFields: ['mandate', 'objectives', 'kpis'],
  },
  diagnosis: {
    key: 'diagnosis',
    title: 'Diagnóstico e Base',
    description: 'Baselines, premissas e fontes',
    icon: Search,
    hasStructuredData: false,
  },
  objectives: {
    key: 'objectives',
    title: 'Objetivos e Metas',
    description: 'Objetivos O1-O5, metas mensuráveis e KPIs',
    icon: Target,
    hasStructuredData: true,
    structuredFields: ['objectives', 'goals', 'kpis'],
    structuredComponents: ['ObjectivesList', 'KpiTable'],
  },
  programs: {
    key: 'programs',
    title: 'Programas e Iniciativas',
    description: 'Programas da área com metas e ações vinculadas',
    icon: Briefcase,
    hasStructuredData: true,
    structuredFields: ['programs', 'initiatives'],
    structuredComponents: ['ProgramCard'],
  },
  governance: {
    key: 'governance',
    title: 'Governança e Evidências',
    description: 'Rituais WBR/MBR/QBR, atas e decisões',
    icon: Shield,
    hasStructuredData: true,
    structuredFields: ['rituals', 'decisions', 'evidences'],
    structuredComponents: ['GovernanceRituals'],
  },
  docs: {
    key: 'docs',
    title: 'Documentos',
    description: 'Upload, listagem e versionamento de anexos',
    icon: FileText,
    hasStructuredData: false,
  },
}

export const SECTION_ORDER: SectionKey[] = [
  'overview',
  'diagnosis',
  'objectives',
  'programs',
  'governance',
  'docs',
]

export function getSectionConfig(key: SectionKey): SectionConfig {
  return SECTION_CONFIGS[key]
}

export function getSectionTitle(key: SectionKey): string {
  return SECTION_CONFIGS[key]?.title || key
}

export function getSectionIcon(key: SectionKey): React.ElementType {
  return SECTION_CONFIGS[key]?.icon || FileText
}

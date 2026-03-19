import type { BaseEntity } from '@/shared/types'

export type NodeType = 'macro' | 'area' | 'meta' | 'pilar' | 'acao'

export interface PlanTemplate extends BaseEntity {
  name: string
  description: string | null
  structure: NodeType[]
  is_default: boolean
  icon?: string
  color?: string
}

export interface PlanTemplateFormData {
  name: string
  description: string
  structure: NodeType[]
  is_default: boolean
  icon?: string
  color?: string
}

export interface CreatePlanTemplateData {
  name: string
  description?: string
  structure: NodeType[]
  is_default?: boolean
  icon?: string
  color?: string
}

export interface UpdatePlanTemplateData {
  name?: string
  description?: string
  structure?: NodeType[]
  is_default?: boolean
  icon?: string
  color?: string
}

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  macro: 'Macro',
  area: 'Área',
  meta: 'Meta',
  pilar: 'Pilar',
  acao: 'Ação',
}

export const NODE_TYPE_COLORS: Record<NodeType, string> = {
  macro: 'bg-purple-100 text-purple-700',
  area: 'bg-blue-100 text-blue-700',
  meta: 'bg-green-100 text-green-700',
  pilar: 'bg-orange-100 text-orange-700',
  acao: 'bg-accent text-muted',
}

export const DEFAULT_TEMPLATES: PlanTemplate[] = [
  {
    id: 'template-full',
    name: 'Completo (5 níveis)',
    description: 'Hierarquia completa: Macro → Área → Meta → Pilar → Ação',
    structure: ['macro', 'area', 'meta', 'pilar', 'acao'],
    is_default: true,
    icon: 'layers',
    color: '#8B5CF6',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'template-area',
    name: 'Por Área (3 níveis)',
    description: 'Hierarquia simplificada: Área → Pilar → Ação',
    structure: ['area', 'pilar', 'acao'],
    is_default: false,
    icon: 'building',
    color: '#3B82F6',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'template-meta',
    name: 'Por Meta (2 níveis)',
    description: 'Hierarquia focada: Meta → Ação',
    structure: ['meta', 'acao'],
    is_default: false,
    icon: 'target',
    color: '#10B981',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'template-flat',
    name: 'Livre (Ações diretas)',
    description: 'Sem hierarquia: apenas ações',
    structure: ['acao'],
    is_default: false,
    icon: 'list',
    color: '#6B7280',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

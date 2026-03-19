import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import type { PlanTemplate, CreatePlanTemplateData, UpdatePlanTemplateData } from './types'
import { DEFAULT_TEMPLATES } from './types'

const mockTemplates = [...DEFAULT_TEMPLATES]

function normalizeTemplate(t: Record<string, unknown>): PlanTemplate {
  const structure = typeof t.structure === 'string' ? JSON.parse(t.structure) : t.structure
  return { ...t, structure: Array.isArray(structure) ? structure : [] } as PlanTemplate
}

export async function fetchPlanTemplates(): Promise<PlanTemplate[]> {
  if (!isSupabaseConfigured()) {
    return mockTemplates
  }

  const { data, error } = await supabase
    .from('plan_templates')
    .select('*')
    .order('is_default', { ascending: false })
    .order('name')

  if (error) throw error
  return (data || DEFAULT_TEMPLATES).map(normalizeTemplate)
}

export async function fetchPlanTemplateById(id: string): Promise<PlanTemplate | null> {
  if (!isSupabaseConfigured()) {
    return mockTemplates.find((t) => t.id === id) || null
  }

  const { data, error } = await supabase
    .from('plan_templates')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data ? normalizeTemplate(data as Record<string, unknown>) : null
}

export async function createPlanTemplate(templateData: CreatePlanTemplateData): Promise<PlanTemplate> {
  if (!isSupabaseConfigured()) {
    const newTemplate: PlanTemplate = {
      id: `template-${Date.now()}`,
      name: templateData.name,
      description: templateData.description || null,
      structure: templateData.structure,
      is_default: templateData.is_default || false,
      icon: templateData.icon,
      color: templateData.color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockTemplates.push(newTemplate)
    return newTemplate
  }

  const { data, error } = await supabase
    .from('plan_templates')
    .insert(templateData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePlanTemplate(id: string, templateData: UpdatePlanTemplateData): Promise<PlanTemplate> {
  if (!isSupabaseConfigured()) {
    const index = mockTemplates.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Template não encontrado')
    mockTemplates[index] = {
      ...mockTemplates[index],
      ...templateData,
      updated_at: new Date().toISOString(),
    }
    return mockTemplates[index]
  }

  const { data, error } = await supabase
    .from('plan_templates')
    .update({ ...templateData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePlanTemplate(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const index = mockTemplates.findIndex((t) => t.id === id)
    if (index !== -1) mockTemplates.splice(index, 1)
    return
  }

  const { error } = await supabase
    .from('plan_templates')
    .delete()
    .eq('id', id)

  if (error) throw error
}

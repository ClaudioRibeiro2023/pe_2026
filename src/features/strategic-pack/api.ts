// API para Strategic Pack - Supabase com fallback para Mock
import { getSupabaseRuntimeState, supabase } from '@/shared/lib/supabaseClient'
import * as mockApi from './api-mock'
import type {
  AreaStrategicPack,
  AreaPackSection,
  PackAttachment,
  PackComment,
  PackChangeLog,
  PackReference,
  CreatePackData,
  UpdatePackData,
  UpdateSectionData,
  CreateCommentData,
  PackFull,
} from './types'

function shouldUseMockStrategicPack(operation: string): boolean {
  const state = getSupabaseRuntimeState()

  if (state.shouldUseSupabase) {
    return false
  }

  if (state.canUseMockFallback) {
    console.info(`[Strategic Pack API] ${operation}: usando mock em ${state.environment}`)
    return true
  }

  const reason = state.isConfigured ? 'serviço inacessível' : 'variáveis de ambiente ausentes'
  throw new Error(`[Strategic Pack API] ${operation}: Supabase indisponível (${reason})`)
}

// ============================================================
// PACK API
// ============================================================

export async function fetchPack(areaSlug: string, year: number): Promise<AreaStrategicPack | null> {
  if (shouldUseMockStrategicPack('fetchPack')) {
    return mockApi.fetchPack(areaSlug, year)
  }

  const { data, error } = await supabase
    .from('area_strategic_packs')
    .select('*')
    .eq('area_slug', areaSlug)
    .eq('year', year)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows found
    console.error('[Strategic Pack API] fetchPack error:', error)
    throw error
  }

  return data as AreaStrategicPack
}

export async function fetchPackFull(areaSlug: string, year: number): Promise<PackFull | null> {
  if (shouldUseMockStrategicPack('fetchPackFull')) {
    return mockApi.fetchPackFull(areaSlug, year)
  }

  const pack = await fetchPack(areaSlug, year)
  if (!pack) return null

  const [sections, attachments, comments, references] = await Promise.all([
    fetchSections(pack.id),
    fetchAttachments(pack.id),
    fetchComments(pack.id),
    fetchReferences(pack.id),
  ])

  return {
    ...pack,
    sections,
    attachments,
    comments,
    references,
  }
}

export async function createPack(data: CreatePackData): Promise<AreaStrategicPack> {
  if (shouldUseMockStrategicPack('createPack')) {
    return mockApi.createPack(data)
  }

  const { data: pack, error } = await supabase
    .from('area_strategic_packs')
    .insert({
      area_slug: data.area_slug,
      year: data.year,
      summary: data.summary,
      owners: data.owners || { headName: '' },
      status: 'draft',
      version: '1.0',
    })
    .select()
    .single()

  if (error) {
    console.error('[Strategic Pack API] createPack error:', error)
    throw error
  }

  return pack as AreaStrategicPack
}

export async function updatePack(packId: string, data: UpdatePackData): Promise<AreaStrategicPack> {
  if (shouldUseMockStrategicPack('updatePack')) {
    return mockApi.updatePack(packId, data)
  }

  const { data: pack, error } = await supabase
    .from('area_strategic_packs')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', packId)
    .select()
    .single()

  if (error) {
    console.error('[Strategic Pack API] updatePack error:', error)
    throw error
  }

  return pack as AreaStrategicPack
}

// ============================================================
// SECTIONS API
// ============================================================

export async function fetchSections(packId: string): Promise<AreaPackSection[]> {
  if (shouldUseMockStrategicPack('fetchSections')) {
    return mockApi.fetchSections(packId)
  }

  const { data, error } = await supabase
    .from('area_pack_sections')
    .select('*')
    .eq('pack_id', packId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[Strategic Pack API] fetchSections error:', error)
    throw error
  }

  return data as AreaPackSection[]
}

export async function fetchSection(sectionId: string): Promise<AreaPackSection | null> {
  if (shouldUseMockStrategicPack('fetchSection')) {
    return mockApi.fetchSection(sectionId)
  }

  const { data, error } = await supabase
    .from('area_pack_sections')
    .select('*')
    .eq('id', sectionId)
    .single()

  if (error) {
    console.error('[Strategic Pack API] fetchSection error:', error)
    throw error
  }

  return data as AreaPackSection
}

export async function updateSection(
  sectionId: string,
  data: UpdateSectionData,
  actor?: string
): Promise<AreaPackSection> {
  if (shouldUseMockStrategicPack('updateSection')) {
    return mockApi.updateSection(sectionId, data, actor)
  }

  const { data: section, error } = await supabase
    .from('area_pack_sections')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
      updated_by: actor,
    })
    .eq('id', sectionId)
    .select()
    .single()

  if (error) {
    console.error('[Strategic Pack API] updateSection error:', error)
    throw error
  }

  return section as AreaPackSection
}

export async function updateSectionStructuredData(
  sectionId: string,
  patch: Record<string, unknown>,
  actor?: string
): Promise<AreaPackSection> {
  if (shouldUseMockStrategicPack('updateSectionStructuredData')) {
    return mockApi.updateSectionStructuredData(sectionId, patch, actor)
  }

  // Fetch current section to merge structured_data
  const { data: current, error: fetchError } = await supabase
    .from('area_pack_sections')
    .select('structured_data')
    .eq('id', sectionId)
    .single()

  if (fetchError) {
    console.error('[Strategic Pack API] updateSectionStructuredData fetch error:', fetchError)
    throw fetchError
  }

  const mergedData = {
    ...(current.structured_data as Record<string, unknown> || {}),
    ...patch,
  }

  const { data: section, error } = await supabase
    .from('area_pack_sections')
    .update({
      structured_data: mergedData,
      updated_at: new Date().toISOString(),
      updated_by: actor,
    })
    .eq('id', sectionId)
    .select()
    .single()

  if (error) {
    console.error('[Strategic Pack API] updateSectionStructuredData error:', error)
    throw error
  }

  return section as AreaPackSection
}

// ============================================================
// ATTACHMENTS API
// ============================================================

export async function fetchAttachments(packId: string, sectionId?: string): Promise<PackAttachment[]> {
  if (shouldUseMockStrategicPack('fetchAttachments')) {
    return mockApi.fetchAttachments(packId, sectionId)
  }

  let query = supabase
    .from('pack_attachments')
    .select('*')
    .eq('pack_id', packId)

  if (sectionId) {
    query = query.eq('section_id', sectionId)
  }

  const { data, error } = await query.order('uploaded_at', { ascending: false })

  if (error) {
    console.error('[Strategic Pack API] fetchAttachments error:', error)
    throw error
  }

  return data as PackAttachment[]
}

export async function uploadAttachment(
  packId: string,
  file: File,
  sectionId?: string,
  tags?: string[],
  actor?: string
): Promise<PackAttachment> {
  if (shouldUseMockStrategicPack('uploadAttachment')) {
    // For mock, just create the attachment record without actual upload
    return mockApi.createAttachment({
      pack_id: packId,
      section_id: sectionId,
      filename: file.name,
      content_type: file.type,
      storage_path: `mock/${packId}/${file.name}`,
      file_size: file.size,
      tags,
    }, actor)
  }

  // Get pack to determine area_slug
  const pack = await supabase
    .from('area_strategic_packs')
    .select('area_slug, year')
    .eq('id', packId)
    .single()

  if (pack.error) throw pack.error

  const storagePath = `${pack.data.area_slug}/${pack.data.year}/${Date.now()}_${file.name}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('area-packs')
    .upload(storagePath, file)

  if (uploadError) {
    console.error('[Strategic Pack API] uploadAttachment storage error:', uploadError)
    throw uploadError
  }

  // Create attachment record
  const { data: attachment, error } = await supabase
    .from('pack_attachments')
    .insert({
      pack_id: packId,
      section_id: sectionId,
      filename: file.name,
      content_type: file.type,
      storage_path: storagePath,
      file_size: file.size,
      tags: tags || [],
      version_label: 'v1',
      uploaded_by: actor,
    })
    .select()
    .single()

  if (error) {
    console.error('[Strategic Pack API] uploadAttachment record error:', error)
    throw error
  }

  return attachment as PackAttachment
}

export async function deleteAttachment(attachmentId: string, actor?: string): Promise<void> {
  if (shouldUseMockStrategicPack('deleteAttachment')) {
    return mockApi.deleteAttachment(attachmentId, actor)
  }

  // Get attachment to find storage path
  const { data: attachment } = await supabase
    .from('pack_attachments')
    .select('storage_path')
    .eq('id', attachmentId)
    .single()

  if (attachment) {
    // Delete from storage
    await supabase.storage.from('area-packs').remove([attachment.storage_path])
  }

  // Delete record
  const { error } = await supabase
    .from('pack_attachments')
    .delete()
    .eq('id', attachmentId)

  if (error) {
    console.error('[Strategic Pack API] deleteAttachment error:', error)
    throw error
  }
}

// ============================================================
// COMMENTS API
// ============================================================

export async function fetchComments(packId: string, sectionId?: string): Promise<PackComment[]> {
  if (shouldUseMockStrategicPack('fetchComments')) {
    return mockApi.fetchComments(packId, sectionId)
  }

  let query = supabase
    .from('pack_comments')
    .select('*')
    .eq('pack_id', packId)

  if (sectionId) {
    query = query.eq('section_id', sectionId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('[Strategic Pack API] fetchComments error:', error)
    throw error
  }

  return data as PackComment[]
}

export async function createComment(data: CreateCommentData, actor: string): Promise<PackComment> {
  if (shouldUseMockStrategicPack('createComment')) {
    return mockApi.createComment(data, actor)
  }

  const { data: comment, error } = await supabase
    .from('pack_comments')
    .insert({
      pack_id: data.pack_id,
      section_id: data.section_id,
      author: actor,
      body: data.body,
      status: 'open',
    })
    .select()
    .single()

  if (error) {
    console.error('[Strategic Pack API] createComment error:', error)
    throw error
  }

  return comment as PackComment
}

export async function resolveComment(commentId: string, actor: string): Promise<PackComment> {
  if (shouldUseMockStrategicPack('resolveComment')) {
    return mockApi.resolveComment(commentId, actor)
  }

  const { data: comment, error } = await supabase
    .from('pack_comments')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolved_by: actor,
    })
    .eq('id', commentId)
    .select()
    .single()

  if (error) {
    console.error('[Strategic Pack API] resolveComment error:', error)
    throw error
  }

  return comment as PackComment
}

// ============================================================
// CHANGELOG API
// ============================================================

export async function fetchChangelog(packId: string): Promise<PackChangeLog[]> {
  if (shouldUseMockStrategicPack('fetchChangelog')) {
    return mockApi.fetchChangelog(packId)
  }

  const { data, error } = await supabase
    .from('pack_changelog')
    .select('*')
    .eq('pack_id', packId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Strategic Pack API] fetchChangelog error:', error)
    throw error
  }

  return data as PackChangeLog[]
}

// ============================================================
// REFERENCES API
// ============================================================

export async function fetchReferences(packId: string): Promise<PackReference[]> {
  if (shouldUseMockStrategicPack('fetchReferences')) {
    return mockApi.fetchReferences(packId)
  }

  const { data, error } = await supabase
    .from('pack_references')
    .select('*')
    .eq('pack_id', packId)

  if (error) {
    console.error('[Strategic Pack API] fetchReferences error:', error)
    throw error
  }

  return data as PackReference[]
}

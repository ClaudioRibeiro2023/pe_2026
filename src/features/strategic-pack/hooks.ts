// React Query hooks para Strategic Pack
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchPack,
  fetchPackFull,
  createPack,
  updatePack,
  fetchSections,
  fetchSection,
  updateSection,
  updateSectionStructuredData,
  fetchAttachments,
  uploadAttachment,
  deleteAttachment,
  fetchComments,
  createComment,
  resolveComment,
  fetchChangelog,
  fetchReferences,
} from './api'
import type {
  AreaPackSection,
  CreatePackData,
  UpdatePackData,
  UpdateSectionData,
  CreateCommentData,
} from './types'

// ============================================================
// QUERY KEYS
// ============================================================

export const strategicPackKeys = {
  all: ['strategic-pack'] as const,
  packs: () => [...strategicPackKeys.all, 'packs'] as const,
  pack: (areaSlug: string, year: number) => [...strategicPackKeys.packs(), areaSlug, year] as const,
  packFull: (areaSlug: string, year: number) => [...strategicPackKeys.pack(areaSlug, year), 'full'] as const,
  sections: (packId: string) => [...strategicPackKeys.all, 'sections', packId] as const,
  section: (sectionId: string) => [...strategicPackKeys.all, 'section', sectionId] as const,
  attachments: (packId: string, sectionId?: string) => 
    [...strategicPackKeys.all, 'attachments', packId, sectionId] as const,
  comments: (packId: string, sectionId?: string) => 
    [...strategicPackKeys.all, 'comments', packId, sectionId] as const,
  changelog: (packId: string) => [...strategicPackKeys.all, 'changelog', packId] as const,
  references: (packId: string) => [...strategicPackKeys.all, 'references', packId] as const,
}

// ============================================================
// PACK HOOKS
// ============================================================

export function useStrategicPack(areaSlug: string | undefined, year: number = new Date().getFullYear()) {
  return useQuery({
    queryKey: strategicPackKeys.pack(areaSlug || '', year),
    queryFn: () => fetchPack(areaSlug!, year),
    enabled: !!areaSlug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useStrategicPackFull(areaSlug: string | undefined, year: number = new Date().getFullYear()) {
  return useQuery({
    queryKey: strategicPackKeys.packFull(areaSlug || '', year),
    queryFn: () => fetchPackFull(areaSlug!, year),
    enabled: !!areaSlug,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreatePack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePackData) => createPack(data),
    onSuccess: (pack) => {
      queryClient.invalidateQueries({ queryKey: strategicPackKeys.packs() })
      queryClient.setQueryData(strategicPackKeys.pack(pack.area_slug, pack.year), pack)
    },
  })
}

export function useUpdatePack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ packId, data }: { packId: string; data: UpdatePackData }) => 
      updatePack(packId, data),
    onSuccess: (pack) => {
      queryClient.invalidateQueries({ queryKey: strategicPackKeys.pack(pack.area_slug, pack.year) })
    },
  })
}

// ============================================================
// SECTIONS HOOKS
// ============================================================

export function usePackSections(packId: string | undefined) {
  return useQuery({
    queryKey: strategicPackKeys.sections(packId || ''),
    queryFn: () => fetchSections(packId!),
    enabled: !!packId,
    staleTime: 1000 * 60 * 5,
  })
}

export function usePackSection(sectionId: string | undefined) {
  return useQuery({
    queryKey: strategicPackKeys.section(sectionId || ''),
    queryFn: () => fetchSection(sectionId!),
    enabled: !!sectionId,
  })
}

export function useUpdateSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      sectionId, 
      data, 
      actor 
    }: { 
      sectionId: string
      data: UpdateSectionData
      actor?: string 
    }) => updateSection(sectionId, data, actor),
    onSuccess: (section) => {
      queryClient.invalidateQueries({ queryKey: strategicPackKeys.sections(section.pack_id) })
      queryClient.setQueryData(strategicPackKeys.section(section.id), section)
    },
  })
}

export function useUpdateSectionStructuredData() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      sectionId, 
      patch, 
      actor 
    }: { 
      sectionId: string
      patch: Record<string, unknown>
      actor?: string 
    }) => updateSectionStructuredData(sectionId, patch, actor),
    onSuccess: (section: AreaPackSection) => {
      queryClient.invalidateQueries({ queryKey: strategicPackKeys.sections(section.pack_id) })
      queryClient.invalidateQueries({ queryKey: strategicPackKeys.packs() })
      queryClient.setQueryData(strategicPackKeys.section(section.id), section)
    },
  })
}

// ============================================================
// ATTACHMENTS HOOKS
// ============================================================

export function usePackAttachments(packId: string | undefined, sectionId?: string) {
  return useQuery({
    queryKey: strategicPackKeys.attachments(packId || '', sectionId),
    queryFn: () => fetchAttachments(packId!, sectionId),
    enabled: !!packId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useUploadAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      packId,
      file,
      sectionId,
      tags,
      actor,
    }: {
      packId: string
      file: File
      sectionId?: string
      tags?: string[]
      actor?: string
    }) => uploadAttachment(packId, file, sectionId, tags, actor),
    onSuccess: (attachment) => {
      queryClient.invalidateQueries({ 
        queryKey: strategicPackKeys.attachments(attachment.pack_id) 
      })
      if (attachment.section_id) {
        queryClient.invalidateQueries({ 
          queryKey: strategicPackKeys.attachments(attachment.pack_id, attachment.section_id) 
        })
      }
    },
  })
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      attachmentId, 
      packId,
      actor 
    }: { 
      attachmentId: string
      packId: string
      actor?: string 
    }) => deleteAttachment(attachmentId, actor).then(() => packId),
    onSuccess: (packId) => {
      queryClient.invalidateQueries({ queryKey: strategicPackKeys.attachments(packId) })
    },
  })
}

// ============================================================
// COMMENTS HOOKS
// ============================================================

export function usePackComments(packId: string | undefined, sectionId?: string) {
  return useQuery({
    queryKey: strategicPackKeys.comments(packId || '', sectionId),
    queryFn: () => fetchComments(packId!, sectionId),
    enabled: !!packId,
    staleTime: 1000 * 60 * 1,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, actor }: { data: CreateCommentData; actor: string }) => 
      createComment(data, actor),
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ 
        queryKey: strategicPackKeys.comments(comment.pack_id) 
      })
      if (comment.section_id) {
        queryClient.invalidateQueries({ 
          queryKey: strategicPackKeys.comments(comment.pack_id, comment.section_id) 
        })
      }
    },
  })
}

export function useResolveComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, actor }: { commentId: string; actor: string }) => 
      resolveComment(commentId, actor),
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ 
        queryKey: strategicPackKeys.comments(comment.pack_id) 
      })
    },
  })
}

// ============================================================
// CHANGELOG HOOKS
// ============================================================

export function usePackChangelog(packId: string | undefined) {
  return useQuery({
    queryKey: strategicPackKeys.changelog(packId || ''),
    queryFn: () => fetchChangelog(packId!),
    enabled: !!packId,
    staleTime: 1000 * 60 * 2,
  })
}

// ============================================================
// REFERENCES HOOKS
// ============================================================

export function usePackReferences(packId: string | undefined) {
  return useQuery({
    queryKey: strategicPackKeys.references(packId || ''),
    queryFn: () => fetchReferences(packId!),
    enabled: !!packId,
    staleTime: 1000 * 60 * 5,
  })
}

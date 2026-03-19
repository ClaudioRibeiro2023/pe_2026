import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchPlanTemplates, fetchPlanTemplateById, createPlanTemplate, updatePlanTemplate, deletePlanTemplate } from './api'
import type { CreatePlanTemplateData, UpdatePlanTemplateData } from './types'

const QUERY_KEY = ['plan-templates']

export function usePlanTemplates() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchPlanTemplates,
    staleTime: 1000 * 60 * 30,
  })
}

export function usePlanTemplate(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => fetchPlanTemplateById(id),
    enabled: !!id,
  })
}

export function useCreatePlanTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePlanTemplateData) => createPlanTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUpdatePlanTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanTemplateData }) => updatePlanTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeletePlanTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePlanTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchActionPlans, createActionPlan, updateActionPlan, deleteActionPlan } from './api'
import type { ActionPlanFormData } from './types'

const QUERY_KEY = ['action-plans']

export function useActionPlans() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchActionPlans,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

export function useCreateActionPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createActionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUpdateActionPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ActionPlanFormData> }) =>
      updateActionPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeleteActionPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteActionPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

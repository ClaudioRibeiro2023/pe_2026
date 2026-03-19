import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchIndicators, createIndicator, updateIndicator, deleteIndicator } from './api'
import type { IndicatorFormData } from './types'

const QUERY_KEY = ['indicators']

export function useIndicators() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchIndicators,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

export function useCreateIndicator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createIndicator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUpdateIndicator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IndicatorFormData> }) =>
      updateIndicator(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeleteIndicator() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteIndicator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

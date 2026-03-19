import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAreas, fetchAreaById, fetchAreaBySlug, createArea, updateArea, deleteArea } from './api'
import type { CreateAreaData, UpdateAreaData } from './types'

const QUERY_KEY = ['areas']

export function useAreaBySlug(slug: string | null | undefined) {
  return useQuery({
    queryKey: ['area', 'slug', slug],
    queryFn: () => fetchAreaBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  })
}

export function useAreas() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchAreas,
    staleTime: 1000 * 60 * 10,
  })
}

export function useArea(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => fetchAreaById(id),
    enabled: !!id,
  })
}

export function useCreateArea() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAreaData) => createArea(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUpdateArea() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAreaData }) => updateArea(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useDeleteArea() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteArea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

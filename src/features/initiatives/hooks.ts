import { useQuery } from '@tanstack/react-query'
import { fetchInitiativesContext } from './api'
import { fetchInitiatives, fetchMotors } from '@/features/area-plans/api'

const QUERY_KEY = ['initiatives', 'context']
const CANONICAL_QUERY_KEY = ['initiatives', 'canonical']
const MOTORS_QUERY_KEY = ['motors']

export function useInitiativesContext() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchInitiativesContext,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

/**
 * Hook que retorna as 22 iniciativas canônicas (INIT-001..INIT-022)
 * diretamente do mockStore / Supabase via area-plans/api
 */
export function useCanonicalInitiatives() {
  return useQuery({
    queryKey: CANONICAL_QUERY_KEY,
    queryFn: fetchInitiatives,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

/**
 * Hook que retorna os 5 motores estratégicos (M1–M5)
 */
export function useMotors() {
  return useQuery({
    queryKey: MOTORS_QUERY_KEY,
    queryFn: fetchMotors,
    staleTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

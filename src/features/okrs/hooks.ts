import { useQuery } from '@tanstack/react-query'
import { fetchOkrsContext } from './api'
import { fetchCorporateOkrs, fetchKeyResults } from '@/features/area-plans/api'

const QUERY_KEY = ['okrs', 'context']
const CORPORATE_OKRS_KEY = ['okrs', 'corporate', 'canonical']
const KEY_RESULTS_KEY = ['okrs', 'keyresults', 'canonical']

export function useOkrsContext() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchOkrsContext,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

/**
 * Hook que retorna os 5 OKRs corporativos canônicos (OKR-P1..OKR-P5)
 * diretamente do mockStore / Supabase via area-plans/api
 */
export function useCorporateOkrs() {
  return useQuery({
    queryKey: CORPORATE_OKRS_KEY,
    queryFn: fetchCorporateOkrs,
    staleTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

/**
 * Hook que retorna os 25 KRs canônicos (P1.1..P5.5)
 * diretamente do mockStore / Supabase via area-plans/api
 */
export function useCanonicalKeyResults(okrId?: string) {
  return useQuery({
    queryKey: [...KEY_RESULTS_KEY, okrId ?? 'all'],
    queryFn: () => fetchKeyResults(okrId),
    staleTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

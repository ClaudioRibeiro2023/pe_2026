import { useQuery } from '@tanstack/react-query'
import { fetchFinanceContext } from './api'
import { fetchFinancialScenarios, fetchStrategicRisks } from '@/features/area-plans/api'

const QUERY_KEY = ['finance', 'context']
const SCENARIOS_KEY = ['finance', 'scenarios', 'canonical']
const RISKS_KEY = ['finance', 'risks', 'canonical']

export function useFinanceContext() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchFinanceContext,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

/**
 * Hook que retorna os 3 cenários financeiros canônicos (pessimista/base/otimista)
 * diretamente do mockStore / Supabase via area-plans/api
 */
export function useFinancialScenarios() {
  return useQuery({
    queryKey: SCENARIOS_KEY,
    queryFn: fetchFinancialScenarios,
    staleTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

/**
 * Hook que retorna os 13 riscos estratégicos canônicos (RSK-01..RSK-13)
 * diretamente do mockStore / Supabase via area-plans/api
 */
export function useStrategicRisks() {
  return useQuery({
    queryKey: RISKS_KEY,
    queryFn: () => fetchStrategicRisks(),
    staleTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

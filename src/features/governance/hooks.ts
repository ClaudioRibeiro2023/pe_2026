import { useQuery } from '@tanstack/react-query'
import { fetchGovernanceContext } from './api'

const QUERY_KEY = ['governance', 'context']

export function useGovernanceContext() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchGovernanceContext,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

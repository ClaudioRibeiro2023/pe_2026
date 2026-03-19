import { useQuery } from '@tanstack/react-query'
import { fetchScoreboardContext } from './api'

const QUERY_KEY = ['scoreboard', 'context']

export function useScoreboardContext() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchScoreboardContext,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

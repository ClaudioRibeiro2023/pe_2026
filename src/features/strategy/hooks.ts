import { useQuery } from '@tanstack/react-query'
import { fetchStrategicContext } from './api'

const QUERY_KEY = ['strategy', 'context']

export function useStrategicContext() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchStrategicContext,
    staleTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

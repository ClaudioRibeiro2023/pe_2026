import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchScoreboardContext } from './api'
import { applyEngineToContext, computeScoreResult } from './engine'
import type { ScoreResult } from './engine'

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

/**
 * Hook com contexto enriquecido pelo engine de cálculo.
 * Status dos guardrails e KPIs são recalculados a partir dos valores atuais.
 */
export function useScoreboardWithEngine() {
  const query = useScoreboardContext()

  const enriched = useMemo(() => {
    if (!query.data) return null
    return applyEngineToContext(query.data)
  }, [query.data])

  const scoreResult = useMemo((): ScoreResult | null => {
    if (!query.data) return null
    return computeScoreResult(query.data)
  }, [query.data])

  return { ...query, data: enriched, scoreResult }
}

/**
 * Closings Module — React Hooks
 */

import { useState, useEffect, useCallback } from 'react'
import {
  listClosings,
  getClosingById,
  createClosingSnapshot,
  deleteClosing,
  finalizeClosing,
  diffClosings,
  getAuditEvents,
  seedClosings,
} from './api-mock'
import type {
  ClosingSnapshot,
  ClosingDelta,
  AuditEvent,
  ClosingFilters,
  CreateClosingInput,
} from './types'

export function useClosings(filters?: ClosingFilters) {
  const [closings, setClosings] = useState<ClosingSnapshot[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    seedClosings()
    const data = await listClosings(filters)
    setClosings(data)
    setLoading(false)
  }, [filters?.area_id, filters?.period, filters?.status, filters?.search])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { closings, loading, refresh }
}

export function useClosingDetail(id: string | null) {
  const [closing, setClosing] = useState<ClosingSnapshot | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!id) {
      setClosing(null)
      setLoading(false)
      return
    }
    setLoading(true)
    seedClosings()
    const data = await getClosingById(id)
    setClosing(data)
    setLoading(false)
  }, [id])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { closing, loading, refresh }
}

export function useClosingActions() {
  const [creating, setCreating] = useState(false)

  const create = useCallback(async (input: CreateClosingInput) => {
    setCreating(true)
    try {
      const result = await createClosingSnapshot(input)
      return result
    } finally {
      setCreating(false)
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    return deleteClosing(id)
  }, [])

  const finalize = useCallback(async (id: string) => {
    return finalizeClosing(id)
  }, [])

  return { create, remove, finalize, creating }
}

export function useClosingComparison(idA: string | null, idB: string | null) {
  const [delta, setDelta] = useState<ClosingDelta | null>(null)
  const [loading, setLoading] = useState(false)

  const compare = useCallback(async () => {
    if (!idA || !idB) {
      setDelta(null)
      return
    }
    setLoading(true)
    const result = await diffClosings(idA, idB)
    setDelta(result)
    setLoading(false)
  }, [idA, idB])

  useEffect(() => {
    compare()
  }, [compare])

  return { delta, loading }
}

export function useAuditTrail(closingId?: string | null) {
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getAuditEvents(closingId)
    setEvents(data)
    setLoading(false)
  }, [closingId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { events, loading, refresh }
}

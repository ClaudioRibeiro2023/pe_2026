import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'planning_lastAreaSlug'

interface UseLastAreaReturn {
  lastAreaSlug: string | null
  setLastArea: (areaSlug: string) => void
  clearLastArea: () => void
}

/**
 * Hook para persistir a última área selecionada no módulo de planejamento
 * Usa localStorage para manter a seleção entre sessões
 */
export function useLastArea(): UseLastAreaReturn {
  const [lastAreaSlug, setLastAreaSlug] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  })

  const setLastArea = useCallback((areaSlug: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, areaSlug)
      setLastAreaSlug(areaSlug)
    } catch (error) {
      console.error('Failed to save lastAreaSlug to localStorage:', error)
    }
  }, [])

  const clearLastArea = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setLastAreaSlug(null)
    } catch (error) {
      console.error('Failed to clear lastAreaSlug from localStorage:', error)
    }
  }, [])

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setLastAreaSlug(e.newValue)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { lastAreaSlug, setLastArea, clearLastArea }
}

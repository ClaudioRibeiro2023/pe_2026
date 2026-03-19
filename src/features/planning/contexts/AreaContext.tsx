import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAreaBySlug } from '@/features/areas/api'
import type { Area } from '@/features/areas/types'

interface AreaContextValue {
  area: Area | null
  areaSlug: string | null
  isLoading: boolean
  error: Error | null
  setAreaSlug: (slug: string | null) => void
}

const AreaContext = createContext<AreaContextValue | null>(null)

export function useAreaContext() {
  const context = useContext(AreaContext)
  if (!context) {
    throw new Error('useAreaContext must be used within an AreaProvider')
  }
  return context
}

export function useOptionalAreaContext() {
  return useContext(AreaContext)
}

interface AreaProviderProps {
  children: ReactNode
}

export function AreaProvider({ children }: AreaProviderProps) {
  const params = useParams<{ areaSlug?: string }>()
  const [manualSlug, setManualSlug] = useState<string | null>(null)
  
  const currentSlug = params.areaSlug || manualSlug

  const {
    data: area,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['area', 'slug', currentSlug],
    queryFn: () => fetchAreaBySlug(currentSlug!),
    enabled: !!currentSlug,
    staleTime: 1000 * 60 * 10,
  })

  const setAreaSlug = useCallback((slug: string | null) => {
    setManualSlug(slug)
  }, [])

  useEffect(() => {
    if (params.areaSlug && manualSlug !== params.areaSlug) {
      setManualSlug(null)
    }
  }, [params.areaSlug, manualSlug])

  return (
    <AreaContext.Provider
      value={{
        area: area || null,
        areaSlug: currentSlug || null,
        isLoading,
        error: error as Error | null,
        setAreaSlug,
      }}
    >
      {children}
    </AreaContext.Provider>
  )
}

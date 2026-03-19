import { Navigate, useParams } from 'react-router-dom'

interface LegacyAreaRedirectProps {
  subroute?: 'dashboard' | 'kanban' | 'timeline' | 'calendar'
}

/**
 * Componente de redirect para rotas legadas /area-plans/:areaSlug/*
 * Redireciona para as novas rotas /planning/:areaSlug/*
 * Manter por no mínimo 6 meses para compatibilidade
 */
export function LegacyAreaRedirect({ subroute = 'dashboard' }: LegacyAreaRedirectProps) {
  const { areaSlug } = useParams<{ areaSlug: string }>()
  
  if (!areaSlug) {
    return <Navigate to="/planning" replace />
  }
  
  return <Navigate to={`/planning/${areaSlug}/${subroute}`} replace />
}

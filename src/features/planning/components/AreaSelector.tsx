import { useNavigate } from 'react-router-dom'
import { ArrowRight, RefreshCw } from '@/shared/ui/icons'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { useAreas } from '@/features/areas/hooks'
import { useLastArea } from '../hooks/useLastArea'
import type { Area } from '@/features/areas/types'

// MVP Mode: mostrar apenas RH durante validação
const MVP_RH_ONLY = false
const MVP_ALLOWED_AREAS = ['rh']

interface AreaSelectorProps {
  onSelectArea?: (areaSlug: string) => void
  showAllAreas?: boolean // Override para mostrar todas as áreas
}

const AREA_COLORS: Record<string, string> = {
  rh: 'from-purple-500 to-purple-600',
  financeiro: 'from-green-500 to-green-600',
  comercial: 'from-blue-500 to-blue-600',
  operacoes: 'from-orange-500 to-orange-600',
  pd: 'from-cyan-500 to-cyan-600',
  cs: 'from-sky-500 to-sky-600',
  marketing: 'from-pink-500 to-pink-600',
  default: 'from-gray-500 to-gray-600',
}

function getAreaColor(slug: string): string {
  return AREA_COLORS[slug.toLowerCase()] || AREA_COLORS.default
}

export function AreaSelector({ onSelectArea, showAllAreas = false }: AreaSelectorProps) {
  const navigate = useNavigate()
  const { data: areas = [], isLoading } = useAreas()
  const { lastAreaSlug, setLastArea, clearLastArea } = useLastArea()

  // Filtrar áreas para MVP RH-only (exceto se showAllAreas=true)
  const filteredAreas = (MVP_RH_ONLY && !showAllAreas)
    ? areas.filter((a: Area) => MVP_ALLOWED_AREAS.includes(a.slug.toLowerCase()))
    : areas

  const lastArea = areas.find((a: Area) => a.slug === lastAreaSlug)

  const handleSelectArea = (areaSlug: string) => {
    setLastArea(areaSlug)
    if (onSelectArea) {
      onSelectArea(areaSlug)
    } else {
      navigate(`/planning/${areaSlug}/dashboard`)
    }
  }

  const handleContinue = () => {
    if (lastAreaSlug) {
      navigate(`/planning/${lastAreaSlug}/dashboard`)
    }
  }

  const handleChangeArea = () => {
    clearLastArea()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Se tem área recente (e é uma área permitida no MVP), mostrar opção de continuar
  const isLastAreaAllowed = lastArea && (!MVP_RH_ONLY || showAllAreas || MVP_ALLOWED_AREAS.includes(lastArea.slug.toLowerCase()))
  
  if (isLastAreaAllowed && lastArea) {
    const otherAreas = filteredAreas.filter((area: Area) => area.slug !== lastAreaSlug)
    
    return (
      <div className="space-y-6">
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${getAreaColor(lastArea.slug)} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                  {lastArea.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">Última área acessada</p>
                  <h3 className="text-xl font-semibold text-foreground">{lastArea.name}</h3>
                  {lastArea.focus && (
                    <p className="text-sm text-muted">{lastArea.focus}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {otherAreas.length > 0 && (
                  <Button variant="outline" onClick={handleChangeArea}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Trocar área
                  </Button>
                )}
                <Button onClick={handleContinue}>
                  Continuar em {lastArea.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {otherAreas.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted mb-3">Ou selecione outra área:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherAreas.map((area: Area) => (
                <AreaCard
                  key={area.id}
                  area={area}
                  onSelect={() => handleSelectArea(area.slug)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Sem área recente, mostrar áreas filtradas (RH-only no MVP)
  return (
    <div className="space-y-4">
      <p className="text-muted">
        {MVP_RH_ONLY && !showAllAreas 
          ? 'Área disponível para validação MVP:' 
          : 'Selecione uma área para começar:'}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAreas.map((area: Area) => (
          <AreaCard
            key={area.id}
            area={area}
            onSelect={() => handleSelectArea(area.slug)}
          />
        ))}
      </div>
      {MVP_RH_ONLY && !showAllAreas && (
        <p className="text-xs text-muted mt-2">
          * Outras áreas estarão disponíveis após validação do MVP RH
        </p>
      )}
    </div>
  )
}

interface AreaCardProps {
  area: Area
  onSelect: () => void
  highlight?: boolean
}

function AreaCard({ area, onSelect, highlight }: AreaCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg hover:border-blue-300 ${
        highlight ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${getAreaColor(area.slug)} rounded-lg flex items-center justify-center text-white text-lg font-bold shadow`}>
            {area.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{area.name}</h3>
              {highlight && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  MVP
                </span>
              )}
            </div>
            {area.focus && (
              <p className="text-sm text-muted truncate">{area.focus}</p>
            )}
          </div>
          <ArrowRight className="w-5 h-5 text-muted" />
        </div>
      </CardContent>
    </Card>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Wand2, CheckCircle, AlertCircle, Loader2, ListIcon } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { useToast } from '@/shared/ui/Toast'
import { useActionsByPackId, useCreatePlanAction, useGetOrCreatePlanForPack } from '@/features/area-plans/hooks'
import type { Program, Objective } from '../types'

interface GeneratePlanButtonProps {
  packId: string
  areaSlug: string
  areaName: string
  year?: number
  programs: Program[]
  objectives: Objective[]
  onSuccess?: () => void
}

export function GeneratePlanButton({ 
  packId, 
  areaSlug,
  areaName,
  year = new Date().getFullYear(),
  programs, 
  objectives,
  onSuccess 
}: GeneratePlanButtonProps) {
  const { addToast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ created: boolean; message: string; actionCount: number } | null>(null)

  const { data: existingActions = [], refetch } = useActionsByPackId(packId)
  const createAction = useCreatePlanAction()
  const getOrCreatePlan = useGetOrCreatePlanForPack()

  // Se já existem ações, mostrar resultado
  useEffect(() => {
    if (existingActions.length > 0 && !result) {
      setResult({
        created: false,
        message: `Plano já existe com ${existingActions.length} ação(ões).`,
        actionCount: existingActions.length,
      })
    }
  }, [existingActions, result])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setResult(null)

    try {
      // Idempotência: verificar se já existem ações vinculadas ao pack
      const { data: currentActions } = await refetch()
      
      if (currentActions && currentActions.length > 0) {
        setResult({
          created: false,
          message: `Plano já existe com ${currentActions.length} ação(ões).`,
          actionCount: currentActions.length,
        })
        addToast({
          type: 'warning',
          title: 'Plano já gerado',
          message: `Este pack já possui ${currentActions.length} ação(ões) vinculada(s).`,
        })
        setIsGenerating(false)
        return
      }

      // HARDENING: Criar ou obter AreaPlan container
      const plan = await getOrCreatePlan.mutateAsync({
        areaSlug,
        areaName,
        year,
        packId,
      })

      // Gerar ações para cada programa
      const programPromises = programs.map(program => 
        createAction.mutateAsync({
          plan_id: plan.id,
          pack_id: packId,
          program_key: program.key,
          title: `[${program.key.toUpperCase()}] ${program.name}`,
          description: program.description || `Ação gerada do programa ${program.name}`,
          priority: 'P1',
          node_type: 'acao',
        })
      )

      // Gerar ações para cada objetivo
      const objectivePromises = objectives.map(objective => 
        createAction.mutateAsync({
          plan_id: plan.id,
          pack_id: packId,
          objective_key: objective.key,
          title: `[${objective.key}] ${objective.title}`,
          description: objective.description || `Ação gerada do objetivo ${objective.key}`,
          priority: 'P1',
          node_type: 'acao',
        })
      )

      await Promise.all([...programPromises, ...objectivePromises])

      const totalCreated = programs.length + objectives.length
      setResult({
        created: true,
        message: `${totalCreated} ação(ões) criada(s) com sucesso!`,
        actionCount: totalCreated,
      })

      addToast({
        type: 'success',
        title: 'Plano gerado',
        message: `${totalCreated} ação(ões) criada(s) a partir do Strategic Pack.`,
      })

      onSuccess?.()
    } catch (error) {
      console.error('Erro ao gerar plano:', error)
      setResult({
        created: false,
        message: 'Erro ao gerar plano de ação.',
        actionCount: 0,
      })
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível gerar o plano de ação.',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const manageUrl = `/planning/actions/manage?areaSlug=${areaSlug}&packId=${packId}`

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || (programs.length === 0 && objectives.length === 0)}
          variant={result?.created || existingActions.length > 0 ? 'secondary' : 'primary'}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Gerar Plano de Ação
            </>
          )}
        </Button>

        {result && (
          <div className={`flex items-center gap-2 text-sm ${result.created ? 'text-green-600' : 'text-amber-600'}`}>
            {result.created ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{result.message}</span>
          </div>
        )}
      </div>

      {/* Link para gerenciar ações do pack */}
      {(result || existingActions.length > 0) && (
        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              {result?.actionCount || existingActions.length} ação(ões) vinculada(s) a este pack
            </p>
            <p className="text-xs text-blue-700">
              Gerencie as ações criadas a partir do Strategic Pack
            </p>
          </div>
          <Link
            to={manageUrl}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ListIcon className="w-4 h-4" />
            Gerenciar Plano
          </Link>
        </div>
      )}
    </div>
  )
}

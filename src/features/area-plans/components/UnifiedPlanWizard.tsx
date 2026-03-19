import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Building2, FileText } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Card } from '@/shared/ui/Card'
import { LazyModal } from '@/shared/ui/LazyModal'
import { useToast } from '@/shared/ui/Toast'
import { useCreateAreaPlan } from '../hooks'
import { useAreas } from '@/features/areas/hooks'

interface UnifiedPlanWizardProps {
  open: boolean
  onClose: () => void
  defaultAreaId?: string
  year?: number
}

type WizardStep = 'area' | 'details' | 'confirm'

const STEPS: WizardStep[] = ['area', 'details', 'confirm']

const STEP_LABELS: Record<WizardStep, string> = {
  area: 'Selecionar Área',
  details: 'Detalhes do Plano',
  confirm: 'Confirmar',
}

const STEP_ICONS: Record<WizardStep, React.ReactNode> = {
  area: <Building2 className="w-5 h-5" />,
  details: <FileText className="w-5 h-5" />,
  confirm: <Check className="w-5 h-5" />,
}

export function UnifiedPlanWizard({ open, onClose, defaultAreaId, year = new Date().getFullYear() }: UnifiedPlanWizardProps) {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { data: areas = [] } = useAreas()
  const createPlan = useCreateAreaPlan()

  const [currentStep, setCurrentStep] = useState<WizardStep>(defaultAreaId ? 'details' : 'area')
  const [selectedAreaId, setSelectedAreaId] = useState<string>(defaultAreaId || '')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const selectedArea = areas.find(a => a.id === selectedAreaId)

  const currentStepIndex = STEPS.indexOf(currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === STEPS.length - 1

  const canProceed = () => {
    switch (currentStep) {
      case 'area':
        return selectedAreaId
      case 'details':
        return title.trim()
      case 'confirm':
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (!canProceed()) return

    if (isLastStep) {
      handleCreatePlan()
    } else {
      setCurrentStep(STEPS[currentStepIndex + 1])
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(STEPS[currentStepIndex - 1])
    }
  }

  const handleCreatePlan = async () => {
    try {
      const planData = {
        area_id: selectedAreaId,
        year,
        title,
        description,
      }

      await createPlan.mutateAsync(planData)
      
      addToast({
        type: 'success',
        title: 'Plano criado com sucesso!',
        message: `O plano "${title}" foi criado e está pronto para uso.`,
      })

      onClose()
      navigate(`/planning/${selectedArea?.slug}/dashboard`)
    } catch (error) {
      console.error('Erro ao criar plano:', error)
      addToast({
        type: 'error',
        title: 'Erro ao criar plano',
        message: 'Não foi possível criar o plano. Tente novamente.',
      })
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'area':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Selecione a Área</h3>
            <p className="text-sm text-muted">Escolha a área para a qual deseja criar um plano de ação.</p>
            
            <div className="grid gap-3">
              {areas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedAreaId === area.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-border hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: area.color || '#6B7280' }}
                    />
                    <div>
                      <div className="font-medium">{area.name}</div>
                      <div className="text-sm text-muted">{area.focus}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 'details':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detalhes do Plano</h3>
            <p className="text-sm text-muted">Informe os detalhes do seu plano de ação.</p>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Título do Plano *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Plano de Ação ${year} - ${selectedArea?.name}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os objetivos e escopo deste plano de ação..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm resize-none bg-surface"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Área
                </label>
                <div className="px-3 py-2 border border-border rounded-lg bg-accent text-sm">
                  {selectedArea?.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Ano
                </label>
                <div className="px-3 py-2 border border-border rounded-lg bg-accent text-sm">
                  {year}
                </div>
              </div>
            </div>
          </div>
        )

      case 'confirm':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Confirmar Criação</h3>
            <p className="text-sm text-muted">Revise as informações antes de criar o plano.</p>
            
            <Card className="p-4 space-y-3">
              <div>
                <span className="text-sm font-medium text-muted">Título:</span>
                <p className="font-medium">{title}</p>
              </div>
              
              {description && (
                <div>
                  <span className="text-sm font-medium text-muted">Descrição:</span>
                  <p className="text-sm">{description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted">Área:</span>
                  <p className="text-sm">{selectedArea?.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted">Ano:</span>
                  <p className="text-sm">{year}</p>
                </div>
              </div>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <LazyModal open={open} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold">Criar Plano de Ação</h2>
          <p className="text-sm text-muted mt-1">
            Configure seu plano de ação em {STEPS.length} passos simples
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index <= currentStepIndex
                    ? 'bg-primary-500 text-white'
                    : 'bg-accent text-muted'
                }`}
              >
                {STEP_ICONS[step]}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 transition-colors ${
                    index < currentStepIndex ? 'bg-primary-500' : 'bg-accent'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between px-1">
          {STEPS.map((step) => (
            <div key={step} className="text-xs text-center">
              <div
                className={`font-medium ${
                  step === currentStep ? 'text-primary-600' : 'text-muted'
                }`}
              >
                {STEP_LABELS[step]}
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={createPlan.isPending}
          >
            Cancelar
          </Button>
          
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={createPlan.isPending}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || createPlan.isPending}
            >
              {createPlan.isPending ? (
                'Criando...'
              ) : isLastStep ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Criar Plano
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </LazyModal>
  )
}

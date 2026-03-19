import { useState, useEffect, useRef, type CSSProperties } from 'react'
import { X, ArrowRight, ArrowLeft } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/cn'

interface TourStep {
  target: string
  title: string
  content: string
  position?: 'top' | 'right' | 'bottom' | 'left'
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="sidebar"]',
    title: 'Menu de Navegação',
    content: 'Acesse todas as funcionalidades do sistema através do menu lateral. Você pode recolhê-lo clicando no ícone.',
    position: 'right',
  },
  {
    target: '[data-tour="search"]',
    title: 'Busca Rápida',
    content: 'Use Ctrl+K para abrir a busca rápida e navegar rapidamente entre páginas e ações.',
    position: 'bottom',
  },
  {
    target: '[data-tour="notifications"]',
    title: 'Notificações',
    content: 'Acompanhe atualizações e alertas importantes do sistema.',
    position: 'bottom',
  },
  {
    target: '[data-tour="theme"]',
    title: 'Tema',
    content: 'Alterne entre modo claro e escuro conforme sua preferência.',
    position: 'bottom',
  },
]

const STORAGE_KEY = 'onboarding-completed'

export function OnboardingTour() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [position, setPosition] = useState<CSSProperties>({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY)
    if (!completed) {
      setTimeout(() => setIsActive(true), 1000)
    }
  }, [])

  useEffect(() => {
    if (!isActive) return

    const updatePosition = () => {
      const step = tourSteps[currentStep]
      const element = document.querySelector(step.target)
      const viewportPadding = 16
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const tooltipRect = tooltipRef.current?.getBoundingClientRect()
      const tooltipWidth = tooltipRect?.width || Math.min(360, viewportWidth - viewportPadding * 2)
      const tooltipHeight = tooltipRect?.height || 220

      if (!element || viewportWidth < 640) {
        setPosition({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: tooltipWidth,
          maxWidth: '90vw',
        })
        return
      }

      const rect = element.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (step.position) {
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.right + 16
          break
        case 'bottom':
          top = rect.bottom + 16
          left = rect.left + rect.width / 2 - tooltipWidth / 2
          break
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.left - tooltipWidth - 16
          break
        default: // top
          top = rect.top - tooltipHeight - 16
          left = rect.left + rect.width / 2 - tooltipWidth / 2
      }

      const clampedTop = Math.min(
        Math.max(viewportPadding, top),
        viewportHeight - tooltipHeight - viewportPadding
      )
      const clampedLeft = Math.min(
        Math.max(viewportPadding, left),
        viewportWidth - tooltipWidth - viewportPadding
      )

      setPosition({
        top: clampedTop,
        left: clampedLeft,
        transform: 'translateZ(0)',
        width: tooltipWidth,
        maxWidth: '90vw',
      })

      element.classList.add('tour-highlight')
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      const step = tourSteps[currentStep]
      const element = document.querySelector(step.target)
      if (element) {
        element.classList.remove('tour-highlight')
      }
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isActive, currentStep])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsActive(false)
  }

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsActive(false)
  }

  if (!isActive) return null

  const step = tourSteps[currentStep]

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[90]" />
      <div
        ref={tooltipRef}
        className="fixed z-[100] w-80 max-w-[90vw] bg-surface rounded-2xl shadow-2xl border border-border p-6 animate-in fade-in-0 zoom-in-95 duration-300"
        style={position}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
            <p className="text-sm text-muted">{step.content}</p>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 rounded-lg hover:bg-accent text-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-1">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-1.5 w-8 rounded-full transition-colors',
                  index === currentStep ? 'bg-primary-600' : 'bg-border'
                )}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {currentStep < tourSteps.length - 1 ? (
                <>
                  Próximo
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                'Concluir'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

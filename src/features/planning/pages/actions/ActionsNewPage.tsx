import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FilePlus } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { UnifiedPlanWizard } from '@/features/area-plans/components/UnifiedPlanWizard'
import { ROUTES } from '@/shared/config/routes'

export function ActionsNewPage() {
  const navigate = useNavigate()
  const [showWizard, setShowWizard] = useState(true)

  const handleClose = () => {
    setShowWizard(false)
    navigate(ROUTES.PLANNING_ACTIONS_MANAGE)
  }

  return (
    <div className="space-y-6">
      {!showWizard && (
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(ROUTES.PLANNING_ACTIONS_MANAGE)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Criar Novo Plano</h1>
            <p className="text-muted">Inicie um novo plano de ação para uma área</p>
          </div>
        </div>
      )}

      {!showWizard ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilePlus className="w-5 h-5" />
              Novo Plano de Ação
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <p className="text-muted mb-4">Clique no botão abaixo para iniciar o assistente de criação.</p>
            <Button onClick={() => setShowWizard(true)}>
              <FilePlus className="w-4 h-4 mr-2" />
              Iniciar Assistente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <UnifiedPlanWizard
          open={showWizard}
          onClose={handleClose}
          year={new Date().getFullYear()}
        />
      )}
    </div>
  )
}

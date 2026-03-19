import { useState } from 'react'
import { Plus, Layers, Edit2, Trash2 } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { usePlanTemplates, useDeletePlanTemplate } from '@/features/plan-templates/hooks'
import { TemplateSelector } from '@/features/plan-templates/components/TemplateSelector'

export function ActionsTemplatesPage() {
  const { data: templates = [], isLoading } = usePlanTemplates()
  const deleteTemplate = useDeletePlanTemplate()
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este template?')) {
      await deleteTemplate.mutateAsync(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Templates de Planos</h1>
          <p className="text-muted">Gerencie templates reutilizáveis para planos de ação</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Templates Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : templates.length > 0 ? (
            <div className="space-y-4">
              <TemplateSelector
                value={selectedTemplateId}
                onChange={setSelectedTemplateId}
              />
              {selectedTemplateId && (
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(selectedTemplateId)}
                    disabled={deleteTemplate.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Layers className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum template</h3>
              <p className="text-muted mb-4">Crie seu primeiro template de plano de ação.</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Template
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

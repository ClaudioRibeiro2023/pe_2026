import { useState, useEffect } from 'react'
import { ArrowRight, AlertTriangle, CheckCircle, Trash2, RefreshCw } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Select } from '@/shared/ui/Select'
import { PageLoader } from '@/shared/ui/Loader'
import { useToast } from '@/shared/ui/Toast'
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import { useAreas } from '@/features/areas/hooks'

interface LegacyActionPlan {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  assigned_to: string | null
  created_at: string
  is_deprecated: boolean
  migrated_to_area_plan_id: string | null
}

export function LegacyMigrationPage() {
  const [legacyPlans, setLegacyPlans] = useState<LegacyActionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set())
  const [targetAreaId, setTargetAreaId] = useState<string>('')
  const [migrating, setMigrating] = useState(false)
  const { addToast } = useToast()
  const { data: areas = [] } = useAreas()

  useEffect(() => {
    loadLegacyPlans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadLegacyPlans = async () => {
    try {
      setLoading(true)

      if (!isSupabaseConfigured()) {
        setLegacyPlans([
          { id: 'legacy-1', title: 'Plano de Capacitação 2025', description: 'Programa de treinamento legado', status: 'concluido', priority: 'alta', due_date: '2025-12-31', assigned_to: 'user-1', created_at: '2025-01-15T00:00:00Z', is_deprecated: true, migrated_to_area_plan_id: 'plan-rh-2026' },
          { id: 'legacy-2', title: 'Automação de Relatórios', description: 'Migração de relatórios manuais', status: 'em_andamento', priority: 'media', due_date: '2025-09-30', assigned_to: 'user-3', created_at: '2025-03-01T00:00:00Z', is_deprecated: false, migrated_to_area_plan_id: null },
          { id: 'legacy-3', title: 'Revisão de Processos Financeiros', description: 'Adequação de processos ao novo ERP', status: 'pendente', priority: 'alta', due_date: '2025-06-30', assigned_to: 'user-5', created_at: '2025-02-10T00:00:00Z', is_deprecated: false, migrated_to_area_plan_id: null },
        ])
        return
      }

      const { data, error } = await supabase
        .from('action_plans')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLegacyPlans(data || [])
    } catch (error) {
      console.error('Erro ao carregar planos legados:', error)
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os planos legados.',
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedPlans((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectAll = () => {
    const notMigrated = legacyPlans.filter((p) => !p.migrated_to_area_plan_id)
    setSelectedPlans(new Set(notMigrated.map((p) => p.id)))
  }

  const deselectAll = () => {
    setSelectedPlans(new Set())
  }

  const handleMigrate = async () => {
    if (!targetAreaId) {
      addToast({
        type: 'error',
        title: 'Área obrigatória',
        message: 'Selecione uma área de destino para a migração.',
      })
      return
    }

    if (selectedPlans.size === 0) {
      addToast({
        type: 'error',
        title: 'Nenhum plano selecionado',
        message: 'Selecione pelo menos um plano para migrar.',
      })
      return
    }

    try {
      setMigrating(true)

      // Criar um plano de área se não existir
      const currentYear = new Date().getFullYear()
      let { data: existingPlan } = await supabase
        .from('area_plans')
        .select('id')
        .eq('area_id', targetAreaId)
        .eq('year', currentYear)
        .single()

      if (!existingPlan) {
        const area = areas.find((a) => a.id === targetAreaId)
        const { data: newPlan, error: planError } = await supabase
          .from('area_plans')
          .insert({
            area_id: targetAreaId,
            year: currentYear,
            title: `Plano de Ação ${area?.name} ${currentYear} (Migrado)`,
            status: 'RASCUNHO',
          })
          .select('id')
          .single()

        if (planError) throw planError
        existingPlan = newPlan
      }

      // Migrar cada plano selecionado como ação
      const plansToMigrate = legacyPlans.filter((p) => selectedPlans.has(p.id))
      
      for (const plan of plansToMigrate) {
        // Mapear status legado para novo status
        const statusMap: Record<string, string> = {
          pending: 'PENDENTE',
          in_progress: 'EM_ANDAMENTO',
          completed: 'CONCLUIDA',
          cancelled: 'CANCELADA',
        }

        // Mapear prioridade legada para nova prioridade
        const priorityMap: Record<string, string> = {
          low: 'P2',
          medium: 'P1',
          high: 'P0',
          critical: 'P0',
        }

        // Criar ação no novo sistema
        const { error: actionError } = await supabase.from('plan_actions').insert({
          plan_id: existingPlan.id,
          title: plan.title,
          description: plan.description,
          status: statusMap[plan.status] || 'PENDENTE',
          priority: priorityMap[plan.priority] || 'P1',
          due_date: plan.due_date,
          responsible: plan.assigned_to,
          node_type: 'acao',
        })

        if (actionError) throw actionError

        // Marcar plano legado como migrado
        const { error: updateError } = await supabase
          .from('action_plans')
          .update({
            migrated_to_area_plan_id: existingPlan.id,
            is_deprecated: true,
          })
          .eq('id', plan.id)

        if (updateError) throw updateError
      }

      addToast({
        type: 'success',
        title: 'Migração concluída',
        message: `${plansToMigrate.length} plano(s) migrado(s) com sucesso.`,
      })

      setSelectedPlans(new Set())
      loadLegacyPlans()
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Erro na migração',
        message: error?.message || 'Não foi possível migrar os planos.',
      })
    } finally {
      setMigrating(false)
    }
  }

  const handleDeleteMigrated = async () => {
    const migratedPlans = legacyPlans.filter((p) => p.migrated_to_area_plan_id)
    
    if (migratedPlans.length === 0) {
      addToast({
        type: 'info',
        title: 'Nenhum plano para excluir',
        message: 'Não há planos migrados para excluir.',
      })
      return
    }

    if (!window.confirm(`Excluir ${migratedPlans.length} plano(s) migrado(s)? Esta ação é irreversível.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('action_plans')
        .delete()
        .in('id', migratedPlans.map((p) => p.id))

      if (error) throw error

      addToast({
        type: 'success',
        title: 'Planos excluídos',
        message: `${migratedPlans.length} plano(s) legado(s) excluído(s).`,
      })

      loadLegacyPlans()
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Erro ao excluir',
        message: error?.message || 'Não foi possível excluir os planos.',
      })
    }
  }

  const areaOptions = [
    { value: '', label: 'Selecione uma área...' },
    ...areas.map((area) => ({ value: area.id, label: area.name })),
  ]

  const notMigratedCount = legacyPlans.filter((p) => !p.migrated_to_area_plan_id).length
  const migratedCount = legacyPlans.filter((p) => p.migrated_to_area_plan_id).length

  if (loading) {
    return <PageLoader text="Carregando planos legados..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Migração de Módulo Legado</h1>
          <p className="text-muted mt-1">
            Migre planos do sistema antigo (action_plans) para o novo sistema (area_plans)
          </p>
        </div>
        <Button variant="outline" onClick={loadLegacyPlans}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Recarregar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{legacyPlans.length}</p>
              <p className="text-sm text-muted">Total de planos legados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600">{notMigratedCount}</p>
              <p className="text-sm text-muted">Pendentes de migração</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600">{migratedCount}</p>
              <p className="text-sm text-muted">Já migrados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Migrar Planos Selecionados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select
                label="Área de destino"
                value={targetAreaId}
                onChange={(e) => setTargetAreaId(e.target.value)}
                options={areaOptions}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Button
                onClick={handleMigrate}
                disabled={selectedPlans.size === 0 || !targetAreaId}
                loading={migrating}
              >
                <ArrowRight className="w-4 h-4 mr-1" />
                Migrar {selectedPlans.size} plano(s)
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={selectAll}>
              Selecionar todos
            </Button>
            <Button size="sm" variant="outline" onClick={deselectAll}>
              Desmarcar todos
            </Button>
            {migratedCount > 0 && (
              <Button size="sm" variant="outline" onClick={handleDeleteMigrated}>
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir {migratedCount} migrado(s)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plans List */}
      <Card>
        <CardHeader>
          <CardTitle>Planos Legados</CardTitle>
        </CardHeader>
        <CardContent>
          {legacyPlans.length === 0 ? (
            <div className="text-center py-8 text-muted">
              Nenhum plano legado encontrado.
            </div>
          ) : (
            <div className="space-y-2">
              {legacyPlans.map((plan) => {
                const isMigrated = !!plan.migrated_to_area_plan_id
                const isSelected = selectedPlans.has(plan.id)

                return (
                  <div
                    key={plan.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      isMigrated
                        ? 'bg-success-50 border-success-200'
                        : isSelected
                        ? 'bg-primary-50 border-primary-300'
                        : 'bg-surface border-border hover:border-primary-300'
                    }`}
                  >
                    {!isMigrated && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(plan.id)}
                        className="w-4 h-4 rounded border-border"
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{plan.title}</span>
                        {isMigrated && (
                          <span className="flex items-center gap-1 text-xs text-success-600">
                            <CheckCircle className="w-3 h-3" />
                            Migrado
                          </span>
                        )}
                      </div>
                      {plan.description && (
                        <p className="text-sm text-muted truncate">{plan.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        plan.status === 'completed' ? 'bg-success-100 text-success-700' :
                        plan.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        plan.status === 'cancelled' ? 'bg-accent text-muted' :
                        'bg-accent text-muted'
                      }`}>
                        {plan.status}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        plan.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        plan.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        plan.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-accent text-muted'
                      }`}>
                        {plan.priority}
                      </span>
                      <span className="text-xs text-muted">
                        {new Date(plan.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 bg-warning-50 border border-warning-200 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-warning-700">
          <p className="font-medium">Atenção</p>
          <p>
            A migração cria ações no novo sistema baseadas nos planos legados. Os planos originais são
            marcados como migrados mas não são excluídos automaticamente. Você pode excluí-los após
            verificar a migração.
          </p>
        </div>
      </div>
    </div>
  )
}

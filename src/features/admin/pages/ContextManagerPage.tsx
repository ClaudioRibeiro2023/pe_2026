import { useState, useEffect } from 'react'
import { Check, RefreshCw, FileText, AlertCircle, CheckCircle, Database } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageLoader } from '@/shared/ui/Loader'
import { useToast } from '@/shared/ui/Toast'
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import { getErrorMessage } from '@/shared/lib/errorUtils'

interface ContextItem {
  id: string
  context_type: string
  data: Record<string, any>
  version: number
  updated_at: string
}

const CONTEXT_TYPES = [
  { key: 'strategic', label: 'Contexto Estratégico', description: 'Pilares, temas, objetivos e metas 2026' },
  { key: 'okrs', label: 'Contexto de OKRs', description: 'OKRs corporativos e por área' },
  { key: 'governance', label: 'Contexto de Governança', description: 'Artefatos, decisões, riscos e rituais' },
  { key: 'scoreboard', label: 'Placar Institucional', description: 'Guardrails, métricas e status War Room' },
]

export function ContextManagerPage() {
  const [contexts, setContexts] = useState<ContextItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('strategic')
  const [editingData, setEditingData] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [jsonError, setJsonError] = useState<string | null>(null)
  const { addToast } = useToast()

  useEffect(() => {
    loadContexts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const context = contexts.find((c) => c.context_type === selectedType)
    if (context) {
      setEditingData(JSON.stringify(context.data, null, 2))
      setJsonError(null)
    } else {
      setEditingData('{}')
    }
  }, [selectedType, contexts])

  const loadContexts = async () => {
    try {
      setLoading(true)

      if (!isSupabaseConfigured()) {
        setContexts([
          { id: 'ctx-1', context_type: 'strategic', data: { pillars: 5, themes: 12, objectives: 20 }, version: 1, updated_at: '2026-01-15T00:00:00Z' },
          { id: 'ctx-2', context_type: 'okrs', data: { corporate_okrs: 5, area_okrs: 15 }, version: 1, updated_at: '2026-01-15T00:00:00Z' },
          { id: 'ctx-3', context_type: 'governance', data: { decisions: 8, risks: 12, rituals: 4 }, version: 1, updated_at: '2026-01-20T00:00:00Z' },
        ])
        return
      }

      const { data, error } = await supabase
        .from('context_store')
        .select('*')
        .order('context_type')

      if (error) throw error
      setContexts(data || [])
    } catch (error) {
      console.error('Erro ao carregar contextos:', error)
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os contextos.',
      })
    } finally {
      setLoading(false)
    }
  }

  const validateJson = (text: string): boolean => {
    try {
      JSON.parse(text)
      setJsonError(null)
      return true
    } catch (e: any) {
      setJsonError(e.message)
      return false
    }
  }

  const handleTextChange = (value: string) => {
    setEditingData(value)
    validateJson(value)
  }

  const handleSave = async () => {
    if (!validateJson(editingData)) {
      addToast({
        type: 'error',
        title: 'JSON inválido',
        message: 'Corrija os erros no JSON antes de salvar.',
      })
      return
    }

    try {
      setSaving(true)
      const parsedData = JSON.parse(editingData)
      const existingContext = contexts.find((c) => c.context_type === selectedType)

      if (existingContext) {
        const { error } = await supabase
          .from('context_store')
          .update({
            data: parsedData,
            version: existingContext.version + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingContext.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('context_store')
          .insert({
            context_type: selectedType,
            data: parsedData,
            version: 1,
          })

        if (error) throw error
      }

      addToast({
        type: 'success',
        title: 'Contexto salvo',
        message: `O contexto "${selectedType}" foi atualizado com sucesso.`,
      })

      loadContexts()
    } catch (error: unknown) {
      addToast({
        type: 'error',
        title: 'Erro ao salvar',
        message: getErrorMessage(error),
      })
    } finally {
      setSaving(false)
    }
  }

  const handleImportFromJson = async () => {
    try {
      const fileName = `${selectedType}_context.json`
      
      const response = await fetch(`/data/${fileName}`)
      if (!response.ok) throw new Error(`Arquivo ${fileName} não encontrado`)
      
      const jsonData = await response.json()
      setEditingData(JSON.stringify(jsonData, null, 2))
      setJsonError(null)
      
      addToast({
        type: 'success',
        title: 'JSON importado',
        message: `Dados importados de ${fileName}. Clique em Salvar para persistir.`,
      })
    } catch (error: unknown) {
      addToast({
        type: 'error',
        title: 'Erro ao importar',
        message: getErrorMessage(error),
      })
    }
  }

  const selectedConfig = CONTEXT_TYPES.find((c) => c.key === selectedType)
  const selectedContext = contexts.find((c) => c.context_type === selectedType)

  if (loading) {
    return <PageLoader text="Carregando contextos..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerenciador de Contextos</h1>
          <p className="text-muted mt-1">
            Edite os dados de contexto que alimentam os módulos da plataforma
          </p>
        </div>
        <Button variant="outline" onClick={loadContexts}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Recarregar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Context Types */}
        <div className="space-y-2">
          {CONTEXT_TYPES.map((ctx) => {
            const hasData = contexts.some((c) => c.context_type === ctx.key)
            const isSelected = selectedType === ctx.key

            return (
              <Card
                key={ctx.key}
                className={`cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-primary-500 border-primary-500' : 'hover:border-primary-300'
                }`}
                onClick={() => setSelectedType(ctx.key)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{ctx.label}</h4>
                      <p className="text-xs text-muted">{ctx.description}</p>
                    </div>
                    {hasData ? (
                      <CheckCircle className="w-4 h-4 text-success-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-warning-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  {selectedConfig?.label}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {selectedContext && (
                    <span className="text-xs text-muted">
                      v{selectedContext.version} • Atualizado em{' '}
                      {new Date(selectedContext.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <Button size="sm" variant="outline" onClick={handleImportFromJson}>
                  <FileText className="w-4 h-4 mr-1" />
                  Importar do JSON estático
                </Button>
                <div className="flex items-center gap-2">
                  {jsonError && (
                    <span className="text-xs text-danger-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      JSON inválido
                    </span>
                  )}
                  {!jsonError && editingData.length > 2 && (
                    <span className="text-xs text-success-500 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      JSON válido
                    </span>
                  )}
                </div>
              </div>

              {/* JSON Editor */}
              <div className="relative">
                <textarea
                  value={editingData}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className={`w-full h-[500px] p-4 font-mono text-sm border rounded-lg resize-none ${
                    jsonError ? 'border-danger-500 bg-danger-50' : 'border-gray-300'
                  }`}
                  spellCheck={false}
                />
                {jsonError && (
                  <div className="absolute bottom-2 left-2 right-2 p-2 bg-danger-100 text-danger-700 text-xs rounded">
                    {jsonError}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const context = contexts.find((c) => c.context_type === selectedType)
                    if (context) {
                      setEditingData(JSON.stringify(context.data, null, 2))
                      setJsonError(null)
                    }
                  }}
                >
                  Descartar alterações
                </Button>
                <Button onClick={handleSave} loading={saving} disabled={!!jsonError}>
                  <Check className="w-4 h-4 mr-1" />
                  Salvar Contexto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

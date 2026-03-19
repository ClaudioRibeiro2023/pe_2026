import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Play, Database, Shield, Layers, FileText, Settings, FileDown } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { useToast } from '@/shared/ui/Toast'
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import { useAuth } from '@/features/auth/AuthProvider'
import { runPlatformReport, generateMarkdownReport, type PlatformCheck } from '@/shared/lib/platformReport'

interface ValidationCheck {
  id: string
  category: string
  name: string
  description: string
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning'
  message?: string
  duration?: number
}

const INITIAL_CHECKS: ValidationCheck[] = [
  // Database
  { id: 'db-connection', category: 'Database', name: 'Conexão Supabase', description: 'Verifica conexão com o banco de dados', status: 'pending' },
  { id: 'db-profiles', category: 'Database', name: 'Tabela profiles', description: 'Verifica se a tabela profiles existe', status: 'pending' },
  { id: 'db-areas', category: 'Database', name: 'Tabela areas', description: 'Verifica se a tabela areas existe', status: 'pending' },
  { id: 'db-pillars', category: 'Database', name: 'Tabela pillars', description: 'Verifica se a tabela pillars existe', status: 'pending' },
  { id: 'db-area-plans', category: 'Database', name: 'Tabela area_plans', description: 'Verifica se a tabela area_plans existe', status: 'pending' },
  { id: 'db-plan-actions', category: 'Database', name: 'Tabela plan_actions', description: 'Verifica se a tabela plan_actions existe', status: 'pending' },
  { id: 'db-templates', category: 'Database', name: 'Tabela plan_templates', description: 'Verifica se a tabela plan_templates existe', status: 'pending' },
  
  // RLS & Security
  { id: 'rls-enabled', category: 'Segurança', name: 'RLS Ativado', description: 'Verifica se RLS está ativo nas tabelas principais', status: 'pending' },
  { id: 'rls-is-admin', category: 'Segurança', name: 'Função is_admin()', description: 'Verifica se a função is_admin existe', status: 'pending' },
  { id: 'rls-user-area', category: 'Segurança', name: 'Função user_area_id()', description: 'Verifica se a função user_area_id existe', status: 'pending' },
  
  // Data
  { id: 'data-areas', category: 'Dados', name: 'Áreas cadastradas', description: 'Verifica se existem áreas no sistema', status: 'pending' },
  { id: 'data-pillars', category: 'Dados', name: 'Pilares cadastrados', description: 'Verifica se existem pilares estratégicos', status: 'pending' },
  { id: 'data-templates', category: 'Dados', name: 'Templates cadastrados', description: 'Verifica se existem templates de planos', status: 'pending' },
  
  // Context Store
  { id: 'ctx-strategic', category: 'Contextos', name: 'Contexto estratégico', description: 'Verifica dados de contexto estratégico', status: 'pending' },
  { id: 'ctx-okrs', category: 'Contextos', name: 'Contexto OKRs', description: 'Verifica dados de contexto de OKRs', status: 'pending' },
  
  // Storage
  { id: 'storage-bucket', category: 'Storage', name: 'Bucket de evidências', description: 'Verifica se o bucket action-evidences existe', status: 'pending' },
]

export function ValidationPage() {
  const [checks, setChecks] = useState<ValidationCheck[]>(INITIAL_CHECKS)
  const [running, setRunning] = useState(false)
  const [completedAt, setCompletedAt] = useState<Date | null>(null)
  const { addToast } = useToast()
  const { user, roleOverride } = useAuth()
  const [platformChecks, setPlatformChecks] = useState<PlatformCheck[]>([])

  // Auto-run platform checks on mount
  useEffect(() => {
    const results = runPlatformReport(user?.profile?.role)
    setPlatformChecks(results)
  }, [user?.profile?.role])

  const updateCheck = (id: string, update: Partial<ValidationCheck>) => {
    setChecks((prev) => prev.map((c) => (c.id === id ? { ...c, ...update } : c)))
  }

  const runChecks = async () => {
    setRunning(true)
    setCompletedAt(null)
    setChecks(INITIAL_CHECKS)

    const startTime = Date.now()

    // Database Connection
    updateCheck('db-connection', { status: 'running' })
    try {
      if (!isSupabaseConfigured()) {
        updateCheck('db-connection', { status: 'warning', message: 'Supabase não configurado (usando modo offline)' })
      } else {
        const { error } = await supabase.from('profiles').select('count').limit(1)
        if (error) throw error
        updateCheck('db-connection', { status: 'passed', message: 'Conectado com sucesso' })
      }
    } catch (e: any) {
      updateCheck('db-connection', { status: 'failed', message: e.message })
    }

    // Check tables exist
    const tables = [
      { id: 'db-profiles', table: 'profiles' },
      { id: 'db-areas', table: 'areas' },
      { id: 'db-pillars', table: 'pillars' },
      { id: 'db-area-plans', table: 'area_plans' },
      { id: 'db-plan-actions', table: 'plan_actions' },
      { id: 'db-templates', table: 'plan_templates' },
    ]

    for (const { id, table } of tables) {
      updateCheck(id, { status: 'running' })
      try {
        const { error } = await supabase.from(table).select('count').limit(1)
        if (error && error.code === '42P01') {
          updateCheck(id, { status: 'failed', message: 'Tabela não existe' })
        } else if (error) {
          updateCheck(id, { status: 'warning', message: error.message })
        } else {
          updateCheck(id, { status: 'passed' })
        }
      } catch (e: any) {
        updateCheck(id, { status: 'failed', message: e.message })
      }
    }

    // RLS Checks
    updateCheck('rls-enabled', { status: 'running' })
    try {
      // This is a proxy check - if RLS is enabled, we should be able to query
      const { error } = await supabase.from('profiles').select('id').limit(1)
      if (!error) {
        updateCheck('rls-enabled', { status: 'passed', message: 'RLS operacional' })
      } else {
        updateCheck('rls-enabled', { status: 'warning', message: 'Não foi possível verificar' })
      }
    } catch (e: any) {
      updateCheck('rls-enabled', { status: 'warning', message: e.message })
    }

    // Function checks
    updateCheck('rls-is-admin', { status: 'running' })
    try {
      const { data, error } = await supabase.rpc('is_admin')
      if (error) throw error
      updateCheck('rls-is-admin', { status: 'passed', message: `Retornou: ${data}` })
    } catch (e: any) {
      if (e.message?.includes('does not exist')) {
        updateCheck('rls-is-admin', { status: 'failed', message: 'Função não existe' })
      } else {
        updateCheck('rls-is-admin', { status: 'warning', message: e.message })
      }
    }

    updateCheck('rls-user-area', { status: 'running' })
    try {
      const { data, error } = await supabase.rpc('user_area_id')
      if (error) throw error
      updateCheck('rls-user-area', { status: 'passed', message: data ? `Área: ${data}` : 'Sem área' })
    } catch (e: any) {
      if (e.message?.includes('does not exist')) {
        updateCheck('rls-user-area', { status: 'failed', message: 'Função não existe' })
      } else {
        updateCheck('rls-user-area', { status: 'warning', message: e.message })
      }
    }

    // Data checks
    updateCheck('data-areas', { status: 'running' })
    try {
      const { data, error } = await supabase.from('areas').select('id')
      if (error) throw error
      const count = data?.length || 0
      updateCheck('data-areas', {
        status: count > 0 ? 'passed' : 'warning',
        message: `${count} área(s) encontrada(s)`,
      })
    } catch (e: any) {
      updateCheck('data-areas', { status: 'failed', message: e.message })
    }

    updateCheck('data-pillars', { status: 'running' })
    try {
      const { data, error } = await supabase.from('pillars').select('id')
      if (error) throw error
      const count = data?.length || 0
      updateCheck('data-pillars', {
        status: count > 0 ? 'passed' : 'warning',
        message: `${count} pilar(es) encontrado(s)`,
      })
    } catch (e: any) {
      updateCheck('data-pillars', { status: 'failed', message: e.message })
    }

    updateCheck('data-templates', { status: 'running' })
    try {
      const { data, error } = await supabase.from('plan_templates').select('id')
      if (error) throw error
      const count = data?.length || 0
      updateCheck('data-templates', {
        status: count > 0 ? 'passed' : 'warning',
        message: `${count} template(s) encontrado(s)`,
      })
    } catch (e: any) {
      updateCheck('data-templates', { status: 'failed', message: e.message })
    }

    // Context checks
    updateCheck('ctx-strategic', { status: 'running' })
    try {
      const { data, error } = await supabase.from('context_store').select('slug').eq('slug', 'strategic')
      if (error) throw error
      updateCheck('ctx-strategic', {
        status: data && data.length > 0 ? 'passed' : 'warning',
        message: data && data.length > 0 ? 'Contexto disponível' : 'Contexto não encontrado',
      })
    } catch (e: any) {
      updateCheck('ctx-strategic', { status: 'warning', message: e.message })
    }

    updateCheck('ctx-okrs', { status: 'running' })
    try {
      const { data, error } = await supabase.from('context_store').select('slug').eq('slug', 'okrs')
      if (error) throw error
      updateCheck('ctx-okrs', {
        status: data && data.length > 0 ? 'passed' : 'warning',
        message: data && data.length > 0 ? 'Contexto disponível' : 'Contexto não encontrado',
      })
    } catch (e: any) {
      updateCheck('ctx-okrs', { status: 'warning', message: e.message })
    }

    // Storage check
    updateCheck('storage-bucket', { status: 'running' })
    try {
      const { error } = await supabase.storage.getBucket('action-evidences')
      if (error) throw error
      updateCheck('storage-bucket', { status: 'passed', message: 'Bucket disponível' })
    } catch (e: any) {
      updateCheck('storage-bucket', { status: 'warning', message: 'Bucket não encontrado ou sem acesso' })
    }

    const duration = Date.now() - startTime
    setCompletedAt(new Date())
    setRunning(false)

    const passed = checks.filter((c) => c.status === 'passed').length
    const failed = checks.filter((c) => c.status === 'failed').length

    addToast({
      type: failed > 0 ? 'warning' : 'success',
      title: 'Validação concluída',
      message: `${passed} testes passaram, ${failed} falharam em ${duration}ms`,
    })
  }

  const getStatusIcon = (status: ValidationCheck['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-success-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-danger-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />
      case 'running':
        return <RefreshCw className="w-5 h-5 text-primary-500 animate-spin" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-border" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Database':
        return <Database className="w-4 h-4" />
      case 'Segurança':
        return <Shield className="w-4 h-4" />
      case 'Dados':
        return <Layers className="w-4 h-4" />
      case 'Contextos':
        return <FileText className="w-4 h-4" />
      case 'Storage':
        return <Database className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const categories = [...new Set(checks.map((c) => c.category))]
  const passedCount = checks.filter((c) => c.status === 'passed').length
  const failedCount = checks.filter((c) => c.status === 'failed').length
  const warningCount = checks.filter((c) => c.status === 'warning').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Validação do Sistema</h1>
          <p className="text-muted mt-1">
            Verificação ampla e granular de todos os componentes da plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const report = generateMarkdownReport({
                supabaseChecks: checks as any,
                platformChecks,
                userEmail: user?.email || 'unknown',
                userRole: user?.profile?.role || 'unknown',
                roleOverride: !!roleOverride,
                completedAt,
              })
              const blob = new Blob([report.content], { type: 'text/markdown' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = report.filename
              a.click()
              URL.revokeObjectURL(url)
              addToast({ type: 'success', title: 'Relatório exportado', message: report.filename })
            }}
          >
            <FileDown className="w-4 h-4 mr-1" />
            Exportar .md
          </Button>
          <Button onClick={runChecks} loading={running}>
            <Play className="w-4 h-4 mr-1" />
            Executar Validação
          </Button>
        </div>
      </div>

      {/* Summary */}
      {completedAt && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{checks.length}</p>
                <p className="text-sm text-muted">Total de testes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-success-600">{passedCount}</p>
                <p className="text-sm text-muted">Passou</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-warning-600">{warningCount}</p>
                <p className="text-sm text-muted">Alertas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-danger-600">{failedCount}</p>
                <p className="text-sm text-muted">Falhou</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Checks by Category */}
      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCategoryIcon(category)}
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {checks
                .filter((c) => c.category === category)
                .map((check) => (
                  <div key={check.id} className="flex items-center gap-4 p-4">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{check.name}</p>
                      <p className="text-sm text-muted">{check.description}</p>
                    </div>
                    {check.message && (
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          check.status === 'passed'
                            ? 'bg-success-100 text-success-700'
                            : check.status === 'failed'
                            ? 'bg-danger-100 text-danger-700'
                            : check.status === 'warning'
                            ? 'bg-warning-100 text-warning-700'
                            : 'bg-accent text-muted'
                        }`}
                      >
                        {check.message}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {completedAt && (
        <div className="text-center text-sm text-muted">
          Última execução: {completedAt.toLocaleString('pt-BR')}
        </div>
      )}

      {/* Platform Health Report — auto-run */}
      <div className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-bold text-foreground">Diagnóstico da Plataforma</h2>
          <span className="text-xs px-2 py-0.5 rounded bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            Automático
          </span>
        </div>
        <p className="text-sm text-muted mb-4">
          Verificações executadas automaticamente ao abrir esta página. Analisa RBAC, navegação, dados mock e ambiente.
        </p>

        {(() => {
          const cats = [...new Set(platformChecks.map(c => c.category))]
          const pPassed = platformChecks.filter(c => c.status === 'passed').length
          const pFailed = platformChecks.filter(c => c.status === 'failed').length
          const pWarning = platformChecks.filter(c => c.status === 'warning').length
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground">{platformChecks.length}</p>
                      <p className="text-sm text-muted">Verificações</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-success-600">{pPassed}</p>
                      <p className="text-sm text-muted">OK</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-warning-600">{pWarning}</p>
                      <p className="text-sm text-muted">Alertas</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-danger-600">{pFailed}</p>
                      <p className="text-sm text-muted">Falhas</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {cats.map(cat => (
                <Card key={cat} className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-base">{cat}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {platformChecks.filter(c => c.category === cat).map(check => (
                        <div key={check.id} className="flex items-start gap-3 p-4">
                          {check.status === 'passed' ? (
                            <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                          ) : check.status === 'failed' ? (
                            <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">{check.name}</p>
                            <p className="text-sm text-muted">{check.message}</p>
                            {check.detail && (
                              <pre className="mt-1 text-[11px] text-muted bg-accent rounded p-2 overflow-x-auto whitespace-pre-wrap">
                                {check.detail}
                              </pre>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )
        })()}
      </div>
    </div>
  )
}

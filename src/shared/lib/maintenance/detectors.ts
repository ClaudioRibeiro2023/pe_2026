import type { MaintenanceFinding } from './types'

interface DetectorResult {
  findings: MaintenanceFinding[]
  scanDurationMs: number
}

/**
 * Detector de artefatos gerados (dist, build, temp)
 */
export async function detectGeneratedArtifacts(): Promise<DetectorResult> {
  const startTime = Date.now()
  const findings: MaintenanceFinding[] = []
  
  // Detectar dist/ vazio ou acumulado
  findings.push({
    id: `dist-cleanup-${Date.now()}`,
    type: 'cleanup_dist',
    riskLevel: 'safe',
    title: 'Limpeza de diretório dist/',
    description: 'O diretório dist/ pode conter builds antigos ou estar vazio após limpeza.',
    location: 'dist/',
    estimatedImpact: 'low',
    autoFixable: true,
    createdAt: new Date(),
  })
  
  return {
    findings,
    scanDurationMs: Date.now() - startTime,
  }
}

/**
 * Detector de console.logs em produção
 */
export function detectConsoleLogs(sourceCode: string, filePath: string): MaintenanceFinding[] {
  const findings: MaintenanceFinding[] = []
  const consoleLogRegex = /console\.log\s*\(/g
  
  if (consoleLogRegex.test(sourceCode)) {
    findings.push({
      id: `console-log-${filePath}-${Date.now()}`,
      type: 'remove_console_logs',
      riskLevel: 'safe',
      title: `Console.log encontrado em ${filePath}`,
      description: 'Remover console.log de código de produção para manter console limpo.',
      location: filePath,
      estimatedImpact: 'low',
      autoFixable: true,
      createdAt: new Date(),
    })
  }
  
  return findings
}

/**
 * Detector de arquivos mock não utilizados
 */
export function detectOrphanedMocks(mockFiles: string[], usedMocks: string[]): MaintenanceFinding[] {
  const findings: MaintenanceFinding[] = []
  
  for (const mockFile of mockFiles) {
    if (!usedMocks.includes(mockFile)) {
      findings.push({
        id: `orphaned-mock-${mockFile}-${Date.now()}`,
        type: 'audit_mock_usage',
        riskLevel: 'approval',
        title: `Mock potencialmente órfão: ${mockFile}`,
        description: 'Arquivo mock pode não estar sendo utilizado. Verificar antes de remover.',
        location: mockFile,
        estimatedImpact: 'medium',
        autoFixable: false,
        createdAt: new Date(),
      })
    }
  }
  
  return findings
}

/**
 * Detector de documentação duplicada ou desatualizada
 */
export function detectDocIssues(docFiles: { path: string; lastModified: Date; content: string }[]): MaintenanceFinding[] {
  const findings: MaintenanceFinding[] = []
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  
  for (const doc of docFiles) {
    // Docs não modificados há mais de 30 dias
    if (doc.lastModified < thirtyDaysAgo) {
      findings.push({
        id: `stale-doc-${doc.path}-${Date.now()}`,
        type: 'consolidate_docs',
        riskLevel: 'approval',
        title: `Documentação desatualizada: ${doc.path}`,
        description: 'Documento não modificado há mais de 30 dias. Verificar relevância.',
        location: doc.path,
        estimatedImpact: 'medium',
        autoFixable: false,
        createdAt: new Date(),
      })
    }
    
    // Detectar possível duplicação por similaridade de conteúdo (simplificado)
    if (doc.content.includes('IMPLEMENTACAO') || doc.content.includes('COMPLETE')) {
      const similarDocs = docFiles.filter(
        d => d.path !== doc.path && 
        (d.content.includes('IMPLEMENTACAO') || d.content.includes('COMPLETE'))
      )
      
      if (similarDocs.length > 0) {
        findings.push({
          id: `duplicate-doc-${doc.path}-${Date.now()}`,
          type: 'consolidate_docs',
          riskLevel: 'approval',
          title: `Possível duplicação: ${doc.path}`,
          description: `Documento similar a: ${similarDocs.map(d => d.path).join(', ')}`,
          location: doc.path,
          estimatedImpact: 'medium',
          autoFixable: false,
          createdAt: new Date(),
        })
      }
    }
  }
  
  return findings
}

/**
 * Scanner completo de manutenção
 */
export async function runFullMaintenanceScan(): Promise<DetectorResult> {
  const startTime = Date.now()
  const allFindings: MaintenanceFinding[] = []
  
  // Executar todos os detectores
  const artifactResults = await detectGeneratedArtifacts()
  allFindings.push(...artifactResults.findings)
  
  // TODO: Adicionar mais detectores conforme necessário
  // - detectStorageOrphans()
  // - detectMetricsCleanup()
  // - detectBrokenImports()
  // - detectDuplicateLogic()
  
  return {
    findings: allFindings,
    scanDurationMs: Date.now() - startTime,
  }
}

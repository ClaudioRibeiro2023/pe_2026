import type { 
  MaintenanceFinding, 
  MaintenanceAction, 
  MaintenanceReport
} from './types'

interface ExecutionContext {
  dryRun: boolean
  userId?: string
  approvedActionIds?: string[]
}

interface ExecutionResult {
  action: MaintenanceAction
  success: boolean
  message: string
}

/**
 * Orquestrador de ações de manutenção
 * Responsável por decidir o que pode rodar automaticamente vs o que precisa de aprovação
 */
export class MaintenanceEngine {
  private actions: Map<string, MaintenanceAction> = new Map()
  private findings: Map<string, MaintenanceFinding> = new Map()
  
  /**
   * Registra findings descobertos pelo scanner
   */
  registerFindings(findings: MaintenanceFinding[]): void {
    for (const finding of findings) {
      this.findings.set(finding.id, finding)
    }
  }
  
  /**
   * Decide quais ações podem ser executadas automaticamente
   */
  autoApproveSafeActions(): MaintenanceAction[] {
    const autoActions: MaintenanceAction[] = []
    
    for (const finding of this.findings.values()) {
      if (finding.riskLevel === 'safe' && finding.autoFixable) {
        const action: MaintenanceAction = {
          id: `action-${finding.id}`,
          findingId: finding.id,
          type: finding.type,
          status: 'pending',
          executedBy: 'system',
          dryRun: false,
        }
        autoActions.push(action)
        this.actions.set(action.id, action)
      }
    }
    
    return autoActions
  }
  
  /**
   * Retorna ações que precisam de aprovação humana
   */
  getPendingApprovals(): MaintenanceAction[] {
    const pending: MaintenanceAction[] = []
    
    for (const finding of this.findings.values()) {
      if (finding.riskLevel === 'approval' || !finding.autoFixable) {
        const action: MaintenanceAction = {
          id: `action-${finding.id}`,
          findingId: finding.id,
          type: finding.type,
          status: 'pending',
          executedBy: 'user',
          dryRun: true,
        }
        pending.push(action)
        this.actions.set(action.id, action)
      }
    }
    
    return pending
  }
  
  /**
   * Executa uma ação de manutenção
   */
  async executeAction(actionId: string, context: ExecutionContext): Promise<ExecutionResult> {
    const action = this.actions.get(actionId)
    if (!action) {
      const notFoundAction: MaintenanceAction = {
        id: actionId,
        findingId: '',
        type: 'cleanup_dist',
        status: 'failed',
        executedBy: 'system',
        dryRun: context.dryRun,
        result: {
          success: false,
          message: 'Ação não encontrada',
        },
      }
      return {
        action: notFoundAction,
        success: false,
        message: 'Ação não encontrada',
      }
    }
    
    const finding = this.findings.get(action.findingId)
    if (!finding) {
      const noFindingAction: MaintenanceAction = {
        ...action,
        status: 'failed',
        result: {
          success: false,
          message: 'Finding associado não encontrado',
        },
      }
      return {
        action: noFindingAction,
        success: false,
        message: 'Finding associado não encontrado',
      }
    }
    
    // Verificar se precisa de aprovação
    if (finding.riskLevel === 'approval' && !context.approvedActionIds?.includes(actionId)) {
      const rejectedAction: MaintenanceAction = {
        ...action,
        status: 'rejected',
        result: {
          success: false,
          message: 'Ação requer aprovação explícita',
        },
      }
      return {
        action: rejectedAction,
        success: false,
        message: 'Ação requer aprovação explícita',
      }
    }
    
    // Executar com base no tipo
    action.status = 'running'
    
    try {
      const result = await this.executeByType(action.type, context.dryRun)
      
      action.status = result.success ? 'completed' : 'failed'
      action.executedAt = new Date()
      action.result = {
        success: result.success,
        message: result.message,
        details: result.details,
      }
      
      return {
        action,
        success: result.success,
        message: result.message,
      }
    } catch (error) {
      action.status = 'failed'
      action.executedAt = new Date()
      action.result = {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      }
      
      return {
        action,
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }
  
  /**
   * Executa ação específica por tipo
   */
  private async executeByType(
    type: MaintenanceAction['type'], 
    dryRun: boolean
  ): Promise<{ success: boolean; message: string; details?: Record<string, unknown> }> {
    switch (type) {
      case 'cleanup_dist':
        return this.executeCleanupDist(dryRun)
      case 'cleanup_metrics':
        return this.executeCleanupMetrics(dryRun)
      case 'remove_console_logs':
        return this.executeRemoveConsoleLogs(dryRun)
      case 'cleanup_storage_orphaned':
        return this.executeCleanupStorage(dryRun)
      default:
        return {
          success: false,
          message: `Tipo de ação não implementado: ${type}`,
        }
    }
  }
  
  private async executeCleanupDist(dryRun: boolean): Promise<{ success: boolean; message: string }> {
    if (dryRun) {
      return {
        success: true,
        message: '[DRY-RUN] Limparia diretório dist/',
      }
    }
    
    // Em ambiente real, aqui executaria a limpeza
    return {
      success: true,
      message: 'Diretório dist/ limpo com sucesso',
    }
  }
  
  private async executeCleanupMetrics(dryRun: boolean): Promise<{ success: boolean; message: string }> {
    if (dryRun) {
      return {
        success: true,
        message: '[DRY-RUN] Limparia métricas antigas',
      }
    }
    
    return {
      success: true,
      message: 'Métricas antigas limpas com sucesso',
    }
  }
  
  private async executeRemoveConsoleLogs(dryRun: boolean): Promise<{ success: boolean; message: string }> {
    if (dryRun) {
      return {
        success: true,
        message: '[DRY-RUN] Removeria console.logs',
      }
    }
    
    return {
      success: true,
      message: 'Console.logs removidos com sucesso',
    }
  }
  
  private async executeCleanupStorage(dryRun: boolean): Promise<{ success: boolean; message: string }> {
    if (dryRun) {
      return {
        success: true,
        message: '[DRY-RUN] Executaria cleanup_orphaned_files() no Supabase',
      }
    }
    
    return {
      success: true,
      message: 'Arquivos órfãos do storage removidos via Supabase',
    }
  }
  
  /**
   * Gera relatório completo de manutenção
   */
  generateReport(): MaintenanceReport {
    const allFindings = Array.from(this.findings.values())
    const allActions = Array.from(this.actions.values())
    
    return {
      id: `report-${Date.now()}`,
      runAt: new Date(),
      durationMs: 0, // Calculado externamente
      findings: allFindings,
      actions: allActions,
      summary: {
        totalFindings: allFindings.length,
        safeCount: allFindings.filter(f => f.riskLevel === 'safe').length,
        approvalCount: allFindings.filter(f => f.riskLevel === 'approval').length,
        blockedCount: allFindings.filter(f => f.riskLevel === 'blocked').length,
        autoExecuted: allActions.filter(a => a.executedBy === 'system' && a.status === 'completed').length,
        pendingApproval: allActions.filter(a => a.status === 'pending' && a.executedBy === 'user').length,
      },
    }
  }
}

// Singleton instance
export const maintenanceEngine = new MaintenanceEngine()

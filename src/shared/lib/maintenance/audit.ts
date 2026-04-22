interface MaintenanceAuditLog {
  id: string
  timestamp: Date
  type: 'scan' | 'execution' | 'approval' | 'rejection' | 'rollback'
  userId?: string
  actionId?: string
  findingId?: string
  details: Record<string, unknown>
  result: 'success' | 'failure' | 'pending'
  message: string
}

class MaintenanceAuditor {
  private logs: MaintenanceAuditLog[] = []

  log(event: Omit<MaintenanceAuditLog, 'id' | 'timestamp'>): void {
    const log: MaintenanceAuditLog = {
      ...event,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }
    this.logs.push(log)
    
    // Em produção, aqui enviaria para Supabase/Storage
    if (process.env.NODE_ENV === 'development') {
      console.log('[MaintenanceAudit]', log)
    }
  }

  getLogs(filters?: { type?: MaintenanceAuditLog['type']; result?: MaintenanceAuditLog['result'] }): MaintenanceAuditLog[] {
    let filtered = this.logs
    
    if (filters?.type) {
      filtered = filtered.filter(l => l.type === filters.type)
    }
    if (filters?.result) {
      filtered = filtered.filter(l => l.result === filters.result)
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  exportReport(): string {
    return JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalLogs: this.logs.length,
      logs: this.logs,
    }, null, 2)
  }
}

export const maintenanceAuditor = new MaintenanceAuditor()

/**
 * Hook para auditoria de manutenção
 */
export function useMaintenanceAudit() {
  const getRecentLogs = (hours = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    return maintenanceAuditor.getLogs().filter(l => l.timestamp > cutoff)
  }

  const getFailureRate = (hours = 24) => {
    const recent = getRecentLogs(hours)
    if (recent.length === 0) return 0
    const failures = recent.filter(l => l.result === 'failure').length
    return failures / recent.length
  }

  const exportAuditReport = () => {
    return maintenanceAuditor.exportReport()
  }

  return {
    getRecentLogs,
    getFailureRate,
    exportAuditReport,
    totalLogs: maintenanceAuditor.getLogs().length,
  }
}

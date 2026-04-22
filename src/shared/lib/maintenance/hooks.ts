import { useState, useCallback, useEffect } from 'react'
import { maintenanceEngine } from './engine'
import { runFullMaintenanceScan } from './detectors'
import type { MaintenanceFinding, MaintenanceAction, MaintenanceReport } from './types'

interface UseMaintenanceReturn {
  isScanning: boolean
  findings: MaintenanceFinding[]
  actions: MaintenanceAction[]
  report: MaintenanceReport | null
  scan: () => Promise<void>
  executeAction: (actionId: string, dryRun?: boolean) => Promise<void>
  approveAndExecute: (actionId: string) => Promise<void>
  refreshReport: () => void
}

/**
 * Hook principal para operações de manutenção
 */
export function useMaintenance(): UseMaintenanceReturn {
  const [isScanning, setIsScanning] = useState(false)
  const [findings, setFindings] = useState<MaintenanceFinding[]>([])
  const [actions, setActions] = useState<MaintenanceAction[]>([])
  const [report, setReport] = useState<MaintenanceReport | null>(null)

  const scan = useCallback(async () => {
    setIsScanning(true)
    try {
      const result = await runFullMaintenanceScan()
      maintenanceEngine.registerFindings(result.findings)
      
      // Auto-aprovar ações seguras
      const autoActions = maintenanceEngine.autoApproveSafeActions()
      
      // Executar ações seguras automaticamente
      for (const action of autoActions) {
        await maintenanceEngine.executeAction(action.id, { dryRun: false })
      }
      
      // Obter ações pendentes de aprovação
      const pendingActions = maintenanceEngine.getPendingApprovals()
      
      setFindings(result.findings)
      setActions([...autoActions, ...pendingActions])
      refreshReport()
    } finally {
      setIsScanning(false)
    }
  }, [])

  const executeAction = useCallback(async (actionId: string, dryRun = true) => {
    await maintenanceEngine.executeAction(actionId, { dryRun })
    refreshReport()
  }, [])

  const approveAndExecute = useCallback(async (actionId: string) => {
    await maintenanceEngine.executeAction(actionId, { 
      dryRun: false, 
      approvedActionIds: [actionId] 
    })
    refreshReport()
  }, [])

  const refreshReport = useCallback(() => {
    setReport(maintenanceEngine.generateReport())
  }, [])

  // Scan automático no mount
  useEffect(() => {
    scan()
  }, [scan])

  return {
    isScanning,
    findings,
    actions,
    report,
    scan,
    executeAction,
    approveAndExecute,
    refreshReport,
  }
}

/**
 * Hook para monitoramento contínuo de saúde da repo
 */
export function useMaintenanceHealthCheck(intervalMinutes = 30) {
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [issues, setIssues] = useState<MaintenanceFinding[]>([])

  useEffect(() => {
    const check = async () => {
      const result = await runFullMaintenanceScan()
      maintenanceEngine.registerFindings(result.findings)
      
      // Filtrar apenas issues que precisam de atenção
      const criticalIssues = result.findings.filter(
        f => f.riskLevel === 'approval' || f.riskLevel === 'blocked'
      )
      
      setIssues(criticalIssues)
      setLastCheck(new Date())
    }

    // Check inicial
    check()

    // Intervalo de checagem
    const interval = setInterval(check, intervalMinutes * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [intervalMinutes])

  return {
    lastCheck,
    issues,
    hasIssues: issues.length > 0,
  }
}

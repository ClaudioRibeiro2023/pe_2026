export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success'
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed'
export type AlertCategory = 'goal' | 'indicator' | 'action_plan' | 'deadline' | 'system' | 'compliance'

export interface Alert {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  status: AlertStatus
  category: AlertCategory
  source_type?: string
  source_id?: string
  source_label?: string
  created_at: string
  updated_at: string
  acknowledged_at?: string
  acknowledged_by?: string
  resolved_at?: string
  resolved_by?: string
  metadata?: Record<string, unknown>
}

export interface AlertFilter {
  severity?: AlertSeverity[]
  status?: AlertStatus[]
  category?: AlertCategory[]
  dateFrom?: string
  dateTo?: string
}

export interface AlertStats {
  total: number
  critical: number
  warning: number
  info: number
  active: number
  acknowledged: number
  resolved: number
}

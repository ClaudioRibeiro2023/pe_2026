export type AuditAction = 'create' | 'update' | 'delete' | 'view' | 'export' | 'login' | 'logout' | 'approve' | 'reject'
export type AuditEntityType = 'goal' | 'indicator' | 'action_plan' | 'evidence' | 'user' | 'decision' | 'risk' | 'setting'

export interface AuditLog {
  id: string
  action: AuditAction
  entity_type: AuditEntityType
  entity_id: string
  entity_label?: string
  user_id: string
  user_name: string
  user_email: string
  ip_address?: string
  user_agent?: string
  old_value?: Record<string, unknown>
  new_value?: Record<string, unknown>
  metadata?: Record<string, unknown>
  created_at: string
}

export interface ComplianceRule {
  id: string
  name: string
  description: string
  category: string
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable'
  last_checked: string
  evidence_count: number
  issues: string[]
}

export interface AccessLog {
  id: string
  user_id: string
  user_name: string
  user_email: string
  action: 'login' | 'logout' | 'failed_login' | 'password_reset' | 'role_change'
  ip_address: string
  user_agent: string
  location?: string
  success: boolean
  created_at: string
}

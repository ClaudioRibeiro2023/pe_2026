import { lazy } from 'react'
import { Route } from 'react-router-dom'
import { RequireRole } from '../guards/RequireRole'
import { ROUTES } from '@/shared/config/routes'
import { SuspensePage } from './SuspensePage'

const ScoreboardPage = lazy(() =>
  import('@/features/analytics/pages/ScoreboardPage').then((m) => ({ default: m.ScoreboardPage }))
)
const InsightsPage = lazy(() =>
  import('@/features/analytics/pages/InsightsPage').then((m) => ({ default: m.InsightsPage }))
)
const DataHealthPage = lazy(() =>
  import('@/features/analytics/pages/DataHealthPage').then((m) => ({ default: m.DataHealthPage }))
)
const CustomDashboardsPage = lazy(() =>
  import('@/features/dashboards/pages/CustomDashboardsPage').then((m) => ({ default: m.CustomDashboardsPage }))
)
const AlertCenterPage = lazy(() =>
  import('@/features/alerts/pages/AlertCenterPage').then((m) => ({ default: m.AlertCenterPage }))
)
const AuditLogsPage = lazy(() =>
  import('@/features/audit/pages/AuditLogsPage').then((m) => ({ default: m.AuditLogsPage }))
)
const CompliancePage = lazy(() =>
  import('@/features/audit/pages/CompliancePage').then((m) => ({ default: m.CompliancePage }))
)

export function analyticsRoutes() {
  return (
    <>
      {/* Cockpit - Alerts & Dashboards */}
      <Route path={ROUTES.ALERTS} element={<SuspensePage featureName="Alertas"><AlertCenterPage /></SuspensePage>} />
      <Route path={ROUTES.CUSTOM_DASHBOARDS} element={<SuspensePage featureName="Dashboards"><CustomDashboardsPage /></SuspensePage>} />

      {/* Analytics Hub */}
      <Route path={ROUTES.ANALYTICS_SCOREBOARD} element={<SuspensePage featureName="Analytics"><ScoreboardPage /></SuspensePage>} />
      <Route path={ROUTES.ANALYTICS_INSIGHTS} element={<SuspensePage featureName="Analytics"><InsightsPage /></SuspensePage>} />
      <Route path={ROUTES.ANALYTICS_DASHBOARDS} element={<SuspensePage featureName="Analytics"><CustomDashboardsPage /></SuspensePage>} />
      <Route path={ROUTES.ANALYTICS_DATA_HEALTH} element={<SuspensePage featureName="Analytics"><DataHealthPage /></SuspensePage>} />

      {/* Audit & Compliance */}
      <Route path={ROUTES.AUDIT_LOGS} element={<SuspensePage featureName="Auditoria"><RequireRole allowedRoles={['admin', 'gestor']}><AuditLogsPage /></RequireRole></SuspensePage>} />
      <Route path={ROUTES.AUDIT_COMPLIANCE} element={<SuspensePage featureName="Auditoria"><RequireRole allowedRoles={['admin', 'gestor']}><CompliancePage /></RequireRole></SuspensePage>} />
    </>
  )
}

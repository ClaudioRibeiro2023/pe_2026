import { lazy } from 'react'
import { Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import { LegacyAreaRedirect } from '../components/LegacyAreaRedirect'
import { SuspensePage } from './SuspensePage'

const PlanningHomePage = lazy(() =>
  import('@/features/planning/pages/PlanningHomePage').then((m) => ({ default: m.PlanningHomePage }))
)
const PlanningDashboardPage = lazy(() =>
  import('@/features/planning/pages/PlanningDashboardPage').then((m) => ({ default: m.PlanningDashboardPage }))
)
const PlanningKanbanPage = lazy(() =>
  import('@/features/planning/pages/PlanningKanbanPage').then((m) => ({ default: m.PlanningKanbanPage }))
)
const PlanningCalendarPage = lazy(() =>
  import('@/features/planning/pages/PlanningCalendarPage').then((m) => ({ default: m.PlanningCalendarPage }))
)
const PlanningTimelinePage = lazy(() =>
  import('@/features/planning/pages/PlanningTimelinePage').then((m) => ({ default: m.PlanningTimelinePage }))
)
const ActionsNewPage = lazy(() =>
  import('@/features/planning/pages/actions/ActionsNewPage').then((m) => ({ default: m.ActionsNewPage }))
)
const ActionsManagePage = lazy(() =>
  import('@/features/planning/pages/actions/ActionsManagePage').then((m) => ({ default: m.ActionsManagePage }))
)
const ActionsTemplatesPage = lazy(() =>
  import('@/features/planning/pages/actions/ActionsTemplatesPage').then((m) => ({ default: m.ActionsTemplatesPage }))
)
const ActionsApprovalsPage = lazy(() =>
  import('@/features/planning/pages/actions/ActionsApprovalsPage').then((m) => ({ default: m.ActionsApprovalsPage }))
)
const ActionsEvidencesPage = lazy(() =>
  import('@/features/planning/pages/actions/ActionsEvidencesPage').then((m) => ({ default: m.ActionsEvidencesPage }))
)
const PlanningAreaDashboardPage = lazy(() =>
  import('@/features/planning/pages/area/PlanningAreaDashboardPage').then((m) => ({ default: m.PlanningAreaDashboardPage }))
)
const PlanningAreaKanbanPage = lazy(() =>
  import('@/features/planning/pages/area/PlanningAreaKanbanPage').then((m) => ({ default: m.PlanningAreaKanbanPage }))
)
const PlanningAreaCalendarPage = lazy(() =>
  import('@/features/planning/pages/area/PlanningAreaCalendarPage').then((m) => ({ default: m.PlanningAreaCalendarPage }))
)
const PlanningAreaTimelinePage = lazy(() =>
  import('@/features/planning/pages/area/PlanningAreaTimelinePage').then((m) => ({ default: m.PlanningAreaTimelinePage }))
)
const PlanningAreaStrategicPackPage = lazy(() =>
  import('@/features/planning/pages/area/PlanningAreaStrategicPackPage').then((m) => ({ default: m.PlanningAreaStrategicPackPage }))
)
const PlanningAreaLayout = lazy(() =>
  import('@/features/planning/layouts/PlanningAreaLayout').then((m) => ({ default: m.PlanningAreaLayout }))
)

export function planningRoutes() {
  return (
    <>
      {/* Area Plans Section - LEGACY REDIRECTS (manter por 6 meses mínimo) */}
      <Route path={ROUTES.AREA_PLANS} element={<Navigate to="/planning" replace />} />
      <Route path="/area-plans/dashboard" element={<Navigate to="/planning/dashboard" replace />} />
      <Route path="/area-plans/kanban" element={<Navigate to="/planning/kanban" replace />} />
      <Route path="/area-plans/timeline" element={<Navigate to="/planning/timeline" replace />} />
      <Route path="/area-plans/:areaSlug" element={<LegacyAreaRedirect />} />
      <Route path="/area-plans/:areaSlug/kanban" element={<LegacyAreaRedirect subroute="kanban" />} />
      <Route path="/area-plans/:areaSlug/timeline" element={<LegacyAreaRedirect subroute="timeline" />} />
      <Route path="/area-plans/:areaSlug/approvals" element={<Navigate to="/planning/actions/approvals" replace />} />

      {/* Planning Module */}
      <Route path={ROUTES.PLANNING} element={<SuspensePage featureName="Planning"><PlanningHomePage /></SuspensePage>} />
      <Route path={ROUTES.PLANNING_DASHBOARD} element={<SuspensePage featureName="Planning"><PlanningDashboardPage /></SuspensePage>} />
      <Route path={ROUTES.PLANNING_KANBAN} element={<SuspensePage featureName="Planning"><PlanningKanbanPage /></SuspensePage>} />
      <Route path={ROUTES.PLANNING_CALENDAR} element={<SuspensePage featureName="Planning"><PlanningCalendarPage /></SuspensePage>} />
      <Route path={ROUTES.PLANNING_TIMELINE} element={<SuspensePage featureName="Planning"><PlanningTimelinePage /></SuspensePage>} />
      <Route path={ROUTES.PLANNING_ACTIONS_NEW} element={<SuspensePage featureName="Planning"><ActionsNewPage /></SuspensePage>} />
      <Route path={ROUTES.PLANNING_ACTIONS_MANAGE} element={<SuspensePage featureName="Planning"><ActionsManagePage /></SuspensePage>} />
      <Route path={ROUTES.PLANNING_ACTIONS_TEMPLATES} element={<SuspensePage featureName="Planning"><ActionsTemplatesPage /></SuspensePage>} />
      <Route path={ROUTES.PLANNING_ACTIONS_APPROVALS} element={<SuspensePage featureName="Planning"><ActionsApprovalsPage /></SuspensePage>} />
      <Route path={ROUTES.PLANNING_ACTIONS_EVIDENCES} element={<SuspensePage featureName="Planning"><ActionsEvidencesPage /></SuspensePage>} />

      {/* Planning Area Routes */}
      <Route path="/planning/:areaSlug" element={<SuspensePage featureName="Planning"><PlanningAreaLayout /></SuspensePage>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SuspensePage featureName="Planning"><PlanningAreaDashboardPage /></SuspensePage>} />
        <Route path="kanban" element={<SuspensePage featureName="Planning"><PlanningAreaKanbanPage /></SuspensePage>} />
        <Route path="calendar" element={<SuspensePage featureName="Planning"><PlanningAreaCalendarPage /></SuspensePage>} />
        <Route path="timeline" element={<SuspensePage featureName="Planning"><PlanningAreaTimelinePage /></SuspensePage>} />
        <Route path="pe-2026" element={<SuspensePage featureName="Planning"><PlanningAreaStrategicPackPage /></SuspensePage>} />
      </Route>
    </>
  )
}

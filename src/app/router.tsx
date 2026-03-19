import { Suspense, lazy, type ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { RequireAuth } from './guards/RequireAuth'
import { RequireRole } from './guards/RequireRole'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { PageLoader } from '@/shared/ui/Loader'
import { ROUTES } from '@/shared/config/routes'
import { LegacyAreaRedirect } from './components/LegacyAreaRedirect'
import { FeatureErrorBoundary } from '@/shared/components/error-boundary/FeatureErrorBoundary'

const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
)
const AdminPage = lazy(() =>
  import('@/features/admin/pages/AdminPage').then((m) => ({ default: m.AdminPage }))
)
const CalendarPage = lazy(() =>
  import('@/features/calendar/pages/CalendarPage').then((m) => ({ default: m.CalendarPage }))
)
const GoalsPage = lazy(() => import('@/features/goals/pages/GoalsPage').then((m) => ({ default: m.GoalsPage })))
const IndicatorsPage = lazy(() => import('@/features/indicators/pages/IndicatorsPage').then((m) => ({ default: m.IndicatorsPage })))
const ActionPlansPage = lazy(() => import('@/features/action-plans/pages/ActionPlansPage').then((m) => ({ default: m.ActionPlansPage })))
const ActionPlanDashboard = lazy(() => import('@/features/action-plans/pages/ActionPlanDashboard').then((m) => ({ default: m.ActionPlanDashboard })))
const ActionPlanKanban = lazy(() => import('@/features/action-plans/pages/ActionPlanKanban').then((m) => ({ default: m.ActionPlanKanban })))
const ActionPlanTimeline = lazy(() => import('@/features/action-plans/pages/ActionPlanTimeline').then((m) => ({ default: m.ActionPlanTimeline })))
const InitiativesPage = lazy(() => import('@/features/initiatives/pages/InitiativesPage').then((m) => ({ default: m.InitiativesPage })))
const AreasPage = lazy(() => import('@/features/areas/pages/AreasPage').then((m) => ({ default: m.AreasPage })))
const CapacityPage = lazy(() =>
  import('@/features/capacity/pages/CapacityPage').then((m) => ({ default: m.CapacityPage }))
)
const MonetizationPage = lazy(() =>
  import('@/features/monetization/pages/MonetizationPage').then((m) => ({ default: m.MonetizationPage }))
)
const FinancePage = lazy(() =>
  import('@/features/finance/pages/FinancePage').then((m) => ({ default: m.FinancePage }))
)
const ReportsPage = lazy(() =>
  import('@/features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage }))
)
const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
)
const GovernanceDecisionsPage = lazy(() =>
  import('@/features/governance/pages/GovernanceDecisionsPage').then((m) => ({
    default: m.GovernanceDecisionsPage,
  }))
)
const GovernanceRisksPage = lazy(() =>
  import('@/features/governance/pages/GovernanceRisksPage').then((m) => ({
    default: m.GovernanceRisksPage,
  }))
)
const GovernanceEvidencesPage = lazy(() =>
  import('@/features/governance/pages/GovernanceEvidencesPage').then((m) => ({
    default: m.GovernanceEvidencesPage,
  }))
)
const GovernanceTraceabilityPage = lazy(() =>
  import('@/features/governance/pages/GovernanceTraceabilityPage').then((m) => ({
    default: m.GovernanceTraceabilityPage,
  }))
)
// Closings Module
const ClosingsListPage = lazy(() =>
  import('@/features/closings/pages/ClosingsListPage').then((m) => ({ default: m.ClosingsListPage }))
)
const ClosingDetailsPage = lazy(() =>
  import('@/features/closings/pages/ClosingDetailsPage').then((m) => ({ default: m.ClosingDetailsPage }))
)
const ClosingsComparePage = lazy(() =>
  import('@/features/closings/pages/ClosingsComparePage').then((m) => ({ default: m.ClosingsComparePage }))
)

const StrategyLayout = lazy(() =>
  import('@/features/strategy/pages/StrategyLayout').then((m) => ({ default: m.StrategyLayout }))
)
const StrategyOverviewPage = lazy(() =>
  import('@/features/strategy/pages/StrategyOverviewPage').then((m) => ({
    default: m.StrategyOverviewPage,
  }))
)
const StrategyThesisPage = lazy(() =>
  import('@/features/strategy/pages/StrategyThesisPage').then((m) => ({ default: m.StrategyThesisPage }))
)
const StrategyPillarsPage = lazy(() =>
  import('@/features/strategy/pages/StrategyPillarsPage').then((m) => ({ default: m.StrategyPillarsPage }))
)
const StrategyScenariosPage = lazy(() =>
  import('@/features/strategy/pages/StrategyScenariosPage').then((m) => ({
    default: m.StrategyScenariosPage,
  }))
)
const StrategyRisksPage = lazy(() =>
  import('@/features/strategy/pages/StrategyRisksPage').then((m) => ({ default: m.StrategyRisksPage }))
)
const StrategyKpisPage = lazy(() =>
  import('@/features/strategy/pages/StrategyKpisPage').then((m) => ({ default: m.StrategyKpisPage }))
)
const StrategyOkrsPage = lazy(() =>
  import('@/features/strategy/pages/StrategyOkrsPage').then((m) => ({ default: m.StrategyOkrsPage }))
)

// LEGACY: imports de area-plans removidos - rotas agora são redirects para /planning/*
// Mantidos como comentário para referência durante período de transição (6 meses)

// Planning Module (novo)
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

// Planning Area Pages (rotas por área)
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

// Cockpit - Alerts & Dashboards
const AlertCenterPage = lazy(() =>
  import('@/features/alerts/pages/AlertCenterPage').then((m) => ({ default: m.AlertCenterPage }))
)
const CustomDashboardsPage = lazy(() =>
  import('@/features/dashboards/pages/CustomDashboardsPage').then((m) => ({ default: m.CustomDashboardsPage }))
)

// Analytics Hub
const ScoreboardPage = lazy(() =>
  import('@/features/analytics/pages/ScoreboardPage').then((m) => ({ default: m.ScoreboardPage }))
)
const InsightsPage = lazy(() =>
  import('@/features/analytics/pages/InsightsPage').then((m) => ({ default: m.InsightsPage }))
)
const DataHealthPage = lazy(() =>
  import('@/features/analytics/pages/DataHealthPage').then((m) => ({ default: m.DataHealthPage }))
)

// Audit & Compliance
const AuditLogsPage = lazy(() =>
  import('@/features/audit/pages/AuditLogsPage').then((m) => ({ default: m.AuditLogsPage }))
)
const CompliancePage = lazy(() =>
  import('@/features/audit/pages/CompliancePage').then((m) => ({ default: m.CompliancePage }))
)

// Admin Pages
const ContextManagerPage = lazy(() =>
  import('@/features/admin/pages/ContextManagerPage').then((m) => ({ default: m.ContextManagerPage }))
)
const LegacyMigrationPage = lazy(() =>
  import('@/features/admin/pages/LegacyMigrationPage').then((m) => ({ default: m.LegacyMigrationPage }))
)
const ValidationPage = lazy(() =>
  import('@/features/admin/pages/ValidationPage').then((m) => ({ default: m.ValidationPage }))
)

function SuspensePage({ children, featureName }: { children: ReactNode; featureName?: string }) {
  return (
    <FeatureErrorBoundary featureName={featureName}>
      <Suspense fallback={<PageLoader text="Carregando..." />}>{children}</Suspense>
    </FeatureErrorBoundary>
  )
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <SuspensePage>
            <LoginPage />
          </SuspensePage>
        }
      />
      <Route
        path="/reset-password"
        element={
          <SuspensePage>
            <ResetPasswordPage />
          </SuspensePage>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <SuspensePage>
            <ResetPasswordPage />
          </SuspensePage>
        }
      />

      {/* Protected routes */}
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <SuspensePage>
              <DashboardPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.GOALS}
          element={
            <SuspensePage>
              <GoalsPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.INDICATORS}
          element={
            <SuspensePage>
              <IndicatorsPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.ACTION_PLANS}
          element={
            <SuspensePage>
              <ActionPlansPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.ACTION_PLANS_DASHBOARD}
          element={
            <SuspensePage>
              <ActionPlanDashboard />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.ACTION_PLANS_KANBAN}
          element={
            <SuspensePage>
              <ActionPlanKanban />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.ACTION_PLANS_TIMELINE}
          element={
            <SuspensePage>
              <ActionPlanTimeline />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.INITIATIVES}
          element={
            <SuspensePage>
              <InitiativesPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.AREAS}
          element={
            <SuspensePage>
              <AreasPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.CAPACITY}
          element={
            <SuspensePage>
              <CapacityPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.MONETIZATION}
          element={
            <SuspensePage>
              <MonetizationPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.FINANCE}
          element={
            <SuspensePage>
              <FinancePage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.ADMIN}
          element={
            <SuspensePage>
              <RequireRole allowedRoles={['admin']}>
                <AdminPage />
              </RequireRole>
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.ADMIN_CONTEXTS}
          element={
            <SuspensePage>
              <RequireRole allowedRoles={['admin']}>
                <ContextManagerPage />
              </RequireRole>
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.ADMIN_MIGRATION}
          element={
            <SuspensePage>
              <RequireRole allowedRoles={['admin']}>
                <LegacyMigrationPage />
              </RequireRole>
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.ADMIN_VALIDATION}
          element={
            <SuspensePage>
              <ValidationPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.CALENDAR}
          element={
            <SuspensePage>
              <CalendarPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.REPORTS}
          element={
            <SuspensePage>
              <ReportsPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <SuspensePage>
              <SettingsPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.GOVERNANCE_DECISIONS}
          element={
            <SuspensePage>
              <GovernanceDecisionsPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.GOVERNANCE_RISKS}
          element={
            <SuspensePage>
              <GovernanceRisksPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.GOVERNANCE_EVIDENCES}
          element={
            <SuspensePage>
              <GovernanceEvidencesPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.GOVERNANCE_TRACEABILITY}
          element={
            <SuspensePage>
              <GovernanceTraceabilityPage />
            </SuspensePage>
          }
        />

        {/* Closings Module */}
        <Route
          path={ROUTES.GOVERNANCE_CLOSINGS_COMPARE}
          element={
            <SuspensePage>
              <ClosingsComparePage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.GOVERNANCE_CLOSINGS_DETAIL}
          element={
            <SuspensePage>
              <ClosingDetailsPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.GOVERNANCE_CLOSINGS}
          element={
            <SuspensePage>
              <ClosingsListPage />
            </SuspensePage>
          }
        />

        {/* Cockpit - Alerts & Dashboards */}
        <Route
          path={ROUTES.ALERTS}
          element={
            <SuspensePage>
              <AlertCenterPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.CUSTOM_DASHBOARDS}
          element={
            <SuspensePage>
              <CustomDashboardsPage />
            </SuspensePage>
          }
        />

        {/* Analytics Hub */}
        <Route
          path={ROUTES.ANALYTICS_SCOREBOARD}
          element={
            <SuspensePage>
              <ScoreboardPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.ANALYTICS_INSIGHTS}
          element={
            <SuspensePage>
              <InsightsPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.ANALYTICS_DASHBOARDS}
          element={
            <SuspensePage>
              <CustomDashboardsPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.ANALYTICS_DATA_HEALTH}
          element={
            <SuspensePage>
              <DataHealthPage />
            </SuspensePage>
          }
        />

        {/* Audit & Compliance */}
        <Route
          path={ROUTES.AUDIT_LOGS}
          element={
            <SuspensePage>
              <RequireRole allowedRoles={['admin', 'gestor']}>
                <AuditLogsPage />
              </RequireRole>
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.AUDIT_COMPLIANCE}
          element={
            <SuspensePage>
              <RequireRole allowedRoles={['admin', 'gestor']}>
                <CompliancePage />
              </RequireRole>
            </SuspensePage>
          }
        />

        {/* Area Plans Section - LEGACY REDIRECTS (manter por 6 meses mínimo) */}
        <Route path={ROUTES.AREA_PLANS} element={<Navigate to="/planning" replace />} />
        <Route path="/area-plans/dashboard" element={<Navigate to="/planning/dashboard" replace />} />
        <Route path="/area-plans/kanban" element={<Navigate to="/planning/kanban" replace />} />
        <Route path="/area-plans/timeline" element={<Navigate to="/planning/timeline" replace />} />
        <Route path="/area-plans/:areaSlug" element={<LegacyAreaRedirect />} />
        <Route path="/area-plans/:areaSlug/kanban" element={<LegacyAreaRedirect subroute="kanban" />} />
        <Route path="/area-plans/:areaSlug/timeline" element={<LegacyAreaRedirect subroute="timeline" />} />
        <Route path="/area-plans/:areaSlug/approvals" element={<Navigate to="/planning/actions/approvals" replace />} />

        {/* Planning Module (novo) */}
        <Route
          path={ROUTES.PLANNING}
          element={
            <SuspensePage>
              <PlanningHomePage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.PLANNING_DASHBOARD}
          element={
            <SuspensePage>
              <PlanningDashboardPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.PLANNING_KANBAN}
          element={
            <SuspensePage>
              <PlanningKanbanPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.PLANNING_CALENDAR}
          element={
            <SuspensePage>
              <PlanningCalendarPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.PLANNING_TIMELINE}
          element={
            <SuspensePage>
              <PlanningTimelinePage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.PLANNING_ACTIONS_NEW}
          element={
            <SuspensePage>
              <ActionsNewPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.PLANNING_ACTIONS_MANAGE}
          element={
            <SuspensePage>
              <ActionsManagePage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.PLANNING_ACTIONS_TEMPLATES}
          element={
            <SuspensePage>
              <ActionsTemplatesPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.PLANNING_ACTIONS_APPROVALS}
          element={
            <SuspensePage>
              <ActionsApprovalsPage />
            </SuspensePage>
          }
        />
        <Route
          path={ROUTES.PLANNING_ACTIONS_EVIDENCES}
          element={
            <SuspensePage>
              <ActionsEvidencesPage />
            </SuspensePage>
          }
        />

        {/* Planning Area Routes (rotas por área específica com layout contextual) */}
        <Route
          path="/planning/:areaSlug"
          element={
            <SuspensePage>
              <PlanningAreaLayout />
            </SuspensePage>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <SuspensePage>
                <PlanningAreaDashboardPage />
              </SuspensePage>
            }
          />
          <Route
            path="kanban"
            element={
              <SuspensePage>
                <PlanningAreaKanbanPage />
              </SuspensePage>
            }
          />
          <Route
            path="calendar"
            element={
              <SuspensePage>
                <PlanningAreaCalendarPage />
              </SuspensePage>
            }
          />
          <Route
            path="timeline"
            element={
              <SuspensePage>
                <PlanningAreaTimelinePage />
              </SuspensePage>
            }
          />
          <Route
            path="pe-2026"
            element={
              <SuspensePage>
                <PlanningAreaStrategicPackPage />
              </SuspensePage>
            }
          />
        </Route>

        {/* Strategy Section with nested layout */}
        <Route
          path={ROUTES.STRATEGY}
          element={
            <SuspensePage>
              <StrategyLayout />
            </SuspensePage>
          }
        >
          <Route
            index
            element={
              <SuspensePage>
                <StrategyOverviewPage />
              </SuspensePage>
            }
          />
          <Route
            path="thesis"
            element={
              <SuspensePage>
                <StrategyThesisPage />
              </SuspensePage>
            }
          />
          <Route
            path="pillars"
            element={
              <SuspensePage>
                <StrategyPillarsPage />
              </SuspensePage>
            }
          />
          <Route
            path="okrs"
            element={
              <SuspensePage>
                <StrategyOkrsPage />
              </SuspensePage>
            }
          />
          <Route
            path="kpis"
            element={
              <SuspensePage>
                <StrategyKpisPage />
              </SuspensePage>
            }
          />
          <Route
            path="scenarios"
            element={
              <SuspensePage>
                <StrategyScenariosPage />
              </SuspensePage>
            }
          />
          <Route
            path="risks"
            element={
              <SuspensePage>
                <StrategyRisksPage />
              </SuspensePage>
            }
          />
        </Route>
      </Route>

      {/* Fallback routes */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

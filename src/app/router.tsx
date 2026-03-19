import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { RequireAuth } from './guards/RequireAuth'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { ROUTES } from '@/shared/config/routes'
import { SuspensePage, planningRoutes, strategyRoutes, governanceRoutes, adminRoutes, analyticsRoutes } from './routes'

// Core pages (kept in main router — small group)
const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const ResetPasswordPage = lazy(() =>
  import('@/features/auth/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const GoalsPage = lazy(() => import('@/features/goals/pages/GoalsPage').then((m) => ({ default: m.GoalsPage })))
const IndicatorsPage = lazy(() => import('@/features/indicators/pages/IndicatorsPage').then((m) => ({ default: m.IndicatorsPage })))
const ActionPlansPage = lazy(() => import('@/features/action-plans/pages/ActionPlansPage').then((m) => ({ default: m.ActionPlansPage })))
const ActionPlanDashboard = lazy(() => import('@/features/action-plans/pages/ActionPlanDashboard').then((m) => ({ default: m.ActionPlanDashboard })))
const ActionPlanKanban = lazy(() => import('@/features/action-plans/pages/ActionPlanKanban').then((m) => ({ default: m.ActionPlanKanban })))
const ActionPlanTimeline = lazy(() => import('@/features/action-plans/pages/ActionPlanTimeline').then((m) => ({ default: m.ActionPlanTimeline })))
const InitiativesPage = lazy(() => import('@/features/initiatives/pages/InitiativesPage').then((m) => ({ default: m.InitiativesPage })))
const AreasPage = lazy(() => import('@/features/areas/pages/AreasPage').then((m) => ({ default: m.AreasPage })))
const CapacityPage = lazy(() => import('@/features/capacity/pages/CapacityPage').then((m) => ({ default: m.CapacityPage })))
const MonetizationPage = lazy(() => import('@/features/monetization/pages/MonetizationPage').then((m) => ({ default: m.MonetizationPage })))
const FinancePage = lazy(() => import('@/features/finance/pages/FinancePage').then((m) => ({ default: m.FinancePage })))
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const CalendarPage = lazy(() => import('@/features/calendar/pages/CalendarPage').then((m) => ({ default: m.CalendarPage })))

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.LOGIN} element={<SuspensePage><LoginPage /></SuspensePage>} />
      <Route path="/reset-password" element={<SuspensePage><ResetPasswordPage /></SuspensePage>} />
      <Route path="/reset-password/:token" element={<SuspensePage><ResetPasswordPage /></SuspensePage>} />

      {/* Protected routes */}
      <Route element={<RequireAuth><AppShell /></RequireAuth>}>
        {/* Core */}
        <Route path={ROUTES.DASHBOARD} element={<SuspensePage featureName="Dashboard"><DashboardPage /></SuspensePage>} />
        <Route path={ROUTES.GOALS} element={<SuspensePage featureName="Metas"><GoalsPage /></SuspensePage>} />
        <Route path={ROUTES.INDICATORS} element={<SuspensePage featureName="Indicadores"><IndicatorsPage /></SuspensePage>} />
        <Route path={ROUTES.ACTION_PLANS} element={<SuspensePage featureName="Planos de Ação"><ActionPlansPage /></SuspensePage>} />
        <Route path={ROUTES.ACTION_PLANS_DASHBOARD} element={<SuspensePage featureName="Planos de Ação"><ActionPlanDashboard /></SuspensePage>} />
        <Route path={ROUTES.ACTION_PLANS_KANBAN} element={<SuspensePage featureName="Planos de Ação"><ActionPlanKanban /></SuspensePage>} />
        <Route path={ROUTES.ACTION_PLANS_TIMELINE} element={<SuspensePage featureName="Planos de Ação"><ActionPlanTimeline /></SuspensePage>} />
        <Route path={ROUTES.INITIATIVES} element={<SuspensePage featureName="Iniciativas"><InitiativesPage /></SuspensePage>} />
        <Route path={ROUTES.AREAS} element={<SuspensePage featureName="Áreas"><AreasPage /></SuspensePage>} />
        <Route path={ROUTES.CAPACITY} element={<SuspensePage featureName="Capacidade"><CapacityPage /></SuspensePage>} />
        <Route path={ROUTES.MONETIZATION} element={<SuspensePage featureName="Monetização"><MonetizationPage /></SuspensePage>} />
        <Route path={ROUTES.FINANCE} element={<SuspensePage featureName="Financeiro"><FinancePage /></SuspensePage>} />
        <Route path={ROUTES.CALENDAR} element={<SuspensePage featureName="Calendário"><CalendarPage /></SuspensePage>} />
        <Route path={ROUTES.REPORTS} element={<SuspensePage featureName="Relatórios"><ReportsPage /></SuspensePage>} />
        <Route path={ROUTES.SETTINGS} element={<SuspensePage featureName="Configurações"><SettingsPage /></SuspensePage>} />

        {/* Route groups */}
        {adminRoutes()}
        {governanceRoutes()}
        {analyticsRoutes()}
        {planningRoutes()}
        {strategyRoutes()}
      </Route>

      {/* Fallback routes */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

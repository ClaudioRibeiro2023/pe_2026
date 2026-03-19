import { ROUTES } from '@/shared/config/routes'

export const loadDashboardPage = () => import('@/features/dashboard/pages/DashboardPage')
export const loadAdminPage = () => import('@/features/admin/pages/AdminPage')
export const loadCalendarPage = () => import('@/features/calendar/pages/CalendarPage')
export const loadGoalsPage = () => import('@/features/goals/pages/GoalsPage')
export const loadIndicatorsPage = () => import('@/features/indicators/pages/IndicatorsPage')
export const loadActionPlansPage = () => import('@/features/action-plans/pages/ActionPlansPage')
export const loadInitiativesPage = () => import('@/features/initiatives/pages/InitiativesPage')
export const loadAreasPage = () => import('@/features/areas/pages/AreasPage')
export const loadCapacityPage = () => import('@/features/capacity/pages/CapacityPage')
export const loadMonetizationPage = () => import('@/features/monetization/pages/MonetizationPage')
export const loadFinancePage = () => import('@/features/finance/pages/FinancePage')
export const loadReportsPage = () => import('@/features/reports/pages/ReportsPage')
export const loadSettingsPage = () => import('@/features/settings/pages/SettingsPage')
export const loadGovernanceDecisionsPage = () =>
  import('@/features/governance/pages/GovernanceDecisionsPage')
export const loadGovernanceRisksPage = () => import('@/features/governance/pages/GovernanceRisksPage')
export const loadGovernanceEvidencesPage = () =>
  import('@/features/governance/pages/GovernanceEvidencesPage')
export const loadGovernanceTraceabilityPage = () =>
  import('@/features/governance/pages/GovernanceTraceabilityPage')
export const loadStrategyOverviewPage = () => import('@/features/strategy/pages/StrategyOverviewPage')
export const loadStrategyScenariosPage = () => import('@/features/strategy/pages/StrategyScenariosPage')
export const loadStrategyRisksPage = () => import('@/features/strategy/pages/StrategyRisksPage')
export const loadStrategyKpisPage = () => import('@/features/strategy/pages/StrategyKpisPage')
export const loadStrategyOkrsPage = () => import('@/features/strategy/pages/StrategyOkrsPage')

export const routePreloaders: Record<string, () => Promise<unknown>> = {
  [ROUTES.DASHBOARD]: loadDashboardPage,
  [ROUTES.ADMIN]: loadAdminPage,
  [ROUTES.CALENDAR]: loadCalendarPage,
  [ROUTES.GOALS]: loadGoalsPage,
  [ROUTES.INDICATORS]: loadIndicatorsPage,
  [ROUTES.ACTION_PLANS]: loadActionPlansPage,
  [ROUTES.INITIATIVES]: loadInitiativesPage,
  [ROUTES.AREAS]: loadAreasPage,
  [ROUTES.CAPACITY]: loadCapacityPage,
  [ROUTES.MONETIZATION]: loadMonetizationPage,
  [ROUTES.FINANCE]: loadFinancePage,
  [ROUTES.REPORTS]: loadReportsPage,
  [ROUTES.SETTINGS]: loadSettingsPage,
  [ROUTES.GOVERNANCE_DECISIONS]: loadGovernanceDecisionsPage,
  [ROUTES.GOVERNANCE_RISKS]: loadGovernanceRisksPage,
  [ROUTES.GOVERNANCE_EVIDENCES]: loadGovernanceEvidencesPage,
  [ROUTES.GOVERNANCE_TRACEABILITY]: loadGovernanceTraceabilityPage,
  [ROUTES.STRATEGY_OVERVIEW]: loadStrategyOverviewPage,
  [ROUTES.STRATEGY_SCENARIOS]: loadStrategyScenariosPage,
  [ROUTES.STRATEGY_RISKS]: loadStrategyRisksPage,
  [ROUTES.STRATEGY_KPIS]: loadStrategyKpisPage,
  [ROUTES.STRATEGY_OKRS]: loadStrategyOkrsPage,
}

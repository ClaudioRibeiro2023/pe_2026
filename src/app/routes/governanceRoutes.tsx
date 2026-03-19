import { lazy } from 'react'
import { Route } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import { SuspensePage } from './SuspensePage'

const GovernanceDecisionsPage = lazy(() =>
  import('@/features/governance/pages/GovernanceDecisionsPage').then((m) => ({ default: m.GovernanceDecisionsPage }))
)
const GovernanceRisksPage = lazy(() =>
  import('@/features/governance/pages/GovernanceRisksPage').then((m) => ({ default: m.GovernanceRisksPage }))
)
const GovernanceEvidencesPage = lazy(() =>
  import('@/features/governance/pages/GovernanceEvidencesPage').then((m) => ({ default: m.GovernanceEvidencesPage }))
)
const GovernanceTraceabilityPage = lazy(() =>
  import('@/features/governance/pages/GovernanceTraceabilityPage').then((m) => ({ default: m.GovernanceTraceabilityPage }))
)
const ClosingsListPage = lazy(() =>
  import('@/features/closings/pages/ClosingsListPage').then((m) => ({ default: m.ClosingsListPage }))
)
const ClosingDetailsPage = lazy(() =>
  import('@/features/closings/pages/ClosingDetailsPage').then((m) => ({ default: m.ClosingDetailsPage }))
)
const ClosingsComparePage = lazy(() =>
  import('@/features/closings/pages/ClosingsComparePage').then((m) => ({ default: m.ClosingsComparePage }))
)

export function governanceRoutes() {
  return (
    <>
      <Route path={ROUTES.GOVERNANCE_DECISIONS} element={<SuspensePage featureName="Governança"><GovernanceDecisionsPage /></SuspensePage>} />
      <Route path={ROUTES.GOVERNANCE_RISKS} element={<SuspensePage featureName="Governança"><GovernanceRisksPage /></SuspensePage>} />
      <Route path={ROUTES.GOVERNANCE_EVIDENCES} element={<SuspensePage featureName="Governança"><GovernanceEvidencesPage /></SuspensePage>} />
      <Route path={ROUTES.GOVERNANCE_TRACEABILITY} element={<SuspensePage featureName="Governança"><GovernanceTraceabilityPage /></SuspensePage>} />

      {/* Closings Module */}
      <Route path={ROUTES.GOVERNANCE_CLOSINGS_COMPARE} element={<SuspensePage featureName="Fechamentos"><ClosingsComparePage /></SuspensePage>} />
      <Route path={ROUTES.GOVERNANCE_CLOSINGS_DETAIL} element={<SuspensePage featureName="Fechamentos"><ClosingDetailsPage /></SuspensePage>} />
      <Route path={ROUTES.GOVERNANCE_CLOSINGS} element={<SuspensePage featureName="Fechamentos"><ClosingsListPage /></SuspensePage>} />
    </>
  )
}

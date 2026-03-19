import { lazy } from 'react'
import { Route } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import { SuspensePage } from './SuspensePage'

const StrategyLayout = lazy(() =>
  import('@/features/strategy/pages/StrategyLayout').then((m) => ({ default: m.StrategyLayout }))
)
const StrategyOverviewPage = lazy(() =>
  import('@/features/strategy/pages/StrategyOverviewPage').then((m) => ({ default: m.StrategyOverviewPage }))
)
const StrategyThesisPage = lazy(() =>
  import('@/features/strategy/pages/StrategyThesisPage').then((m) => ({ default: m.StrategyThesisPage }))
)
const StrategyPillarsPage = lazy(() =>
  import('@/features/strategy/pages/StrategyPillarsPage').then((m) => ({ default: m.StrategyPillarsPage }))
)
const StrategyScenariosPage = lazy(() =>
  import('@/features/strategy/pages/StrategyScenariosPage').then((m) => ({ default: m.StrategyScenariosPage }))
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

export function strategyRoutes() {
  return (
    <Route path={ROUTES.STRATEGY} element={<SuspensePage featureName="Estratégia"><StrategyLayout /></SuspensePage>}>
      <Route index element={<SuspensePage featureName="Estratégia"><StrategyOverviewPage /></SuspensePage>} />
      <Route path="thesis" element={<SuspensePage featureName="Estratégia"><StrategyThesisPage /></SuspensePage>} />
      <Route path="pillars" element={<SuspensePage featureName="Estratégia"><StrategyPillarsPage /></SuspensePage>} />
      <Route path="okrs" element={<SuspensePage featureName="Estratégia"><StrategyOkrsPage /></SuspensePage>} />
      <Route path="kpis" element={<SuspensePage featureName="Estratégia"><StrategyKpisPage /></SuspensePage>} />
      <Route path="scenarios" element={<SuspensePage featureName="Estratégia"><StrategyScenariosPage /></SuspensePage>} />
      <Route path="risks" element={<SuspensePage featureName="Estratégia"><StrategyRisksPage /></SuspensePage>} />
    </Route>
  )
}

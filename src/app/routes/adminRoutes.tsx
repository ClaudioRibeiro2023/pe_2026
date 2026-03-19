import { lazy } from 'react'
import { Route } from 'react-router-dom'
import { RequireRole } from '../guards/RequireRole'
import { ROUTES } from '@/shared/config/routes'
import { SuspensePage } from './SuspensePage'

const AdminPage = lazy(() =>
  import('@/features/admin/pages/AdminPage').then((m) => ({ default: m.AdminPage }))
)
const ContextManagerPage = lazy(() =>
  import('@/features/admin/pages/ContextManagerPage').then((m) => ({ default: m.ContextManagerPage }))
)
const LegacyMigrationPage = lazy(() =>
  import('@/features/admin/pages/LegacyMigrationPage').then((m) => ({ default: m.LegacyMigrationPage }))
)
const ValidationPage = lazy(() =>
  import('@/features/admin/pages/ValidationPage').then((m) => ({ default: m.ValidationPage }))
)

export function adminRoutes() {
  return (
    <>
      <Route path={ROUTES.ADMIN} element={<SuspensePage featureName="Admin"><RequireRole allowedRoles={['admin']}><AdminPage /></RequireRole></SuspensePage>} />
      <Route path={ROUTES.ADMIN_CONTEXTS} element={<SuspensePage featureName="Admin"><RequireRole allowedRoles={['admin']}><ContextManagerPage /></RequireRole></SuspensePage>} />
      <Route path={ROUTES.ADMIN_MIGRATION} element={<SuspensePage featureName="Admin"><RequireRole allowedRoles={['admin']}><LegacyMigrationPage /></RequireRole></SuspensePage>} />
      <Route path={ROUTES.ADMIN_VALIDATION} element={<SuspensePage featureName="Admin"><ValidationPage /></SuspensePage>} />
    </>
  )
}

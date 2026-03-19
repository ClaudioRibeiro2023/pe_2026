import { Suspense, type ReactNode } from 'react'
import { PageLoader } from '@/shared/ui/Loader'
import { FeatureErrorBoundary } from '@/shared/components/error-boundary/FeatureErrorBoundary'

export function SuspensePage({ children, featureName }: { children: ReactNode; featureName?: string }) {
  return (
    <FeatureErrorBoundary featureName={featureName}>
      <Suspense fallback={<PageLoader text="Carregando..." />}>{children}</Suspense>
    </FeatureErrorBoundary>
  )
}

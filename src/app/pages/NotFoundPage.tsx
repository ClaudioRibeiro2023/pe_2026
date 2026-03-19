import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { ROUTES } from '@/shared/config/routes'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-muted">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mt-4">
          Página não encontrada
        </h2>
        <p className="text-muted mt-2 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Link to={ROUTES.DASHBOARD}>
            <Button>
              <Home className="h-4 w-4" />
              Ir para Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

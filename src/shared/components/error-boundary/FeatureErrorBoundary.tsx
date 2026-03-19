import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from '@/shared/ui/icons'

interface Props {
  children: ReactNode
  featureName?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[FeatureErrorBoundary] ${this.props.featureName || 'Unknown'}:`, error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-warning mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Erro em {this.props.featureName || 'módulo'}
          </h2>
          <p className="text-sm text-muted mb-4 max-w-md">
            Ocorreu um erro inesperado nesta seção. As demais funcionalidades continuam operando normalmente.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-xs text-danger bg-danger-50 p-3 rounded-lg mb-4 max-w-lg overflow-auto">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

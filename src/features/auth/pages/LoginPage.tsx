import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../AuthProvider'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useToast } from '@/shared/ui/Toast'
import { PageLoader } from '@/shared/ui/Loader'
import { ROUTES } from '@/shared/config/routes'
import { env } from '@/shared/config/env'
import { supabase } from '@/shared/lib/supabaseClient'
import { ArrowLeft, BarChart3, Target, TrendingUp } from '@/shared/ui/icons'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

const recoverySchema = z.object({
  email: z.string().email('Email inválido'),
})

type LoginForm = z.infer<typeof loginSchema>
type RecoveryForm = z.infer<typeof recoverySchema>

function FeatureItem({ icon: Icon, title, description }: { icon: typeof BarChart3; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm text-white/70 mt-0.5">{description}</p>
      </div>
    </div>
  )
}

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isRecovery, setIsRecovery] = useState(false)
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState<string | null>(null)
  const { signIn, signUp, user, loading: authLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const from = (location.state as { from?: Location })?.from?.pathname || ROUTES.DASHBOARD

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const {
    register: registerRecovery,
    handleSubmit: handleSubmitRecovery,
    formState: { errors: errorsRecovery },
  } = useForm<RecoveryForm>({
    resolver: zodResolver(recoverySchema),
  })

  // Show loader while checking auth or redirecting
  if (authLoading) {
    return <PageLoader text="Verificando autenticação..." />
  }

  // Don't render login form if user is authenticated (redirect will happen)
  if (user) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    const { error, needsEmailConfirmation } = isSignUp 
      ? await signUp(data.email, data.password)
      : await signIn(data.email, data.password)
    setLoading(false)

    if (error) {
      addToast({
        type: 'error',
        title: isSignUp ? 'Erro ao criar conta' : 'Erro ao entrar',
        message: error,
      })

      if (needsEmailConfirmation) {
        setPendingConfirmationEmail(data.email)
      }
      return
    }

    if (needsEmailConfirmation) {
      setPendingConfirmationEmail(data.email)
      addToast({
        type: 'info',
        title: 'Confirme seu email',
        message: 'Enviamos um link de confirmação. Confirme o email para concluir o acesso.',
      })
      return
    }

    addToast({
      type: 'success',
      title: isSignUp ? 'Conta criada!' : 'Bem-vindo!',
      message: isSignUp ? 'Sua conta foi criada com sucesso.' : 'Login realizado com sucesso.',
    })

    navigate(from, { replace: true })
  }

  const handleResendConfirmation = async () => {
    if (!pendingConfirmationEmail) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingConfirmationEmail,
      })

      if (error) throw error

      addToast({
        type: 'success',
        title: 'Email reenviado!',
        message: 'Verifique sua caixa de entrada para confirmar sua conta.',
      })
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Não foi possível reenviar',
        message: error.message || 'Tente novamente em instantes.',
      })
    } finally {
      setLoading(false)
    }
  }

  const onRecoverySubmit = async (data: RecoveryForm) => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      addToast({
        type: 'success',
        title: 'Email enviado!',
        message: 'Verifique sua caixa de entrada para redefinir sua senha.',
      })

      setIsRecovery(false)
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Erro ao enviar email',
        message: error.message || 'Não foi possível enviar o email de recuperação.',
      })
    } finally {
      setLoading(false)
    }
  }

  // Layout split com gradiente
  const LeftPanel = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-950 p-12 flex-col justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-lg">PE</span>
          </div>
          <span className="text-white font-semibold text-xl">{env.appName}</span>
        </div>
      </div>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Planejamento Estratégico
          </h1>
          <p className="text-white/80 text-lg mt-4">
            Gerencie metas, indicadores e planos de ação em uma única plataforma.
          </p>
        </div>
        
        <div className="space-y-6">
          <FeatureItem 
            icon={Target} 
            title="Metas & Indicadores" 
            description="Acompanhe o progresso em tempo real"
          />
          <FeatureItem 
            icon={BarChart3} 
            title="Dashboards Inteligentes" 
            description="Visualize dados de forma clara e objetiva"
          />
          <FeatureItem 
            icon={TrendingUp} 
            title="Análises & Insights" 
            description="Tome decisões baseadas em dados"
          />
        </div>
      </div>
      
      <p className="text-white/50 text-sm">
        © 2026 Aero Engenharia. Todos os direitos reservados.
      </p>
    </div>
  )

  // Formulário de recuperação
  if (isRecovery) {
    return (
      <div className="min-h-screen flex">
        <LeftPanel />
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">PE</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Recuperar Senha</h2>
              <p className="text-muted mt-2">
                Digite seu email para receber instruções
              </p>
            </div>

            <form onSubmit={handleSubmitRecovery(onRecoverySubmit)} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                error={errorsRecovery.email?.message}
                {...registerRecovery('email')}
              />
              <Button type="submit" className="w-full" loading={loading}>
                Enviar Email
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsRecovery(false)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para login
              </button>
            </div>

            {!env.supabaseUrl && (
              <div className="mt-6 p-4 bg-warning-50 border border-warning-100 rounded-lg">
                <p className="text-sm text-warning-700">
                  <strong>Modo Demo:</strong> Recuperação requer Supabase.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Formulário principal de login/signup
  return (
    <div className="min-h-screen flex">
      <LeftPanel />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">PE</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}
            </h2>
            <p className="text-muted mt-2">
              {isSignUp ? 'Preencha os dados para criar sua conta' : 'Entre com suas credenciais'}
            </p>
          </div>

          {pendingConfirmationEmail && (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-lg">
              <p className="text-sm text-primary-800">
                Confirmação pendente para <strong>{pendingConfirmationEmail}</strong>.
              </p>
              <button
                type="button"
                onClick={handleResendConfirmation}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                disabled={loading}
              >
                Reenviar confirmação
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            
            {!isSignUp && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsRecovery(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              {isSignUp ? 'Criar Conta' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted text-sm">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem conta?'}{' '}
            </span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {isSignUp ? 'Entre aqui' : 'Crie uma'}
            </button>
          </div>

          {!env.supabaseUrl && (
            <div className="mt-6 p-4 bg-warning-50 border border-warning-100 rounded-lg">
              <p className="text-sm text-warning-700">
                <strong>Modo Demo:</strong> Qualquer credencial será aceita.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

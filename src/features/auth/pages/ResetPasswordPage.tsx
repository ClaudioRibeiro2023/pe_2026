import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { useToast } from '@/shared/ui/Toast'
import { getErrorMessage } from '@/shared/lib/errorUtils'
import { ROUTES } from '@/shared/config/routes'
import { env } from '@/shared/config/env'
import { supabase } from '@/shared/lib/supabaseClient'
import { Lock, CheckCircle } from '@/shared/ui/icons'

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    // Verificar se há um token de recuperação válido na URL
    const checkRecoveryToken = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setValidToken(true)
      } else {
        addToast({
          type: 'error',
          title: 'Link inválido',
          message: 'O link de recuperação é inválido ou expirou.',
        })
        setTimeout(() => navigate(ROUTES.LOGIN), 3000)
      }
    }

    checkRecoveryToken()
  }, [navigate, addToast])

  const onSubmit = async (data: ResetPasswordForm) => {
    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) throw error

      setSuccess(true)
      addToast({
        type: 'success',
        title: 'Senha redefinida!',
        message: 'Sua senha foi redefinida com sucesso.',
      })

      // Redirecionar para login após 3 segundos
      setTimeout(() => navigate(ROUTES.LOGIN), 3000)
    } catch (error: unknown) {
      addToast({
        type: 'error',
        title: 'Erro ao redefinir senha',
        message: getErrorMessage(error),
      })
    } finally {
      setLoading(false)
    }
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
              <p className="text-muted">Verificando link de recuperação...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Senha Redefinida!</CardTitle>
            <p className="text-muted mt-2">
              Sua senha foi redefinida com sucesso.
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted">
              Você será redirecionado para a página de login em instantes...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
          <p className="text-muted mt-2">
            Digite sua nova senha
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nova Senha"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="bg-accent p-3 rounded-lg text-sm text-muted">
              <p className="font-medium mb-1">Requisitos da senha:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mínimo de 6 caracteres</li>
                <li>Recomendado: letras, números e símbolos</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Redefinir Senha
            </Button>
          </form>

          {!env.supabaseUrl && (
            <div className="mt-4 p-3 bg-warning-50 border border-warning-500 rounded-lg">
              <p className="text-sm text-warning-700">
                <strong>Modo Demo:</strong> Redefinição de senha requer Supabase configurado.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

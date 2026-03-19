import { useState, useEffect } from 'react'
import { Users, Shield, UserCheck, UserX, Mail, Building2 } from '@/shared/ui/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { LazyModal } from '@/shared/ui/LazyModal'
import { Select } from '@/shared/ui/Select'
import { Input } from '@/shared/ui/Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table'
import { PageLoader } from '@/shared/ui/Loader'
import { useToast } from '@/shared/ui/Toast'
import { ROUTES } from '@/shared/config/routes'
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabaseClient'
import { useAreas } from '@/features/areas/hooks'

interface UserProfile {
  id: string
  user_id: string
  email: string
  role: string
  active: boolean
  area_id: string | null
  area_name?: string
  area_role: 'gestor' | 'colaborador' | null
  created_at: string
}

export function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedAreaId, setSelectedAreaId] = useState<string>('')
  const [selectedAreaRole, setSelectedAreaRole] = useState<string>('colaborador')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('colaborador')
  const [inviteAreaId, setInviteAreaId] = useState<string>('')
  const [inviteAreaRole, setInviteAreaRole] = useState<string>('colaborador')
  const [inviteLoading, setInviteLoading] = useState(false)
  const { addToast } = useToast()
  const isSupabaseReady = isSupabaseConfigured()
  const { data: areas = [] } = useAreas()

  useEffect(() => {
    loadUsers()
  }, [])

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'direcao', label: 'Direção' },
    { value: 'gestor', label: 'Gestor' },
    { value: 'colaborador', label: 'Colaborador' },
    { value: 'cliente', label: 'Cliente' },
  ]

  const areaOptions = [
    { value: '', label: 'Sem área definida' },
    ...areas.map((area) => ({ value: area.id, label: area.name })),
  ]

  const areaRoleOptions = [
    { value: 'colaborador', label: 'Colaborador da Área' },
    { value: 'gestor', label: 'Gestor da Área' },
  ]

  const loadUsers = async () => {
    try {
      setLoading(true)

      if (!isSupabaseReady) {
        setUsers([
          { id: 'p-1', user_id: 'demo-user', email: 'admin@empresa.com', role: 'admin', active: true, area_id: null, area_name: undefined, area_role: null, created_at: '2026-01-01T00:00:00Z' },
          { id: 'p-2', user_id: 'user-dir', email: 'direcao@empresa.com', role: 'direcao', active: true, area_id: null, area_name: undefined, area_role: null, created_at: '2026-01-01T00:00:00Z' },
          { id: 'p-3', user_id: 'user-1', email: 'gestor.rh@empresa.com', role: 'gestor', active: true, area_id: 'area-rh', area_name: 'Recursos Humanos', area_role: 'gestor', created_at: '2026-01-01T00:00:00Z' },
          { id: 'p-4', user_id: 'user-2', email: 'gestor.mkt@empresa.com', role: 'gestor', active: true, area_id: 'area-mkt', area_name: 'Marketing', area_role: 'gestor', created_at: '2026-01-05T00:00:00Z' },
          { id: 'p-5', user_id: 'user-3', email: 'gestor.ops@empresa.com', role: 'gestor', active: true, area_id: 'area-ops', area_name: 'Operações', area_role: 'gestor', created_at: '2026-01-02T00:00:00Z' },
          { id: 'p-6', user_id: 'user-4', email: 'gestor.ti@empresa.com', role: 'gestor', active: true, area_id: 'area-ti', area_name: 'Tecnologia', area_role: 'gestor', created_at: '2026-01-03T00:00:00Z' },
          { id: 'p-7', user_id: 'user-5', email: 'gestor.fin@empresa.com', role: 'gestor', active: true, area_id: 'area-fin', area_name: 'Financeiro', area_role: 'gestor', created_at: '2026-01-10T00:00:00Z' },
          { id: 'p-8', user_id: 'user-6', email: 'colab.rh@empresa.com', role: 'colaborador', active: true, area_id: 'area-rh', area_name: 'Recursos Humanos', area_role: 'colaborador', created_at: '2026-01-15T00:00:00Z' },
          { id: 'p-9', user_id: 'user-cli', email: 'cliente@parceiro.com', role: 'cliente', active: false, area_id: null, area_name: undefined, area_role: null, created_at: '2026-02-01T00:00:00Z' },
        ])
        return
      }

      const { data, error } = await supabase.rpc('get_all_profiles')
      
      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os usuários.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInviteUser = async () => {
    const trimmedEmail = inviteEmail.trim()
    if (!trimmedEmail) {
      addToast({
        type: 'error',
        title: 'Email obrigatório',
        message: 'Informe o email para enviar o convite.',
      })
      return
    }

    if (!isSupabaseReady) {
      addToast({
        type: 'error',
        title: 'Supabase não configurado',
        message: 'Configure as variáveis do Supabase para enviar convites.',
      })
      return
    }

    try {
      setInviteLoading(true)
      const { error } = await supabase.functions.invoke('invite-user', {
        body: {
          email: trimmedEmail,
          role: inviteRole,
          redirectTo: `${window.location.origin}${ROUTES.LOGIN}`,
        },
      })

      if (error) throw error

      addToast({
        type: 'success',
        title: 'Convite enviado',
        message: 'O usuário recebeu o convite por email.',
      })

      setInviteModalOpen(false)
      setInviteEmail('')
      setInviteRole('colaborador')
      loadUsers()
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Erro ao enviar convite',
        message: error?.message || 'Não foi possível enviar o convite.',
      })
    } finally {
      setInviteLoading(false)
    }
  }

  const handleUpdateRole = async () => {
    if (!editingUser || !selectedRole) return

    try {
      const { error } = await supabase.rpc('update_user_role', {
        target_user_id: editingUser.user_id,
        new_role: selectedRole,
      })

      if (error) throw error

      // Atualizar área e area_role
      if (selectedAreaId !== (editingUser.area_id || '') || selectedAreaRole !== (editingUser.area_role || 'colaborador')) {
        const { error: areaError } = await supabase.rpc('update_user_area', {
          target_user_id: editingUser.user_id,
          new_area_id: selectedAreaId || null,
          new_area_role: selectedAreaId ? selectedAreaRole : 'colaborador',
        })

        if (areaError) throw areaError
      }

      addToast({
        type: 'success',
        title: 'Usuário atualizado',
        message: 'Role e área do usuário foram atualizados com sucesso.',
      })

      setEditingUser(null)
      loadUsers()
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar o usuário.',
      })
    }
  }

  const handleToggleActive = async (user: UserProfile) => {
    try {
      const { error } = await supabase.rpc('toggle_user_active', {
        target_user_id: user.user_id,
        is_active: !user.active,
      })

      if (error) throw error

      addToast({
        type: 'success',
        title: user.active ? 'Usuário desativado' : 'Usuário ativado',
        message: `O usuário foi ${user.active ? 'desativado' : 'ativado'} com sucesso.`,
      })

      loadUsers()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      addToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível alterar o status do usuário.',
      })
    }
  }

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-danger-100 text-danger-700',
      direcao: 'bg-purple-100 text-purple-700',
      gestor: 'bg-primary-100 text-primary-700',
      colaborador: 'bg-success-100 text-success-700',
      cliente: 'bg-accent text-muted',
    }
    return colors[role as keyof typeof colors] || colors.cliente
  }

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: <Shield className="h-4 w-4" />,
      direcao: <Shield className="h-4 w-4" />,
      gestor: <Users className="h-4 w-4" />,
      colaborador: <UserCheck className="h-4 w-4" />,
      cliente: <Mail className="h-4 w-4" />,
    }
    return icons[role as keyof typeof icons] || icons.cliente
  }

  if (loading) {
    return <PageLoader text="Carregando usuários..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Administração</h1>
          <p className="text-muted mt-1">
            Gerencie usuários e permissões do sistema
          </p>
        </div>
        <Button onClick={() => setInviteModalOpen(true)}>
          <Mail className="h-4 w-4" />
          Convidar usuário
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Total de Usuários</p>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Ativos</p>
                <p className="text-2xl font-bold text-success-600">
                  {users.filter(u => u.active).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Inativos</p>
                <p className="text-2xl font-bold text-danger-600">
                  {users.filter(u => !u.active).length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-danger-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Administradores</p>
                <p className="text-2xl font-bold text-primary-600">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-sm text-foreground">{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.area_name ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                        <Building2 className="h-3 w-3" />
                        {user.area_name}
                      </span>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.active 
                        ? 'bg-success-100 text-success-700' 
                        : 'bg-accent text-muted'
                    }`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingUser(user)
                          setSelectedRole(user.role)
                          setSelectedAreaId(user.area_id || '')
                          setSelectedAreaRole(user.area_role || 'colaborador')
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant={user.active ? 'outline' : 'primary'}
                        onClick={() => handleToggleActive(user)}
                      >
                        {user.active ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <LazyModal
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Editar Usuário"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted mb-2">
              Usuário: <strong>{editingUser?.email}</strong>
            </p>
            <div className="space-y-3">
              <Select
                label="Role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                options={roleOptions}
              />
              <Select
                label="Área"
                value={selectedAreaId}
                onChange={(e) => setSelectedAreaId(e.target.value)}
                options={areaOptions}
              />
              {selectedAreaId && (
                <Select
                  label="Função na Área"
                  value={selectedAreaRole}
                  onChange={(e) => setSelectedAreaRole(e.target.value)}
                  options={areaRoleOptions}
                />
              )}
            </div>
          </div>

          <div className="bg-accent p-3 rounded-lg text-sm text-muted">
            <p className="font-medium mb-1">Permissões:</p>
            <ul className="list-disc list-inside space-y-1">
              {selectedRole === 'admin' && (
                <>
                  <li>Acesso total ao sistema</li>
                  <li>Gerenciar usuários e permissões</li>
                  <li>Todas as funcionalidades</li>
                </>
              )}
              {selectedRole === 'direcao' && (
                <>
                  <li>Aprovar planos, ações e evidências</li>
                  <li>Visão consolidada de todas as áreas</li>
                  <li>Acesso a governança e auditoria</li>
                </>
              )}
              {selectedRole === 'gestor' && (
                <>
                  <li>Criar e editar metas e indicadores da área</li>
                  <li>Gerenciar planos de ação da área</li>
                  <li>Aprovar ações e evidências</li>
                </>
              )}
              {selectedRole === 'colaborador' && (
                <>
                  <li>Visualizar metas e indicadores da área</li>
                  <li>Editar planos de ação atribuídos</li>
                  <li>Adicionar comentários e evidências</li>
                </>
              )}
              {selectedRole === 'cliente' && (
                <>
                  <li>Visualizar dashboards</li>
                  <li>Acesso somente leitura</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateRole}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </LazyModal>

      {/* Invite User Modal */}
      <LazyModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Convidar novo usuário"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Envie um convite por email para liberar acesso ao painel.
          </p>
          {!isSupabaseReady && (
            <div className="rounded-lg border border-warning-200 bg-warning-50 p-3 text-sm text-warning-700">
              Convites exigem Supabase configurado e a edge function invite-user publicada.
            </div>
          )}
          <Input
            label="Email"
            type="email"
            placeholder="usuario@empresa.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            disabled={inviteLoading || !isSupabaseReady}
          />
          <Select
            label="Role inicial"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            options={roleOptions}
            disabled={inviteLoading || !isSupabaseReady}
          />
          <Select
            label="Área"
            value={inviteAreaId}
            onChange={(e) => setInviteAreaId(e.target.value)}
            options={areaOptions}
            disabled={inviteLoading || !isSupabaseReady}
          />
          {inviteAreaId && (
            <Select
              label="Função na Área"
              value={inviteAreaRole}
              onChange={(e) => setInviteAreaRole(e.target.value)}
              options={areaRoleOptions}
              disabled={inviteLoading || !isSupabaseReady}
            />
          )}
          <div className="rounded-lg border border-border bg-accent p-3 text-xs text-muted">
            O convite direciona para {window.location.origin}{ROUTES.LOGIN}.
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInviteUser} loading={inviteLoading} disabled={!isSupabaseReady}>
              Enviar convite
            </Button>
          </div>
        </div>
      </LazyModal>
    </div>
  )
}

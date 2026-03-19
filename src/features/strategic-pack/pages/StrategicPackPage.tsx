import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Download } from '@/shared/ui/icons'
import { Button } from '@/shared/ui/Button'
import { PageLoader } from '@/shared/ui/Loader'
import { useToast } from '@/shared/ui/Toast'
import { useAuth } from '@/features/auth/AuthProvider'
import { 
  PackHeader, 
  PackTabs, 
  SectionContent, 
  AttachmentList, 
  PackComments,
  ChangelogList,
  ObjectivesList,
  KpiTable,
  ProgramCard,
  GovernanceRituals,
  GeneratePlanButton,
  MonthlyCloseButton
} from '../components'
import { useActionsByPackId } from '@/features/area-plans/hooks'
import { useEvidenceBacklog } from '@/features/area-plans/hooks'
import { 
  useStrategicPackFull, 
  useUpdatePack,
  useUpdateSection,
  useUpdateSectionStructuredData,
  useUploadAttachment,
  useDeleteAttachment,
  usePackComments,
  useCreateComment,
  useResolveComment,
  usePackChangelog,
} from '../hooks'
import type { SectionKey, Objective, Kpi, Program, Ritual, MeetingMinutes, ObjectivesData, ProgramsData, GovernanceData } from '../types'
import { exportPackToPDF } from '@/shared/lib/pdf/exportPacks'

interface StrategicPackPageProps {
  areaSlug: string
  areaName: string
  year?: number
}

export function StrategicPackPage({ 
  areaSlug, 
  areaName, 
  year = new Date().getFullYear() 
}: StrategicPackPageProps) {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<SectionKey>('overview')

  const { data: pack, isLoading, error } = useStrategicPackFull(areaSlug, year)
  const { data: comments = [] } = usePackComments(pack?.id)
  const { data: changelog = [] } = usePackChangelog(pack?.id)
  const { data: packActions = [] } = useActionsByPackId(pack?.id)
  const { data: evidenceBacklog = [] } = useEvidenceBacklog()
  
  // Filter evidences by area and calculate counts
  const evidenceCounts = useMemo(() => {
    const areaEvidences = evidenceBacklog.filter(e => e.area_slug === areaSlug)
    const pending = areaEvidences.filter(e => e.evidence_status === 'PENDENTE').length
    const approved = areaEvidences.filter(e => e.evidence_status === 'APROVADA' || e.evidence_status === 'APROVADA_GESTOR').length
    const rejected = areaEvidences.filter(e => e.evidence_status === 'REJEITADA').length
    return { pending, approved, rejected }
  }, [evidenceBacklog, areaSlug])

  const updatePack = useUpdatePack()
  const updateSection = useUpdateSection()
  const updateStructuredData = useUpdateSectionStructuredData()
  const uploadAttachment = useUploadAttachment()
  const deleteAttachment = useDeleteAttachment()
  const createComment = useCreateComment()
  const resolveComment = useResolveComment()

  const activeSection = useMemo(() => 
    pack?.sections.find(s => s.key === activeTab),
    [pack?.sections, activeTab]
  )

  const sectionComments = useMemo(() => 
    comments.filter(c => c.section_id === activeSection?.id),
    [comments, activeSection?.id]
  )

  const sectionAttachments = useMemo(() => 
    pack?.attachments.filter(a => a.section_id === activeSection?.id || (activeTab === 'docs' && !a.section_id)) || [],
    [pack?.attachments, activeSection?.id, activeTab]
  )

  const commentCountsBySection = useMemo(() => {
    const counts: Record<SectionKey, number> = {
      overview: 0,
      diagnosis: 0,
      objectives: 0,
      programs: 0,
      governance: 0,
      docs: 0,
    }
    if (!pack) return counts
    
    comments.forEach(c => {
      if (c.status === 'open') {
        const section = pack.sections.find(s => s.id === c.section_id)
        if (section) {
          counts[section.key]++
        }
      }
    })
    return counts
  }, [pack, comments])

  const handleStatusChange = async (newStatus: 'review' | 'published' | 'archived') => {
    if (!pack) return
    try {
      await updatePack.mutateAsync({ 
        packId: pack.id, 
        data: { status: newStatus } 
      })
      addToast({
        type: 'success',
        title: 'Status atualizado',
        message: `Pack alterado para ${newStatus === 'review' ? 'Em Revisão' : newStatus === 'published' ? 'Publicado' : 'Arquivado'}`,
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao atualizar status',
        message: 'Não foi possível alterar o status do pack.',
      })
    }
  }

  const handleSectionUpdate = async (data: { body_markdown?: string; structured_data?: Record<string, unknown> }) => {
    if (!activeSection) return
    try {
      await updateSection.mutateAsync({
        sectionId: activeSection.id,
        data,
        actor: user?.email,
      })
      addToast({
        type: 'success',
        title: 'Seção atualizada',
        message: 'As alterações foram salvas.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao salvar',
        message: 'Não foi possível salvar as alterações.',
      })
    }
  }

  const handleStructuredDataUpdate = async (patch: Record<string, unknown>) => {
    if (!activeSection) return
    try {
      await updateStructuredData.mutateAsync({
        sectionId: activeSection.id,
        patch,
        actor: user?.email,
      })
      addToast({
        type: 'success',
        title: 'Dados atualizados',
        message: 'Os campos estruturados foram salvos.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao salvar',
        message: 'Não foi possível salvar os dados estruturados.',
      })
    }
  }

  // Helpers para extrair structured_data tipado
  const getObjectivesData = (): ObjectivesData => {
    const section = pack?.sections.find(s => s.key === 'objectives')
    return (section?.structured_data as ObjectivesData) || {}
  }

  const getProgramsData = (): ProgramsData => {
    const section = pack?.sections.find(s => s.key === 'programs')
    return (section?.structured_data as ProgramsData) || {}
  }

  const getGovernanceData = (): GovernanceData => {
    const section = pack?.sections.find(s => s.key === 'governance')
    return (section?.structured_data as GovernanceData) || {}
  }

  const handleUpload = async (file: File, tags?: string[]) => {
    if (!pack) return
    try {
      await uploadAttachment.mutateAsync({
        packId: pack.id,
        file,
        sectionId: activeTab === 'docs' ? undefined : activeSection?.id,
        tags,
        actor: user?.email,
      })
      addToast({
        type: 'success',
        title: 'Upload concluído',
        message: `Arquivo "${file.name}" enviado com sucesso.`,
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro no upload',
        message: 'Não foi possível enviar o arquivo.',
      })
    }
  }

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!pack || !confirm('Tem certeza que deseja excluir este documento?')) return
    try {
      await deleteAttachment.mutateAsync({
        attachmentId,
        packId: pack.id,
        actor: user?.email,
      })
      addToast({
        type: 'success',
        title: 'Documento excluído',
        message: 'O documento foi removido.',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir o documento.',
      })
    }
  }

  const handleAddComment = async (body: string) => {
    if (!pack) return
    try {
      await createComment.mutateAsync({
        data: {
          pack_id: pack.id,
          section_id: activeSection?.id,
          body,
        },
        actor: user?.email || 'anonymous',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao comentar',
        message: 'Não foi possível adicionar o comentário.',
      })
    }
  }

  const handleResolveComment = async (commentId: string) => {
    try {
      await resolveComment.mutateAsync({
        commentId,
        actor: user?.email || 'anonymous',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao resolver',
        message: 'Não foi possível resolver o comentário.',
      })
    }
  }

  const handleExportPDF = async () => {
    if (!pack) return
    try {
      const programs = getProgramsData().programs || []
      const objectives = getObjectivesData().objectives || []
      await exportPackToPDF({
        areaName,
        packName: pack.summary || `PE ${year}`,
        period: String(year),
        programs: programs.map((p: Program) => ({ key: p.key || '', label: p.name || '', count: 0 })),
        objectives: objectives.map((o: Objective) => ({ title: o.title || '', status: 'active', linkedActions: 0 })),
        kpis: [
          { label: 'Total Acoes', value: packActions.length },
          { label: 'Programas', value: programs.length },
          { label: 'Objetivos', value: objectives.length },
        ],
        actions: packActions.map(a => ({
          titulo: a.title,
          status: a.status,
          progresso: `${a.progress}%`,
          responsavel: a.responsible || '-',
          vencimento: a.due_date ? new Date(a.due_date).toLocaleDateString('pt-BR') : '-',
        })),
        actionColumns: [
          { header: 'Titulo', dataKey: 'titulo' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Progresso', dataKey: 'progresso' },
          { header: 'Responsavel', dataKey: 'responsavel' },
          { header: 'Vencimento', dataKey: 'vencimento' },
        ],
      })
      addToast({ type: 'success', title: 'PDF exportado' })
    } catch {
      addToast({ type: 'error', title: 'Erro ao exportar PDF' })
    }
  }

  if (isLoading) {
    return <PageLoader text="Carregando Strategic Pack..." />
  }

  if (error || !pack) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-foreground mb-2">Pack não encontrado</h3>
        <p className="text-muted mb-4">
          O Strategic Pack para {areaName} ({year}) não foi encontrado.
        </p>
        <Button onClick={() => navigate(`/planning/${areaSlug}/dashboard`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PackHeader 
        pack={pack}
        areaName={areaName}
        onPublish={() => handleStatusChange(pack.status === 'draft' ? 'review' : 'published')}
        onArchive={() => handleStatusChange('archived')}
        isUpdating={updatePack.isPending}
      />

      {/* Export PDF Button */}
      <div className="max-w-7xl mx-auto px-6 pt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={handleExportPDF}>
          <Download className="h-4 w-4" /> Exportar PDF
        </Button>
      </div>

      <PackTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        commentCounts={commentCountsBySection}
      />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Botão Gerar Plano de Ação - exibido apenas na tab overview */}
        {activeTab === 'overview' && pack.status !== 'archived' && (
          <div className="mb-6 p-4 bg-surface rounded-lg border border-border">
            <GeneratePlanButton
              packId={pack.id}
              areaSlug={areaSlug}
              areaName={areaName}
              year={year}
              programs={getProgramsData().programs || []}
              objectives={getObjectivesData().objectives || []}
            />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {activeSection && (
              <SectionContent
                section={activeSection}
                onUpdate={handleSectionUpdate}
                isUpdating={updateSection.isPending}
                readonly={pack.status === 'archived'}
              />
            )}

            {/* Structured Data Components por Tab */}
            {activeTab === 'objectives' && (
              <>
                <ObjectivesList
                  objectives={getObjectivesData().objectives || []}
                  packId={pack.id}
                  onUpdate={(objectives: Objective[]) => handleStructuredDataUpdate({ objectives })}
                  readonly={pack.status === 'archived'}
                />
                <KpiTable
                  kpis={getObjectivesData().kpis || []}
                  onUpdate={(kpis: Kpi[]) => handleStructuredDataUpdate({ kpis })}
                  readonly={pack.status === 'archived'}
                />
              </>
            )}

            {activeTab === 'programs' && (
              <ProgramCard
                programs={getProgramsData().programs || []}
                packId={pack.id}
                onUpdate={(programs: Program[]) => handleStructuredDataUpdate({ programs })}
                readonly={pack.status === 'archived'}
              />
            )}

            {activeTab === 'governance' && (
              <>
                <GovernanceRituals
                  rituals={getGovernanceData().rituals || []}
                  minutes={getGovernanceData().minutes || []}
                  onUpdateRituals={(rituals: Ritual[]) => handleStructuredDataUpdate({ rituals })}
                  onUpdateMinutes={(minutes: MeetingMinutes[]) => handleStructuredDataUpdate({ minutes })}
                  readonly={pack.status === 'archived'}
                />
                <MonthlyCloseButton
                  pack={pack}
                  areaName={areaName}
                  actions={packActions}
                  pendingEvidences={evidenceCounts.pending}
                  approvedEvidences={evidenceCounts.approved}
                  rejectedEvidences={evidenceCounts.rejected}
                />
              </>
            )}

            {activeTab === 'docs' && (
              <AttachmentList
                attachments={pack.attachments}
                onUpload={handleUpload}
                onDelete={handleDeleteAttachment}
                isUploading={uploadAttachment.isPending}
                readonly={pack.status === 'archived'}
              />
            )}

            {activeTab !== 'docs' && sectionAttachments.length > 0 && (
              <AttachmentList
                attachments={sectionAttachments}
                onUpload={handleUpload}
                onDelete={handleDeleteAttachment}
                isUploading={uploadAttachment.isPending}
                readonly={pack.status === 'archived'}
              />
            )}
          </div>

          <div className="space-y-6">
            <PackComments
              comments={sectionComments}
              onAddComment={handleAddComment}
              onResolveComment={handleResolveComment}
              isAdding={createComment.isPending}
              readonly={pack.status === 'archived'}
            />

            <ChangelogList changelog={changelog} maxItems={5} />

            <QuickLinks areaSlug={areaSlug} packId={pack.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickLinks({ areaSlug, packId }: { areaSlug: string; packId?: string }) {
  const packQuery = packId ? `&packId=${packId}` : ''
  const links = [
    { label: 'Plano de Ação', url: `/planning/${areaSlug}/dashboard` },
    { label: 'Kanban', url: `/planning/${areaSlug}/kanban` },
    { label: 'Timeline', url: `/planning/${areaSlug}/timeline` },
    { label: 'Evidências', url: `/planning/actions/evidences?areaSlug=${areaSlug}${packQuery}` },
    { label: 'Aprovações', url: `/planning/actions/approvals?areaSlug=${areaSlug}${packQuery}` },
  ]

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Links Rápidos</h3>
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.url}
            to={link.url}
            className="flex items-center justify-between text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1.5 rounded"
          >
            {link.label}
            <ExternalLink className="w-3 h-3" />
          </Link>
        ))}
      </div>
    </div>
  )
}

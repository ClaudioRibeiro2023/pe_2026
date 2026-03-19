import { z } from 'zod'

// ============================================================
// ENUMS
// ============================================================

export const packStatusSchema = z.enum(['draft', 'review', 'published', 'archived'])

export const sectionKeySchema = z.enum([
  'overview',
  'diagnosis',
  'objectives',
  'programs',
  'governance',
  'docs',
])

export const changeTypeSchema = z.enum([
  'created',
  'updated',
  'published',
  'archived',
  'attachment_added',
  'attachment_removed',
  'section_updated',
  'status_changed',
  'comment_added',
  'comment_resolved',
])

export const referenceTypeSchema = z.enum([
  'plan',
  'action',
  'evidence',
  'approval',
  'externalDoc',
])

export const commentStatusSchema = z.enum(['open', 'resolved'])

export const ritualTypeSchema = z.enum(['WBR', 'MBR', 'QBR'])

export const kpiCadenceSchema = z.enum([
  'diario',
  'semanal',
  'mensal',
  'trimestral',
  'anual',
])

// ============================================================
// ENTIDADES
// ============================================================

export const packOwnersSchema = z.object({
  headName: z.string().min(1, 'Nome do head é obrigatório'),
  backupName: z.string().optional(),
})

export const areaStrategicPackSchema = z.object({
  id: z.string().uuid(),
  area_slug: z.string().min(1),
  year: z.number().int().min(2020).max(2100),
  status: packStatusSchema,
  version: z.string(),
  summary: z.string().nullable(),
  owners: packOwnersSchema,
  created_at: z.string(),
  updated_at: z.string(),
})

export const areaPackSectionSchema = z.object({
  id: z.string().uuid(),
  pack_id: z.string().uuid(),
  key: sectionKeySchema,
  title: z.string().min(1),
  body_markdown: z.string().nullable(),
  structured_data: z.record(z.unknown()),
  sort_order: z.number().int(),
  updated_at: z.string(),
  updated_by: z.string().nullable(),
})

export const packAttachmentSchema = z.object({
  id: z.string().uuid(),
  pack_id: z.string().uuid(),
  section_id: z.string().uuid().nullable(),
  filename: z.string().min(1),
  content_type: z.string().nullable(),
  storage_path: z.string().min(1),
  file_size: z.number().nullable(),
  tags: z.array(z.string()),
  version_label: z.string(),
  uploaded_by: z.string().nullable(),
  uploaded_at: z.string(),
})

export const packReferenceSchema = z.object({
  id: z.string().uuid(),
  pack_id: z.string().uuid(),
  ref_type: referenceTypeSchema,
  label: z.string(),
  url: z.string(),
  metadata: z.record(z.unknown()),
})

export const packCommentSchema = z.object({
  id: z.string().uuid(),
  pack_id: z.string().uuid(),
  section_id: z.string().uuid().nullable(),
  author: z.string(),
  body: z.string().min(1, 'Comentário não pode ser vazio'),
  status: commentStatusSchema,
  created_at: z.string(),
  resolved_at: z.string().optional(),
  resolved_by: z.string().optional(),
})

export const packChangeLogSchema = z.object({
  id: z.string().uuid(),
  pack_id: z.string().uuid(),
  actor: z.string(),
  change_type: changeTypeSchema,
  before: z.record(z.unknown()).nullable(),
  after: z.record(z.unknown()).nullable(),
  created_at: z.string(),
})

// ============================================================
// DADOS ESTRUTURADOS (MVP-2)
// ============================================================

export const objectiveSchema = z.object({
  id: z.string(),
  key: z.string(), // O1, O2, etc.
  title: z.string().min(1),
  description: z.string().optional(),
})

export const kpiSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  definition: z.string(),
  cadence: kpiCadenceSchema,
  owner: z.string(),
  target: z.string(),
  trigger: z.string().optional(),
  current_value: z.string().optional(),
})

export const programSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  goals: z.array(z.string()),
  status: z.enum(['active', 'planned', 'completed']),
})

export const ritualSchema = z.object({
  id: z.string(),
  type: ritualTypeSchema,
  name: z.string(),
  cadence: z.string(),
  participants: z.array(z.string()),
  last_meeting: z.string().optional(),
  next_meeting: z.string().optional(),
})

export const meetingMinutesSchema = z.object({
  id: z.string(),
  ritual_id: z.string(),
  date: z.string(),
  attendees: z.array(z.string()),
  summary: z.string(),
  decisions: z.array(z.string()),
  action_items: z.array(z.string()),
  attachment_id: z.string().optional(),
})

// Structured data schemas por seção
export const objectivesDataSchema = z.object({
  objectives: z.array(objectiveSchema).optional(),
  macro_goals: z.array(z.string()).optional(),
  kpis: z.array(kpiSchema).optional(),
})

export const programsDataSchema = z.object({
  programs: z.array(programSchema).optional(),
})

export const governanceDataSchema = z.object({
  rituals: z.array(ritualSchema).optional(),
  minutes: z.array(meetingMinutesSchema).optional(),
  decisions: z.array(z.object({
    date: z.string(),
    description: z.string(),
    responsible: z.string(),
  })).optional(),
})

// Schema para update parcial de structured_data
export const updateStructuredDataSchema = z.record(z.unknown())

// ============================================================
// DTOs (Formulários)
// ============================================================

export const createPackSchema = z.object({
  area_slug: z.string().min(1, 'Slug da área é obrigatório'),
  year: z.number().int().min(2020).max(2100),
  summary: z.string().optional(),
  owners: packOwnersSchema.optional(),
})

export const updatePackSchema = z.object({
  status: packStatusSchema.optional(),
  version: z.string().optional(),
  summary: z.string().optional(),
  owners: packOwnersSchema.optional(),
})

export const createSectionSchema = z.object({
  pack_id: z.string().uuid(),
  key: sectionKeySchema,
  title: z.string().min(1),
  body_markdown: z.string().optional(),
  structured_data: z.record(z.unknown()).optional(),
  sort_order: z.number().int().optional(),
})

export const updateSectionSchema = z.object({
  title: z.string().min(1).optional(),
  body_markdown: z.string().optional(),
  structured_data: z.record(z.unknown()).optional(),
})

export const createAttachmentSchema = z.object({
  pack_id: z.string().uuid(),
  section_id: z.string().uuid().optional(),
  filename: z.string().min(1),
  content_type: z.string().optional(),
  storage_path: z.string().min(1),
  file_size: z.number().optional(),
  tags: z.array(z.string()).optional(),
  version_label: z.string().optional(),
})

export const createCommentSchema = z.object({
  pack_id: z.string().uuid(),
  section_id: z.string().uuid().optional(),
  body: z.string().min(1, 'Comentário não pode ser vazio'),
})

// ============================================================
// TYPES INFERIDOS
// ============================================================

export type CreatePackInput = z.infer<typeof createPackSchema>
export type UpdatePackInput = z.infer<typeof updatePackSchema>
export type CreateSectionInput = z.infer<typeof createSectionSchema>
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>
export type CreateAttachmentInput = z.infer<typeof createAttachmentSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>

-- ============================================================
-- CRIAÇÃO DO BUCKET DE STORAGE PARA EVIDÊNCIAS
-- ============================================================

-- Criar bucket para evidências de ações
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'action-evidences',
  'action-evidences',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'text/csv']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- POLÍTICAS DE ACESSO AO BUCKET
-- ============================================================

-- Política para SELECT (visualizar arquivos)
-- Usuários autenticados podem ver arquivos de ações da sua área
CREATE POLICY "Usuários podem ver evidências da sua área"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'action-evidences'
  AND (
    -- Admin pode ver tudo
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
    OR
    -- Usuário pode ver evidências de ações da sua área
    EXISTS (
      SELECT 1 
      FROM action_evidences ae
      JOIN plan_actions pa ON ae.action_id = pa.id
      JOIN area_plans ap ON pa.plan_id = ap.id
      JOIN profiles p ON p.user_id = auth.uid()
      WHERE ae.storage_path = name
      AND (
        p.role = 'admin'
        OR p.area_id = ap.area_id
      )
    )
  )
);

-- Política para INSERT (upload de arquivos)
-- Usuários autenticados podem fazer upload para ações da sua área
CREATE POLICY "Usuários podem fazer upload de evidências"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'action-evidences'
  AND (
    -- Admin pode fazer upload em qualquer lugar
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
    OR
    -- Usuário pode fazer upload para ações da sua área
    EXISTS (
      SELECT 1 
      FROM plan_actions pa
      JOIN area_plans ap ON pa.plan_id = ap.id
      JOIN profiles p ON p.user_id = auth.uid()
      WHERE pa.id::text = split_part(name, '/', 1)
      AND (
        p.role IN ('admin', 'gestor')
        OR (p.area_id = ap.area_id AND p.role = 'colaborador')
      )
    )
  )
);

-- Política para DELETE (excluir arquivos)
-- Apenas quem fez upload ou admin/gestor pode excluir
CREATE POLICY "Usuários podem excluir suas próprias evidências"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'action-evidences'
  AND (
    -- Admin pode excluir qualquer arquivo
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
    OR
    -- Quem fez upload pode excluir (se evidência ainda está pendente)
    EXISTS (
      SELECT 1 
      FROM action_evidences ae
      WHERE ae.storage_path = name
      AND ae.submitted_by = auth.uid()
      AND ae.status = 'PENDENTE'
    )
    OR
    -- Gestor da área pode excluir
    EXISTS (
      SELECT 1 
      FROM action_evidences ae
      JOIN plan_actions pa ON ae.action_id = pa.id
      JOIN area_plans ap ON pa.plan_id = ap.id
      JOIN profiles p ON p.user_id = auth.uid()
      WHERE ae.storage_path = name
      AND p.area_id = ap.area_id
      AND p.area_role = 'gestor'
    )
  )
);

-- ============================================================
-- ATUALIZAR TABELA PROFILES COM AREA_ID (se não existir)
-- ============================================================

-- Adicionar coluna area_id se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'area_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN area_id uuid REFERENCES areas(id);
    CREATE INDEX IF NOT EXISTS idx_profiles_area_id ON profiles(area_id);
  END IF;
END $$;

-- Adicionar coluna area_role se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'area_role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN area_role text CHECK (area_role IN ('gestor', 'colaborador'));
  END IF;
END $$;

-- Nota: Usuários de teste devem ser criados via Supabase Auth
-- e depois vinculados às áreas via a tabela profiles

-- ============================================
-- SUPABASE STORAGE CONFIGURATION
-- Configuração do Storage para upload de arquivos
-- ============================================

-- 1. Criar bucket para attachments (anexos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attachments',
  'attachments',
  false,
  10485760, -- 10MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES (RLS)
-- ============================================

-- 2. Policy: Usuários autenticados podem fazer upload
DROP POLICY IF EXISTS "Authenticated users can upload attachments" ON storage.objects;
CREATE POLICY "Authenticated users can upload attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Policy: Usuários podem visualizar seus próprios arquivos
DROP POLICY IF EXISTS "Users can view own attachments" ON storage.objects;
CREATE POLICY "Users can view own attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Policy: Usuários podem atualizar seus próprios arquivos
DROP POLICY IF EXISTS "Users can update own attachments" ON storage.objects;
CREATE POLICY "Users can update own attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Policy: Usuários podem deletar seus próprios arquivos
DROP POLICY IF EXISTS "Users can delete own attachments" ON storage.objects;
CREATE POLICY "Users can delete own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Policy: Admins podem visualizar todos os arquivos
DROP POLICY IF EXISTS "Admins can view all attachments" ON storage.objects;
CREATE POLICY "Admins can view all attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'attachments' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- PRÉ-REQUISITO: TABELA attachments
-- ============================================

-- Esta tabela é criada no script SUPABASE_ADMIN_COMMENTS.sql.
-- Caso ainda não exista, interrompemos aqui com uma mensagem clara.
DO $$
BEGIN
  IF to_regclass('public.attachments') IS NULL THEN
    RAISE EXCEPTION 'Tabela public.attachments não existe. Execute primeiro SUPABASE_ADMIN_COMMENTS.sql (seção: TABELA DE ANEXOS) e depois rode este script.';
  END IF;
END
$$;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- 7. Função para limpar arquivos órfãos (sem registro na tabela attachments)
CREATE OR REPLACE FUNCTION cleanup_orphaned_files()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Esta função deve ser executada periodicamente via cron job
  -- Remove arquivos do storage que não têm registro na tabela attachments
  DELETE FROM storage.objects
  WHERE bucket_id = 'attachments'
  AND name NOT IN (
    SELECT file_path FROM attachments
  );
END;
$$;

-- 8. Função para obter URL pública temporária de um arquivo
CREATE OR REPLACE FUNCTION get_attachment_url(file_path text, expires_in integer DEFAULT 3600)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  signed_url text;
BEGIN
  -- Gera URL assinada válida por 1 hora (3600 segundos)
  -- Nota: Esta função é um placeholder. Use o SDK do Supabase no frontend
  -- para gerar URLs assinadas: supabase.storage.from('attachments').createSignedUrl()
  RETURN 'Use supabase.storage.from(''attachments'').createSignedUrl() no frontend';
END;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- 9. Trigger para deletar arquivo do storage quando registro é deletado
CREATE OR REPLACE FUNCTION delete_storage_file_on_attachment_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Deleta o arquivo do storage quando o registro é deletado
  DELETE FROM storage.objects
  WHERE bucket_id = 'attachments'
  AND name = OLD.file_path;
  
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trigger_delete_storage_file ON attachments;
CREATE TRIGGER trigger_delete_storage_file
AFTER DELETE ON attachments
FOR EACH ROW
EXECUTE FUNCTION delete_storage_file_on_attachment_delete();

-- ============================================
-- INDEXES PARA PERFORMANCE
-- ============================================

-- 10. Index para busca rápida de anexos por action_plan_id
CREATE INDEX IF NOT EXISTS idx_attachments_action_plan_id 
ON attachments(action_plan_id);

-- 11. Index para busca rápida de anexos por user_id
CREATE INDEX IF NOT EXISTS idx_attachments_user_id 
ON attachments(user_id);

-- 12. Index para busca rápida de anexos por data
CREATE INDEX IF NOT EXISTS idx_attachments_created_at 
ON attachments(created_at DESC);

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- 13. View com informações completas de anexos
CREATE OR REPLACE VIEW attachments_full AS
SELECT 
  a.*,
  u.email as user_email,
  p.role as user_role,
  ap.title as action_plan_title,
  ap.status as action_plan_status
FROM attachments a
LEFT JOIN auth.users u ON u.id = a.user_id
LEFT JOIN profiles p ON a.user_id = p.user_id
LEFT JOIN action_plans ap ON a.action_plan_id = ap.id;

-- ============================================
-- ESTATÍSTICAS E MONITORAMENTO
-- ============================================

-- 14. View de estatísticas de storage
CREATE OR REPLACE VIEW storage_statistics AS
SELECT 
  COUNT(*) as total_files,
  SUM(file_size) as total_size_bytes,
  ROUND(SUM(file_size)::numeric / 1024 / 1024, 2) as total_size_mb,
  AVG(file_size) as avg_file_size,
  MAX(file_size) as max_file_size,
  MIN(file_size) as min_file_size,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT action_plan_id) as unique_action_plans
FROM attachments;

-- 15. View de uso de storage por usuário
CREATE OR REPLACE VIEW storage_usage_by_user AS
SELECT 
  a.user_id,
  u.email,
  COUNT(*) as file_count,
  SUM(a.file_size) as total_size_bytes,
  ROUND(SUM(a.file_size)::numeric / 1024 / 1024, 2) as total_size_mb
FROM attachments a
LEFT JOIN auth.users u ON u.id = a.user_id
GROUP BY a.user_id, u.email
ORDER BY total_size_bytes DESC;

-- ============================================
-- GRANTS (Permissões)
-- ============================================

-- 16. Garantir que usuários autenticados possam acessar as views
GRANT SELECT ON attachments_full TO authenticated;
GRANT SELECT ON storage_statistics TO authenticated;
GRANT SELECT ON storage_usage_by_user TO authenticated;

-- ============================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ============================================

COMMENT ON TABLE attachments IS 'Tabela de anexos/arquivos vinculados a planos de ação';
COMMENT ON COLUMN attachments.file_path IS 'Caminho do arquivo no storage (formato: user_id/action_plan_id/timestamp_filename)';
COMMENT ON COLUMN attachments.file_size IS 'Tamanho do arquivo em bytes';
COMMENT ON COLUMN attachments.mime_type IS 'MIME type do arquivo';

-- ============================================
-- CONFIGURAÇÕES ADICIONAIS
-- ============================================

-- 17. Habilitar RLS na tabela storage.objects (se ainda não estiver)
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'Sem permissão para ALTER TABLE storage.objects ENABLE RLS (normal em alguns projetos Supabase). Prosseguindo sem alterar.';
  END;
END
$$;

-- ============================================
-- INSTRUÇÕES DE USO
-- ============================================

/*
COMO USAR NO FRONTEND:

1. Upload de arquivo:
```typescript
const { data, error } = await supabase.storage
  .from('attachments')
  .upload(`${userId}/${actionPlanId}/${Date.now()}_${file.name}`, file)
```

2. Download de arquivo:
```typescript
const { data, error } = await supabase.storage
  .from('attachments')
  .download(filePath)
```

3. Obter URL assinada (válida por 1 hora):
```typescript
const { data, error } = await supabase.storage
  .from('attachments')
  .createSignedUrl(filePath, 3600)
```

4. Deletar arquivo:
```typescript
const { error } = await supabase.storage
  .from('attachments')
  .remove([filePath])
```

5. Listar arquivos:
```typescript
const { data, error } = await supabase.storage
  .from('attachments')
  .list(`${userId}/${actionPlanId}`)
```

MANUTENÇÃO:

- Execute cleanup_orphaned_files() periodicamente (ex: via cron job semanal)
- Monitore storage_statistics para acompanhar uso
- Use storage_usage_by_user para identificar usuários com alto uso
*/

-- ============================================
-- FIM DO SCRIPT
-- ============================================

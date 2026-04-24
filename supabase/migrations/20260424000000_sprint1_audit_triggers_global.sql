-- Sprint 1 / Nó #12: audit trigger global para todas as pe_*
-- Cobertura: 100% das tabelas pe_* com PK uuid + organization_id
-- Exclui: pe_audit_log (self, evita recursão), pe_initiative_kr_link (PK composto, sem id/org_id)

-- ============================================================================
-- 1. Função genérica de auditoria
-- ============================================================================
CREATE OR REPLACE FUNCTION public.pe_audit_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_action     text;
  v_before     jsonb;
  v_after      jsonb;
  v_entity_id  uuid;
  v_org_id     uuid;
  v_cycle_id   uuid;
  v_code       text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action    := 'insert';
    v_before    := NULL;
    v_after     := to_jsonb(NEW);
    v_entity_id := NEW.id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF to_jsonb(OLD) ? 'deleted_at'
       AND (to_jsonb(OLD)->>'deleted_at') IS NULL
       AND (to_jsonb(NEW)->>'deleted_at') IS NOT NULL THEN
      v_action := 'soft_delete';
    ELSIF to_jsonb(OLD) ? 'deleted_at'
       AND (to_jsonb(OLD)->>'deleted_at') IS NOT NULL
       AND (to_jsonb(NEW)->>'deleted_at') IS NULL THEN
      v_action := 'restore';
    ELSE
      v_action := 'update';
    END IF;
    v_before    := to_jsonb(OLD);
    v_after     := to_jsonb(NEW);
    v_entity_id := NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    v_action    := 'hard_delete';
    v_before    := to_jsonb(OLD);
    v_after     := NULL;
    v_entity_id := OLD.id;
  END IF;

  v_org_id := COALESCE(
    (v_after  ->> 'organization_id')::uuid,
    (v_before ->> 'organization_id')::uuid
  );

  v_cycle_id := COALESCE(
    (v_after  ->> 'strategic_cycle_id')::uuid,
    (v_before ->> 'strategic_cycle_id')::uuid
  );

  v_code := COALESCE(
    v_after  ->> 'code',
    v_before ->> 'code'
  );

  INSERT INTO public.pe_audit_log (
    organization_id,
    strategic_cycle_id,
    actor_user_id,
    action,
    entity_type,
    entity_id,
    entity_code,
    before_json,
    after_json,
    occurred_at
  ) VALUES (
    v_org_id,
    v_cycle_id,
    auth.uid(),
    v_action,
    TG_TABLE_NAME,
    v_entity_id,
    v_code,
    v_before,
    v_after,
    now()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.pe_audit_changes() IS
  'Sprint1/No12: trigger genérico de auditoria para todas as pe_* tables. Grava INSERT/UPDATE/DELETE + soft_delete/restore em pe_audit_log.';

-- ============================================================================
-- 2. Bind triggers em cada tabela pe_* elegível
-- ============================================================================
DO $bind$
DECLARE
  r record;
  v_tname text;
BEGIN
  FOR r IN
    SELECT c.relname AS tname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relname LIKE 'pe\_%' ESCAPE '\'
      AND c.relname <> 'pe_audit_log'
      AND EXISTS (
        SELECT 1 FROM information_schema.columns col
        WHERE col.table_schema='public' AND col.table_name=c.relname
          AND col.column_name='id' AND col.data_type='uuid'
      )
      AND EXISTS (
        SELECT 1 FROM information_schema.columns col
        WHERE col.table_schema='public' AND col.table_name=c.relname
          AND col.column_name='organization_id'
      )
    ORDER BY c.relname
  LOOP
    v_tname := r.tname;
    EXECUTE format('DROP TRIGGER IF EXISTS trg_audit_%I ON public.%I', v_tname, v_tname);
    EXECUTE format(
      'CREATE TRIGGER trg_audit_%I AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.pe_audit_changes()',
      v_tname, v_tname
    );
    RAISE NOTICE 'Audit trigger bound on %', v_tname;
  END LOOP;
END
$bind$;

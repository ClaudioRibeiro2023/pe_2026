-- Pre-patch: drop de todas as policies existentes que conflitam com migrations
-- Necessário porque o banco remoto foi parcialmente populado antes das migrations formais
-- Todas as policies são recridas pelas migrations subsequentes
-- Usa DO $$ para ignorar tabelas que ainda não existem (fresh install)

DO $$ BEGIN
  -- areas
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='areas') THEN
    DROP POLICY IF EXISTS "areas_select_all"   ON public.areas;
    DROP POLICY IF EXISTS "areas_insert_admin" ON public.areas;
    DROP POLICY IF EXISTS "areas_update_admin" ON public.areas;
    DROP POLICY IF EXISTS "areas_delete_admin" ON public.areas;
  END IF;

  -- plan_templates
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='plan_templates') THEN
    DROP POLICY IF EXISTS "plan_templates_select_all"   ON public.plan_templates;
    DROP POLICY IF EXISTS "plan_templates_insert_admin" ON public.plan_templates;
    DROP POLICY IF EXISTS "plan_templates_update_admin" ON public.plan_templates;
    DROP POLICY IF EXISTS "plan_templates_delete_admin" ON public.plan_templates;
    DROP POLICY IF EXISTS "plan_templates_modify_admin" ON public.plan_templates;
  END IF;

  -- plan_actions
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='plan_actions') THEN
    DROP POLICY IF EXISTS "plan_actions_select_all"     ON public.plan_actions;
    DROP POLICY IF EXISTS "plan_actions_insert_by_role" ON public.plan_actions;
    DROP POLICY IF EXISTS "plan_actions_update_by_role" ON public.plan_actions;
    DROP POLICY IF EXISTS "plan_actions_delete_admin"   ON public.plan_actions;
    DROP POLICY IF EXISTS "plan_actions_select"         ON public.plan_actions;
    DROP POLICY IF EXISTS "plan_actions_insert"         ON public.plan_actions;
    DROP POLICY IF EXISTS "plan_actions_update"         ON public.plan_actions;
    DROP POLICY IF EXISTS "plan_actions_delete"         ON public.plan_actions;
    DROP POLICY IF EXISTS "actions_select"              ON public.plan_actions;
    DROP POLICY IF EXISTS "actions_insert"              ON public.plan_actions;
    DROP POLICY IF EXISTS "actions_update"              ON public.plan_actions;
    DROP POLICY IF EXISTS "actions_delete"              ON public.plan_actions;
  END IF;

  -- area_plans
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='area_plans') THEN
    DROP POLICY IF EXISTS "area_plans_select_by_area" ON public.area_plans;
    DROP POLICY IF EXISTS "area_plans_insert_by_role" ON public.area_plans;
    DROP POLICY IF EXISTS "area_plans_update_by_role" ON public.area_plans;
    DROP POLICY IF EXISTS "area_plans_select"         ON public.area_plans;
    DROP POLICY IF EXISTS "area_plans_insert"         ON public.area_plans;
    DROP POLICY IF EXISTS "area_plans_update"         ON public.area_plans;
    DROP POLICY IF EXISTS "area_plans_delete"         ON public.area_plans;
    DROP POLICY IF EXISTS "plans_select"              ON public.area_plans;
    DROP POLICY IF EXISTS "plans_insert"              ON public.area_plans;
    DROP POLICY IF EXISTS "plans_update"              ON public.area_plans;
    DROP POLICY IF EXISTS "plans_delete"              ON public.area_plans;
  END IF;

  -- profiles
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='profiles') THEN
    DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
  END IF;

  -- pillars
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='pillars') THEN
    DROP POLICY IF EXISTS "pillars_select_all"   ON public.pillars;
    DROP POLICY IF EXISTS "pillars_modify_admin" ON public.pillars;
  END IF;

  -- subpillars
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='subpillars') THEN
    DROP POLICY IF EXISTS "subpillars_select_all"   ON public.subpillars;
    DROP POLICY IF EXISTS "subpillars_modify_admin" ON public.subpillars;
  END IF;

  -- corporate_okrs
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='corporate_okrs') THEN
    DROP POLICY IF EXISTS "corporate_okrs_select_all"   ON public.corporate_okrs;
    DROP POLICY IF EXISTS "corporate_okrs_modify_admin" ON public.corporate_okrs;
    DROP POLICY IF EXISTS "corporate_okrs_select"       ON public.corporate_okrs;
    DROP POLICY IF EXISTS "corporate_okrs_insert"       ON public.corporate_okrs;
    DROP POLICY IF EXISTS "corporate_okrs_update"       ON public.corporate_okrs;
    DROP POLICY IF EXISTS "corporate_okrs_delete"       ON public.corporate_okrs;
  END IF;

  -- key_results
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='key_results') THEN
    DROP POLICY IF EXISTS "key_results_select_all"   ON public.key_results;
    DROP POLICY IF EXISTS "key_results_modify_admin" ON public.key_results;
    DROP POLICY IF EXISTS "key_results_select"       ON public.key_results;
    DROP POLICY IF EXISTS "key_results_insert"       ON public.key_results;
    DROP POLICY IF EXISTS "key_results_update"       ON public.key_results;
    DROP POLICY IF EXISTS "key_results_delete"       ON public.key_results;
  END IF;

  -- area_okrs
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='area_okrs') THEN
    DROP POLICY IF EXISTS "area_okrs_select_all"    ON public.area_okrs;
    DROP POLICY IF EXISTS "area_okrs_modify_admin"  ON public.area_okrs;
    DROP POLICY IF EXISTS "area_okrs_select"        ON public.area_okrs;
    DROP POLICY IF EXISTS "area_okrs_insert"        ON public.area_okrs;
    DROP POLICY IF EXISTS "area_okrs_update"        ON public.area_okrs;
    DROP POLICY IF EXISTS "area_okrs_delete"        ON public.area_okrs;
    DROP POLICY IF EXISTS "area_okrs_select_auth"   ON public.area_okrs;
  END IF;

  -- area_okr_krs
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='area_okr_krs') THEN
    DROP POLICY IF EXISTS "area_okr_krs_select" ON public.area_okr_krs;
    DROP POLICY IF EXISTS "area_okr_krs_insert" ON public.area_okr_krs;
    DROP POLICY IF EXISTS "area_okr_krs_delete" ON public.area_okr_krs;
  END IF;

  -- initiatives
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='initiatives') THEN
    DROP POLICY IF EXISTS "initiatives_select_all"   ON public.initiatives;
    DROP POLICY IF EXISTS "initiatives_modify_admin" ON public.initiatives;
    DROP POLICY IF EXISTS "initiatives_select"       ON public.initiatives;
    DROP POLICY IF EXISTS "initiatives_insert"       ON public.initiatives;
    DROP POLICY IF EXISTS "initiatives_update"       ON public.initiatives;
    DROP POLICY IF EXISTS "initiatives_delete"       ON public.initiatives;
  END IF;

  -- action_plans (tabela legada)
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='action_plans') THEN
    DROP POLICY IF EXISTS "action_plans_select_auth" ON public.action_plans;
    DROP POLICY IF EXISTS "action_plans_insert_auth" ON public.action_plans;
    DROP POLICY IF EXISTS "action_plans_update_auth" ON public.action_plans;
  END IF;

  -- comments
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='comments') THEN
    DROP POLICY IF EXISTS "comments_select_auth" ON public.comments;
    DROP POLICY IF EXISTS "comments_insert_auth" ON public.comments;
  END IF;

  -- attachments
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='attachments') THEN
    DROP POLICY IF EXISTS "attachments_select_auth" ON public.attachments;
    DROP POLICY IF EXISTS "attachments_insert_auth" ON public.attachments;
  END IF;

  -- context_store
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='context_store') THEN
    DROP POLICY IF EXISTS "context_store_select_auth"  ON public.context_store;
    DROP POLICY IF EXISTS "context_store_modify_admin" ON public.context_store;
  END IF;

  -- goals
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='goals') THEN
    DROP POLICY IF EXISTS "goals_select_auth"   ON public.goals;
    DROP POLICY IF EXISTS "goals_modify_admin"  ON public.goals;
  END IF;

  -- indicators
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='indicators') THEN
    DROP POLICY IF EXISTS "indicators_select_auth"  ON public.indicators;
    DROP POLICY IF EXISTS "indicators_modify_admin" ON public.indicators;
  END IF;

  -- action_subtasks
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='action_subtasks') THEN
    DROP POLICY IF EXISTS "action_subtasks_all" ON public.action_subtasks;
  END IF;

  -- action_evidences
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='action_evidences') THEN
    DROP POLICY IF EXISTS "action_evidences_all" ON public.action_evidences;
  END IF;

  -- evidence_approvals
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='evidence_approvals') THEN
    DROP POLICY IF EXISTS "evidence_approvals_all" ON public.evidence_approvals;
  END IF;

  -- action_comments
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='action_comments') THEN
    DROP POLICY IF EXISTS "action_comments_all" ON public.action_comments;
  END IF;

  -- action_risks
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='action_risks') THEN
    DROP POLICY IF EXISTS "action_risks_all" ON public.action_risks;
  END IF;

  -- action_dependencies
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='action_dependencies') THEN
    DROP POLICY IF EXISTS "action_dependencies_all" ON public.action_dependencies;
  END IF;

  -- action_history
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='action_history') THEN
    DROP POLICY IF EXISTS "action_history_select" ON public.action_history;
  END IF;
END $$;

-- storage (schema separado — não precisa verificar pg_tables)
DROP POLICY IF EXISTS "storage_evidences_select" ON storage.objects;
DROP POLICY IF EXISTS "storage_evidences_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_evidences_delete" ON storage.objects;

-- funções auxiliares (serão recriadas pelas migrations)
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_area_manager(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_action_area_manager(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.user_area_id() CASCADE;
DROP FUNCTION IF EXISTS public.user_role() CASCADE;

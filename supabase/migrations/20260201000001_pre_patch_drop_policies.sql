-- Pre-patch: drop de todas as policies existentes que conflitam com migrations
-- Necessário porque o banco remoto foi parcialmente populado antes das migrations formais
-- Todas as policies são recridas pelas migrations subsequentes

-- areas
DROP POLICY IF EXISTS "areas_select_all"          ON public.areas;
DROP POLICY IF EXISTS "areas_insert_admin"         ON public.areas;
DROP POLICY IF EXISTS "areas_update_admin"         ON public.areas;
DROP POLICY IF EXISTS "areas_delete_admin"         ON public.areas;

-- plan_templates
DROP POLICY IF EXISTS "plan_templates_select_all"    ON public.plan_templates;
DROP POLICY IF EXISTS "plan_templates_insert_admin"  ON public.plan_templates;
DROP POLICY IF EXISTS "plan_templates_update_admin"  ON public.plan_templates;
DROP POLICY IF EXISTS "plan_templates_delete_admin"  ON public.plan_templates;
DROP POLICY IF EXISTS "plan_templates_modify_admin"  ON public.plan_templates;

-- plan_actions
DROP POLICY IF EXISTS "plan_actions_select_all"      ON public.plan_actions;
DROP POLICY IF EXISTS "plan_actions_insert_by_role"  ON public.plan_actions;
DROP POLICY IF EXISTS "plan_actions_update_by_role"  ON public.plan_actions;
DROP POLICY IF EXISTS "plan_actions_delete_admin"    ON public.plan_actions;
DROP POLICY IF EXISTS "plan_actions_select"          ON public.plan_actions;
DROP POLICY IF EXISTS "plan_actions_insert"          ON public.plan_actions;
DROP POLICY IF EXISTS "plan_actions_update"          ON public.plan_actions;
DROP POLICY IF EXISTS "plan_actions_delete"          ON public.plan_actions;
DROP POLICY IF EXISTS "actions_select"               ON public.plan_actions;
DROP POLICY IF EXISTS "actions_insert"               ON public.plan_actions;
DROP POLICY IF EXISTS "actions_update"               ON public.plan_actions;
DROP POLICY IF EXISTS "actions_delete"               ON public.plan_actions;

-- area_plans
DROP POLICY IF EXISTS "area_plans_select_by_area"   ON public.area_plans;
DROP POLICY IF EXISTS "area_plans_insert_by_role"   ON public.area_plans;
DROP POLICY IF EXISTS "area_plans_update_by_role"   ON public.area_plans;
DROP POLICY IF EXISTS "area_plans_select"           ON public.area_plans;
DROP POLICY IF EXISTS "area_plans_insert"           ON public.area_plans;
DROP POLICY IF EXISTS "area_plans_update"           ON public.area_plans;
DROP POLICY IF EXISTS "area_plans_delete"           ON public.area_plans;
DROP POLICY IF EXISTS "plans_select"                ON public.area_plans;
DROP POLICY IF EXISTS "plans_insert"                ON public.area_plans;
DROP POLICY IF EXISTS "plans_update"                ON public.area_plans;
DROP POLICY IF EXISTS "plans_delete"                ON public.area_plans;

-- profiles
DROP POLICY IF EXISTS "profiles_select_own"         ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"         ON public.profiles;

-- pillars
DROP POLICY IF EXISTS "pillars_select_all"          ON public.pillars;
DROP POLICY IF EXISTS "pillars_modify_admin"        ON public.pillars;

-- subpillars
DROP POLICY IF EXISTS "subpillars_select_all"       ON public.subpillars;
DROP POLICY IF EXISTS "subpillars_modify_admin"     ON public.subpillars;

-- corporate_okrs
DROP POLICY IF EXISTS "corporate_okrs_select_all"   ON public.corporate_okrs;
DROP POLICY IF EXISTS "corporate_okrs_modify_admin" ON public.corporate_okrs;
DROP POLICY IF EXISTS "corporate_okrs_select"       ON public.corporate_okrs;
DROP POLICY IF EXISTS "corporate_okrs_insert"       ON public.corporate_okrs;
DROP POLICY IF EXISTS "corporate_okrs_update"       ON public.corporate_okrs;
DROP POLICY IF EXISTS "corporate_okrs_delete"       ON public.corporate_okrs;

-- key_results
DROP POLICY IF EXISTS "key_results_select_all"      ON public.key_results;
DROP POLICY IF EXISTS "key_results_modify_admin"    ON public.key_results;
DROP POLICY IF EXISTS "key_results_select"          ON public.key_results;
DROP POLICY IF EXISTS "key_results_insert"          ON public.key_results;
DROP POLICY IF EXISTS "key_results_update"          ON public.key_results;
DROP POLICY IF EXISTS "key_results_delete"          ON public.key_results;

-- area_okrs
DROP POLICY IF EXISTS "area_okrs_select_all"        ON public.area_okrs;
DROP POLICY IF EXISTS "area_okrs_modify_admin"      ON public.area_okrs;
DROP POLICY IF EXISTS "area_okrs_select"            ON public.area_okrs;
DROP POLICY IF EXISTS "area_okrs_insert"            ON public.area_okrs;
DROP POLICY IF EXISTS "area_okrs_update"            ON public.area_okrs;
DROP POLICY IF EXISTS "area_okrs_delete"            ON public.area_okrs;
DROP POLICY IF EXISTS "area_okrs_select_auth"       ON public.area_okrs;

-- area_okr_krs
DROP POLICY IF EXISTS "area_okr_krs_select"         ON public.area_okr_krs;
DROP POLICY IF EXISTS "area_okr_krs_insert"         ON public.area_okr_krs;
DROP POLICY IF EXISTS "area_okr_krs_delete"         ON public.area_okr_krs;

-- initiatives
DROP POLICY IF EXISTS "initiatives_select_all"      ON public.initiatives;
DROP POLICY IF EXISTS "initiatives_modify_admin"    ON public.initiatives;
DROP POLICY IF EXISTS "initiatives_select"          ON public.initiatives;
DROP POLICY IF EXISTS "initiatives_insert"          ON public.initiatives;
DROP POLICY IF EXISTS "initiatives_update"          ON public.initiatives;
DROP POLICY IF EXISTS "initiatives_delete"          ON public.initiatives;

-- action_plans (tabela legada)
DROP POLICY IF EXISTS "action_plans_select_auth"    ON public.action_plans;
DROP POLICY IF EXISTS "action_plans_insert_auth"    ON public.action_plans;
DROP POLICY IF EXISTS "action_plans_update_auth"    ON public.action_plans;

-- comments
DROP POLICY IF EXISTS "comments_select_auth"        ON public.comments;
DROP POLICY IF EXISTS "comments_insert_auth"        ON public.comments;

-- attachments
DROP POLICY IF EXISTS "attachments_select_auth"     ON public.attachments;
DROP POLICY IF EXISTS "attachments_insert_auth"     ON public.attachments;

-- context_store
DROP POLICY IF EXISTS "context_store_select_auth"   ON public.context_store;
DROP POLICY IF EXISTS "context_store_modify_admin"  ON public.context_store;

-- goals
DROP POLICY IF EXISTS "goals_select_auth"           ON public.goals;
DROP POLICY IF EXISTS "goals_modify_admin"          ON public.goals;

-- indicators
DROP POLICY IF EXISTS "indicators_select_auth"      ON public.indicators;
DROP POLICY IF EXISTS "indicators_modify_admin"     ON public.indicators;

-- action_subtasks
DROP POLICY IF EXISTS "action_subtasks_all"         ON public.action_subtasks;

-- action_evidences
DROP POLICY IF EXISTS "action_evidences_all"        ON public.action_evidences;

-- evidence_approvals
DROP POLICY IF EXISTS "evidence_approvals_all"      ON public.evidence_approvals;

-- action_comments
DROP POLICY IF EXISTS "action_comments_all"         ON public.action_comments;

-- action_risks
DROP POLICY IF EXISTS "action_risks_all"            ON public.action_risks;

-- action_dependencies
DROP POLICY IF EXISTS "action_dependencies_all"     ON public.action_dependencies;

-- action_history
DROP POLICY IF EXISTS "action_history_select"       ON public.action_history;

-- storage
DROP POLICY IF EXISTS "storage_evidences_select"    ON storage.objects;
DROP POLICY IF EXISTS "storage_evidences_insert"    ON storage.objects;
DROP POLICY IF EXISTS "storage_evidences_delete"    ON storage.objects;

-- funções auxiliares (serão recriadas pelas migrations)
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_area_manager(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_action_area_manager(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.user_area_id() CASCADE;
DROP FUNCTION IF EXISTS public.user_role() CASCADE;

-- Pre-patch: corrige tipo de assigned_to em plan_actions (text -> uuid)
-- Necessário porque o banco remoto foi criado antes da migration 20260202000000
-- Esta migration roda antes de todas as demais por ter timestamp anterior

DO $$
BEGIN
  -- Só executa se a coluna existir e for TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'plan_actions'
      AND column_name = 'assigned_to'
      AND data_type = 'text'
  ) THEN
    -- Remove policies que dependem da coluna
    DROP POLICY IF EXISTS "actions_update" ON plan_actions;

    -- Converte a coluna para UUID
    ALTER TABLE plan_actions
      ALTER COLUMN assigned_to TYPE UUID USING assigned_to::UUID;

    RAISE NOTICE 'pre_patch: assigned_to convertido de TEXT para UUID';
  ELSE
    RAISE NOTICE 'pre_patch: assigned_to já é UUID ou não existe — nada a fazer';
  END IF;
END $$;

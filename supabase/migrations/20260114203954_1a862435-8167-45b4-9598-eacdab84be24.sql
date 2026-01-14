-- Fix infinite recursion in RLS policy on public.individuals
-- The previous policy referenced the individuals table inside its own USING clause.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'individuals'
      AND policyname = 'Users can view household members'
  ) THEN
    EXECUTE 'DROP POLICY "Users can view household members" ON public.individuals';
  END IF;
END $$;

-- Note: We keep the "Users can view own individual record" policy (auth.uid() = user_id)
-- which is sufficient for evaluating other table policies that join against the current user.

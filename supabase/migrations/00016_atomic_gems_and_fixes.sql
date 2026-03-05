-- Atomic gem spending function to prevent race conditions
CREATE OR REPLACE FUNCTION spend_gems(p_user_id UUID, p_amount INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  new_balance INT;
BEGIN
  UPDATE user_profiles
  SET gems = gems - p_amount
  WHERE user_id = p_user_id AND gems >= p_amount
  RETURNING gems INTO new_balance;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN new_balance;
END;
$$;

-- Add intimate_fantasy to boundary preset constraint
ALTER TABLE public.user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_boundary_preset_check;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_boundary_preset_check
    CHECK (boundary_preset IN (
      'platonic_only',
      'no_sexual_content',
      'flirty_not_explicit',
      'romantic_slow_burn',
      'romantic_escalating',
      'intimate_fantasy'
    ));

-- Add missing indexes on foreign key columns
CREATE INDEX IF NOT EXISTS idx_threads_persona_id ON public.threads(persona_id);
CREATE INDEX IF NOT EXISTS idx_checkins_thread_id ON public.checkins(thread_id);

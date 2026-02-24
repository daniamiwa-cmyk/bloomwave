-- Add interaction mode to user profiles
-- Two modes: 'relational' (default) and 'fantasy' (opt-in)
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS interaction_mode TEXT NOT NULL DEFAULT 'relational'
    CHECK (interaction_mode IN ('relational', 'fantasy'));

-- Fantasy mode requires explicit consent tracking
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS fantasy_mode_consented_at TIMESTAMPTZ;

-- Also update boundary_preset to add the new escalation-based options
ALTER TABLE public.user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_boundary_preset_check;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_boundary_preset_check
    CHECK (boundary_preset IN (
      'platonic_only',
      'no_sexual_content',
      'flirty_not_explicit',
      'romantic_slow_burn',
      'romantic_escalating'
    ));

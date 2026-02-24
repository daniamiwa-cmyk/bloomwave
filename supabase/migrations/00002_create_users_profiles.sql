CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  pronouns TEXT,
  boundary_preset TEXT NOT NULL DEFAULT 'platonic_only'
    CHECK (boundary_preset IN (
      'no_sexual_content',
      'flirty_not_explicit',
      'romantic_slow_burn',
      'platonic_only'
    )),
  custom_boundaries JSONB DEFAULT '[]'::jsonb,
  preferred_tone TEXT DEFAULT 'warm',
  humor_style TEXT DEFAULT 'light',
  comfort_style TEXT DEFAULT 'validating',
  important_people JSONB DEFAULT '[]'::jsonb,
  what_calms JSONB DEFAULT '[]'::jsonb,
  what_triggers JSONB DEFAULT '[]'::jsonb,
  core_values JSONB DEFAULT '[]'::jsonb,
  extended_profile JSONB DEFAULT '{}'::jsonb,
  profile_embedding VECTOR(512),
  memory_paused BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  gems INTEGER NOT NULL DEFAULT 10,
  last_free_gems_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_profile UNIQUE (user_id)
);

CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);

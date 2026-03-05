-- ============================================================================
-- Migration: 00010_create_personas.sql
-- Adds persona system: global personas catalog, per-user unlocks,
-- and persona_id on threads for per-thread companion selection.
-- ============================================================================

-- Persona catalog (global, not per-user)
CREATE TABLE public.personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_emoji TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#7C5CFC',
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'nonbinary')),
  orientation TEXT NOT NULL CHECK (orientation IN ('straight', 'gay', 'bisexual', 'pansexual', 'queer', 'fluid')),
  archetype TEXT NOT NULL CHECK (archetype IN (
    'protector', 'muse', 'trickster', 'sage', 'rebel',
    'nurturer', 'explorer', 'lover', 'healer', 'provocateur'
  )),
  tagline TEXT NOT NULL,
  backstory TEXT NOT NULL,
  personality_prompt TEXT NOT NULL,
  voice_notes TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 1 CHECK (tier BETWEEN 1 AND 4),
  unlock_requirement JSONB NOT NULL DEFAULT '{"method": "starter"}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_personas_tier ON public.personas(tier);
CREATE INDEX idx_personas_archetype ON public.personas(archetype);

-- RLS: personas are globally readable
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view personas" ON public.personas FOR SELECT USING (true);

-- Per-user unlock tracking
CREATE TABLE public.user_persona_unlocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona_id UUID NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unlock_method TEXT NOT NULL CHECK (unlock_method IN ('starter', 'messages', 'streak', 'threads', 'gems')),
  CONSTRAINT unique_user_persona UNIQUE (user_id, persona_id)
);

CREATE INDEX idx_user_persona_unlocks_user ON public.user_persona_unlocks(user_id);

-- RLS: users own their unlocks
ALTER TABLE public.user_persona_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own persona unlocks" ON public.user_persona_unlocks FOR ALL USING (auth.uid() = user_id);

-- Add persona_id to threads (NULL = classic Amaia, backward compatible)
ALTER TABLE public.threads
  ADD COLUMN IF NOT EXISTS persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL;

-- Auto-seed tier 1 personas for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile (existing behavior)
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);

  -- Auto-unlock all tier 1 (starter) personas
  INSERT INTO public.user_persona_unlocks (user_id, persona_id, unlock_method)
  SELECT NEW.id, p.id, 'starter'
  FROM public.personas p
  WHERE p.tier = 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

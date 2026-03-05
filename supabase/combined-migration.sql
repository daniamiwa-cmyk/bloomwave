-- ============================================================================
-- Combined Amaia Migrations
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Migration: 00001_enable_extensions.sql
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- Migration: 00002_create_users_profiles.sql
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- Migration: 00003_create_threads_messages.sql
-- ----------------------------------------------------------------------------
CREATE TABLE public.threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#7C5CFC',
  icon TEXT DEFAULT 'chat',
  is_default BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  context_summary TEXT,
  context_embedding VECTOR(512),
  last_message_at TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_threads_user_id ON public.threads(user_id);
CREATE INDEX idx_threads_last_message ON public.threads(user_id, last_message_at DESC);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  token_count INTEGER,
  model_used TEXT,
  memories_used UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_thread_id ON public.messages(thread_id, created_at DESC);
CREATE INDEX idx_messages_user_id ON public.messages(user_id);

-- ----------------------------------------------------------------------------
-- Migration: 00004_create_memories.sql
-- ----------------------------------------------------------------------------
CREATE TYPE memory_type AS ENUM ('episodic', 'profile_update');
CREATE TYPE emotional_tone AS ENUM (
  'joyful', 'sad', 'anxious', 'calm', 'frustrated',
  'hopeful', 'grateful', 'angry', 'vulnerable', 'excited',
  'reflective', 'neutral'
);

CREATE TABLE public.memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES public.threads(id) ON DELETE SET NULL,
  source_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  type memory_type NOT NULL DEFAULT 'episodic',
  content TEXT NOT NULL,
  summary TEXT,
  relevance_score FLOAT DEFAULT 0.5,
  emotional_weight FLOAT DEFAULT 0.5,
  confidence FLOAT DEFAULT 0.5,
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  emotion emotional_tone DEFAULT 'neutral',
  embedding VECTOR(512) NOT NULL,
  profile_field TEXT,
  profile_value JSONB,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  user_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memories_embedding ON public.memories
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_memories_user_id ON public.memories(user_id);
CREATE INDEX idx_memories_thread_id ON public.memories(thread_id);
CREATE INDEX idx_memories_type ON public.memories(user_id, type);
CREATE INDEX idx_memories_created ON public.memories(user_id, created_at DESC);
CREATE INDEX idx_memories_tags ON public.memories USING gin(tags);

CREATE OR REPLACE FUNCTION match_memories(
  query_embedding VECTOR(512),
  match_user_id UUID,
  match_thread_id UUID DEFAULT NULL,
  match_count INT DEFAULT 10,
  match_threshold FLOAT DEFAULT 0.3
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  summary TEXT,
  type memory_type,
  emotion emotional_tone,
  tags TEXT[],
  relevance_score FLOAT,
  emotional_weight FLOAT,
  thread_id UUID,
  created_at TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.content,
    m.summary,
    m.type,
    m.emotion,
    m.tags,
    m.relevance_score,
    m.emotional_weight,
    m.thread_id,
    m.created_at,
    1 - (m.embedding <=> query_embedding) AS similarity
  FROM public.memories m
  WHERE m.user_id = match_user_id
    AND m.is_hidden = FALSE
    AND (match_thread_id IS NULL OR m.thread_id = match_thread_id OR m.thread_id IS NULL)
    AND 1 - (m.embedding <=> query_embedding) > match_threshold
  ORDER BY
    (1 - (m.embedding <=> query_embedding)) * 0.6
    + m.relevance_score * 0.2
    + m.emotional_weight * 0.2
    DESC
  LIMIT match_count;
END;
$$;

-- ----------------------------------------------------------------------------
-- Migration: 00005_create_checkins.sql
-- ----------------------------------------------------------------------------
CREATE TYPE checkin_status AS ENUM ('active', 'paused', 'completed', 'cancelled');
CREATE TYPE checkin_frequency AS ENUM ('once', 'daily', 'weekly', 'custom');

CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES public.threads(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  prompt_template TEXT,
  context TEXT,
  frequency checkin_frequency NOT NULL DEFAULT 'once',
  scheduled_at TIMESTAMPTZ NOT NULL,
  cron_expression TEXT,
  timezone TEXT DEFAULT 'America/Los_Angeles',
  status checkin_status DEFAULT 'active',
  times_triggered INTEGER DEFAULT 0,
  last_triggered_at TIMESTAMPTZ,
  send_push BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checkins_user_id ON public.checkins(user_id);
CREATE INDEX idx_checkins_scheduled ON public.checkins(scheduled_at)
  WHERE status = 'active';

CREATE TABLE public.device_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expo_push_token TEXT NOT NULL,
  device_name TEXT,
  platform TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_token UNIQUE (user_id, expo_push_token)
);

-- ----------------------------------------------------------------------------
-- Migration: 00006_create_gems.sql
-- ----------------------------------------------------------------------------
CREATE TYPE gem_transaction_type AS ENUM ('purchase', 'spend', 'bonus', 'refund');

CREATE TABLE public.gem_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type gem_transaction_type NOT NULL,
  description TEXT NOT NULL,
  iap_product_id TEXT,
  iap_transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gem_transactions_user_id ON public.gem_transactions(user_id, created_at DESC);

CREATE TABLE public.gem_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL UNIQUE,
  gems INTEGER NOT NULL,
  price_usd NUMERIC(6,2) NOT NULL,
  label TEXT NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.gem_products (product_id, gems, price_usd, label, is_popular) VALUES
  ('alora_gems_50', 50, 2.99, '50 Gems', false),
  ('alora_gems_150', 150, 6.99, '150 Gems', true),
  ('alora_gems_400', 400, 14.99, '400 Gems', false),
  ('alora_gems_1000', 1000, 29.99, '1000 Gems', false);

-- ----------------------------------------------------------------------------
-- Migration: 00007_create_rls_policies.sql
-- ----------------------------------------------------------------------------
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gem_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gem_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own threads" ON public.threads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own messages" ON public.messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own memories" ON public.memories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own checkins" ON public.checkins FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own device tokens" ON public.device_tokens FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own gem transactions" ON public.gem_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view gem products" ON public.gem_products FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.threads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.memories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.checkins FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ----------------------------------------------------------------------------
-- Migration: 00008_auto_create_profile.sql
-- ----------------------------------------------------------------------------
-- Automatically create a user_profile when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Migration: 00009_add_interaction_mode.sql
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- Migration: 00010_create_personas.sql
-- ----------------------------------------------------------------------------
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

ALTER TABLE public.user_persona_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own persona unlocks" ON public.user_persona_unlocks FOR ALL USING (auth.uid() = user_id);

-- Add persona_id to threads (NULL = classic Amaia, backward compatible)
ALTER TABLE public.threads
  ADD COLUMN IF NOT EXISTS persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL;

-- Update handle_new_user to also seed tier 1 persona unlocks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);

  INSERT INTO public.user_persona_unlocks (user_id, persona_id, unlock_method)
  SELECT NEW.id, p.id, 'starter'
  FROM public.personas p
  WHERE p.tier = 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

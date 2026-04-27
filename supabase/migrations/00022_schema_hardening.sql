-- Migration 00022: Schema hardening
-- Addresses issues found in code review:
--   1. gems can go negative → add non-negative check
--   2. membership_type has no allowed-values constraint
--   3. is_member / membership_type consistency check
--   4. match_memories calculates vector similarity twice → rewrite with CTE
--   5. Add partial HNSW index on visible memories only for better vector scan perf

-- ============================================================================
-- 1. Prevent negative gem balances
-- ============================================================================
ALTER TABLE public.user_profiles
  DROP CONSTRAINT IF EXISTS gems_non_negative;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT gems_non_negative CHECK (gems >= 0);

-- ============================================================================
-- 2. Constrain membership_type to known values
-- ============================================================================
ALTER TABLE public.user_profiles
  DROP CONSTRAINT IF EXISTS membership_type_values;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT membership_type_values
    CHECK (membership_type IS NULL OR membership_type IN ('amaia_monthly', 'amaia_annual'));

-- ============================================================================
-- 3. Enforce is_member / membership_expires_at consistency
--    is_member=true requires membership_expires_at to be set, and vice versa
-- ============================================================================
ALTER TABLE public.user_profiles
  DROP CONSTRAINT IF EXISTS membership_consistency;

ALTER TABLE public.user_profiles
  ADD CONSTRAINT membership_consistency
    CHECK (
      (is_member = true  AND membership_expires_at IS NOT NULL) OR
      (is_member = false AND membership_expires_at IS NULL)
    );

-- ============================================================================
-- 4. Replace match_memories RPC — eliminate double similarity calculation
-- ============================================================================
CREATE OR REPLACE FUNCTION public.match_memories(
  query_embedding vector(512),
  match_user_id uuid,
  match_threshold float DEFAULT 0.6,
  match_count int DEFAULT 8,
  match_thread_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  thread_id uuid,
  content text,
  memory_type text,
  emotion text,
  relevance_score float,
  emotional_weight float,
  access_count int,
  is_pinned boolean,
  is_hidden boolean,
  created_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH scored AS (
    SELECT
      m.id,
      m.user_id,
      m.thread_id,
      m.content,
      m.memory_type,
      m.emotion,
      m.relevance_score,
      m.emotional_weight,
      m.access_count,
      m.is_pinned,
      m.is_hidden,
      m.created_at,
      1 - (m.embedding <=> query_embedding) AS similarity
    FROM public.memories m
    WHERE
      m.user_id = match_user_id
      AND m.is_hidden = FALSE
      AND (
        match_thread_id IS NULL
        OR m.thread_id = match_thread_id
        OR m.thread_id IS NULL
      )
  )
  SELECT *
  FROM scored
  WHERE similarity > match_threshold
  ORDER BY (similarity * 0.6 + relevance_score * 0.2 + emotional_weight * 0.2) DESC
  LIMIT match_count;
END;
$$;

-- ============================================================================
-- 5. Partial HNSW index: only index visible memories
--    Drops old full index and replaces with partial — better for vector scans
--    on the filtered WHERE is_hidden = FALSE path
-- ============================================================================
DROP INDEX IF EXISTS public.idx_memories_embedding;

CREATE INDEX idx_memories_embedding ON public.memories
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64)
  WHERE is_hidden = FALSE;

-- ============================================================================
-- 6. Add missing index on gem_transactions for history pagination safety
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_gem_transactions_user_created
  ON public.gem_transactions(user_id, created_at DESC);

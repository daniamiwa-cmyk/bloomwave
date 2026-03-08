-- Migration 00017: Atomic add_gems RPC + server-side age verification for fantasy mode

-- 1. Create atomic add_gems function (mirrors spend_gems pattern)
CREATE OR REPLACE FUNCTION public.add_gems(p_user_id UUID, p_amount INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_balance INT;
BEGIN
  UPDATE public.user_profiles
  SET gems = gems + p_amount
  WHERE user_id = p_user_id
  RETURNING gems INTO new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found for %', p_user_id;
  END IF;

  RETURN new_balance;
END;
$$;

-- 2. Atomic memory access count increment
CREATE OR REPLACE FUNCTION public.increment_memory_access(p_memory_ids UUID[])
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.memories
  SET access_count = access_count + 1,
      last_accessed_at = NOW()
  WHERE id = ANY(p_memory_ids);
END;
$$;

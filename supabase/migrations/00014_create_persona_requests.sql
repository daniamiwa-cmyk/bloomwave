CREATE TYPE persona_request_status AS ENUM ('pending', 'reviewed', 'built');

CREATE TABLE public.persona_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  archetype TEXT NOT NULL,
  description TEXT NOT NULL,
  status persona_request_status DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_persona_requests_user_id ON public.persona_requests(user_id);

ALTER TABLE public.persona_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own persona requests"
  ON public.persona_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own persona requests"
  ON public.persona_requests FOR SELECT
  USING (auth.uid() = user_id);

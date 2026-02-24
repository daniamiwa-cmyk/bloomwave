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

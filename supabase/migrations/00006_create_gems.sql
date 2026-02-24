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

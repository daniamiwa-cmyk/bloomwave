-- Migration 00019: Fix product IDs (alora→amai), add subscription infrastructure

-- ============================================================================
-- 1. Fix product ID mismatch: DB had alora_gems_* but RevenueCat uses amai_gems_*
-- ============================================================================
UPDATE public.gem_products SET product_id = 'amai_gems_50'   WHERE product_id = 'alora_gems_50';
UPDATE public.gem_products SET product_id = 'amai_gems_150'  WHERE product_id = 'alora_gems_150';
UPDATE public.gem_products SET product_id = 'amai_gems_400'  WHERE product_id = 'alora_gems_400';
UPDATE public.gem_products SET product_id = 'amai_gems_1000' WHERE product_id = 'alora_gems_1000';
UPDATE public.gem_products SET product_id = 'amai_gems_2500' WHERE product_id = 'alora_gems_2500';
UPDATE public.gem_products SET product_id = 'amai_gems_5000' WHERE product_id = 'alora_gems_5000';

-- Also update the member_price_usd values with cleaner numbers after rename
UPDATE public.gem_products SET member_price_usd = 2.49  WHERE product_id = 'amai_gems_50';
UPDATE public.gem_products SET member_price_usd = 5.99  WHERE product_id = 'amai_gems_150';
UPDATE public.gem_products SET member_price_usd = 12.99 WHERE product_id = 'amai_gems_400';
UPDATE public.gem_products SET member_price_usd = 24.99 WHERE product_id = 'amai_gems_1000';
UPDATE public.gem_products SET member_price_usd = 49.99 WHERE product_id = 'amai_gems_2500';
UPDATE public.gem_products SET member_price_usd = 84.99 WHERE product_id = 'amai_gems_5000';

-- ============================================================================
-- 2. Add membership_expires_at to track when subscription lapses
-- ============================================================================
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ;

-- ============================================================================
-- 3. Update unlock_method constraint to include 'subscription'
--    (tier 4 personas are subscription-exclusive)
-- ============================================================================
ALTER TABLE public.user_persona_unlocks
  DROP CONSTRAINT IF EXISTS user_persona_unlocks_unlock_method_check;

ALTER TABLE public.user_persona_unlocks
  ADD CONSTRAINT user_persona_unlocks_unlock_method_check
    CHECK (unlock_method IN ('starter', 'messages', 'streak', 'threads', 'gems', 'subscription'));

-- ============================================================================
-- 4. Subscription products table (separate from gem_products — these are
--    recurring, not consumables. Used by the API to return subscription info.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscription_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('monthly', 'annual')),
  price_usd NUMERIC(6,2) NOT NULL,
  monthly_gems INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.subscription_products (product_id, label, interval, price_usd, monthly_gems) VALUES
  ('amaia_monthly', 'Monthly Membership', 'monthly', 9.99,  75),
  ('amaia_annual',  'Annual Membership',  'annual',  79.99, 100)
ON CONFLICT (product_id) DO NOTHING;

-- RLS: anyone authenticated can read subscription products
ALTER TABLE public.subscription_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view subscription products"
  ON public.subscription_products FOR SELECT USING (true);

-- Add member pricing column to gem_products
ALTER TABLE public.gem_products ADD COLUMN IF NOT EXISTS member_price_usd NUMERIC(6,2);

-- Add membership flag to user_profiles
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_member BOOLEAN DEFAULT false;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS membership_type TEXT;

-- Update existing products with member prices (15% off, rounded to nice price points)
UPDATE public.gem_products SET member_price_usd = 2.49 WHERE product_id = 'alora_gems_50';
UPDATE public.gem_products SET member_price_usd = 5.99 WHERE product_id = 'alora_gems_150';
UPDATE public.gem_products SET member_price_usd = 12.99 WHERE product_id = 'alora_gems_400';
UPDATE public.gem_products SET member_price_usd = 24.99 WHERE product_id = 'alora_gems_1000';

-- Add new higher-tier products
INSERT INTO public.gem_products (product_id, gems, price_usd, member_price_usd, label, is_popular) VALUES
  ('alora_gems_2500', 2500, 59.99, 49.99, '2,500 Gems', false),
  ('alora_gems_5000', 5000, 99.99, 84.99, '5,000 Gems', false)
ON CONFLICT (product_id) DO NOTHING;

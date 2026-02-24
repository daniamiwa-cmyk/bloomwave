-- Seed data for local development
-- This runs after all migrations

-- Verify gem products exist
SELECT count(*) AS gem_product_count FROM public.gem_products;

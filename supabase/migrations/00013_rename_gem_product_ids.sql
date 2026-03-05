-- Rename gem product IDs from alora_ to amai_
UPDATE public.gem_products SET product_id = 'amai_gems_50' WHERE product_id = 'alora_gems_50';
UPDATE public.gem_products SET product_id = 'amai_gems_150' WHERE product_id = 'alora_gems_150';
UPDATE public.gem_products SET product_id = 'amai_gems_400' WHERE product_id = 'alora_gems_400';
UPDATE public.gem_products SET product_id = 'amai_gems_1000' WHERE product_id = 'alora_gems_1000';
UPDATE public.gem_products SET product_id = 'amai_gems_2500' WHERE product_id = 'alora_gems_2500';
UPDATE public.gem_products SET product_id = 'amai_gems_5000' WHERE product_id = 'alora_gems_5000';

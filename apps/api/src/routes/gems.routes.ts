import { FastifyPluginAsync } from 'fastify';
import * as gemsService from '../services/gems.service.js';

export const gemsRoutes: FastifyPluginAsync = async (fastify) => {
  // Get balance
  fastify.get('/balance', async (request) => {
    const gems = await gemsService.getBalance(request.userId);
    return { gems };
  });

  // Get available products
  fastify.get('/products', async () => {
    const products = await gemsService.getProducts();
    return { products };
  });

  // Claim daily free gems
  fastify.post('/daily', async (request) => {
    return gemsService.claimDailyGems(request.userId);
  });

  // Verify IAP and add gems
  fastify.post<{
    Body: {
      product_id: string;
      transaction_id: string;
      receipt: string;
    };
  }>('/purchase', async (request) => {
    const { product_id, transaction_id } = request.body;

    // TODO: Verify receipt with Apple/RevenueCat before crediting
    // For now, look up the product and credit gems
    const products = await gemsService.getProducts();
    const product = products.find((p: any) => p.product_id === product_id);

    if (!product) {
      return { error: 'Invalid product' };
    }

    const balance = await gemsService.addGems(
      request.userId,
      product.gems,
      'purchase',
      `Purchased ${product.label}`,
      product_id,
      transaction_id,
    );

    return { gems: balance, purchased: product.gems };
  });

  // Get transaction history
  fastify.get<{
    Querystring: { page?: string; limit?: string };
  }>('/transactions', async (request) => {
    const { supabaseAdmin } = await import('../lib/supabase.js');
    const page = parseInt(request.query.page || '0');
    const limit = Math.min(parseInt(request.query.limit || '20'), 50);
    const offset = page * limit;

    const { data, count } = await supabaseAdmin
      .from('gem_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', request.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return {
      transactions: data || [],
      has_more: (count || 0) > offset + limit,
      total: count || 0,
    };
  });
};

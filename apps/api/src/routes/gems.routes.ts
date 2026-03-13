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
  fastify.post('/daily', { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } }, async (request) => {
    return gemsService.claimDailyGems(request.userId);
  });

  // Verify IAP and add gems
  fastify.post<{
    Body: {
      product_id: string;
      transaction_id: string;
    };
  }>('/purchase', async (request, reply) => {
    const { product_id, transaction_id } = request.body;

    const products = await gemsService.getProducts();
    const product = products.find((p: any) => p.product_id === product_id);

    if (!product) {
      return reply.code(400).send({ error: 'Invalid product' });
    }

    // Idempotency: if already processed, return current balance
    const alreadyProcessed = await gemsService.checkTransactionProcessed(transaction_id);
    if (alreadyProcessed) {
      const balance = await gemsService.getBalance(request.userId);
      return { gems: balance, purchased: product.gems };
    }

    // Verify the transaction with RevenueCat
    const verified = await gemsService.verifyRevenueCatTransaction(
      request.userId,
      transaction_id,
      product_id,
    );

    if (!verified) {
      return reply.code(403).send({ error: 'Transaction verification failed' });
    }

    let balance: number;
    try {
      balance = await gemsService.addGems(
        request.userId,
        product.gems,
        'purchase',
        `Purchased ${product.label}`,
        product_id,
        transaction_id,
      );
    } catch (err: any) {
      // Unique constraint violation — duplicate transaction
      if (err?.code === '23505') {
        const currentBalance = await gemsService.getBalance(request.userId);
        return { gems: currentBalance, purchased: product.gems };
      }
      throw err;
    }

    return { gems: balance, purchased: product.gems };
  });

  // Get transaction history
  fastify.get<{
    Querystring: { page?: string; limit?: string };
  }>('/transactions', async (request) => {
    const { supabaseAdmin } = await import('../lib/supabase.js');
    const page = Math.max(0, parseInt(request.query.page || '0') || 0);
    const limit = Math.min(parseInt(request.query.limit || '20') || 20, 50);
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

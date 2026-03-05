import { FastifyPluginAsync } from 'fastify';
import { env } from '../config/env.js';
import { supabaseAdmin } from '../lib/supabase.js';
import * as gemsService from '../services/gems.service.js';

export const webhookRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/revenuecat', async (request, reply) => {
    // Verify webhook secret (required — reject if not configured)
    if (!env.REVENUECAT_WEBHOOK_SECRET) {
      fastify.log.error('REVENUECAT_WEBHOOK_SECRET not configured');
      return reply.code(500).send({ error: 'Webhook not configured' });
    }
    const auth = request.headers.authorization;
    if (auth !== `Bearer ${env.REVENUECAT_WEBHOOK_SECRET}`) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const body = request.body as any;
    const event = body?.event;

    if (!event) {
      return reply.code(200).send({ ok: true });
    }

    const eventType = event.type;
    const appUserId = event.app_user_id;
    const productId = event.product_id;
    const transactionId =
      event.transaction_id || event.store_transaction_id || event.id;

    if (!appUserId || !transactionId) {
      return reply.code(200).send({ ok: true });
    }

    if (eventType === 'NON_RENEWING_PURCHASE' || eventType === 'INITIAL_PURCHASE') {
      // Check idempotency
      const alreadyProcessed = await gemsService.checkTransactionProcessed(transactionId);
      if (alreadyProcessed) {
        return reply.code(200).send({ ok: true, status: 'already_processed' });
      }

      // Look up product to get gem amount
      const products = await gemsService.getProducts();
      const product = products.find((p: any) => p.product_id === productId);

      if (!product) {
        fastify.log.warn({ productId }, 'Unknown product in webhook');
        return reply.code(200).send({ ok: true, status: 'unknown_product' });
      }

      await gemsService.addGems(
        appUserId,
        product.gems,
        'purchase',
        `Purchased ${product.label} (webhook)`,
        productId,
        transactionId,
      );

      return reply.code(200).send({ ok: true, status: 'credited' });
    }

    if (eventType === 'CANCELLATION') {
      const refundId = `refund-${transactionId}`;

      const alreadyRefunded = await gemsService.checkRefundProcessed(transactionId);
      if (alreadyRefunded) {
        return reply.code(200).send({ ok: true, status: 'already_refunded' });
      }

      const products = await gemsService.getProducts();
      const product = products.find((p: any) => p.product_id === productId);

      if (!product) {
        fastify.log.warn({ productId }, 'Unknown product in refund webhook');
        return reply.code(200).send({ ok: true, status: 'unknown_product' });
      }

      await gemsService.addGems(
        appUserId,
        -product.gems,
        'refund',
        `Refund for ${product.label}`,
        productId,
        refundId,
      );

      return reply.code(200).send({ ok: true, status: 'refunded' });
    }

    // Subscription events — manage membership
    if (
      eventType === 'RENEWAL' ||
      eventType === 'INITIAL_PURCHASE' ||
      eventType === 'NON_RENEWING_PURCHASE'
    ) {
      // Check if this is a subscription product (not a gem consumable)
      const subProducts = ['monthly', 'yearly', 'lifetime'];
      if (subProducts.includes(productId)) {
        await supabaseAdmin
          .from('user_profiles')
          .update({ is_member: true, membership_type: productId })
          .eq('user_id', appUserId);

        return reply.code(200).send({ ok: true, status: 'member_activated' });
      }
    }

    if (eventType === 'EXPIRATION') {
      await supabaseAdmin
        .from('user_profiles')
        .update({ is_member: false, membership_type: null })
        .eq('user_id', appUserId);

      return reply.code(200).send({ ok: true, status: 'member_expired' });
    }

    // All other event types — acknowledge but ignore
    return reply.code(200).send({ ok: true, status: 'ignored' });
  });
};

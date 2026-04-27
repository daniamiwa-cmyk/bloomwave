import { FastifyPluginAsync } from 'fastify';
import * as gemsService from '../services/gems.service.js';

export const subscriptionRoutes: FastifyPluginAsync = async (fastify) => {
  // Get current subscription status for the authenticated user
  fastify.get('/status', async (request) => {
    return gemsService.getSubscriptionStatus(request.userId);
  });

  // Get available subscription products
  fastify.get('/products', async () => {
    const products = await gemsService.getSubscriptionProducts();
    return { products };
  });
};

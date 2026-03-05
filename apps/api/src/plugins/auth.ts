import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { supabaseAdmin } from '../lib/supabase.js';

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
  }
}

const authPluginImpl: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('userId', '');

  fastify.addHook('onRequest', async (request: FastifyRequest, reply) => {
    // Skip auth for health check and webhooks
    if (request.url === '/health') return;
    if (request.url.startsWith('/webhooks/')) return;

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing authorization header' });
    }

    const token = authHeader.slice(7);
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return reply.code(401).send({ error: 'Invalid or expired token' });
    }

    request.userId = data.user.id;
  });
};

export const authPlugin = fp(authPluginImpl, { name: 'auth' });

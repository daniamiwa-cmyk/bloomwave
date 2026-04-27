import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { authPlugin } from './plugins/auth.js';
import { chatRoutes } from './routes/chat.routes.js';
import { threadRoutes } from './routes/threads.routes.js';
import { memoryRoutes } from './routes/memories.routes.js';
import { profileRoutes } from './routes/profile.routes.js';
import { checkinRoutes } from './routes/checkins.routes.js';
import { gemsRoutes } from './routes/gems.routes.js';
import { personaRoutes } from './routes/personas.routes.js';
import { personaRequestRoutes } from './routes/personaRequests.routes.js';
import { webhookRoutes } from './routes/webhooks.routes.js';
import { subscriptionRoutes } from './routes/subscription.routes.js';
import { AppError } from './utils/errors.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  // Plugins
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : true,
  });
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: (request) => request.userId || request.ip,
  });
  await app.register(authPlugin);

  // Health check (unauthenticated)
  app.get('/health', async () => ({ status: 'ok', service: 'amaia-api' }));

  // Routes — chat routes have stricter rate limits
  await app.register(
    async (scoped) => {
      scoped.addHook('onRoute', (routeOptions) => {
        // Chat send/stream: 20 per minute (expensive AI calls)
        if (routeOptions.url === '/send' || routeOptions.url === '/stream') {
          routeOptions.config = {
            ...routeOptions.config,
            rateLimit: { max: 20, timeWindow: '1 minute' },
          };
        }
      });
      await scoped.register(chatRoutes);
    },
    { prefix: '/api/v1/chat' },
  );
  await app.register(threadRoutes, { prefix: '/api/v1/threads' });
  await app.register(memoryRoutes, { prefix: '/api/v1/memories' });
  await app.register(profileRoutes, { prefix: '/api/v1/profile' });
  await app.register(checkinRoutes, { prefix: '/api/v1/checkins' });
  await app.register(gemsRoutes, { prefix: '/api/v1/gems' });
  await app.register(personaRoutes, { prefix: '/api/v1/personas' });
  await app.register(personaRequestRoutes, { prefix: '/api/v1/persona-requests' });
  await app.register(webhookRoutes, { prefix: '/webhooks' });
  await app.register(subscriptionRoutes, { prefix: '/api/v1/subscription' });

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        error: error.message,
        code: error.code,
      });
    }

    request.log.error(error);
    return reply.code(500).send({ error: 'Internal server error' });
  });

  return app;
}

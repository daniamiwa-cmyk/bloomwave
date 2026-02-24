import { FastifyPluginAsync } from 'fastify';
import * as profileService from '../services/profile.service.js';

export const profileRoutes: FastifyPluginAsync = async (fastify) => {
  // Get profile
  fastify.get('/', async (request) => {
    return profileService.getProfile(request.userId);
  });

  // Update profile
  fastify.patch<{
    Body: Record<string, unknown>;
  }>('/', async (request) => {
    return profileService.updateProfile(request.userId, request.body as any);
  });

  // Complete onboarding
  fastify.post<{
    Body: {
      display_name: string;
      pronouns: string;
      boundary_preset: string;
      preferred_tone: string;
      humor_style: string;
      comfort_style: string;
    };
  }>('/onboarding', async (request) => {
    return profileService.completeOnboarding(request.userId, request.body as any);
  });

  // Toggle memory pause
  fastify.post('/memory-pause', async (request) => {
    const profile = await profileService.getProfile(request.userId);
    return profileService.updateProfile(request.userId, {
      memory_paused: !profile.memory_paused,
    } as any);
  });

  // Delete account and all data
  fastify.delete('/account', async (request, reply) => {
    await profileService.deleteAccount(request.userId);
    return reply.code(204).send();
  });
};

import type { FastifyPluginAsync } from 'fastify';
import * as personaService from '../services/persona.service.js';

export const personaRoutes: FastifyPluginAsync = async (fastify) => {
  // Gallery: all personas with unlock status
  fastify.get('/', async (request) => {
    return personaService.getGallery(request.userId);
  });

  // Single persona detail (public info only — prompt hidden)
  fastify.get<{
    Params: { personaId: string };
  }>('/:personaId', async (request) => {
    const persona = await personaService.getPersona(request.params.personaId);
    // Return gallery-safe version (strip prompt/voice internals)
    const { personality_prompt: _, voice_notes: __, ...card } = persona;
    const unlocked = await personaService.isUnlocked(request.userId, persona.id);
    return { ...card, is_unlocked: unlocked };
  });

  // Attempt to unlock a persona
  fastify.post<{
    Params: { personaId: string };
  }>('/:personaId/unlock', async (request) => {
    return personaService.unlockPersona(request.userId, request.params.personaId);
  });
};

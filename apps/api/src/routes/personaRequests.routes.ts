import type { FastifyPluginAsync } from 'fastify';
import type { CreatePersonaRequestBody } from '@amai/shared';
import * as personaRequestService from '../services/personaRequest.service.js';
import { AppError } from '../utils/errors.js';

export const personaRequestRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: CreatePersonaRequestBody }>('/', async (request) => {
    const { name, gender, archetype, description } = request.body || {};

    if (!name || !gender || !archetype || !description) {
      throw new AppError('All fields are required', 400, 'VALIDATION_ERROR');
    }

    return personaRequestService.submitRequest(request.userId, {
      name,
      gender,
      archetype,
      description,
    });
  });
};

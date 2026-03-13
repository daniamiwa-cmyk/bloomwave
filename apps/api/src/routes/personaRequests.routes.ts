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

    if (name.length > 100) {
      throw new AppError('Name too long (max 100 characters)', 400, 'VALIDATION_ERROR');
    }
    if (description.length > 2000) {
      throw new AppError('Description too long (max 2000 characters)', 400, 'VALIDATION_ERROR');
    }

    return personaRequestService.submitRequest(request.userId, {
      name: name.slice(0, 100),
      gender: gender.slice(0, 50),
      archetype: archetype.slice(0, 100),
      description: description.slice(0, 2000),
    });
  });
};

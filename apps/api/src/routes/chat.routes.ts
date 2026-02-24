import { FastifyPluginAsync } from 'fastify';
import * as chatService from '../services/chat.service.js';

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
  // Non-streaming send (original)
  fastify.post<{
    Body: { thread_id: string; content: string };
  }>('/send', async (request, reply) => {
    const { thread_id, content } = request.body;

    if (!thread_id || !content?.trim()) {
      return reply.code(400).send({ error: 'thread_id and content are required' });
    }

    const result = await chatService.sendMessage(request.userId, thread_id, content.trim());
    return result;
  });

  // Streaming send (SSE)
  fastify.post<{
    Body: { thread_id: string; content: string };
  }>('/stream', async (request, reply) => {
    const { thread_id, content } = request.body;

    if (!thread_id || !content?.trim()) {
      return reply.code(400).send({ error: 'thread_id and content are required' });
    }

    await chatService.sendMessageStreaming(request.userId, thread_id, content.trim(), reply);
  });

  // Message history
  fastify.get<{
    Params: { threadId: string };
    Querystring: { page?: string; limit?: string };
  }>('/:threadId/history', async (request) => {
    const { threadId } = request.params;
    const page = parseInt(request.query.page || '0');
    const limit = Math.min(parseInt(request.query.limit || '30'), 50);

    return chatService.getMessageHistory(threadId, page, limit);
  });
};

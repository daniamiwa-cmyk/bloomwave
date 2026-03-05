import { FastifyPluginAsync } from 'fastify';
import { supabaseAdmin } from '../lib/supabase.js';
import * as chatService from '../services/chat.service.js';

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
  // Report a message
  fastify.post<{
    Body: { message_id: string; thread_id: string; content_preview?: string };
  }>('/report', async (request, reply) => {
    const { message_id, thread_id, content_preview } = request.body;

    if (!message_id || !thread_id) {
      return reply.code(400).send({ error: 'message_id and thread_id are required' });
    }

    await supabaseAdmin.from('content_reports').insert({
      user_id: request.userId,
      message_id,
      thread_id,
      content_preview: content_preview?.slice(0, 200) || null,
    });

    return { reported: true };
  });

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

    return chatService.getMessageHistory(request.userId, threadId, page, limit);
  });
};

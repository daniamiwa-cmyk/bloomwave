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

    // Verify the message belongs to a thread the user owns
    const { data: message } = await supabaseAdmin
      .from('messages')
      .select('id, thread_id')
      .eq('id', message_id)
      .eq('thread_id', thread_id)
      .single();

    if (!message) {
      return reply.code(404).send({ error: 'Message not found' });
    }

    const { data: thread } = await supabaseAdmin
      .from('threads')
      .select('id')
      .eq('id', thread_id)
      .eq('user_id', request.userId)
      .single();

    if (!thread) {
      return reply.code(404).send({ error: 'Thread not found' });
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

    if (content.length > 4000) {
      return reply.code(400).send({ error: 'Message too long (max 4000 characters)' });
    }

    // Verify user owns the thread
    const { data: thread } = await supabaseAdmin
      .from('threads')
      .select('id')
      .eq('id', thread_id)
      .eq('user_id', request.userId)
      .single();

    if (!thread) {
      return reply.code(404).send({ error: 'Thread not found' });
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

    if (content.length > 4000) {
      return reply.code(400).send({ error: 'Message too long (max 4000 characters)' });
    }

    // Verify user owns the thread
    const { data: thread } = await supabaseAdmin
      .from('threads')
      .select('id')
      .eq('id', thread_id)
      .eq('user_id', request.userId)
      .single();

    if (!thread) {
      return reply.code(404).send({ error: 'Thread not found' });
    }

    await chatService.sendMessageStreaming(request.userId, thread_id, content.trim(), reply);
  });

  // Message history
  fastify.get<{
    Params: { threadId: string };
    Querystring: { page?: string; limit?: string };
  }>('/:threadId/history', async (request) => {
    const { threadId } = request.params;
    const page = Math.max(0, parseInt(request.query.page || '0') || 0);
    const limit = Math.min(parseInt(request.query.limit || '30') || 30, 50);

    return chatService.getMessageHistory(request.userId, threadId, page, limit);
  });
};

import { FastifyPluginAsync } from 'fastify';
import { supabaseAdmin } from '../lib/supabase.js';

export const threadRoutes: FastifyPluginAsync = async (fastify) => {
  // List all threads
  fastify.get('/', async (request) => {
    const { data } = await supabaseAdmin
      .from('threads')
      .select('*')
      .eq('user_id', request.userId)
      .eq('is_archived', false)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    return { threads: data || [] };
  });

  // Create thread
  fastify.post<{
    Body: { title: string; description?: string; color?: string; icon?: string };
  }>('/', async (request) => {
    const { title, description, color, icon } = request.body;

    const { data, error } = await supabaseAdmin
      .from('threads')
      .insert({
        user_id: request.userId,
        title,
        description: description || null,
        color: color || '#7C5CFC',
        icon: icon || 'chat',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  });

  // Update thread
  fastify.patch<{
    Params: { threadId: string };
    Body: { title?: string; description?: string; color?: string; icon?: string; is_archived?: boolean };
  }>('/:threadId', async (request) => {
    const { threadId } = request.params;
    const updates = request.body;

    const { data, error } = await supabaseAdmin
      .from('threads')
      .update(updates)
      .eq('id', threadId)
      .eq('user_id', request.userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  });

  // Archive thread
  fastify.delete<{
    Params: { threadId: string };
  }>('/:threadId', async (request, reply) => {
    const { threadId } = request.params;

    await supabaseAdmin
      .from('threads')
      .update({ is_archived: true })
      .eq('id', threadId)
      .eq('user_id', request.userId);

    return reply.code(204).send();
  });
};

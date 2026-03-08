import { FastifyPluginAsync } from 'fastify';
import { supabaseAdmin } from '../lib/supabase.js';

export const memoryRoutes: FastifyPluginAsync = async (fastify) => {
  // List memories (paginated, filterable)
  fastify.get<{
    Querystring: {
      page?: string;
      limit?: string;
      thread_id?: string;
      tag?: string;
      emotion?: string;
    };
  }>('/', async (request) => {
    const page = Math.max(0, parseInt(request.query.page || '0') || 0);
    const limit = Math.min(parseInt(request.query.limit || '20') || 20, 50);
    const offset = page * limit;

    let query = supabaseAdmin
      .from('memories')
      .select('*', { count: 'exact' })
      .eq('user_id', request.userId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (request.query.thread_id) {
      query = query.eq('thread_id', request.query.thread_id);
    }
    if (request.query.tag) {
      query = query.contains('tags', [request.query.tag]);
    }
    if (request.query.emotion) {
      query = query.eq('emotion', request.query.emotion);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      memories: data || [],
      has_more: (count || 0) > offset + limit,
      total: count || 0,
    };
  });

  // Get single memory
  fastify.get<{ Params: { memoryId: string } }>('/:memoryId', async (request, reply) => {
    const { data } = await supabaseAdmin
      .from('memories')
      .select('*')
      .eq('id', request.params.memoryId)
      .eq('user_id', request.userId)
      .single();

    if (!data) return reply.code(404).send({ error: 'Memory not found' });
    return data;
  });

  // Edit memory content
  fastify.patch<{
    Params: { memoryId: string };
    Body: { content: string };
  }>('/:memoryId', async (request, reply) => {
    const content = request.body.content;
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return reply.code(400).send({ error: 'Content is required' });
    }
    if (content.length > 2000) {
      return reply.code(400).send({ error: 'Content too long (max 2000 characters)' });
    }

    const { data, error } = await supabaseAdmin
      .from('memories')
      .update({ content: content.trim(), user_edited: true })
      .eq('id', request.params.memoryId)
      .eq('user_id', request.userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return reply.code(404).send({ error: 'Memory not found' });
    return data;
  });

  // Delete (hide) memory
  fastify.delete<{ Params: { memoryId: string } }>('/:memoryId', async (request, reply) => {
    await supabaseAdmin
      .from('memories')
      .update({ is_hidden: true })
      .eq('id', request.params.memoryId)
      .eq('user_id', request.userId);

    return reply.code(204).send();
  });

  // Pin/unpin memory
  fastify.post<{ Params: { memoryId: string } }>('/:memoryId/pin', async (request) => {
    const { data: current } = await supabaseAdmin
      .from('memories')
      .select('is_pinned')
      .eq('id', request.params.memoryId)
      .eq('user_id', request.userId)
      .single();

    const { data } = await supabaseAdmin
      .from('memories')
      .update({ is_pinned: !current?.is_pinned })
      .eq('id', request.params.memoryId)
      .eq('user_id', request.userId)
      .select()
      .single();

    return data;
  });

  // Bulk delete all memories
  fastify.delete('/', async (request, reply) => {
    await supabaseAdmin
      .from('memories')
      .update({ is_hidden: true })
      .eq('user_id', request.userId);

    return reply.code(204).send();
  });
};

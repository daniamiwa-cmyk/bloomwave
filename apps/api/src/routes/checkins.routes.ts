import { FastifyPluginAsync } from 'fastify';
import { supabaseAdmin } from '../lib/supabase.js';

export const checkinRoutes: FastifyPluginAsync = async (fastify) => {
  // List check-ins
  fastify.get('/', async (request) => {
    const { data } = await supabaseAdmin
      .from('checkins')
      .select('*')
      .eq('user_id', request.userId)
      .neq('status', 'cancelled')
      .order('scheduled_at', { ascending: true });

    return { checkins: data || [] };
  });

  // Create check-in
  fastify.post<{
    Body: {
      topic: string;
      prompt_template?: string;
      context?: string;
      thread_id?: string;
      frequency: string;
      scheduled_at: string;
      cron_expression?: string;
      timezone?: string;
      send_push?: boolean;
    };
  }>('/', async (request) => {
    const { data, error } = await supabaseAdmin
      .from('checkins')
      .insert({
        user_id: request.userId,
        ...request.body,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  });

  // Update check-in
  fastify.patch<{
    Params: { checkinId: string };
    Body: Record<string, unknown>;
  }>('/:checkinId', async (request) => {
    const ALLOWED_FIELDS = [
      'topic', 'prompt_template', 'context', 'thread_id',
      'frequency', 'scheduled_at', 'cron_expression',
      'timezone', 'send_push',
    ];
    const filtered = Object.fromEntries(
      Object.entries(request.body).filter(([k]) => ALLOWED_FIELDS.includes(k)),
    );

    const { data, error } = await supabaseAdmin
      .from('checkins')
      .update(filtered)
      .eq('id', request.params.checkinId)
      .eq('user_id', request.userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  });

  // Cancel check-in
  fastify.delete<{
    Params: { checkinId: string };
  }>('/:checkinId', async (request, reply) => {
    await supabaseAdmin
      .from('checkins')
      .update({ status: 'cancelled' })
      .eq('id', request.params.checkinId)
      .eq('user_id', request.userId);

    return reply.code(204).send();
  });
};

import { FastifyPluginAsync } from 'fastify';
import { supabaseAdmin } from '../lib/supabase.js';
import * as personaService from '../services/persona.service.js';
import { AppError } from '../utils/errors.js';

export const threadRoutes: FastifyPluginAsync = async (fastify) => {
  // List all threads (with persona info)
  fastify.get('/', async (request) => {
    const { data: threads } = await supabaseAdmin
      .from('threads')
      .select('*, personas(name, avatar_emoji, color, slug)')
      .eq('user_id', request.userId)
      .eq('is_archived', false)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    // Flatten persona join into thread fields
    const result = (threads || []).map((t: any) => ({
      ...t,
      persona_name: t.personas?.name || null,
      persona_emoji: t.personas?.avatar_emoji || null,
      persona_slug: t.personas?.slug || null,
      persona_color: t.personas?.color || null,
      personas: undefined,
    }));

    return { threads: result };
  });

  // Create thread (with optional persona_id)
  fastify.post<{
    Body: { title: string; description?: string; color?: string; icon?: string; persona_id?: string };
  }>('/', async (request) => {
    const { title, description, color, icon, persona_id } = request.body;

    // If persona_id provided, validate ownership (user must have unlocked it)
    if (persona_id) {
      const unlocked = await personaService.isUnlocked(request.userId, persona_id);
      if (!unlocked) {
        throw new AppError('Persona not unlocked', 403, 'PERSONA_NOT_UNLOCKED');
      }
    }

    const { data, error } = await supabaseAdmin
      .from('threads')
      .insert({
        user_id: request.userId,
        title,
        description: description || null,
        color: color || '#7C5CFC',
        icon: icon || 'chat',
        persona_id: persona_id || null,
      })
      .select('*, personas(name, avatar_emoji, color, slug)')
      .single();

    if (error) throw error;

    // Flatten persona join
    const result = {
      ...data,
      persona_name: (data as any).personas?.name || null,
      persona_emoji: (data as any).personas?.avatar_emoji || null,
      persona_slug: (data as any).personas?.slug || null,
      persona_color: (data as any).personas?.color || null,
      personas: undefined,
    };

    return result;
  });

  // Update thread
  fastify.patch<{
    Params: { threadId: string };
    Body: { title?: string; description?: string; color?: string; icon?: string; is_archived?: boolean };
  }>('/:threadId', async (request) => {
    const { threadId } = request.params;
    const ALLOWED_FIELDS = ['title', 'description', 'color', 'icon', 'is_archived'];
    const updates = Object.fromEntries(
      Object.entries(request.body || {}).filter(([k]) => ALLOWED_FIELDS.includes(k)),
    );

    if (Object.keys(updates).length === 0) {
      return request.body; // No valid fields to update
    }

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

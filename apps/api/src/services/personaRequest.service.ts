import { supabaseAdmin } from '../lib/supabase.js';
import { AppError } from '../utils/errors.js';
import type { CreatePersonaRequestBody, PersonaRequestResponse } from '@amai/shared';

const MAX_PENDING_REQUESTS = 5;

export async function submitRequest(
  userId: string,
  body: CreatePersonaRequestBody,
): Promise<PersonaRequestResponse> {
  // Check pending request count
  const { count } = await supabaseAdmin
    .from('persona_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'pending');

  if ((count || 0) >= MAX_PENDING_REQUESTS) {
    throw new AppError('You can only have 5 pending requests', 429, 'TOO_MANY_REQUESTS');
  }

  const { data, error } = await supabaseAdmin
    .from('persona_requests')
    .insert({
      user_id: userId,
      name: body.name,
      gender: body.gender,
      archetype: body.archetype,
      description: body.description,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new AppError('Failed to submit persona request', 500, 'INSERT_FAILED');
  }

  return { success: true, id: data.id };
}

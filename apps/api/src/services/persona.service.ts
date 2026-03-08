import { supabaseAdmin } from '../lib/supabase.js';
import * as gemsService from './gems.service.js';
import { NotFoundError, AppError } from '../utils/errors.js';
import type { Persona, PersonaCard, PersonaGalleryResponse, UnlockPersonaResponse } from '@amai/shared';

export async function getGallery(userId: string): Promise<PersonaGalleryResponse> {
  const [personasResult, unlocksResult] = await Promise.all([
    supabaseAdmin.from('personas').select('*').order('tier').order('name'),
    supabaseAdmin.from('user_persona_unlocks').select('persona_id').eq('user_id', userId),
  ]);

  const personas = personasResult.data || [];
  const unlockedIds = new Set((unlocksResult.data || []).map((u) => u.persona_id));

  const cards: PersonaCard[] = personas.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    avatar_emoji: p.avatar_emoji,
    color: p.color,
    gender: p.gender,
    orientation: p.orientation,
    archetype: p.archetype,
    tagline: p.tagline,
    backstory: p.backstory,
    tier: p.tier,
    unlock_requirement: p.unlock_requirement,
    is_unlocked: unlockedIds.has(p.id),
  }));

  return {
    personas: cards,
    unlocked_count: unlockedIds.size,
    total_count: personas.length,
  };
}

export async function getPersona(personaId: string): Promise<Persona> {
  const { data, error } = await supabaseAdmin
    .from('personas')
    .select('*')
    .eq('id', personaId)
    .single();

  if (error || !data) throw new NotFoundError('Persona');
  return data as Persona;
}

export async function getPersonaBySlug(slug: string): Promise<Persona> {
  const { data, error } = await supabaseAdmin
    .from('personas')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) throw new NotFoundError('Persona');
  return data as Persona;
}

export async function isUnlocked(userId: string, personaId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('user_persona_unlocks')
    .select('id')
    .eq('user_id', userId)
    .eq('persona_id', personaId)
    .maybeSingle();

  return !!data;
}

export async function unlockPersona(
  userId: string,
  personaId: string,
): Promise<UnlockPersonaResponse> {
  // Check if already unlocked
  const alreadyUnlocked = await isUnlocked(userId, personaId);
  if (alreadyUnlocked) {
    return { success: true, persona_id: personaId, unlock_method: 'starter' };
  }

  // Get persona to check requirements
  const persona = await getPersona(personaId);
  const req = persona.unlock_requirement;

  if (req.method === 'gems') {
    const gemsNeeded = req.value || 50;
    const gemsRemaining = await gemsService.spendGems(
      userId,
      gemsNeeded,
      `Unlock persona: ${persona.name}`,
    );

    // Insert unlock record; if this fails, refund the gems
    const { error: unlockError } = await supabaseAdmin.from('user_persona_unlocks').insert({
      user_id: userId,
      persona_id: personaId,
      unlock_method: 'gems',
    });

    if (unlockError) {
      // Refund gems since unlock failed
      await gemsService.addGems(userId, gemsNeeded, 'refund', `Refund: failed unlock for ${persona.name}`);
      throw new AppError('Failed to unlock persona', 500, 'UNLOCK_FAILED');
    }

    return {
      success: true,
      persona_id: personaId,
      unlock_method: 'gems',
      gems_remaining: gemsRemaining,
    };
  }

  // For milestone unlocks (messages, streak, threads), validate the requirement
  const meetsRequirement = await checkRequirement(userId, req);
  if (!meetsRequirement) {
    throw new AppError(
      `Unlock requirement not met: ${req.method} (need ${req.value})`,
      403,
      'UNLOCK_REQUIREMENT_NOT_MET',
    );
  }

  await supabaseAdmin.from('user_persona_unlocks').insert({
    user_id: userId,
    persona_id: personaId,
    unlock_method: req.method,
  });

  return { success: true, persona_id: personaId, unlock_method: req.method };
}

async function checkRequirement(
  userId: string,
  req: { method: string; value?: number },
): Promise<boolean> {
  const value = req.value || 0;

  switch (req.method) {
    case 'starter':
      return true;

    case 'messages': {
      const { count } = await supabaseAdmin
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('role', 'user');
      return (count || 0) >= value;
    }

    case 'threads': {
      const { count } = await supabaseAdmin
        .from('threads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_archived', false);
      return (count || 0) >= value;
    }

    case 'streak': {
      // Check if user has sent messages on consecutive days
      const { data } = await supabaseAdmin
        .from('messages')
        .select('created_at')
        .eq('user_id', userId)
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(value * 5); // Fetch enough messages to check streak

      if (!data || data.length === 0) return false;

      const days = new Set(
        data.map((m) => new Date(m.created_at).toISOString().split('T')[0]),
      );
      const sortedDays = [...days].sort().reverse();

      let streak = 1;
      for (let i = 1; i < sortedDays.length; i++) {
        const prev = new Date(sortedDays[i - 1]);
        const curr = new Date(sortedDays[i]);
        const diffDays = (prev.getTime() - curr.getTime()) / 86400000;
        if (diffDays <= 1.5) {
          streak++;
          if (streak >= value) return true;
        } else {
          break;
        }
      }
      return streak >= value;
    }

    default:
      return false;
  }
}

export async function checkMilestoneUnlocks(userId: string): Promise<string[]> {
  // Get all locked personas for this user
  const [allPersonas, userUnlocks] = await Promise.all([
    supabaseAdmin.from('personas').select('id, unlock_requirement, name, tier').neq('tier', 4),
    supabaseAdmin.from('user_persona_unlocks').select('persona_id').eq('user_id', userId),
  ]);

  const unlockedIds = new Set((userUnlocks.data || []).map((u) => u.persona_id));
  const locked = (allPersonas.data || []).filter((p) => !unlockedIds.has(p.id));

  if (locked.length === 0) return [];

  const newlyUnlocked: string[] = [];

  for (const persona of locked) {
    const req = persona.unlock_requirement;
    if (req.method === 'gems' || req.method === 'starter') continue;

    const meets = await checkRequirement(userId, req);
    if (meets) {
      await supabaseAdmin.from('user_persona_unlocks').insert({
        user_id: userId,
        persona_id: persona.id,
        unlock_method: req.method,
      });
      newlyUnlocked.push(persona.id);
    }
  }

  return newlyUnlocked;
}

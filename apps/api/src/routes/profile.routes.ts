import { FastifyPluginAsync } from 'fastify';
import { supabaseAdmin } from '../lib/supabase.js';
import * as profileService from '../services/profile.service.js';

export const profileRoutes: FastifyPluginAsync = async (fastify) => {
  // Get profile
  fastify.get('/', async (request) => {
    return profileService.getProfile(request.userId);
  });

  // Update profile (allowlist fields to prevent users setting gems, is_member, etc.)
  fastify.patch<{
    Body: Record<string, unknown>;
  }>('/', async (request) => {
    const ALLOWED_FIELDS = [
      'display_name', 'pronouns', 'boundary_preset', 'custom_boundaries',
      'preferred_tone', 'humor_style', 'comfort_style', 'interaction_mode',
      'important_people', 'what_calms', 'what_triggers', 'core_values',
      'memory_paused', 'accent_color', 'background_theme',
      'extended_profile', 'fantasy_mode_consented_at',
    ];
    const filtered = Object.fromEntries(
      Object.entries(request.body).filter(([k]) => ALLOWED_FIELDS.includes(k)),
    );

    // Server-side age gate: verify 18+ before allowing fantasy mode
    if (filtered.interaction_mode === 'fantasy') {
      const profile = await profileService.getProfile(request.userId);
      const dob = profile?.extended_profile?.date_of_birth;
      if (!dob || typeof dob !== 'string') {
        return request.server.httpErrors.forbidden('Date of birth required for fantasy mode');
      }
      const [year, month, day] = dob.split('-').map(Number);
      if (!year || !month || !day) {
        return request.server.httpErrors.forbidden('Invalid date of birth');
      }
      // Use UTC throughout to avoid timezone-based age miscalculation
      const todayUtc = new Date();
      const birthDate = new Date(Date.UTC(year, month - 1, day));
      if (isNaN(birthDate.getTime()) || birthDate > todayUtc) {
        return request.server.httpErrors.forbidden('Invalid date of birth');
      }
      let age = todayUtc.getUTCFullYear() - birthDate.getUTCFullYear();
      const m = todayUtc.getUTCMonth() - birthDate.getUTCMonth();
      if (m < 0 || (m === 0 && todayUtc.getUTCDate() < birthDate.getUTCDate())) age--;
      if (age < 18) {
        return request.server.httpErrors.forbidden('Must be 18 or older for fantasy mode');
      }
    }

    return profileService.updateProfile(request.userId, filtered as any);
  });

  // Complete onboarding
  fastify.post<{
    Body: {
      display_name: string;
      pronouns: string;
      boundary_preset: string;
      preferred_tone: string;
      humor_style: string;
      comfort_style: string;
    };
  }>('/onboarding', async (request) => {
    return profileService.completeOnboarding(request.userId, request.body as any);
  });

  // Toggle memory pause
  fastify.post('/memory-pause', async (request) => {
    const profile = await profileService.getProfile(request.userId);
    return profileService.updateProfile(request.userId, {
      memory_paused: !profile.memory_paused,
    } as any);
  });

  // Register device token for push notifications
  fastify.post<{
    Body: { expo_push_token: string; platform: string; device_name: string };
  }>('/device-token', async (request, reply) => {
    const { expo_push_token, platform, device_name } = request.body;

    await supabaseAdmin.from('device_tokens').upsert(
      {
        user_id: request.userId,
        expo_push_token,
        platform,
        device_name,
        is_active: true,
      },
      { onConflict: 'user_id,expo_push_token' },
    );

    return reply.code(201).send({ ok: true });
  });

  // Delete account and all data
  fastify.delete('/account', async (request, reply) => {
    await profileService.deleteAccount(request.userId);
    return reply.code(204).send();
  });
};

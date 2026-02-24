import { supabaseAdmin } from '../lib/supabase.js';
import type { UserProfile, OnboardingPayload, ProfileUpdate } from '@alora/shared';
import { NotFoundError } from '../utils/errors.js';

export async function getProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) throw new NotFoundError('Profile');
  return data as UserProfile;
}

export async function createProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate,
): Promise<UserProfile> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function completeOnboarding(
  userId: string,
  payload: OnboardingPayload,
): Promise<UserProfile> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      ...payload,
      onboarding_completed: true,
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function mergeProfileUpdate(
  userId: string,
  field: string,
  value: unknown,
): Promise<void> {
  const profile = await getProfile(userId);

  // For array fields, merge without duplicates
  const arrayFields = ['important_people', 'what_calms', 'what_triggers', 'core_values'];

  if (arrayFields.includes(field)) {
    const existing = (profile as unknown as Record<string, unknown>)[field];
    if (Array.isArray(existing) && Array.isArray(value)) {
      const merged = [...existing, ...value];
      // Deduplicate by stringifying
      const seen = new Set<string>();
      const unique = merged.filter((item) => {
        const key = typeof item === 'string' ? item : JSON.stringify(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      await supabaseAdmin
        .from('user_profiles')
        .update({ [field]: unique })
        .eq('user_id', userId);
      return;
    }
  }

  // For scalar fields, just overwrite
  await supabaseAdmin
    .from('user_profiles')
    .update({ [field]: value })
    .eq('user_id', userId);
}

export async function deleteAccount(userId: string): Promise<void> {
  // CASCADE handles all related data deletion
  await supabaseAdmin.from('user_profiles').delete().eq('user_id', userId);
  // Delete the auth user
  await supabaseAdmin.auth.admin.deleteUser(userId);
}

export type PersonaGender = 'male' | 'female' | 'nonbinary';
export type PersonaOrientation = 'straight' | 'gay' | 'bisexual' | 'pansexual' | 'queer' | 'fluid';
export type PersonaArchetype =
  | 'protector'
  | 'muse'
  | 'trickster'
  | 'sage'
  | 'rebel'
  | 'nurturer'
  | 'explorer'
  | 'lover'
  | 'healer'
  | 'provocateur';

export type UnlockMethod = 'starter' | 'messages' | 'streak' | 'threads' | 'gems';

export interface UnlockRequirement {
  method: UnlockMethod;
  value?: number; // e.g., 25 messages, 3-day streak, 50 gems
}

export interface Persona {
  id: string;
  slug: string;
  name: string;
  avatar_emoji: string;
  color: string;
  gender: PersonaGender;
  orientation: PersonaOrientation;
  archetype: PersonaArchetype;
  tagline: string;
  backstory: string;
  personality_prompt: string;
  voice_notes: string;
  tier: number;
  unlock_requirement: UnlockRequirement;
  created_at: string;
}

// Gallery-safe version — hides personality_prompt and voice_notes
export interface PersonaCard {
  id: string;
  slug: string;
  name: string;
  avatar_emoji: string;
  color: string;
  gender: PersonaGender;
  orientation: PersonaOrientation;
  archetype: PersonaArchetype;
  tagline: string;
  backstory: string;
  tier: number;
  unlock_requirement: UnlockRequirement;
  is_unlocked: boolean;
}

export interface PersonaGalleryResponse {
  personas: PersonaCard[];
  unlocked_count: number;
  total_count: number;
}

export interface UnlockPersonaResponse {
  success: boolean;
  persona_id: string;
  unlock_method: UnlockMethod;
  gems_remaining?: number;
}

export interface UserPersonaUnlock {
  id: string;
  user_id: string;
  persona_id: string;
  unlocked_at: string;
  unlock_method: UnlockMethod;
}

import { BoundaryPreset, InteractionMode } from './boundary';

export interface ImportantPerson {
  name: string;
  relationship: string;
  notes?: string;
}

export type PreferredTone = 'warm' | 'playful' | 'direct' | 'gentle';
export type HumorStyle = 'light' | 'witty' | 'dry' | 'none';
export type ComfortStyle = 'validating' | 'problem_solving' | 'just_listen';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  pronouns: string | null;
  boundary_preset: BoundaryPreset;
  custom_boundaries: string[];
  preferred_tone: PreferredTone;
  humor_style: HumorStyle;
  comfort_style: ComfortStyle;
  important_people: ImportantPerson[];
  what_calms: string[];
  what_triggers: string[];
  core_values: string[];
  extended_profile: Record<string, unknown>;
  interaction_mode: InteractionMode;
  fantasy_mode_consented_at: string | null;
  memory_paused: boolean;
  onboarding_completed: boolean;
  gems: number;
  accent_color: string | null;
  background_theme: string | null;
  is_member: boolean;
  membership_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  display_name?: string;
  pronouns?: string;
  boundary_preset?: BoundaryPreset;
  custom_boundaries?: string[];
  preferred_tone?: PreferredTone;
  humor_style?: HumorStyle;
  comfort_style?: ComfortStyle;
  important_people?: ImportantPerson[];
  what_calms?: string[];
  interaction_mode?: InteractionMode;
  fantasy_mode_consented_at?: string;
  extended_profile?: Record<string, unknown>;
  memory_paused?: boolean;
  what_triggers?: string[];
  core_values?: string[];
  accent_color?: string;
  background_theme?: string;
}

export interface OnboardingPayload {
  display_name: string;
  pronouns: string;
  boundary_preset: BoundaryPreset;
  preferred_tone: PreferredTone;
  humor_style: HumorStyle;
  comfort_style: ComfortStyle;
}

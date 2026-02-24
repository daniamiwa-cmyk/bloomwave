export type BoundaryPreset =
  | 'platonic_only'
  | 'no_sexual_content'
  | 'flirty_not_explicit'
  | 'romantic_slow_burn'
  | 'romantic_escalating';

export type InteractionMode = 'relational' | 'fantasy';

export interface BoundarySettings {
  preset: BoundaryPreset;
  custom: string[];
  mode: InteractionMode;
}

export interface BoundaryPresetInfo {
  id: BoundaryPreset;
  title: string;
  description: string;
  icon: string;
  color: string;
  mode: InteractionMode;
}

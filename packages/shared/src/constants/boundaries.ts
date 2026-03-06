import { BoundaryPresetInfo } from '../types/boundary';

// Relational mode presets (default)
export const RELATIONAL_PRESETS: BoundaryPresetInfo[] = [
  {
    id: 'platonic_only',
    title: 'Platonic Only',
    description: 'A warm, supportive friend. No romantic undertones.',
    icon: 'heart-handshake',
    color: '#7C5CFC',
    mode: 'relational',
  },
  {
    id: 'no_sexual_content',
    title: 'No Sexual Content',
    description: 'Romantic feelings can be explored, but nothing sexual.',
    icon: 'shield-heart',
    color: '#E86CCC',
    mode: 'relational',
  },
  {
    id: 'flirty_not_explicit',
    title: 'Flirty but Tasteful',
    description: 'Playful banter and compliments. Light and charming.',
    icon: 'sparkles',
    color: '#FF8C66',
    mode: 'relational',
  },
  {
    id: 'romantic_slow_burn',
    title: 'Romantic Slow Burn',
    description: 'Emotional intimacy that deepens over time. Tasteful, never explicit.',
    icon: 'flame',
    color: '#FF6B8A',
    mode: 'relational',
  },
];

// Fantasy mode presets (opt-in, requires consent)
export const FANTASY_PRESETS: BoundaryPresetInfo[] = [
  {
    id: 'romantic_escalating',
    title: 'Romantic Fantasy',
    description: 'Deep emotional intimacy, romantic tension, and longing. Poetic and slow-burn.',
    icon: 'flame',
    color: '#E53935',
    mode: 'fantasy',
  },
  {
    id: 'intimate_fantasy',
    title: 'Intimate Fantasy',
    description: 'Physical affection expressed openly. Sensual and tasteful — never crude or mechanical.',
    icon: 'flame',
    color: '#D81B60',
    mode: 'fantasy',
  },
];

// All presets combined
export const BOUNDARY_PRESETS: BoundaryPresetInfo[] = [
  ...RELATIONAL_PRESETS,
  ...FANTASY_PRESETS,
];

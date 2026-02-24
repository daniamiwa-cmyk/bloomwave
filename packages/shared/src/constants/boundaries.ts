import { BoundaryPresetInfo } from '../types/boundary';

export const BOUNDARY_PRESETS: BoundaryPresetInfo[] = [
  {
    id: 'platonic_only',
    title: 'Platonic Only',
    description: 'A warm, supportive friend. No romantic undertones.',
    icon: 'heart-handshake',
    color: '#7C5CFC',
  },
  {
    id: 'no_sexual_content',
    title: 'No Sexual Content',
    description: 'Romantic feelings can be explored, but nothing sexual.',
    icon: 'shield-heart',
    color: '#E86CCC',
  },
  {
    id: 'flirty_not_explicit',
    title: 'Flirty but Tasteful',
    description: 'Playful banter and compliments. Light and charming.',
    icon: 'sparkles',
    color: '#FF8C66',
  },
  {
    id: 'romantic_slow_burn',
    title: 'Romantic Slow Burn',
    description: 'Emotional intimacy that deepens over time. Tasteful.',
    icon: 'flame',
    color: '#FF6B8A',
  },
];

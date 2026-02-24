export const EMOTIONAL_TONES = [
  'joyful',
  'sad',
  'anxious',
  'calm',
  'frustrated',
  'hopeful',
  'grateful',
  'angry',
  'vulnerable',
  'excited',
  'reflective',
  'neutral',
] as const;

export type EmotionalTone = (typeof EMOTIONAL_TONES)[number];

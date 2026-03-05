export interface AccentColor {
  id: string;
  label: string;
  hex: string;
}

export interface BackgroundThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  text?: string;
  textSecondary?: string;
  textMuted?: string;
  border?: string;
  divider?: string;
  aiBubble?: string;
  aiBubbleText?: string;
  aiBubbleBorder?: string;
}

export interface BackgroundTheme {
  id: string;
  label: string;
  colors: BackgroundThemeColors;
}

export const ACCENT_COLORS: AccentColor[] = [
  { id: 'purple', label: 'Purple', hex: '#6246EA' },
  { id: 'indigo', label: 'Indigo', hex: '#6366F1' },
  { id: 'blue', label: 'Blue', hex: '#3B82F6' },
  { id: 'teal', label: 'Teal', hex: '#14B8A6' },
  { id: 'green', label: 'Green', hex: '#22C55E' },
  { id: 'amber', label: 'Amber', hex: '#F59E0B' },
  { id: 'orange', label: 'Orange', hex: '#F97316' },
  { id: 'rose', label: 'Rose', hex: '#F43F5E' },
  { id: 'pink', label: 'Pink', hex: '#EC4899' },
  { id: 'red', label: 'Red', hex: '#EF4444' },
  { id: 'violet', label: 'Violet', hex: '#8B5CF6' },
  { id: 'slate', label: 'Slate', hex: '#64748B' },
];

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  {
    id: 'warm_cream',
    label: 'Warm Cream',
    colors: {
      background: '#FFF9F5',
      surface: '#FFFFFF',
      surfaceElevated: '#FFF5F0',
    },
  },
  {
    id: 'cool_white',
    label: 'Cool White',
    colors: {
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceElevated: '#F1F5F9',
    },
  },
  {
    id: 'soft_lavender',
    label: 'Soft Lavender',
    colors: {
      background: '#FAF5FF',
      surface: '#FFFFFF',
      surfaceElevated: '#F3E8FF',
    },
  },
  {
    id: 'blush',
    label: 'Blush',
    colors: {
      background: '#FFF1F2',
      surface: '#FFFFFF',
      surfaceElevated: '#FFE4E6',
    },
  },
  {
    id: 'sage',
    label: 'Sage',
    colors: {
      background: '#F5F7F2',
      surface: '#FFFFFF',
      surfaceElevated: '#EDF0E8',
    },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    colors: {
      background: '#1A1A2E',
      surface: '#252542',
      surfaceElevated: '#2A2A4A',
      text: '#F0EDF5',
      textSecondary: '#A89BBE',
      textMuted: '#6B5F7B',
      border: '#3A3A5C',
      divider: '#2F2F4F',
      aiBubble: '#252542',
      aiBubbleText: '#F0EDF5',
      aiBubbleBorder: '#3A3A5C',
    },
  },
];

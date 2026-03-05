import React, { createContext, useContext, useMemo } from 'react';
import { colors as staticColors } from './colors';
import { ACCENT_COLORS, BACKGROUND_THEMES } from './palettes';
import { useAuthStore } from '@/stores/authStore';

type Colors = typeof staticColors;

const ThemeContext = createContext<Colors>(staticColors);

export function useTheme(): Colors {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const profile = useAuthStore((s) => s.profile);

  const themeColors = useMemo(() => {
    if (!profile?.is_member) return staticColors;

    const accentId = profile.accent_color;
    const bgId = profile.background_theme;

    if (!accentId && !bgId) return staticColors;

    const merged = { ...staticColors };

    // Apply accent color
    if (accentId) {
      const accent = ACCENT_COLORS.find((a) => a.id === accentId);
      if (accent) {
        merged.primary = accent.hex;
        merged.primaryLight = accent.hex + 'CC';
        merged.primaryDark = accent.hex;
        merged.userBubble = accent.hex;
      }
    }

    // Apply background theme
    if (bgId) {
      const bg = BACKGROUND_THEMES.find((b) => b.id === bgId);
      if (bg) {
        merged.background = bg.colors.background;
        merged.surface = bg.colors.surface;
        merged.surfaceElevated = bg.colors.surfaceElevated;

        // Dark theme overrides
        if (bg.colors.text) merged.text = bg.colors.text;
        if (bg.colors.textSecondary) merged.textSecondary = bg.colors.textSecondary;
        if (bg.colors.textMuted) merged.textMuted = bg.colors.textMuted;
        if (bg.colors.border) merged.border = bg.colors.border;
        if (bg.colors.divider) merged.divider = bg.colors.divider;
        if (bg.colors.aiBubble) merged.aiBubble = bg.colors.aiBubble;
        if (bg.colors.aiBubbleText) merged.aiBubbleText = bg.colors.aiBubbleText;
        if (bg.colors.aiBubbleBorder) merged.aiBubbleBorder = bg.colors.aiBubbleBorder;
      }
    }

    return merged;
  }, [profile?.is_member, profile?.accent_color, profile?.background_theme]);

  return (
    <ThemeContext.Provider value={themeColors}>
      {children}
    </ThemeContext.Provider>
  );
}

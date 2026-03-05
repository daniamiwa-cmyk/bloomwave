import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/theme/ThemeProvider';
import { api } from '@/services/api';
import { ACCENT_COLORS, BACKGROUND_THEMES } from '@/theme/palettes';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

export default function AppearanceScreen() {
  const { profile, loadProfile } = useAuthStore();
  const colors = useTheme();
  const router = useRouter();

  const [selectedAccent, setSelectedAccent] = useState(profile?.accent_color || 'purple');
  const [selectedBg, setSelectedBg] = useState(profile?.background_theme || 'warm_cream');
  const [saving, setSaving] = useState(false);

  const isMember = profile?.is_member ?? false;

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/api/v1/profile', {
        accent_color: selectedAccent,
        background_theme: selectedBg,
      });
      await loadProfile();
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isMember) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Appearance</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.lockedState}>
          <Ionicons name="lock-closed" size={48} color={colors.textMuted} />
          <Text style={[styles.lockedTitle, { color: colors.text }]}>Members only</Text>
          <Text style={[styles.lockedSubtitle, { color: colors.textSecondary }]}>
            Become a member to customize your accent color and background theme.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Appearance</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveText, { color: colors.primary }, saving && { opacity: 0.4 }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACCENT COLOR</Text>
        <View style={styles.colorGrid}>
          {ACCENT_COLORS.map((accent) => (
            <TouchableOpacity
              key={accent.id}
              style={[
                styles.colorCircle,
                { backgroundColor: accent.hex },
                selectedAccent === accent.id && styles.colorCircleSelected,
              ]}
              onPress={() => setSelectedAccent(accent.id)}
            >
              {selectedAccent === accent.id && (
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: spacing.xl }]}>
          BACKGROUND
        </Text>
        <View style={styles.bgList}>
          {BACKGROUND_THEMES.map((theme) => {
            const isSelected = selectedBg === theme.id;
            const isDark = theme.id === 'midnight';
            return (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.bgCard,
                  { backgroundColor: theme.colors.background },
                  isSelected && { borderColor: colors.primary, borderWidth: 2 },
                  isDark && { borderColor: isSelected ? colors.primary : '#3A3A5C' },
                ]}
                onPress={() => setSelectedBg(theme.id)}
              >
                <View style={[styles.bgPreviewBar, { backgroundColor: theme.colors.surfaceElevated }]} />
                <Text
                  style={[
                    styles.bgLabel,
                    { color: isDark ? '#F0EDF5' : colors.text },
                  ]}
                >
                  {theme.label}
                </Text>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.primary}
                    style={styles.bgCheck}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...typography.h3,
  },
  saveText: {
    ...typography.body,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.caption,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  bgList: {
    gap: spacing.sm,
  },
  bgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: spacing.md,
    gap: spacing.md,
  },
  bgPreviewBar: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
  },
  bgLabel: {
    ...typography.body,
    fontWeight: '500',
    flex: 1,
  },
  bgCheck: {
    marginLeft: 'auto',
  },
  lockedState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  lockedTitle: {
    ...typography.h3,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  lockedSubtitle: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
});

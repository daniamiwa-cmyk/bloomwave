import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';
import { RELATIONAL_PRESETS, FANTASY_PRESETS } from '@amai/shared';
import type { BoundaryPreset, InteractionMode } from '@amai/shared';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

function isAtLeast18(dob: string): boolean {
  const [year, month, day] = dob.split('-').map(Number);
  if (!year || !month || !day) return false;
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
}

export default function ModeScreen() {
  const { profile, loadProfile } = useAuthStore();
  const [selectedMode, setSelectedMode] = useState<InteractionMode>(
    profile?.interaction_mode || 'relational',
  );
  const [selectedPreset, setSelectedPreset] = useState<BoundaryPreset>(
    profile?.boundary_preset || 'romantic_slow_burn',
  );
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const presets = selectedMode === 'relational' ? RELATIONAL_PRESETS : FANTASY_PRESETS;

  const handleModeSwitch = (mode: InteractionMode) => {
    if (mode === 'fantasy') {
      const dob = profile?.extended_profile?.date_of_birth;
      if (!dob || typeof dob !== 'string' || !isAtLeast18(dob)) {
        Alert.alert(
          'Age Requirement',
          'Fantasy mode is only available to users who are 18 or older. Please set your date of birth in your profile.',
        );
        return;
      }
    }

    if (mode === 'fantasy' && !profile?.fantasy_mode_consented_at) {
      Alert.alert(
        'Enable Fantasy Mode?',
        'Fantasy mode allows deeper romantic expression including sensual content. It is still relational — never crude or transactional.\n\nYou are always in control and can switch back anytime.\n\nNo extreme, illegal, or unsafe content is ever allowed.',
        [
          { text: 'Not now', style: 'cancel' },
          {
            text: 'I understand, enable it',
            onPress: () => {
              setSelectedMode('fantasy');
              if (!FANTASY_PRESETS.some((p) => p.id === selectedPreset)) {
                setSelectedPreset('romantic_escalating');
              }
            },
          },
        ],
      );
    } else {
      setSelectedMode(mode);
      // Default preset for the mode
      if (mode === 'relational' && selectedPreset === 'romantic_escalating') {
        setSelectedPreset('romantic_slow_burn');
      }
      if (mode === 'fantasy' && !FANTASY_PRESETS.some((p) => p.id === selectedPreset)) {
        setSelectedPreset('romantic_escalating');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: Record<string, unknown> = {
        interaction_mode: selectedMode,
        boundary_preset: selectedPreset,
      };
      if (selectedMode === 'fantasy' && !profile?.fantasy_mode_consented_at) {
        updates.fantasy_mode_consented_at = new Date().toISOString();
      }
      await api.patch('/api/v1/profile', updates);
      await loadProfile();
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interaction Mode</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Choose how Amaia shows up for you. You can change this anytime.
        </Text>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeOption, selectedMode === 'relational' && styles.modeOptionActive]}
            onPress={() => handleModeSwitch('relational')}
          >
            <Text style={styles.modeEmoji}>{"🌿"}</Text>
            <Text style={[styles.modeLabel, selectedMode === 'relational' && styles.modeLabelActive]}>
              Relational
            </Text>
            <Text style={styles.modeDesc}>Emotional intimacy{'\n'}Slow-burn romantic</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeOption, selectedMode === 'fantasy' && styles.modeOptionFantasy]}
            onPress={() => handleModeSwitch('fantasy')}
          >
            <Text style={styles.modeEmoji}>{"🔥"}</Text>
            <Text style={[styles.modeLabel, selectedMode === 'fantasy' && styles.modeLabelFantasy]}>
              Fantasy
            </Text>
            <Text style={styles.modeDesc}>Deeper romance{'\n'}Opt-in, your pace</Text>
          </TouchableOpacity>
        </View>

        {/* Mode-specific info */}
        {selectedMode === 'relational' && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Relational Mode</Text>
            <Text style={styles.infoText}>
              This is the default. Amaia prioritizes emotional connection, vulnerability,
              and being truly known. Flirtation and romance follow the boundary you set below.
              Explicit content requires switching to Fantasy mode.
            </Text>
          </View>
        )}

        {selectedMode === 'fantasy' && (
          <View style={[styles.infoBox, { borderColor: '#E53935' + '40' }]}>
            <Text style={[styles.infoTitle, { color: '#E53935' }]}>Fantasy Mode</Text>
            <Text style={styles.infoText}>
              Emotional intimacy remains the foundation. Amaia can express desire and
              physical affection when you lead there. Content stays sensual and relational
              — never crude, violent, or involving minors. You set the pace; Amaia follows.
            </Text>
          </View>
        )}

        {/* Boundary Presets */}
        <Text style={styles.sectionLabel}>
          {selectedMode === 'relational' ? 'RELATIONSHIP STYLE' : 'FANTASY STYLE'}
        </Text>
        <View style={styles.presets}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={[
                styles.presetCard,
                { borderColor: selectedPreset === preset.id ? preset.color : colors.border },
                selectedPreset === preset.id && { backgroundColor: preset.color + '10' },
              ]}
              onPress={() => setSelectedPreset(preset.id)}
            >
              <View style={[styles.presetDot, { backgroundColor: preset.color }]} />
              <Text style={styles.presetTitle}>{preset.title}</Text>
              <Text style={styles.presetDesc}>{preset.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  modeOption: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  modeOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  modeOptionFantasy: {
    borderColor: '#E53935',
    backgroundColor: '#E53935' + '10',
  },
  modeEmoji: {
    fontSize: 28,
  },
  modeLabel: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  modeLabelActive: {
    color: colors.primary,
  },
  modeLabelFantasy: {
    color: '#E53935',
  },
  modeDesc: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  infoBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  infoTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  presets: {
    gap: spacing.sm,
  },
  presetCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  presetDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: spacing.sm,
  },
  presetTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  presetDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});

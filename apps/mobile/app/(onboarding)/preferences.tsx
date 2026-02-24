import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

const TONE_OPTIONS = [
  { id: 'warm', label: 'Warm', desc: 'Soft, nurturing, like a close friend' },
  { id: 'playful', label: 'Playful', desc: 'Light, fun, a bit cheeky' },
  { id: 'direct', label: 'Direct', desc: 'Honest, clear, no fluff' },
  { id: 'gentle', label: 'Gentle', desc: 'Quiet, soothing, careful' },
];

const HUMOR_OPTIONS = [
  { id: 'light', label: 'Light humor' },
  { id: 'witty', label: 'Witty & clever' },
  { id: 'dry', label: 'Dry & deadpan' },
  { id: 'none', label: 'Keep it serious' },
];

const COMFORT_OPTIONS = [
  { id: 'validating', label: 'Validate my feelings', desc: '"That makes so much sense."' },
  { id: 'problem_solving', label: 'Help me think through it', desc: '"What if we looked at it this way?"' },
  { id: 'just_listen', label: 'Just listen', desc: '"I\'m here. Tell me more."' },
];

export default function PreferencesScreen() {
  const [tone, setTone] = useState('warm');
  const [humor, setHumor] = useState('light');
  const [comfort, setComfort] = useState('validating');
  const router = useRouter();
  const params = useLocalSearchParams<{
    name: string;
    pronouns: string;
    boundary_preset: string;
  }>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>How should I show up?</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TONE</Text>
          <View style={styles.options}>
            {TONE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.option, tone === opt.id && styles.optionSelected]}
                onPress={() => setTone(opt.id)}
              >
                <Text style={[styles.optionLabel, tone === opt.id && styles.optionLabelSelected]}>
                  {opt.label}
                </Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>HUMOR</Text>
          <View style={styles.chips}>
            {HUMOR_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.chip, humor === opt.id && styles.chipSelected]}
                onPress={() => setHumor(opt.id)}
              >
                <Text style={[styles.chipText, humor === opt.id && styles.chipTextSelected]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHEN I'M UPSET</Text>
          <View style={styles.options}>
            {COMFORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.option, comfort === opt.id && styles.optionSelected]}
                onPress={() => setComfort(opt.id)}
              >
                <Text style={[styles.optionLabel, comfort === opt.id && styles.optionLabelSelected]}>
                  {opt.label}
                </Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: '/(onboarding)/complete',
              params: {
                ...params,
                preferred_tone: tone,
                humor_style: humor,
                comfort_style: comfort,
              },
            })
          }
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: colors.primary,
  },
  optionDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});

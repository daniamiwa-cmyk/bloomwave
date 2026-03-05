import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BOUNDARY_PRESETS, type BoundaryPreset } from '@amai/shared';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

export default function BoundariesScreen() {
  const [selected, setSelected] = useState<BoundaryPreset | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams<{ name: string; pronouns: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Set your boundaries</Text>
        <Text style={styles.subtitle}>
          This shapes how I show up for you.{'\n'}
          You can change this anytime.
        </Text>

        <View style={styles.cards}>
          {BOUNDARY_PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={[
                styles.card,
                { borderColor: selected === preset.id ? preset.color : colors.border },
                selected === preset.id && { backgroundColor: preset.color + '10' },
              ]}
              onPress={() => setSelected(preset.id)}
            >
              <View style={[styles.dot, { backgroundColor: preset.color }]} />
              <Text style={styles.cardTitle}>{preset.title}</Text>
              <Text style={styles.cardDescription}>{preset.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selected && styles.buttonDisabled]}
          onPress={() =>
            router.push({
              pathname: '/(onboarding)/preferences',
              params: { ...params, boundary_preset: selected! },
            })
          }
          disabled={!selected}
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
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  cards: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
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
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});

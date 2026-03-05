import { useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePersonaStore } from '@/stores/personaStore';
import { getPortrait } from '@/utils/portraitMap';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import type { PersonaCard } from '@amai/shared';

interface Props {
  selectedId: string | null;
  onSelect: (persona: PersonaCard | null) => void;
}

export function PersonaPicker({ selectedId, onSelect }: Props) {
  const { personas, loadGallery } = usePersonaStore();

  useEffect(() => {
    if (personas.length === 0) loadGallery();
  }, []);

  const unlocked = personas.filter((p) => p.is_unlocked);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chat with</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Default Amaia option */}
        <TouchableOpacity
          style={[styles.chip, !selectedId && styles.chipSelected]}
          onPress={() => onSelect(null)}
        >
          <Text style={styles.chipEmoji}>💜</Text>
          <Text style={[styles.chipName, !selectedId && styles.chipNameSelected]}>
            Amaia
          </Text>
        </TouchableOpacity>

        {unlocked.map((p) => {
          const portrait = getPortrait(p.slug);
          return (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.chip,
                selectedId === p.id && styles.chipSelected,
                selectedId === p.id && { borderColor: p.color },
              ]}
              onPress={() => onSelect(p)}
            >
              {portrait ? (
                <Image source={portrait} style={styles.chipPortrait} />
              ) : (
                <Text style={styles.chipEmoji}>{p.avatar_emoji}</Text>
              )}
              <Text
                style={[styles.chipName, selectedId === p.id && styles.chipNameSelected]}
                numberOfLines={1}
              >
                {p.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Browse all */}
        <TouchableOpacity
          style={[styles.chip, styles.browseChip]}
          onPress={() => router.push('/(main)/personas/')}
        >
          <Text style={styles.browseText}>Browse all</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  scroll: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  chipPortrait: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipName: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
    maxWidth: 80,
  },
  chipNameSelected: {
    fontWeight: '700',
  },
  browseChip: {
    borderStyle: 'dashed',
    borderColor: colors.textMuted,
  },
  browseText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontWeight: '600',
  },
});

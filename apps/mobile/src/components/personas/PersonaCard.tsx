import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import { getPortrait } from '@/utils/portraitMap';
import type { PersonaCard as PersonaCardType } from '@amai/shared';

interface Props {
  persona: PersonaCardType;
  onPress: () => void;
}

export function PersonaCard({ persona, onPress }: Props) {
  const portrait = getPortrait(persona.slug);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: persona.is_unlocked ? persona.color + '40' : colors.border },
        !persona.is_unlocked && { opacity: 0.55 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {!persona.is_unlocked && (
        <View style={styles.lockOverlay}>
          <Ionicons name="lock-closed" size={20} color={colors.textMuted} />
        </View>
      )}
      {portrait ? (
        <View>
          <Image source={portrait} style={styles.portrait} />
          {!persona.is_unlocked && <View style={styles.portraitOverlay} />}
        </View>
      ) : (
        <Text style={styles.emoji}>{persona.avatar_emoji}</Text>
      )}
      <Text style={styles.name} numberOfLines={1}>
        {persona.name}
      </Text>
      <Text style={styles.tagline} numberOfLines={2}>
        {persona.tagline}
      </Text>
      <View style={[styles.archBadge, { backgroundColor: persona.color + '20' }]}>
        <Text style={[styles.archText, { color: persona.color }]}>
          {persona.archetype}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 160,
  },
  lockOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  portrait: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.sm,
  },
  portraitOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  emoji: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  tagline: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  archBadge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  archText: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

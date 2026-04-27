import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePersonaStore } from '@/stores/personaStore';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { getPortrait } from '@/utils/portraitMap';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

export default function PersonaDetailScreen() {
  const { personaId } = useLocalSearchParams<{ personaId: string }>();
  const { personas, loadGallery } = usePersonaStore();
  const { createThread } = useChatStore();
  const { profile } = useAuthStore();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (personas.length === 0) {
      loadGallery().catch(() => setLoadFailed(true));
    }
  }, []);

  const persona = personas.find((p) => p.id === personaId);
  const portrait = persona ? getPortrait(persona.slug) : null;

  if (!persona) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          {loadFailed || personas.length > 0 ? (
            <Text style={{ ...typography.body, color: colors.textSecondary }}>Persona not found</Text>
          ) : (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
        </View>
      </SafeAreaView>
    );
  }

  const handleStartThread = async () => {
    setCreating(true);
    try {
      const thread = await createThread(
        `Chat with ${persona.name}`,
        undefined,
        persona.id,
      );
      router.replace(`/(main)/chat/${thread.id}`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not create thread.');
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.heroCard, { borderColor: persona.color + '40' }]}>
          {portrait ? (
            <Image source={portrait} style={styles.portrait} />
          ) : (
            <Text style={styles.emoji}>{persona.avatar_emoji}</Text>
          )}
          <Text style={styles.name}>{persona.name}</Text>
          <Text style={styles.tagline}>{persona.tagline}</Text>

          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: persona.color + '20' }]}>
              <Text style={[styles.badgeText, { color: persona.color }]}>
                {persona.archetype}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{persona.gender}</Text>
            </View>
          </View>
        </View>

        {/* Backstory */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backstory</Text>
          <Text style={styles.backstory}>{persona.backstory}</Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        {persona.tier === 4 && !profile?.is_member ? (
          <>
            <View style={styles.lockNote}>
              <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
              <Text style={styles.lockNoteText}>Exclusive to Amaia members</Text>
            </View>
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(main)/settings/subscription')}
            >
              <Ionicons name="sparkles" size={20} color="#FFF" />
              <Text style={styles.ctaText}>Unlock with Membership</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: persona.color || colors.primary }]}
            onPress={handleStartThread}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="chatbubble-ellipses" size={20} color="#FFF" />
                <Text style={styles.ctaText}>Start a thread with {persona.name}</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    width: 40,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  portrait: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: spacing.md,
  },
  emoji: {
    fontSize: 72,
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  backstory: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
    borderRadius: radius.md,
  },
  ctaText: {
    ...typography.button,
    color: '#FFF',
  },
  lockNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  lockNoteText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});

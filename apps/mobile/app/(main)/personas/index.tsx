import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePersonaStore } from '@/stores/personaStore';
import { PersonaCard } from '@/components/personas/PersonaCard';
import { UnlockModal } from '@/components/personas/UnlockModal';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import type { PersonaCard as PersonaCardType } from '@amai/shared';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unlocked', label: 'Unlocked' },
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
  { key: 'nonbinary', label: 'Nonbinary' },
] as const;

export default function PersonaGalleryScreen() {
  const {
    personas,
    unlockedCount,
    totalCount,
    isLoading,
    filter,
    loadGallery,
    unlockPersona,
    setFilter,
    getFiltered,
  } = usePersonaStore();
  const router = useRouter();

  const [unlockTarget, setUnlockTarget] = useState<PersonaCardType | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const filtered = getFiltered();

  const handlePersonaPress = (persona: PersonaCardType) => {
    if (persona.is_unlocked) {
      router.push(`/(main)/personas/${persona.id}`);
    } else {
      setUnlockTarget(persona);
    }
  };

  const handleUnlock = async (personaId: string) => {
    try {
      await unlockPersona(personaId);
    } catch (err: any) {
      Alert.alert('Cannot unlock', err.message || 'Try again later.');
      throw err;
    }
  };

  const renderItem = ({ item, index }: { item: PersonaCardType; index: number }) => (
    <View style={[styles.cardWrapper, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}>
      <PersonaCard persona={item} onPress={() => handlePersonaPress(item)} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Companions</Text>
        <Text style={styles.unlockCount}>
          {unlockedCount}/{totalCount}
        </Text>
      </View>

      {/* Filter pills */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterPill, filter === f.key && styles.filterPillActive]}
            onPress={() => setFilter(f.key as any)}
          >
            <Text
              style={[styles.filterText, filter === f.key && styles.filterTextActive]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>

      {/* Gallery grid */}
      {isLoading && personas.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}

      <UnlockModal
        persona={unlockTarget}
        visible={!!unlockTarget}
        onClose={() => setUnlockTarget(null)}
        onUnlock={handleUnlock}
      />
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    flex: 1,
    marginLeft: spacing.sm,
  },
  unlockCount: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontWeight: '700',
  },
  filterBar: {
    flexShrink: 0,
    paddingBottom: spacing.md,
  },
  filters: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.textOnPrimary,
  },
  grid: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  cardWrapper: {
    flex: 1,
    marginBottom: spacing.sm,
  },
  cardLeft: {
    marginRight: spacing.xs,
  },
  cardRight: {
    marginLeft: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

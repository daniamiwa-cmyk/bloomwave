import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useChatStore } from '@/stores/chatStore';
import { PersonaPicker } from '@/components/personas/PersonaPicker';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import type { Thread, PersonaCard } from '@amai/shared';

export default function ThreadsScreen() {
  const { threads: rawThreads, loadThreads, createThread, deleteThread } = useChatStore();
  // Deduplicate threads by ID to prevent React key warnings
  const threads = rawThreads.filter(
    (t, i, arr) => arr.findIndex((x) => x.id === t.id) === i,
  );
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<PersonaCard | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadThreads();
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const thread = await createThread(
        newTitle.trim(),
        newDesc.trim() || undefined,
        selectedPersona?.id,
      );
      setShowCreate(false);
      setNewTitle('');
      setNewDesc('');
      setSelectedPersona(null);
      router.push(`/(main)/chat/${thread.id}`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDeleteThread = (thread: Thread) => {
    Alert.alert(
      'Delete conversation',
      `Delete "${thread.title}"? This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteThread(thread.id);
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ],
    );
  };

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    thread: Thread,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDeleteThread(thread)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          <Text style={styles.deleteActionText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderThread = ({ item }: { item: Thread }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
      overshootRight={false}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(main)/chat/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={[styles.colorBar, { backgroundColor: item.color }]} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.persona_name && (
            <Text style={styles.personaLabel}>
              {item.persona_emoji} with {item.persona_name}
            </Text>
          )}
          {item.description && (
            <Text style={styles.cardDesc} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          <Text style={styles.cardMeta}>
            {item.message_count} messages
            {item.context_summary ? ' \u00b7 has summary' : ''}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Threads</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreate(!showCreate)}
        >
          <Ionicons name={showCreate ? 'close' : 'add'} size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {showCreate && (
        <View style={styles.createForm}>
          <PersonaPicker
            selectedId={selectedPersona?.id || null}
            onSelect={setSelectedPersona}
          />
          <TextInput
            style={styles.input}
            placeholder="Thread name (e.g. My anxiety)"
            placeholderTextColor={colors.textMuted}
            value={newTitle}
            onChangeText={setNewTitle}
            autoFocus
          />
          <TextInput
            style={[styles.input, styles.descInput]}
            placeholder="Context (optional)"
            placeholderTextColor={colors.textMuted}
            value={newDesc}
            onChangeText={setNewDesc}
            multiline
          />
          <TouchableOpacity
            style={[styles.createButton, !newTitle.trim() && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={!newTitle.trim()}
          >
            <Text style={styles.createButtonText}>Create thread</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionHint}>
        Threads help Amaia stay focused and pull the right memories.
      </Text>

      <FlatList
        data={threads}
        renderItem={renderThread}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No threads yet</Text>
            <Text style={styles.emptySubtitle}>
              Create a thread to give Amaia focused context for a topic.
            </Text>
          </View>
        }
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  createForm: {
    margin: spacing.lg,
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    ...typography.body,
    color: colors.text,
  },
  descInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.4,
  },
  createButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  personaLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  cardDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
  },
  cardMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: radius.md,
    marginLeft: spacing.xs,
  },
  deleteActionText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 2,
  },
});

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from '@/stores/chatStore';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import type { Thread } from '@alora/shared';

export default function ThreadsScreen() {
  const { threads, loadThreads, createThread } = useChatStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadThreads();
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const thread = await createThread(newTitle.trim(), newDesc.trim() || undefined);
      setShowCreate(false);
      setNewTitle('');
      setNewDesc('');
      router.push(`/(main)/chat/${thread.id}`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const renderThread = ({ item }: { item: Thread }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(main)/chat/${item.id}`)}
    >
      <View style={[styles.colorBar, { backgroundColor: item.color }]} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
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
        Threads help Alora stay focused and pull the right memories.
      </Text>

      <FlatList
        data={threads}
        renderItem={renderThread}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
});

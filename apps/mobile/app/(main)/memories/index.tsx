import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import type { Memory, MemoryListResponse } from '@amai/shared';

const EMOTION_COLORS: Record<string, string> = {
  joyful: '#4CAF50',
  sad: '#5C6BC0',
  anxious: '#FF9800',
  calm: '#26A69A',
  frustrated: '#F44336',
  hopeful: '#66BB6A',
  grateful: '#AB47BC',
  angry: '#E53935',
  vulnerable: '#EC407A',
  excited: '#FFA726',
  reflective: '#7E57C2',
  neutral: colors.textMuted,
};

export default function MemoriesScreen() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMemories = async () => {
    try {
      const data = await api.get<MemoryListResponse>('/api/v1/memories?limit=50');
      setMemories(data.memories);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMemories();
  }, []);

  const handleDelete = (memory: Memory) => {
    Alert.alert('Delete memory', 'This memory will be removed. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await api.delete(`/api/v1/memories/${memory.id}`);
          setMemories((prev) => prev.filter((m) => m.id !== memory.id));
        },
      },
    ]);
  };

  const handlePin = async (memory: Memory) => {
    await api.post(`/api/v1/memories/${memory.id}/pin`);
    setMemories((prev) =>
      prev.map((m) => (m.id === memory.id ? { ...m, is_pinned: !m.is_pinned } : m)),
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderMemory = ({ item }: { item: Memory }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.emotionDot, { backgroundColor: EMOTION_COLORS[item.emotion] || colors.textMuted }]} />
        <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
        {item.is_pinned && <Ionicons name="pin" size={12} color={colors.primary} />}
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => handlePin(item)} style={styles.iconBtn}>
          <Ionicons
            name={item.is_pinned ? 'pin' : 'pin-outline'}
            size={16}
            color={colors.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardContent}>{item.content}</Text>
      {item.tags.length > 0 && (
        <View style={styles.tags}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Memories</Text>
        <Text style={styles.subtitle}>What I remember about you</Text>
      </View>

      {memories.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No memories yet</Text>
          <Text style={styles.emptyHint}>
            As we talk, I'll hold onto the moments that matter.
          </Text>
        </View>
      ) : (
        <FlatList
          data={memories}
          renderItem={renderMemory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  emotionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  iconBtn: {
    padding: 4,
  },
  cardContent: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primary + '15',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  tagText: {
    ...typography.caption,
    color: colors.primary,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptyHint: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
